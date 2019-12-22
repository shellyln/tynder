// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { parserInput,
         ParserFnWithCtx }   from 'fruitsconfits/modules/lib/types';
import { getStringParsers }  from 'fruitsconfits/modules/lib/string-parser';
import { getObjectParsers }  from 'fruitsconfits/modules/lib/object-parser';
import { SxTokenChild,
         SxToken,
         SxSymbol }          from 'liyad/modules/s-exp/types';
import { lisp }              from 'liyad/modules/s-exp/interpreters/presets/lisp';
import { TypeAssertion,
         PrimitiveTypeAssertion,
         ErrorMessages,
         TypeAssertionSetValue,
         TypeAssertionMap }  from './types';
import * as operators        from './operators';



interface SxOp {
    'op': string;
}

type AstChild = SxTokenChild | SxOp | undefined;

type Ctx = undefined;
type Ast = SxToken | AstChild | SxOp | undefined;

const $s = getStringParsers<Ctx, Ast>({
    rawToToken: rawToken => rawToken,
    concatTokens: tokens => (tokens.length ?
        [tokens.reduce((a, b) => String(a) + b)] : []),
});

const $o = getObjectParsers<Ast[], Ctx, Ast>({
    rawToToken: rawToken => rawToken,
    concatTokens: tokens => (tokens.length ?
        [tokens.reduce((a, b) => String(a) + b)] : []),
    comparator: (a, b) => a === b,
});

const {seq, cls, notCls, clsFn, classes, numbers, cat,
       once, repeat, qty, zeroWidth, err, beginning, end,
       first, or, combine, erase, trans, ahead, rules} = $s;


const lineComment =
    combine(
        seq('//'),
        repeat(notCls('\r\n', '\n', '\r')),
        classes.newline, );

const hashLineComment =
    combine(
        seq('#'),
        repeat(notCls('\r\n', '\n', '\r')),
        classes.newline, );

const blockComment =
    combine(
        seq('/*'),
        repeat(notCls('*/')),
        seq('*/'), );

const commentOrSpace =
    first(classes.space, lineComment, hashLineComment, blockComment);


const trueValue =
    trans(tokens => [true])
    (seq('true'));

const falseValue =
    trans(tokens => [false])
    (seq('false'));

const nullValue =
    trans(tokens => [null])
    (seq('null'));

const undefinedValue =
    trans(tokens => [void 0])
    (seq('undefined'));

const positiveInfinityValue =
    trans(tokens => [Number.POSITIVE_INFINITY])
    (qty(0, 1)(seq('+')), seq('Infinity'));

const negativeInfinityValue =
    trans(tokens => [Number.NEGATIVE_INFINITY])
    (seq('-Infinity'));

const nanValue =
    trans(tokens => [Number.NaN])
    (seq('NaN'));


const binaryIntegerValue =
    trans(tokens => [Number.parseInt((tokens as string[])[0].replace(/_/g, ''), 2)])
    (numbers.bin(seq('0b')));

const octalIntegerValue =
    trans(tokens => [Number.parseInt((tokens as string[])[0].replace(/_/g, ''), 8)])
    (numbers.oct(seq('0o'), seq('0')));

const hexIntegerValue =
    trans(tokens => [Number.parseInt((tokens as string[])[0].replace(/_/g, ''), 16)])
    (numbers.hex(seq('0x'), seq('0X')));

const decimalIntegerValue =
    trans(tokens => [Number.parseInt((tokens as string[])[0].replace(/_/g, ''), 10)])
    (numbers.int);

const floatingPointNumberValue =
    trans(tokens => [Number.parseFloat((tokens as string[])[0].replace(/_/g, ''))])
    (numbers.float);

const numberValue =
    first(octalIntegerValue,
          hexIntegerValue,
          binaryIntegerValue,
          floatingPointNumberValue,
          decimalIntegerValue,
          positiveInfinityValue,
          negativeInfinityValue,
          nanValue, );


