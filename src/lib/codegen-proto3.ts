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
import { escapeString }   from '../lib/escape';



function formatTypeName(ty: TypeAssertion, ctx: CodegenContext, typeName: string) {
    if (typeName.includes('.')) {
        return generateProto3CodeInner(ty, false, ctx);
    }
    return typeName;
}


function formatProto3CodeDocComment(ty: TypeAssertion | string, nestLevel: number) {
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


function generateProto3CodePrimitive(ty: PrimitiveTypeAssertion, ctx: CodegenContext) {
    switch (ty.primitiveName) {
    case 'number':
        return 'double';
    case 'integer':
        return 'int32';
    case 'bigint':
        return 'string';
    case 'string':
        return 'string';
    case 'boolean':
        return 'bool';
    case 'undefined': case 'null': default:
        return 'google.protobuf.Any';
    }
    // TODO: Function, integer, DateStr, DateTimeStr
}


function generateProto3CodePrimitiveValue(ty: PrimitiveValueTypeAssertion, ctx: CodegenContext) {
    if (ty.value === null) {
        return 'google.protobuf.Any';
    }
    if (ty.value === void 0) {
        return 'google.protobuf.Any';
    }
    switch (typeof ty.value) {
    case 'number':
        return 'double';
    case 'bigint':
        return 'string';
    case 'string':
        return 'string';
    case 'boolean':
        return 'bool';
    default:
        return 'google.protobuf.Any';
    }
}


function generateProto3CodeRepeated(ty: RepeatedAssertion, ctx: CodegenContext) {
    return (`repeated ${ty.repeated.typeName ?
            formatTypeName(ty.repeated, ctx, ty.repeated.typeName) :
            generateProto3CodeInner(ty.repeated, false, ctx)}`
    );
}


function generateProto3CodeSpread(ty: SpreadAssertion, ctx: CodegenContext) {
    return '';
}


function generateProto3CodeSequence(ty: SequenceAssertion, ctx: CodegenContext) {
    return 'google.protobuf.Any';
}


function generateProto3CodeOneOf(ty: OneOfAssertion, ctx: CodegenContext) {
    return 'google.protobuf.Any';
}


function generateProto3CodeOptional(ty: OptionalAssertion, ctx: CodegenContext) {
    const r = generateProto3CodeInner(ty.optional, false, ctx);
    switch (r) {
    case 'double':
        return 'google.protobuf.DoubleValue';
    case 'int64':
        return 'google.protobuf.Int64Value';
    case 'int32':
        return 'google.protobuf.Int32Value';
    case 'string':
        return 'google.protobuf.StringValue';
    case 'bool':
        return 'google.protobuf.BoolValue';
    default:
        return 'google.protobuf.Any';
    }
}


function generateProto3CodeEnum(ty: EnumAssertion, ctx: CodegenContext) {
    return `(${ty.values.map(x => `${x[1]}`).join(' | ')})`;
}


function generateProto3CodeObject(ty: ObjectAssertion, isInterface: boolean, ctx: CodegenContext) {
    if (ty.members.length === 0) {
        return '{}';
    }
    const sep = isInterface ? ';\n' : ',\n';
    let count = 1;

    const memberLines =
        ty.members
        .map(x =>
            `${formatProto3CodeDocComment(x[3] || '', ctx.nestLevel + 1)}${
                '    '.repeat(ctx.nestLevel + 1)}${
                x[1].typeName ?
                    formatTypeName(x[1], {...ctx, nestLevel: ctx.nestLevel + 1}, x[1].typeName) :
                    generateProto3CodeInner(x[1], false, {...ctx, nestLevel: ctx.nestLevel + 1})} ${
                x[0]} = ${count++}`);

    return (
        `{\n${memberLines.join(sep)}${sep}${'    '.repeat(ctx.nestLevel)}}`
    );
}


function generateProto3CodeInner(ty: TypeAssertion, isInterface: boolean, ctx: CodegenContext): string {
    switch (ty.kind) {
    case 'never': case 'any': case 'unknown':
        return 'google.protobuf.Any';
    case 'primitive':
        return generateProto3CodePrimitive(ty, ctx);
    case 'primitive-value':
        return generateProto3CodePrimitiveValue(ty, ctx);
    case 'repeated':
        return generateProto3CodeRepeated(ty, ctx);
    case 'spread':
        return generateProto3CodeSpread(ty, ctx);
    case 'sequence':
        return generateProto3CodeSequence(ty, ctx);
    case 'one-of':
        return generateProto3CodeOneOf(ty, ctx);
    case 'optional':
        return generateProto3CodeOptional(ty, ctx);
    case 'enum':
        return generateProto3CodeEnum(ty, ctx);
    case 'object':
        return generateProto3CodeObject(ty, isInterface, ctx);
    case 'symlink':
        return ty.symlinkTargetName;
    case 'operator':
        throw new Error(`Unexpected type assertion: ${(ty as any).kind}`);
    default:
        throw new Error(`Unknown type assertion: ${(ty as any).kind}`);
    }
}


export function generateProto3Code(types: TypeAssertionMap): string {
    let code =
`
syntax = "proto3";
import "google/protobuf/wrappers.proto";
import "google/protobuf/any.proto";

`;

    const ctx = {nestLevel: 0};
    for (const ty of types.entries()) {
        if (ty[1].ty.noOutput) {
            const indent0 = '    '.repeat(ctx.nestLevel);
            const indent1 = '    '.repeat(ctx.nestLevel + 1);
            code += `message ${ty[0]} {\n${indent1}google.protobuf.Any value = 1;\n${indent0}}\n\n`;
            continue;
        }
        code += formatProto3CodeDocComment(ty[1].ty, ctx.nestLevel);
        if (ty[1].ty.kind === 'object') {
            code += `message ${ty[0]} ${
                generateProto3CodeInner(ty[1].ty, true, ctx)}\n\n`;
        } else if (ty[1].ty.kind === 'enum') {
            const indent0 = '    '.repeat(ctx.nestLevel);
            const indent1 = '    '.repeat(ctx.nestLevel + 1);
            if (0 < ty[1].ty.values.filter(x => typeof x[1] !== 'number').length) {
                code += `message ${ty[0]} {\n${indent1}google.protobuf.Any value = 1;\n${indent0}}\n\n`;
            } else {
                code += `enum ${ty[0]} {\n${
                    ty[1].ty.values
                        .map(x => `${
                            formatProto3CodeDocComment(x[2] || '', ctx.nestLevel + 1)}${
                            indent1}${(() => {
                                if (typeof x[1] === 'number') {
                                    return `${x[0]} = ${x[1]}`;
                                } else {
                                    return `${x[0]} = '${escapeString(x[1])}'`;
                                }
                            })()};\n`)
                        .join('')}${indent0}}\n\n`;
            }
        } else if (ty[1].ty.kind === 'never' && ty[1].ty.passThruCodeBlock) {
            // nothing to do
        } else {
            const indent0 = '    '.repeat(ctx.nestLevel);
            const indent1 = '    '.repeat(ctx.nestLevel + 1);
            code += `message ${ty[0]} {\n${indent1}${generateProto3CodeInner(ty[1].ty, false, ctx)} value = 1;\n${indent0}}\n\n`;
        }
    }
    return code;
}
