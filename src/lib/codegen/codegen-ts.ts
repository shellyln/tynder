// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { TypeAssertion,
         PrimitiveTypeAssertion,
         PrimitiveValueTypeAssertion,
         RepeatedAssertion,
         SpreadAssertion,
         SequenceAssertion,
         OneOfAssertion,
         OptionalAssertion,
         EnumAssertion,
         AdditionalPropsKey,
         ObjectAssertion,
         TypeAssertionMap,
         CodegenContext } from '../../types';
import { escapeString }   from '../../lib/escape';
import { SymbolPattern }  from '../../lib/util';



function formatTypeName(typeName: string) {
    if (typeName.includes('.')) {
        const z = typeName.split('.');
        let s = z[0];
        for (let i = 1; i < z.length; i++) {
            s += `['${escapeString(z[i])}']`
        }
        return `(${s})`;
    }
    return typeName;
}


function formatTypeScriptCodeDocComment(ty: TypeAssertion | string, nestLevel: number) {
    let code = '';
    const indent = '    '.repeat(nestLevel);
    const docComment = typeof ty === 'string' ? ty : ty.docComment;
    if (docComment) {
        if (0 <= docComment.indexOf('\n')) {
            code += `${indent}/**\n${indent}  ${
                docComment
                    .split('\n')
                    .map(x => x.trimLeft())
                    .join(`\n${indent} `)}\n${indent} */\n`;
        } else {
            code += `${indent}/** ${docComment} */\n`;
        }
    }
    return code;
}


function generateTypeScriptCodePrimitive(ty: PrimitiveTypeAssertion, ctx: CodegenContext) {
    // TODO: Function, DateStr, DateTimeStr
    switch (ty.primitiveName) {
    case 'integer':
        return 'number';
    default:
        return ty.primitiveName;
    }
}


function generateTypeScriptCodePrimitiveValue(ty: PrimitiveValueTypeAssertion, ctx: CodegenContext) {
    if (ty.value === null) {
        return 'null';
    }
    if (ty.value === void 0) {
        return 'undefined';
    }
    switch (typeof ty.value) {
    case 'string':
        return `'${escapeString(ty.value)}'`;
    case 'bigint':
        return `${ty.value.toString()}n`;
    default:
        return ty.value.toString();
    }
}


function generateTypeScriptCodeRepeated(ty: RepeatedAssertion, ctx: CodegenContext) {
    return (ty.repeated.kind === 'primitive' ||
            ty.repeated.kind === 'never' ||
            ty.repeated.kind === 'any' ||
            ty.repeated.kind === 'unknown' ||
            ty.repeated.kind === 'object' ||
            ty.repeated.kind === 'symlink' ||
            (ty.repeated.kind === 'one-of' && ty.repeated.typeName) ?
        `${ty.repeated.typeName ?
            formatTypeName(ty.repeated.typeName) :
            generateTypeScriptCodeInner(ty.repeated, false, ctx)}[]` :
        `Array<${ty.repeated.typeName ?
            formatTypeName(ty.repeated.typeName) :
            generateTypeScriptCodeInner(ty.repeated, false, ctx)}>`
    );
}


function generateTypeScriptCodeSpread(ty: SpreadAssertion, ctx: CodegenContext) {
    return '';
}


function generateTypeScriptCodeSequence(ty: SequenceAssertion, ctx: CodegenContext) {
    if (0 < ty.sequence.filter(x => x.kind === 'spread' || x.kind === 'optional').length) {
        return 'any[]';
    }
    return `[${
        ty.sequence
            .filter(x => x.kind !== 'spread' && x.kind !== 'optional')
            .map(x => x.typeName ?
                formatTypeName(x.typeName) :
                generateTypeScriptCodeInner(x, false, {...ctx, nestLevel: ctx.nestLevel + 1}))
            .join(', ')}]`;
}


function generateTypeScriptCodeOneOf(ty: OneOfAssertion, ctx: CodegenContext) {
    return `(${ty.oneOf
        .map(x => x.typeName ?
            formatTypeName(x.typeName) :
            generateTypeScriptCodeInner(x, false, ctx)).join(' | ')})`;
}


function generateTypeScriptCodeOptional(ty: OptionalAssertion, ctx: CodegenContext) {
    return generateTypeScriptCodeInner(ty.optional, false, ctx);
}


function generateTypeScriptCodeEnum(ty: EnumAssertion, ctx: CodegenContext) {
    return `(${ty.values.map(x => `${x[1]}`).join(' | ')})`;
}


function formatAdditionalPropsName(ak: AdditionalPropsKey, i: number) {
    return (`[propName${i}: ${ak.map(x => typeof x === 'string' ? x : 'string').join(' | ')}]`);
}