const stringEscapeSeq = first(
    trans(t => ['\''])(seq('\\\'')),
    trans(t => ['\"'])(seq('\\"')),
    trans(t => ['\`'])(seq('\\`')),
    trans(t => ['/'])(seq('\\/')),
    trans(t => ['\\'])(seq('\\\\')),
    trans(t => [''])(seq('\\\r\n')),
    trans(t => [''])(seq('\\\r')),
    trans(t => [''])(seq('\\\n')),
    trans(t => ['\n'])(seq('\\n')),
    trans(t => ['\r'])(seq('\\r')),
    trans(t => ['\v'])(seq('\\v')),
    trans(t => ['\t'])(seq('\\t')),
    trans(t => ['\b'])(seq('\\b')),
    trans(t => ['\f'])(seq('\\f')),
    trans(t => [String.fromCodePoint(Number.parseInt((t as string[])[0], 16))])(
        cat(erase(seq('\\u')),
                qty(4, 4)(classes.hex), )),
    trans(t => [String.fromCodePoint(Number.parseInt((t as string[])[0], 16))])(
        cat(erase(seq('\\u{')),
                qty(1, 6)(classes.hex),
                erase(seq('}')), )),
    trans(t => [String.fromCodePoint(Number.parseInt((t as string[])[0], 16))])(
        cat(erase(seq('\\x')),
                qty(2, 2)(classes.hex), )),
    trans(t => [String.fromCodePoint(Number.parseInt((t as string[])[0], 8))])(
        cat(erase(seq('\\')),
                qty(3, 3)(classes.oct), )));

const signleQuotStringValue =
    trans(tokens => [tokens[0]])(
        erase(seq("'")),
            cat(repeat(first(
                stringEscapeSeq,
                combine(cls('\r', '\n'), err('Line breaks within strings are not allowed.')),
                notCls("'"),
            ))),
        erase(seq("'")), );

const doubleQuotStringValue =
    trans(tokens => [tokens[0]])(
        erase(seq('"')),
            cat(repeat(first(
                stringEscapeSeq,
                combine(cls('\r', '\n'), err('Line breaks within strings are not allowed.')),
                notCls('"'),
            ))),
        erase(seq('"')), );

const backQuotStringValue =
    trans(tokens => [tokens[0]])(
        erase(seq('`')),
            cat(repeat(first(
                stringEscapeSeq,
                notCls('`'),
            ))),
        erase(seq('`')), );

const stringValue =
    first(signleQuotStringValue, doubleQuotStringValue, backQuotStringValue);

const regexpStringValue =
    // TODO: '/' ']' '\\' in character class '[]' is not parsed correctly.
    trans(tokens => [{value: new RegExp(tokens[0] as string)}])(
        erase(seq('/')),
            cat(repeat(first(
                stringEscapeSeq,
                notCls('/'),
            ))),
        erase(seq('/')), );


const symbolName =
    trans(tokens => [{symbol: (tokens as string[])[0]}])
    (cat(combine(classes.alpha, repeat(classes.alnum))));

const decoratorSymbolName =
    trans(tokens => [{symbol: (tokens as string[])[0]}])
    (cat(combine(seq('@'), classes.alpha, repeat(classes.alnum))));


const simpleConstExpr =
    first(trueValue, falseValue, nullValue, undefinedValue,
          numberValue, stringValue, );

const objKey =
    first(stringValue, symbolName);

const listValue = first(
    trans(tokens => [[]])(erase(
        seq('['),
            repeat(commentOrSpace),
        seq(']'), )),
    trans(tokens => {
        const ast: Ast = [{symbol: '$list'}];
        for (const token of tokens) {
            ast.push(token as any);
        }
        return [ast];
    })(
        erase(seq('[')),
            once(combine(
                erase(repeat(commentOrSpace)),
                first(input => listValue(input),   // NOTE: recursive definitions
                      input => objectValue(input), //       should place as lambda.
                      simpleConstExpr,
                      ),
                erase(repeat(commentOrSpace)), )),
            repeat(combine(
                erase(repeat(commentOrSpace),
                      seq(','),
                      repeat(commentOrSpace)),
                first(input => listValue(input),   // NOTE: recursive definitions
                      input => objectValue(input), //       should place as lambda.
                      simpleConstExpr,
                      ),
                erase(repeat(commentOrSpace)), )),
            qty(0, 1)(erase(
                seq(','),
                repeat(commentOrSpace), )),
            first(ahead(seq(']')), err('listValue: Unexpected token has appeared.')),
        erase(seq(']')),
    ), );

