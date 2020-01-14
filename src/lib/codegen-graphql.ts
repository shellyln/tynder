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
         ObjectAssertion,
         TypeAssertionMap,
         CodegenContext } from '../types';



function formatGraphQlCodeDocComment(ty: TypeAssertion | string, nestLevel: number) {
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


function generateGraphQlCodePrimitive(ty: PrimitiveTypeAssertion, ctx: CodegenContext) {
    switch (ty.primitiveName) {
    case 'number':
        return 'Float';
    case 'bigint':
        return 'String';
    case 'string':
        return 'String';
    case 'boolean':
        return 'Boolean';
    case 'undefined': case 'null': default:
        return 'Any'; // TODO: Any is invalid type.
    }
}


function generateGraphQlCodePrimitiveValue(ty: PrimitiveValueTypeAssertion, ctx: CodegenContext) {
    if (ty.value === null) {
        return 'Any'; // TODO: Any is invalid type.
    }
    if (ty.value === void 0) {
        return 'Any'; // TODO: Any is invalid type.
    }
    switch (typeof ty.value) {
        case 'number':
            return 'Float';
        case 'bigint':
            return 'String';
        case 'string':
            return 'String';
        case 'boolean':
            return 'Boolean';
        default:
            return 'Any'; // TODO: Any is invalid type.
    }
}


function generateGraphQlCodeRepeated(ty: RepeatedAssertion, ctx: CodegenContext) {
    return (`[${ty.repeated.typeName ?
            ty.repeated.typeName :
            generateGraphQlCodeInner(ty.repeated, false, ctx)}${
                ty.repeated.kind === 'optional' ? '' : '!'}]`
    );
}


function generateGraphQlCodeSpread(ty: SpreadAssertion, ctx: CodegenContext) {
    return '';
}


function generateGraphQlCodeSequence(ty: SequenceAssertion, ctx: CodegenContext) {
    return 'Any'; // TODO: Any is invalid type.
}


function generateGraphQlCodeOneOf(ty: OneOfAssertion, ctx: CodegenContext) {
    return `${ty.oneOf
        .map(x => x.typeName ?
            x.typeName :
            generateGraphQlCodeInner(x, false, ctx)).join(' | ')}`;
}


function generateGraphQlCodeEnum(ty: EnumAssertion, ctx: CodegenContext) {
    return `${ty.values.map(x => `${x[1]}`).join(' | ')}`; // TODO: invalid syntax
}


function generateGraphQlCodeObject(ty: ObjectAssertion, isInterface: boolean, ctx: CodegenContext) {
    if (ty.members.filter(x => !(x[2])).length === 0) {
        return '{}';
    }
    const sep = '\n';

    const memberLines =
        ty.members
        .map(x =>
            `${formatGraphQlCodeDocComment(x[3] || '', ctx.nestLevel + 1)}${
                '    '.repeat(ctx.nestLevel + 1)}${
                x[0]}: ${
                x[1].typeName ?
                    `${x[1].typeName}` :
                    generateGraphQlCodeInner(x[1], false, {...ctx, nestLevel: ctx.nestLevel + 1})}${
                x[1].kind === 'optional' ? '' : '!'}`);

    return (
        `{\n${memberLines.join(sep)}${sep}${'    '.repeat(ctx.nestLevel)}}`
    );
}


function generateGraphQlCodeInner(ty: TypeAssertion, isInterface: boolean, ctx: CodegenContext): string {
    let ret = '';

    switch (ty.kind) {
    case 'optional':
        return generateGraphQlCodeInner(ty.optional, isInterface, ctx);
    case 'one-of':
        return generateGraphQlCodeOneOf(ty, ctx); // TODO: inline union is invalid.
    case 'spread':
        return generateGraphQlCodeSpread(ty, ctx);
    case 'sequence':
        return generateGraphQlCodeSequence(ty, ctx);
    case 'never':
        ret = 'Any'; // TODO: Any is invalid type.
        break;
    case 'any':
        ret = 'Any'; // TODO: Any is invalid type.
        break;
    case 'unknown':
        ret = 'Any'; // TODO: Any is invalid type.
        break;
    case 'primitive':
        ret = generateGraphQlCodePrimitive(ty, ctx);
        break;
    case 'primitive-value':
        ret = generateGraphQlCodePrimitiveValue(ty, ctx);
        break;
    case 'repeated':
        ret = generateGraphQlCodeRepeated(ty, ctx);
        break;
    case 'enum':
        ret = generateGraphQlCodeEnum(ty, ctx);
        break;
    case 'object':
        ret = generateGraphQlCodeObject(ty, isInterface, ctx);
        break;
    case 'symlink':
        ret = ty.symlinkTargetName;
        break;
    default:
        throw new Error(`Unknown type assertion: ${(ty as any).kind}`);
    }
    return ret + '';
}


export function generateGraphQlCode(types: TypeAssertionMap): string {
    let code = `\nscalar Any\n\n`;

    const ctx = {nestLevel: 0};
    for (const ty of types.entries()) {
        if (ty[1].ty.noOutput) {
            code += `scalar ${ty[0]}\n\n`;
            continue;
        }
        code += formatGraphQlCodeDocComment(ty[1].ty, ctx.nestLevel);
        if (ty[1].ty.kind === 'object') {
            code += `type ${ty[0]} ${
                generateGraphQlCodeInner(ty[1].ty, true, ctx)}\n\n`;
        } else if (ty[1].ty.kind === 'enum') {
            const indent0 = '    '.repeat(ctx.nestLevel);
            const indent1 = '    '.repeat(ctx.nestLevel + 1);
            code += `enum ${ty[0]} {\n${
                ty[1].ty.values
                    .map(x => `${
                        formatGraphQlCodeDocComment(x[2] || '', ctx.nestLevel + 1)}${
                        indent1}${x[0]}\n`)
                    .join('')}${indent0}}\n\n`;
        } else if (ty[1].ty.kind === 'never' && ty[1].ty.passThruCodeBlock) {
            // nothing to do
        } else {
            code += `union ${ty[0]} = ${generateGraphQlCodeInner(ty[1].ty, false, ctx)}\n\n`;
        }
    }
    return code;
}