function generateTypeScriptCodeObject(ty: ObjectAssertion, isInterface: boolean, ctx: CodegenContext) {
    if (ty.members.filter(x => !(x[2])).length === 0 &&
        ty.additionalProps?.filter(x => !(x[2])).length === 0) {
        return '{}';
    }
    // NOTE: Semicolon is always preferred.
    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/member-delimiter-style.md
    const sep = isInterface ? ';\n' : ';\n';

    const memberLines =
        ty.members.filter(x => !(x[2]))
        .map(x =>
            `${formatTypeScriptCodeDocComment(x[3] || '', ctx.nestLevel + 1)}${
                '    '.repeat(ctx.nestLevel + 1)}${
                SymbolPattern.test(x[0]) ? x[0] : `'${escapeString(x[0])}'`}${
                    x[1].kind === 'optional' ? '?' : ''}: ${
                x[1].typeName ?
                    formatTypeName(x[1].typeName) :
                    generateTypeScriptCodeInner(x[1], false, {...ctx, nestLevel: ctx.nestLevel + 1})}`);

    const additionalPropsLines =
        ty.additionalProps?.filter(x => !(x[2]))
        .map((x, i) =>
            `${formatTypeScriptCodeDocComment(x[3] || '', ctx.nestLevel + 1)}${
                '    '.repeat(ctx.nestLevel + 1)}${
                formatAdditionalPropsName(x[0], i)}${x[1].kind === 'optional' ? '?' : ''}: ${
                x[1].typeName ?
                    formatTypeName(x[1].typeName) :
                    generateTypeScriptCodeInner(x[1], false, {...ctx, nestLevel: ctx.nestLevel + 1})}`) || [];

    const propsLines = memberLines.concat(additionalPropsLines);
    if (propsLines.length === 0) {
        return '{}';
    }
    return (
        `{\n${propsLines.join(sep)}${sep}${'    '.repeat(ctx.nestLevel)}}`
    );
}


function generateTypeScriptCodeInner(ty: TypeAssertion, isInterface: boolean, ctx: CodegenContext): string {
    switch (ty.kind) {
    case 'never':
        return 'never';
    case 'any':
        return 'any';
    case 'unknown':
        return 'unknown';
    case 'primitive':
        return generateTypeScriptCodePrimitive(ty, ctx);
    case 'primitive-value':
        return generateTypeScriptCodePrimitiveValue(ty, ctx);
    case 'repeated':
        return generateTypeScriptCodeRepeated(ty, ctx);
    case 'spread':
        return generateTypeScriptCodeSpread(ty, ctx);
    case 'sequence':
        return generateTypeScriptCodeSequence(ty, ctx);
    case 'one-of':
        return generateTypeScriptCodeOneOf(ty, ctx);
    case 'optional':
        return generateTypeScriptCodeOptional(ty, ctx);
    case 'enum':
        return generateTypeScriptCodeEnum(ty, ctx);
    case 'object':
        return generateTypeScriptCodeObject(ty, isInterface, ctx);
    case 'symlink':
        return ty.symlinkTargetName;
    case 'operator':
        throw new Error(`Unexpected type assertion: ${(ty as any).kind}`);
    default:
        throw new Error(`Unknown type assertion: ${(ty as any).kind}`);
    }
}


export function generateTypeScriptCode(types: TypeAssertionMap): string {
    let code = '';
    const ctx = {nestLevel: 0};
    for (const ty of types.entries()) {
        if (ty[1].ty.noOutput) {
            continue;
        }
        code += formatTypeScriptCodeDocComment(ty[1].ty, ctx.nestLevel);
        if (ty[1].exported) {
            code += 'export ';
        }
        if (ty[1].ty.kind === 'object') {
            code += `interface ${ty[0]}${
                ty[1].ty.baseTypes && ty[1].ty.baseTypes.length ? ` extends ${
                    ty[1].ty.baseTypes
                        .filter(x => x.typeName)
                        .map(x => formatTypeName(x.typeName as string))
                        .join(', ')}` : ''} ${
                generateTypeScriptCodeInner(ty[1].ty, true, ctx)}\n\n`;
        } else if (ty[1].ty.kind === 'enum') {
            const indent0 = '    '.repeat(ctx.nestLevel);
            const indent1 = '    '.repeat(ctx.nestLevel + 1);
            let value: number | null = 0;
            code += `${ty[1].ty.isConst ? 'const ' : ''}enum ${ty[0]} {\n${
                ty[1].ty.values
                    .map(x => `${
                        formatTypeScriptCodeDocComment(x[2] || '', ctx.nestLevel + 1)}${
                        indent1}${(() => {
                            if (value !== null && x[1] === value) {
                                value++;
                                return `${x[0]}`;
                            } else {
                                if (typeof x[1] === 'number') {
                                    value = x[1] + 1;
                                    return `${x[0]} = ${x[1]}`;
                                } else {
                                    return `${x[0]} = '${escapeString(x[1])}'`;
                                }
                            }
                        })()},\n`)
                    .join('')}${indent0}}\n\n`;
        } else if (ty[1].ty.kind === 'never' && ty[1].ty.passThruCodeBlock) {
            code += `${ty[1].ty.passThruCodeBlock}\n\n`;
        } else {
            code += `type ${ty[0]} = ${
                (ty[1].ty.originalTypeName ?
                    formatTypeName(ty[1].ty.originalTypeName) :
                    void 0) ||
                generateTypeScriptCodeInner(ty[1].ty, false, ctx)};\n\n`;
        }
    }
    return code;
}