const objectKeyValuePair =
    combine(
        objKey,
        erase(repeat(commentOrSpace),
              first(seq(':'), err('":" is needed.')),
              repeat(commentOrSpace)),
        first(input => listValue(input),   // NOTE: recursive definitions
              input => objectValue(input), //       should place as lambda.
              simpleConstExpr,
              err('object value is needed.')), );

const objectValue = first(
    trans(tokens => [[{symbol: '#'}]])(erase(
        seq('{'),
            repeat(commentOrSpace),
        seq('}'),
    )),
    trans(tokens => {
        const ast: Ast = [{symbol: '#'}];
        for (let i = 0; i < tokens.length; i += 2) {
            if (tokens[i] === '__proto__') {
                continue; // NOTE: prevent prototype pollution attacks
            }
            ast.push([tokens[i], tokens[i + 1]]);
        }
        return [ast];
    })(
        erase(seq('{')),
            once(combine(
                erase(repeat(commentOrSpace)),
                objectKeyValuePair,
                erase(repeat(commentOrSpace)), )),
            repeat(combine(
                erase(seq(','),
                      repeat(commentOrSpace)),
                objectKeyValuePair,
                erase(repeat(commentOrSpace)), )),
            qty(0, 1)(erase(
                seq(','),
                repeat(commentOrSpace), )),
            first(ahead(seq('}')), err('objectValue: Unexpected token has appeared.')),
        erase(seq('}')),
    ), );

const constExpr =
    first(simpleConstExpr,
          listValue,
          objectValue, );


// const primitiveValue = trans(tokens => [[{symbol: 'primitiveValue'}, tokens[0]]])(
//     first(trueValue, falseValue, nullValue, undefinedValue,
//           numberValue, stringValue, ));

const primitiveValueNoNullUndefined =
    trans(tokens => [[{symbol: 'primitiveValue'}, tokens[0]]])(
        first(trueValue, falseValue,
              numberValue, stringValue, ));


const primitiveTypeName =
    trans(tokens => [[{symbol: 'primitive'}, tokens[0]]])(
        first(seq('number'), seq('bigint'), seq('string'), seq('boolean')), );

const nullUndefinedTypeName =
    trans(tokens => [[{symbol: 'primitive'}, tokens[0]]])(
        first(seq('null'), seq('undefined'), seq('any'), seq('never')), );

const simpleTypeName =
    first(primitiveTypeName,
          nullUndefinedTypeName,
          trans(tokens =>
                [[{symbol: 'ref'}, (tokens[0] as SxSymbol).symbol]])(symbolName), );


const sequenceType =
    trans(tokens => [[{symbol: 'sequenceOf'}, ...tokens]])(
        trans(tokens => tokens)(
            erase(seq('[')),
                once(combine(
                    erase(repeat(commentOrSpace)),
                    input => spreadOrComplexType(first(seq(','), seq(']')))(input),
                    erase(repeat(commentOrSpace)), )),
                repeat(combine(
                    erase(seq(','),
                        repeat(commentOrSpace)),
                    input => spreadOrComplexType(first(seq(','), seq(']')))(input),
                    erase(repeat(commentOrSpace)), )),
                qty(0, 1)(erase(
                    seq(','),
                    repeat(commentOrSpace), )),
                first(ahead(seq(']')), err('sequenceType: Unexpected token has appeared.')),
            erase(seq(']')), ));


const arraySizeFactorInner =
    first(
        trans(tokens => [[{symbol: '#'}, ['max', tokens[0]]]])(
            erase(seq('..')),
            erase(repeat(commentOrSpace)),
            decimalIntegerValue, ),
        trans(tokens => [[{symbol: '#'}, ['min', tokens[0]], ['max', tokens[1]]]])(
            decimalIntegerValue,
            erase(repeat(commentOrSpace)),
            erase(seq('..')),
            erase(repeat(commentOrSpace)),
            decimalIntegerValue, ),
        trans(tokens => [[{symbol: '#'}, ['min', tokens[0]]]])(
            decimalIntegerValue,
            erase(repeat(commentOrSpace)),
            erase(seq('..')), ),
        trans(tokens => [[{symbol: '#'}, ['max', tokens[0]]]])(
            decimalIntegerValue, ));

