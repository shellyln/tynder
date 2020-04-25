// Copyright (c) 2020 Shellyl_N and Authors
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
         CodegenContext } from '../types';
import { escapeString }   from '../lib/escape';
import { SymbolPattern }  from '../lib/util';



function formatTypeName(typeName: string) {
    if (typeName.includes('.')) {
        // const z = typeName.split('.');
        // let s = z[0];
        // for (let i = 1; i < z.length; i++) {
        //     s += `['${escapeString(z[i])}']`
        // }
        // return `(${s})`;
        return 'object';
    }
    return typeName;
}


function formatCSharpCodeDocComment(ty: TypeAssertion | string, nestLevel: number) {
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


function generateCSharpCodePrimitive(ty: PrimitiveTypeAssertion, ctx: CodegenContext) {
    // TODO: Function, DateStr, DateTimeStr
    switch (ty.primitiveName) {
    case 'null': case 'undefined':
        return 'object';
    case 'integer':
        return 'int';
    case 'bigint':
        return 'decimal';
    case 'number':
        return 'double';
    case 'boolean':
        return 'bool';
    default:
        return ty.primitiveName;
    }
}


function generateCSharpCodePrimitiveValue(ty: PrimitiveValueTypeAssertion, ctx: CodegenContext) {
    if (ty.value === null || ty.value === void 0) {
        return 'object';
    }
    switch (typeof ty.primitiveName) {
    case 'bigint':
        return 'decimal';
    default:
        switch (typeof ty.value) {
        case 'number':
            return 'double';
        case 'string':
            return 'string';
        case 'boolean':
            return 'bool';
        default:
            return 'object';
        }
    }
}


function generateCSharpCodeRepeated(ty: RepeatedAssertion, ctx: CodegenContext) {
    return (
        `${ty.repeated.typeName ?
            formatTypeName(ty.repeated.typeName) :
            'object'}[]`
    );
}


function generateCSharpCodeSpread(ty: SpreadAssertion, ctx: CodegenContext) {
    return '';
}


function generateCSharpCodeSequence(ty: SequenceAssertion, ctx: CodegenContext) {
    // return `[${
    //     ty.sequence
    //         .filter(x => x.kind !== 'spread')
    //         .map(x => x.typeName ?
    //             formatTypeName(x.typeName) :
    //             generateCSharpCodeInner(x, false, {...ctx, nestLevel: ctx.nestLevel + 1}))
    //         .join(', ')}]`;
    return 'object[]';
}


function appendOptionalModifier(name: string) {
    switch (name) {
    case 'decimal': case 'int': case 'double': case 'bool':
        return `${name}?`;
    default:
        return name;
    }
}


function generateCSharpCodeOneOf(ty: OneOfAssertion, ctx: CodegenContext) {
    const filtered = ty.oneOf.filter(x => !(
        x.kind === 'primitive' && (x.primitiveName === 'null' || x.primitiveName === 'undefined') ||
        x.kind === 'primitive-value' && (x.value === null || x.value === void 0)));
    if (filtered.length === 1 && ty.oneOf.length !== 1) {
        return appendOptionalModifier(generateCSharpCodeInner(filtered[0], false, ctx));
    } else {
        return 'object';
    }
}


function generateCSharpCodeOptional(ty: OptionalAssertion, ctx: CodegenContext) {
    return appendOptionalModifier(generateCSharpCodeInner(ty.optional, false, ctx));
}


function generateCSharpCodeEnum(ty: EnumAssertion, ctx: CodegenContext) {
    return `(${ty.values.map(x => `${x[1]}`).join(' | ')})`;
}


function addAttributes(ty: TypeAssertion, ctx: CodegenContext, typeName: string) {
    const attrs: string[] = [];
    if (ty.kind !== 'optional') {
        switch (typeName) {
        case 'decimal': case 'int': case 'double': case 'bool':
            break;
        default:
            attrs.push('Required');
            break;
        }
    }
    if (0 < attrs.length) {
        return `[${attrs.join(', ')}]\n${'    '.repeat(ctx.nestLevel + 1)}`;
    } else{
        return '';
    }
}


function generateCSharpCodeObject(ty: ObjectAssertion, isInterface: boolean, ctx: CodegenContext) {
    const sep = '\n';

    const memberLines =
        ty.members.filter(x => !(x[2]))
        .map(x => {
            const typeName =
                x[1].typeName ?
                    formatTypeName(x[1].typeName) :
                    generateCSharpCodeInner(x[1], false, {...ctx, nestLevel: ctx.nestLevel + 1});

            return (
                `${formatCSharpCodeDocComment(x[3] || '', ctx.nestLevel + 1)}${
                    '    '.repeat(ctx.nestLevel + 1)}${addAttributes(x[1], ctx, typeName)}public ${
                    typeName} ${x[0]} { get; set; }`
            );
        });

    if (memberLines.length === 0) {
        return `\n${'    '.repeat(ctx.nestLevel)}{\n${'    '.repeat(ctx.nestLevel)}}`;
    }
    return (
        `\n${'    '.repeat(ctx.nestLevel)}{\n${memberLines.join(sep)}${sep}${'    '.repeat(ctx.nestLevel)}}`
    );
}


function generateCSharpCodeInner(ty: TypeAssertion, isInterface: boolean, ctx: CodegenContext): string {
    switch (ty.kind) {
    case 'never': case 'any': case 'unknown':
        return 'object';
    case 'primitive':
        return generateCSharpCodePrimitive(ty, ctx);
    case 'primitive-value':
        return generateCSharpCodePrimitiveValue(ty, ctx);
    case 'repeated':
        return generateCSharpCodeRepeated(ty, ctx);
    case 'spread':
        return generateCSharpCodeSpread(ty, ctx);
    case 'sequence':
        return generateCSharpCodeSequence(ty, ctx);
    case 'one-of':
        return generateCSharpCodeOneOf(ty, ctx);
    case 'optional':
        return generateCSharpCodeOptional(ty, ctx);
    // case 'enum':
    //     return generateCSharpCodeEnum(ty, ctx);
    case 'object':
        return generateCSharpCodeObject(ty, isInterface, ctx);
    case 'symlink':
        return ty.symlinkTargetName;
    case 'operator':
        throw new Error(`Unexpected type assertion: ${(ty as any).kind}`);
    default:
        throw new Error(`Unknown type assertion: ${(ty as any).kind}`);
    }
}


export function generateCSharpCode(types: TypeAssertionMap): string {
    let code =
`using System.ComponentModel.DataAnnotations;

namespace Tynder.UserSchema {
`;

    const ctx = {nestLevel: 1};
    for (const ty of types.entries()) {
        if (ty[1].ty.noOutput) {
            continue;
        }

        code += formatCSharpCodeDocComment(ty[1].ty, ctx.nestLevel);
        const accessModifier = ty[1].exported ? 'public' : 'public';

        if (ty[1].ty.kind === 'object') {
            code += `    ${accessModifier} class ${ty[0]}${
                ty[1].ty.baseTypes && ty[1].ty.baseTypes.length ? ` : ${
                    ty[1].ty.baseTypes
                        .filter(x => x.typeName)
                        .map(x => formatTypeName(x.typeName as string))
                        .join(', ')}` : ''} ${
                generateCSharpCodeInner(ty[1].ty, true, ctx)}\n\n`;
        } else if (ty[1].ty.kind === 'enum') {
            const indent0 = '    '.repeat(ctx.nestLevel);
            const indent1 = '    '.repeat(ctx.nestLevel + 1);
            let value: number | null = 0;
            code += `    ${accessModifier} static class ${ty[0]}\n${indent0}{\n${
                ty[1].ty.values
                    .map(x => `${
                        formatCSharpCodeDocComment(x[2] || '', ctx.nestLevel + 1)}${
                        indent1}${(() => {
                            if (value !== null && x[1] === value) {
                                value++;
                                return `public static double ${x[0]} { get { return ${x[1]}; } }`;
                            } else {
                                if (typeof x[1] === 'number') {
                                    value = x[1] + 1;
                                    return `public static double ${x[0]} { get { return ${x[1]}; } }`;
                                } else {
                                    return `public static string ${x[0]} { get { return "${escapeString(x[1])}" } }`;
                                }
                            }
                        })()}\n`)
                    .join('')}${indent0}}\n\n`;
        } else if (ty[1].ty.kind === 'never' && ty[1].ty.passThruCodeBlock) {
            // nothing to do
        } else {
            // code += `type ${ty[0]} = ${
            //     (ty[1].ty.originalTypeName ?
            //         formatTypeName(ty[1].ty.originalTypeName) :
            //         void 0) ||
            //     generateCSharpCodeInner(ty[1].ty, false, ctx)};\n\n`;
        }
    }
    return code + '}\n';
}
