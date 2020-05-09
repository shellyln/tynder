// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { parserInput }           from 'fruitsconfits/modules/lib/types';
import { formatErrorMessage }    from 'fruitsconfits/modules/lib/parser';
import { SxToken,
         SxSymbol,
         SxParserConfig }        from 'liyad/modules/s-exp/types';
import installCore               from 'liyad/modules/s-exp/operators/core';
import { SExpression }           from 'liyad/modules/s-exp/interpreters';
import { defaultConfig }         from 'liyad/modules/s-exp/defaults';
import { TypeAssertion,
         PrimitiveTypeAssertion,
         ErrorMessages,
         TypeAssertionSetValue,
         TypeAssertionMap }      from './types';
import * as operators            from './operators';
import { resolveMemberNames,
         resolveSchema }         from './lib/resolver';
import { dummyTargetObject,
         isUnsafeVarNames }      from './lib/util';
import { externalTypeDef,
         program }               from './lib/compiler';



function parseExternalDirective(s: string) {
    const z = externalTypeDef(parserInput(s, {/* TODO: set initial state to the context */}));
    if (! z.succeeded) {
        throw new Error('Invalid external directive.');
    }
    return z.tokens;
}


export function parse(s: string) {
    const z = program(parserInput(s, {/* TODO: set initial state to the context */}));
    if (! z.succeeded) {
        throw new Error(formatErrorMessage(z));
    }
    return z.tokens;
}


const lisp = (() => {
    let config: SxParserConfig = Object.assign({}, defaultConfig);
    config.reservedNames = Object.assign({}, config.reservedNames, {
        Template: '$concat',
    });
    config = installCore(config);
    config.stripComments = true;
    return SExpression(config);
})();