const arraySizeFactor =
    trans(tokens =>
        tokens.length > 0 ?
            tokens :
            [[{symbol: '#'}]])(
        erase(seq('[')),
            erase(repeat(commentOrSpace)),
            qty(0, 1)(arraySizeFactorInner),
            erase(repeat(commentOrSpace)),
        erase(seq(']')), );

const complexArrayType =
    trans(tokens => [[{symbol: 'repeated'}, tokens[0], tokens[1]]])(
        erase(seq('Array')),
        erase(repeat(commentOrSpace)),
        erase(seq('<')),
            erase(repeat(commentOrSpace)),
            input => complexType(first(seq(','), seq('>')))(input),
            erase(repeat(commentOrSpace)),
            qty(0, 1)(combine(
                erase(seq(',')),
                erase(repeat(commentOrSpace)),
                arraySizeFactorInner,
                erase(repeat(commentOrSpace)), )),
        erase(seq('>')), );

const spreadType =
    trans(tokens => [[{symbol: 'spread'}, tokens[0], tokens[1]]])(
        erase(seq('...')),
        erase(repeat(commentOrSpace)),
        erase(seq('<')),
            erase(repeat(commentOrSpace)),
            input => complexType(first(seq(','), seq('>')))(input),
            erase(repeat(commentOrSpace)),
            qty(0, 1)(combine(
                erase(seq(',')),
                erase(repeat(commentOrSpace)),
                arraySizeFactorInner,
                erase(repeat(commentOrSpace)), )),
        erase(seq('>')), );


const decorator =
    trans(tokens => [tokens])(
        decoratorSymbolName,
        qty(0, 1)(first(
            combine(erase(
                seq('('),
                    repeat(commentOrSpace),
                seq(')'), )),
            combine(
                erase(seq('(')),
                    once(combine(
                        erase(repeat(commentOrSpace)),
                        first(regexpStringValue, constExpr),
                        erase(repeat(commentOrSpace)), )),
                    repeat(combine(
                        erase(repeat(commentOrSpace)),
                        erase(seq(',')),
                        erase(repeat(commentOrSpace)),
                        first(regexpStringValue, constExpr),
                        erase(repeat(commentOrSpace)), )),
                    qty(0, 1)(erase(
                        seq(','),
                        repeat(commentOrSpace), )),
                erase(seq(')')),
            ), )));

const decoratorsClause =
    trans(tokens => tokens)(
        repeat(combine(
            decorator,
            erase(repeat(commentOrSpace)), )));


const complexTypeInnerWOSinpleArrayType = (edge: ParserFnWithCtx<string, Ctx, Ast>) =>
    first(simpleTypeName,
          primitiveValueNoNullUndefined,
          complexArrayType,
          sequenceType,
          input => interfaceDefInner(seq(','))(input), );

const complexTypeInnerRoot: (separator: ParserFnWithCtx<string, Ctx, Ast>) => ParserFnWithCtx<string, Ctx, Ast> =
    (edge: ParserFnWithCtx<string, Ctx, Ast>) =>
    trans(tokens => {
            let ty = [{symbol: '$pipe'}, tokens[1], ...(tokens[0] as Ast[])];
            if (tokens[2] !== null) {
                for (const z of tokens[2] as Ast[]) {
                    ty = [{symbol: 'repeated'}, ty, z];
                }
            }
            return ([[
                ty,
                ...(tokens[3] ? [tokens[3]] : []),
                ...tokens.slice(4),
            ]]);
        })(
        trans(tokens => [tokens])(qty(0, 1)(decoratorsClause)),
        first(
            input => complexTypeInnerWOSinpleArrayType(edge)(input),
            combine(
                erase(seq('(')),
                    erase(repeat(commentOrSpace)),
                    input => complexType(edge)(input),
                    erase(repeat(commentOrSpace)),
                erase(seq(')')), )),
            combine(
            trans(tokens => tokens[0] !== null ? [tokens] : [null])(
                first(
                    qty(1)(combine(
                        erase(repeat(commentOrSpace)),
                        arraySizeFactor,
                    )),
                    zeroWidth(() => null), )),
            combine(first(
                trans(tokens => [tokens[0], ...(tokens[1] as Ast[])])(
                    qty(1)(combine(
                        erase(repeat(commentOrSpace)),
                        trans(tokens => [{op: tokens[0]} as any])(or(seq('&'), seq('|'), seq('-'))),
                        erase(repeat(commentOrSpace)),
                        input => complexTypeInnerRoot(edge)(input), ))),
                trans(tokens => [])(), ))));


