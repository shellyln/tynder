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
         ObjectAssertion,
         TypeAssertionMap,
         CodegenContext } from '../types';
import { escapeString }   from '../lib/escape';
import { nvl }            from '../lib/util';



function formatTypeName(ty: TypeAssertion, ctx: CodegenContext, typeName: string) {
    if (typeName.includes('.')) {
        return generateCSharpCodeInner(ty, false, {...ctx, nestLevel: ctx.nestLevel + 1});
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
            formatTypeName(ty.repeated, ctx, ty.repeated.typeName) :
            'object'}[]`
    );
}


function generateCSharpCodeSpread(ty: SpreadAssertion, ctx: CodegenContext) {
    return '';
}


function generateCSharpCodeSequence(ty: SequenceAssertion, ctx: CodegenContext) {
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


export function nvl2(v: any, f: (x: any) => any, alt: any) {
    return (
        v !== null && v !== void 0 ? v : alt
    );
}


function addAttributes(ty: TypeAssertion, ctx: CodegenContext, typeName: string) {
    const attrs: string[] = [];
    let ty2: TypeAssertion = ty;

    if (ty2.kind !== 'optional') {
        switch (typeName) {
        case 'decimal': case 'int': case 'double': case 'bool':
            break;
        default:
            attrs.push('Required');
            break;
        }
        ty2 = ty;
    }

    switch (ty2.kind) {
    case 'primitive':
        {
            if (typeof ty2.minLength === 'number') {
                attrs.push(`MinLength(${ty2.minLength})`);
            }
            if (typeof ty2.maxLength === 'number') {
                attrs.push(`MaxLength(${ty2.maxLength})`);
            }
            if (ty2.minValue !== null && ty2.minValue !== void 0 ||
                ty2.maxValue !== null && ty2.maxValue !== void 0) {
                switch (ty2.primitiveName) {
                case 'string':
                    attrs.push(`Range(typeof(string),
                        ${nvl(ty2.minValue, '')}, ${nvl(ty2.maxValue, '')})`);
                    break;
                case 'bigint':
                    attrs.push(`Range(typeof(decimal),
                        ${nvl2(ty2.minValue, x => `new decimal(@"${String(x)}").ToString()`, 'Decimal.MinValue')},
                        ${nvl2(ty2.maxValue, x => `new decimal(@"${String(x)}").ToString()`, 'Decimal.MaxValue')})`);
                    break;
                case 'integer':
                    attrs.push(`Range(
                        ${nvl2(ty2.minValue, x => `(int)${String(x)}`, 'Int32.MinValue')},
                        ${nvl2(ty2.maxValue, x => `(int)${String(x)}`, 'Int32.MaxValue')})`);
                    break;
                case 'number':
                    attrs.push(`Range(
                        ${nvl2(ty2.minValue, x => `(double)${String(x)}`, 'Double.MinValue')},
                        ${nvl2(ty2.maxValue, x => `(double)${String(x)}`, 'Double.MaxValue')})`);
                    break;
                }
            }
            if (ty2.pattern) {
                attrs.push(`RegularExpression(@"${ty2.pattern.source.replace(/"/g, '""')}")`);
            }
        }
        break;
    case 'repeated':
        {
            if (typeof ty2.min === 'number') {
                attrs.push(`MinLength(${ty2.min})`);
            }
            if (typeof ty2.max === 'number') {
                attrs.push(`MaxLength(${ty2.max})`);
            }
        }
        break;
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
                    formatTypeName(x[1], {...ctx, nestLevel: ctx.nestLevel + 1}, x[1].typeName) :
                    generateCSharpCodeInner(x[1], false, {...ctx, nestLevel: ctx.nestLevel + 1});

            return (
                `${formatCSharpCodeDocComment(x[3] || '', ctx.nestLevel + 1)}${
                    '    '.repeat(ctx.nestLevel + 1)}${addAttributes(x[1], ctx, typeName)}public ${
                    typeName} ${x[0]} { get; set; }`
            );
        });

    if (memberLines.length === 0) {
        return (`\n${
            '    '.repeat(ctx.nestLevel)}{\n${
            '    '.repeat(ctx.nestLevel)}}`
        );
    }
    return (`\n${
        '    '.repeat(ctx.nestLevel)}{\n${memberLines.join(sep)}${sep}${
        '    '.repeat(ctx.nestLevel)}}`
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

namespace Tynder.UserSchema
{
`;

    const ctx = {nestLevel: 1};

    for (const ty of types.entries()) {
        if (ty[1].ty.noOutput) {
            continue;
        }

        const indent0 = '    '.repeat(ctx.nestLevel);

        if (ty[1].ty.kind === 'object') {
            // nothing to do
        } else if (ty[1].ty.kind === 'enum') {
            // nothing to do
        } else if (ty[1].ty.kind === 'never' && ty[1].ty.passThruCodeBlock) {
            // nothing to do
        } else {
            code += formatCSharpCodeDocComment(ty[1].ty, ctx.nestLevel);
            code += `${indent0}using ${ty[0]} = System.Object;\n\n`;
        }
    }

    for (const ty of types.entries()) {
        if (ty[1].ty.noOutput) {
            continue;
        }

        const accessModifier = ty[1].exported ? 'public' : 'public';
        const indent0 = '    '.repeat(ctx.nestLevel);
        const indent1 = '    '.repeat(ctx.nestLevel + 1);

        if (ty[1].ty.kind === 'object') {
            code += formatCSharpCodeDocComment(ty[1].ty, ctx.nestLevel);
            code += `${indent0}${accessModifier} class ${ty[0]}${
                ty[1].ty.baseTypes && ty[1].ty.baseTypes.length ? ` : ${
                    ty[1].ty.baseTypes
                        .filter(x => x.typeName)
                        .map(x => formatTypeName(x, {...ctx, nestLevel: ctx.nestLevel + 1}, x.typeName as string))
                        .join(', ')}` : ''} ${
                generateCSharpCodeInner(ty[1].ty, true, ctx)}\n\n`;
        } else if (ty[1].ty.kind === 'enum') {
            code += formatCSharpCodeDocComment(ty[1].ty, ctx.nestLevel);
            let value: number | null = 0;
            code += `${indent0}${accessModifier} static class ${ty[0]}\n${indent0}{\n${
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
            // nothing to do
        }
    }
    return code + '}\n';
}
