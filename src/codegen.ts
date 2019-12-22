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
         ObjectAssertion,
         TypeAssertionMap } from './types';



interface CodegenContext {
    nestLevel: number;
}

function escapeString(s: string) {
    return (s
        .replace(/\b/g, '\\b')
        .replace(/\f/g, '\\f')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t')
        .replace(/\v/g, '\\v')
        .replace(/\\/g, '\\\\')
        .replace(/\'/g, '\\\'')
        .replace(/\"/g, '\\\"')
        .replace(/\`/g, '\\\`')
    );
}

function generateTypedefCodePrimitive(ty: PrimitiveTypeAssertion, ctx: CodegenContext) {
    return ty.primitiveName;
}

function generateTypedefCodePrimitiveValue(ty: PrimitiveValueTypeAssertion, ctx: CodegenContext) {
    if (ty.value === null) {
        return 'null';
    }
    if (ty.value === void 0) {
        return 'undefined';
    }
    switch (typeof ty.value) {
    case 'string':
        return `${escapeString(ty.value)}`;
    default:
        return ty.value.toString();
    }
}

function generateTypedefCodeRepeated(ty: RepeatedAssertion, ctx: CodegenContext) {
    return (ty.repeated.kind === 'primitive' ?
        `${generateTypedefCodeInner(ty.repeated, false, ctx)}[]` :
        `Array<${generateTypedefCodeInner(ty.repeated, false, ctx)}>`
    );
}

function generateTypedefCodeSpread(ty: SpreadAssertion, ctx: CodegenContext) {
    return '';
}

function generateTypedefCodeSequence(ty: SequenceAssertion, ctx: CodegenContext) {
    return `[${
        ty.sequence
            .filter(x => x.kind !== 'spread')
            .map(x => generateTypedefCodeInner(x, false, ctx))
            .join(', ')}]`;
}

function generateTypedefCodeOneOf(ty: OneOfAssertion, ctx: CodegenContext) {
    return `(${ty.oneOf.map(x => generateTypedefCodeInner(x, false, ctx)).join(' | ')})`;
}

function generateTypedefCodeOptional(ty: OptionalAssertion, ctx: CodegenContext) {
    return generateTypedefCodeInner(ty.optional, false, ctx);
}

function generateTypedefCodeObject(ty: ObjectAssertion, isInterface: boolean, ctx: CodegenContext) {
    if (ty.members.length === 0) {
        return '{}';
    }
    const sep = isInterface ? ';\n' : ',\n';
    return `{\n${ty.members.map(x =>
        `${'    '}${x[0]}${x[1].kind === 'optional' ? '?' : ''}: ${
            generateTypedefCodeInner(x[1], false, ctx)}`)
        .join(sep)}${sep}}`;
}

function generateTypedefCodeInner(ty: TypeAssertion, isInterface: boolean, ctx: CodegenContext): string {
    switch (ty.kind) {
    case 'never':
        return 'never';
    case 'any':
        return 'any';
    case 'unknown':
        return 'unknown';
    case 'primitive':
        return generateTypedefCodePrimitive(ty, ctx);
    case 'primitive-value':
        return generateTypedefCodePrimitiveValue(ty, ctx);
    case 'repeated':
        return generateTypedefCodeRepeated(ty, ctx);
    case 'spread':
        return generateTypedefCodeSpread(ty, ctx);
    case 'sequence':
        return generateTypedefCodeSequence(ty, ctx);
    case 'one-of':
        return generateTypedefCodeOneOf(ty, ctx);
    case 'optional':
        return generateTypedefCodeOptional(ty, ctx);
    case 'object':
        return generateTypedefCodeObject(ty, isInterface, ctx);
    }
}

export function generateTypedefCode(types: TypeAssertionMap): string {
    let code = '';
    const ctx = {nestLevel: 0};
    for (const ty of types.entries()) {
        if (ty[1].exported) {
            code += 'export ';
        }
        if (ty[1].ty.kind === 'object') {
            code += `interface ${ty[0]} ${generateTypedefCodeInner(ty[1].ty, true, ctx)}\n\n`;
        } else {
            code += `type ${ty[0]} = ${generateTypedefCodeInner(ty[1].ty, false, ctx)};\n\n`;
        }
    }
    return code;
}


function generateJsonSchemaInner(ty: TypeAssertion, isInterface: boolean) {
    // switch (ty.kind) {
    // case 'never':
    // case 'any':
    // case 'unknown':
    // case 'primitive':
    // case 'primitive-value':
    // case 'repeated':
    // case 'spread':
    // case 'sequence':
    // case 'one-of':
    // case 'optional':
    // case 'object':
    // }
}

export function generateJsonSchema(types: TypeAssertionMap): string {
    // TODO: not impl
    throw new Error(`function 'generateJsonSchema()' is not implemented.`);
    // return '';
}