const binaryOp = (op: string, op1: any, op2: any) => {
    return [{symbol: op}, op1, op2];
};

const isOperator = (v: any, op: string) => {
    if (typeof v === 'object' && v.op === op) {
        return true;
    }
    return false;
};

const isValue = (v: any) => {
    // TODO: check type
    return true;
};


// production rules:
//   S -> S "&" S
const complexTypeExprRule3 = $o.trans(tokens => [binaryOp('intersect', tokens[0], tokens[2])])(
    $o.clsFn(t => isValue(t)),
    $o.clsFn(t => isOperator(t, '&')),
    $o.clsFn(t => isValue(t)),
);

// production rules:
//   S -> S "|" S
const complexTypeExprRule2 = $o.trans(tokens => [binaryOp('oneOf', tokens[0], tokens[2])])(
    $o.clsFn(t => isValue(t)),
    $o.clsFn(t => isOperator(t, '|')),
    $o.clsFn(t => isValue(t)),
);

// production rules:
//   S -> S "-" S
const complexTypeExprRule1 = $o.trans(tokens => [binaryOp('subtract', tokens[0], tokens[2])])(
    $o.clsFn(t => isValue(t)),
    $o.clsFn(t => isOperator(t, '-')),
    $o.clsFn(t => isValue(t)),
);

const complexType = (edge: ParserFnWithCtx<string, Ctx, Ast>) => rules({
    rules: [
        complexTypeExprRule3,
        complexTypeExprRule2,
        complexTypeExprRule1,
    ],
    check: $o.combine($o.classes.any, $o.end()),
})(trans(tokens => tokens[0] as Ast[])(complexTypeInnerRoot(edge)));


const spreadOrComplexType: (separator: ParserFnWithCtx<string, Ctx, Ast>) => ParserFnWithCtx<string, Ctx, Ast> =
    (edge: ParserFnWithCtx<string, Ctx, Ast>) =>
    first(spreadType, complexType(edge));


const typeDef =
    trans(tokens => [[{symbol: 'def'}, tokens[0], tokens[1]]])(
        erase(seq('type')),
            erase(repeat(commentOrSpace)),
            symbolName,
            erase(repeat(commentOrSpace)),
        erase(seq('=')),
            erase(repeat(commentOrSpace)),
            input => complexType(first(seq(','), seq(';')))(input),
            erase(repeat(commentOrSpace)),
        erase(seq(';')), );

const exportedTypeDef =
    trans(tokens => [[{symbol: 'export'}, tokens[0]]])(
        erase(seq('export'),
              repeat(commentOrSpace), ),
        typeDef, );


const interfaceExtendsClause =
    trans(tokens => [
            [{symbol: '$list'},
                ...tokens.map(x => [{symbol: 'ref'}, (x as SxSymbol).symbol])], ])(
        erase(seq('extends')),
        erase(repeat(commentOrSpace)),
        symbolName,
        repeat(combine(
            erase(repeat(commentOrSpace)),
            erase(seq(',')),
            erase(repeat(commentOrSpace)),
            symbolName, )));

const interfaceKeyTypePair = (separator: ParserFnWithCtx<string, Ctx, Ast>) =>
    trans(tokens => [
            [{symbol: '$list'},
                tokens[1],
                [{symbol: '$pipe'},
                    tokens[2] === '?' ?
                        [{symbol: 'optional'}, tokens[3]] :
                        tokens[3], ...(tokens[0] as Ast[]), ]]])(
        trans(tokens => [tokens])(first(
            once(decoratorsClause),
            zeroWidth(() => []), )),                // [0]
        objKey,                                     // [1]
        first(                                      // [2]
            combine(
                erase(repeat(commentOrSpace)),
                seq('?'),
                erase(repeat(commentOrSpace)), ),
            zeroWidth(() => ['']),
        ),
        erase(repeat(commentOrSpace),
            first(seq(':'), err('":" is needed.')),
            repeat(commentOrSpace), ),
        first(                                      // [3]
            input => complexType(first(separator, seq('}')))(input),
            err('interface member type is needed.'), ));