// tslint:disable: object-literal-key-quotes
export function compile(s: string) {
    const mapTyToTySet = new Map<TypeAssertion, TypeAssertionSetValue>();
    const schema: TypeAssertionMap = new Map<string, TypeAssertionSetValue>();
    let gensymCount = 0;

    const def = (name: SxSymbol | string, ty: TypeAssertion): TypeAssertion => {
        let ret = ty;

        const sym = typeof name === 'string' ? name : name.symbol;
        if (isUnsafeVarNames(dummyTargetObject, sym)) {
            throw new Error(`Unsafe symbol name is appeared: ${sym}`);
        }

        if (! mapTyToTySet.has(ret)) {
            const originalTypeName = ret.typeName;
            ret = operators.withName(operators.withTypeName(
                originalTypeName ?
                    operators.withOriginalTypeName(ret, originalTypeName) :
                    ret,
                sym), sym);
        }

        const tySet = mapTyToTySet.has(ret) ?
            mapTyToTySet.get(ret) as TypeAssertionSetValue :
            {ty: ret, exported: false, isDeclare: false, resolved: false};

        schema.set(sym, tySet);

        if (! mapTyToTySet.has(ret)) {
            // TODO: aliases are not exported correctly
            mapTyToTySet.set(ret, tySet);
        }
        return ret;
    };

    const ref = (name: SxSymbol | string, ...memberNames: (SxSymbol | string)[]): TypeAssertion => {
        const sym = typeof name === 'string' ? name : name.symbol;
        if (isUnsafeVarNames(dummyTargetObject, sym)) {
            throw new Error(`Unsafe symbol name is appeared: ${sym}`);
        }

        const memberTreeSymbols = memberNames.map(x => {
            const ms = typeof x === 'string' ? x : x.symbol;
            if (isUnsafeVarNames(dummyTargetObject, ms)) {
                throw new Error(`Unsafe symbol name is appeared: ${ms}`);
            }
            return ms;
        });

        if (! schema.has(sym)) {
            return ({
                ...{
                    kind: 'symlink',
                    symlinkTargetName: sym,
                    name: sym,
                    typeName: sym,
                },
                ...(0 < memberTreeSymbols.length ? {
                    memberTree: memberTreeSymbols,
                } : {}),
            });
        }

        let ty = resolveMemberNames(
            (schema.get(sym) as TypeAssertionSetValue).ty,
            sym, memberTreeSymbols,
            0,
        );

        if (ty.noOutput) {
            ty = {...ty};
            delete ty.noOutput;
        }
        return ty;
    };

    const redef = (original: TypeAssertion, ty: TypeAssertion) => {
        if (original === ty) {
            return ty;
        }
        // NOTE: 'ty' should already be registered to 'mapTyToTySet' and 'schema'
        const tySet = mapTyToTySet.has(original) ?
            mapTyToTySet.get(original) as TypeAssertionSetValue :
            {ty: original, exported: false, isDeclare: false, resolved: false};
        tySet.ty = ty;
        mapTyToTySet.set(tySet.ty, tySet);
        if (ty.name) {
            schema.set(ty.name, tySet);
        }
        return tySet.ty;
    };

    const exported = (ty: TypeAssertion) => {
        if (ty.kind === 'never' && typeof ty.passThruCodeBlock === 'string') {
            ty.passThruCodeBlock = `export ${ty.passThruCodeBlock}`;
            return ty;
        } else {
            // NOTE: 'ty' should already be registered to 'mapTyToTySet' and 'schema'
            const tySet = mapTyToTySet.has(ty) ?
                mapTyToTySet.get(ty) as TypeAssertionSetValue :
                {ty, exported: false, isDeclare: false, resolved: false};
            tySet.exported = true;
            return ty;
        }
    };

    const external = (...names: (string | [string, TypeAssertion?])[]) => {
        for (const name of names) {
            let ty: TypeAssertion = null as any;
            if (typeof name === 'string') {
                ty = def(name, operators.primitive('any'));
            } else {
                ty = def(name[0], name[1] ? name[1] : operators.primitive('any'));
            }
            ty.noOutput = true;
        }
    };

    const asConst = (ty: TypeAssertion) => {
        switch (ty.kind) {
        case 'enum':
            // NOTE: `ty` may already `def`ed.
            ty.isConst = true;
            break;
        default:
            throw new Error(`It cannot set to const: ${ty.kind} ${ty.typeName || '(unnamed)'}`);
        }
        return ty;
    };

    const asDeclare = (ty: TypeAssertion) => {
        // NOTE: 'ty' should already be registered to 'mapTyToTySet' and 'schema'
        const tySet = mapTyToTySet.has(ty) ?
            mapTyToTySet.get(ty) as TypeAssertionSetValue :
            {ty, exported: false, isDeclare: false, resolved: false};
        tySet.isDeclare = true;
        return ty;
    };

    const passthru = (str: string, docCommentText?: string) => {
        const ty: TypeAssertion = {
            kind: 'never',
            passThruCodeBlock: str || '',
        };
        if (docCommentText) {
            ty.docComment = docCommentText;
        }
        schema.set(`__$$$gensym_${gensymCount++}$$$__`, {ty, exported: false, isDeclare: false, resolved: false});
        return ty;
    };

    const directive = (name: string, body: string) => {
        switch (name) {
        case '@tynder-external':
            lisp.evaluateAST(parseExternalDirective(`external ${body} ;`) as SxToken[]);
            break;
        case '@tynder-pass-through':
            passthru(body);
            break;
        default:
            throw new Error(`Unknown directive is appeared: ${name}`);
        }
        return [];
    };

    lisp.setGlobals({
        picked: operators.picked,
        omit: operators.omit,
        partial: operators.partial,
        intersect: operators.intersect,
        oneOf: operators.oneOf,
        subtract: operators.subtract,
        primitive: operators.primitive,
        primitiveValue: operators.primitiveValue,
        optional: operators.optional,
        repeated: operators.repeated,
        sequenceOf: operators.sequenceOf,
        spread: operators.spread,
        enumType: operators.enumType,
        objectType: operators.objectType,
        derived: operators.derived,
        def,
        ref,
        redef,
        export: exported,
        external,
        asConst,
        asDeclare,
        passthru,
        directive,
        docComment: operators.withDocComment,
        '@range': (minValue: number | string, maxValue: number | string) => (ty: PrimitiveTypeAssertion) =>
            operators.withRange(minValue, maxValue)(ty),
        '@minValue': (minValue: number | string) => (ty: PrimitiveTypeAssertion) =>
            operators.withMinValue(minValue)(ty),
        '@maxValue': (maxValue: number | string) => (ty: PrimitiveTypeAssertion) =>
            operators.withMaxValue(maxValue)(ty),
        '@greaterThan': (greaterThan: number | string) => (ty: PrimitiveTypeAssertion) =>
            operators.withGreaterThan(greaterThan)(ty),
        '@lessThan': (lessThan: number | string) => (ty: PrimitiveTypeAssertion) =>
            operators.withLessThan(lessThan)(ty),
        '@minLength': (minLength: number) => (ty: PrimitiveTypeAssertion) =>
            operators.withMinLength(minLength)(ty),
        '@maxLength': (maxLength: number) => (ty: PrimitiveTypeAssertion) =>
            operators.withMaxLength(maxLength)(ty),
        '@match': (pattern: RegExp) => (ty: PrimitiveTypeAssertion) =>
            operators.withMatch(pattern)(ty),
        '@stereotype': (stereotype: string) => (ty: TypeAssertion) =>
            operators.withStereotype(stereotype)(ty),
        '@constraint': (name: string, args?: any) => (ty: TypeAssertion) =>
            operators.withConstraint(name, args)(ty),
        '@forceCast': () => (ty: TypeAssertion) =>
            operators.withForceCast()(ty),
        '@recordType': () => (ty: TypeAssertion) =>
            operators.withRecordType()(ty),
        '@meta': (meta: any) => (ty: TypeAssertion) =>
            operators.withMeta(meta)(ty),
        '@msg': (messages: string | ErrorMessages) => (ty: TypeAssertion) =>
            operators.withMsg(messages)(ty),
        '@msgId': (messageId: string) => (ty: TypeAssertion) =>
            operators.withMsgId(messageId)(ty),
    });

    const z = parse(s);
    lisp.evaluateAST(z as SxToken[]);

    return resolveSchema(schema);
}
// tslint:enable: object-literal-key-quotes