const interfaceDefInner: (separator: ParserFnWithCtx<string, Ctx, Ast>) => ParserFnWithCtx<string, Ctx, Ast> =
    (separator: ParserFnWithCtx<string, Ctx, Ast>) =>
    trans(tokens => [[{symbol: 'objectType'}, ...tokens]])(
        first(
            trans(tokens => tokens)(erase(
                seq('{'),
                    repeat(commentOrSpace),
                seq('}'),
            )),
            trans(tokens => tokens)(
                erase(seq('{')),
                    once(combine(
                        erase(repeat(commentOrSpace)),
                        interfaceKeyTypePair(separator),
                        erase(repeat(commentOrSpace)), )),
                    repeat(combine(
                        erase(separator,
                              repeat(commentOrSpace)),
                        interfaceKeyTypePair(separator),
                        erase(repeat(commentOrSpace)), )),
                    qty(0, 1)(erase(
                        separator,
                        repeat(commentOrSpace), )),
                    first(ahead(seq('}')), err('interfaceDefInner: Unexpected token has appeared.')),
                erase(seq('}')),
            ), ));

const interfaceDef =
    trans(tokens => [
        [{symbol: 'def'},
            tokens[0],
            [{symbol: 'derived'}, tokens[2], [{symbol: '$spread'}, tokens[1]]], ]])(
    erase(seq('interface')),
        erase(repeat(commentOrSpace)),
        symbolName,                              // [0]
        erase(repeat(commentOrSpace)),
        first(interfaceExtendsClause,            // [1]
              zeroWidth(() => []), ),
        erase(repeat(commentOrSpace)),
    input => interfaceDefInner(seq(';'))(input), // [2]
);

const exportedInterfaceDef =
    trans(tokens => [[{symbol: 'export'}, tokens[0]]])(
        erase(seq('export'),
              repeat(commentOrSpace), ),
        interfaceDef, );


const definition =
    first(typeDef,
          interfaceDef,
          exportedTypeDef,
          exportedInterfaceDef, );

const program =
    trans(tokens => tokens)(
        erase(repeat(commentOrSpace)),
        repeat(combine(
            definition,
            erase(repeat(commentOrSpace)), )),
        end(), );


export function parse(s: string) {
    const z = program(parserInput(s));
    if (! z.succeeded) {
        throw new Error(z.message);
    }
    return z.tokens;
}


// tslint:disable: object-literal-key-quotes
export function compile(s: string) {
    const mapTyToTy = new Map<TypeAssertion, TypeAssertionSetValue>();
    const mapStrToTy = new Map<string, TypeAssertionSetValue>();

    lisp.setGlobals({
        picked: operators.picked,
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
        objectType: operators.objectType,
        derived: operators.derived,
        def: (name: SxSymbol | string, ty: TypeAssertion) => {
            const tySet = mapTyToTy.has(ty) ? mapTyToTy.get(ty) as TypeAssertionSetValue : {ty, exported: false};
            mapStrToTy.set(typeof name === 'string' ? name : name.symbol, {ty, exported: false});
            if (! mapTyToTy.has(ty)) {
                mapTyToTy.set(ty, tySet);
            }
            return ty;
        },
        ref: (name: SxSymbol | string) => {
            const sym = typeof name === 'string' ? name : name.symbol;
            if (! mapStrToTy.has(sym)) {
                throw new Error(`Undefined symbol '${sym}' is referred.`);
            }
            return mapStrToTy.get(sym)?.ty;
        },
        export: (ty: TypeAssertion) => {
            const tySet = mapTyToTy.has(ty) ? mapTyToTy.get(ty) as TypeAssertionSetValue : {ty, exported: false};
            tySet.exported = true;
            return ty;
        },
        '@range': (minValue: number | string, maxValue: number | string) => (ty: PrimitiveTypeAssertion) => {
            if (typeof minValue !== 'number' && typeof minValue !== 'string') {
                throw new Error(`Decorator '@range' parameter 'minValue' should be number or string.`);
            }
            if (typeof maxValue !== 'number' && typeof maxValue !== 'string') {
                throw new Error(`Decorator '@range' parameter 'maxValue' should be number or string.`);
            }
            if (!ty || ty.kind !== 'primitive') {
                throw new Error(`Decorator '@range' cannot be applied to anything other than 'primitive'.`);
            }
            return ({...ty, minValue, maxValue});
        },
        '@minValue': (minValue: number | string) => (ty: PrimitiveTypeAssertion) => {
            if (typeof minValue !== 'number' && typeof minValue !== 'string') {
                throw new Error(`Decorator '@minValue' parameter 'minValue' should be number or string.`);
            }
            if (!ty || ty.kind !== 'primitive') {
                throw new Error(`Decorator '@minValue' cannot be applied to anything other than 'primitive'.`);
            }
            return ({...ty, minValue});
        },
        '@maxValue': (maxValue: number | string) => (ty: PrimitiveTypeAssertion) => {
            if (typeof maxValue !== 'number' && typeof maxValue !== 'string') {
                throw new Error(`Decorator '@maxValue' parameter 'maxValue' should be number or string.`);
            }
            if (!ty || ty.kind !== 'primitive') {
                throw new Error(`Decorator '@maxValue' cannot be applied to anything other than 'primitive'.`);
            }
            return ({...ty, maxValue});
        },
        '@greaterThan': (greaterThan: number | string) => (ty: PrimitiveTypeAssertion) => {
            if (typeof greaterThan !== 'number' && typeof greaterThan !== 'string') {
                throw new Error(`Decorator '@greaterThan' parameter 'greaterThan' should be number or string.`);
            }
            if (!ty || ty.kind !== 'primitive') {
                throw new Error(`Decorator '@greaterThan' cannot be applied to anything other than 'primitive'.`);
            }
            return ({...ty, greaterThan});
        },
        '@lessThan': (lessThan: number | string) => (ty: PrimitiveTypeAssertion) => {
            if (typeof lessThan !== 'number' && typeof lessThan !== 'string') {
                throw new Error(`Decorator '@lessThan' parameter 'lessThan' should be number or string.`);
            }
            if (!ty || ty.kind !== 'primitive') {
                throw new Error(`Decorator '@lessThan' cannot be applied to anything other than 'primitive'.`);
            }
            return ({...ty, lessThan});
        },
        '@minLength': (minLength: number) => (ty: PrimitiveTypeAssertion) => {
            if (typeof minLength !== 'number') {
                throw new Error(`Decorator '@minLength' parameter 'minLength' should be number.`);
            }
            if (!ty || ty.kind !== 'primitive') {
                throw new Error(`Decorator '@minLength' cannot be applied to anything other than 'primitive'.`);
            }
            return ({...ty, minLength});
        },
        '@maxLength': (maxLength: number) => (ty: PrimitiveTypeAssertion) => {
            if (typeof maxLength !== 'number') {
                throw new Error(`Decorator '@maxLength' parameter 'maxLength' should be number.`);
            }
            if (!ty || ty.kind !== 'primitive') {
                throw new Error(`Decorator '@maxLength' cannot be applied to anything other than 'primitive'.`);
            }
            return ({...ty, maxLength});
        },
        '@match': (pattern: RegExp) => (ty: PrimitiveTypeAssertion) => {
            if (typeof pattern !== 'object') {
                throw new Error(`Decorator '@match' parameter 'pattern' should be RegExp.`);
            }
            if (!ty || ty.kind !== 'primitive' || ty.primitiveName !== 'string') {
                throw new Error(`Decorator '@match' cannot be applied to anything other than 'primitive'.`);
            }
            return ({...ty, pattern});
        },
        // TODO: greaterThan, lessThan, minLength, maxLength, match
        '@msg': (messages: string | ErrorMessages) => (ty: TypeAssertion) =>
            operators.msg(messages, ty),
        '@msgId': (messageId: string) => (ty: TypeAssertion) =>
            operators.msgId(messageId, ty),
    });

    const z = parse(s);
    const ast = lisp.evaluateAST(z as SxToken[]) as TypeAssertion;

    return mapStrToTy;
}
// tslint:enable: object-literal-key-quotes
