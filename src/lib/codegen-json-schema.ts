// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { TypeAssertion,
         TypeAssertionMap } from '../types';
import * as JsonSchema      from '../types/json-schema-types';



function addMetaInfo(a: JsonSchema.JsonSchemaAssertion, ty: TypeAssertion) {
    if (ty.docComment) {
        a.description = ty.docComment;
    }
    switch (ty.kind) {
    case 'repeated':
        if (typeof ty.min === 'number') {
            (a as JsonSchema.JsonSchemaArrayAssertion).minItems = ty.min;
        }
        if (typeof ty.max === 'number') {
            (a as JsonSchema.JsonSchemaArrayAssertion).maxItems = ty.max;
        }
        break;
    case 'primitive':
        if (typeof ty.minValue === 'number') {
            (a as JsonSchema.JsonSchemaNumberAssertion).minimum = ty.minValue;
        }
        if (typeof ty.maxValue === 'number') {
            (a as JsonSchema.JsonSchemaNumberAssertion).maximum = ty.maxValue;
        }
        if (typeof ty.greaterThanValue === 'number') {
            (a as JsonSchema.JsonSchemaNumberAssertion).exclusiveMinimum = ty.greaterThanValue;
        }
        if (typeof ty.lessThanValue === 'number') {
            (a as JsonSchema.JsonSchemaNumberAssertion).exclusiveMaximum = ty.lessThanValue;
        }
        if (typeof ty.minLength === 'number') {
            (a as JsonSchema.JsonSchemaStringAssertion).minLength = ty.minLength;
        }
        if (typeof ty.maxLength === 'number') {
            (a as JsonSchema.JsonSchemaStringAssertion).maxLength = ty.maxLength;
        }
        if (ty.pattern) {
            (a as JsonSchema.JsonSchemaStringAssertion).pattern = ty.pattern.source;
        }
        break;
    }
    return a;
}

function generateJsonSchemaInner(ty: TypeAssertion, nestLevel: number): JsonSchema.JsonSchemaAssertion {
    if (0 < nestLevel && ty.typeName) {
        const ret: JsonSchema.JsonSchemaRefAssertion = {
            $ref: `#/definitions/${ty.typeName}`,
        };
        return addMetaInfo(ret, ty);
    }

    // const ret: TypeAssertion = {...ty};
    switch (ty.kind) {
    case 'symlink':
        {
            const ret: JsonSchema.JsonSchemaRefAssertion = {
                $ref: `#/definitions/${ty.symlinkTargetName}`,
            };
            return addMetaInfo(ret, ty);
        }
    case 'repeated':
        {
            const ret: JsonSchema.JsonSchemaArrayAssertion = {
                type: 'array',
                items: generateJsonSchemaInner(ty.repeated, nestLevel + 1),
            };
            if (typeof ty.min === 'number') {
                ret.minItems = ty.min;
            }
            if (typeof ty.max === 'number') {
                ret.maxItems = ty.max;
            }
            return addMetaInfo(ret, ty);
        }
    case 'sequence':
        {
            const ret: JsonSchema.JsonSchemaArrayAssertion = {
                type: 'array',
                items: { anyOf: ty.sequence.map(x => generateJsonSchemaInner(x, nestLevel + 1)) },
            };
            return addMetaInfo(ret, ty);
        }
    case 'spread':
        {
            return generateJsonSchemaInner(ty.spread, nestLevel + 1);
        }
    case 'one-of':
        {
            const ret: JsonSchema.JsonSchemaAnyOfAssertion = {
                anyOf: ty.oneOf.map(x => generateJsonSchemaInner(x, nestLevel + 1)),
            };
            return addMetaInfo(ret, ty);
        }
    case 'optional':
        {
            const ret: JsonSchema.JsonSchemaOneOfAssertion = {
                oneOf: [
                    generateJsonSchemaInner(ty.optional, nestLevel + 1),
                    {type: 'null'},
                ],
            };
            return addMetaInfo(ret, ty);
        }
    case 'enum':
        {
            const ret: JsonSchema.JsonSchemaTsEnumAssertion = {
                type: ['string', 'number'],
                enum: ty.values.map(x => x[1]),
            };
            return addMetaInfo(ret, ty);
        }
    case 'object':
        {
            const properties: JsonSchema.JsonSchemaObjectPropertyAssertion = {};
            for (const m of ty.members) {
                const z = generateJsonSchemaInner(m[1], nestLevel + 1);
                if (m[3]) {
                    z.description = m[3];
                } else {
                    delete z.description;
                }
                properties[m[0]] = z;
            }
            const ret: JsonSchema.JsonSchemaObjectAssertion = {
                type: 'object',
                properties,
            };
            return addMetaInfo(ret, ty);
        }
    case 'primitive':
        {
            switch (ty.primitiveName) {
            case 'null': case 'undefined':
                {
                    const ret: JsonSchema.JsonSchemaNullAssertion = {
                        type: 'null',
                    };
                    return addMetaInfo(ret, ty);
                }
            case 'number': case 'bigint':
                {
                    const ret: JsonSchema.JsonSchemaNumberAssertion = {
                        type: 'number',
                    };
                    return addMetaInfo(ret, ty);
                }
            case 'string':
                {
                    const ret: JsonSchema.JsonSchemaStringAssertion = {
                        type: 'string',
                    };
                    return addMetaInfo(ret, ty);
                }
            case 'boolean':
                {
                    const ret: JsonSchema.JsonSchemaBooleanAssertion = {
                        type: 'boolean',
                    };
                    return addMetaInfo(ret, ty);
                }
            }
        }
    case 'primitive-value':
        {
            switch (typeof ty.value) {
            case 'number':
                {
                    const ret: JsonSchema.JsonSchemaNumberValueAssertion = {
                        type: 'number',
                        enum: [ty.value],
                    };
                    return addMetaInfo(ret, ty);
                }
            case 'bigint':
                {
                    const ret: JsonSchema.JsonSchemaBigintNumberValueAssertion = {
                        type: 'number',
                        enum: [ty.value.toString()],
                    };
                    return addMetaInfo(ret, ty);
                }
            case 'string':
                {
                    const ret: JsonSchema.JsonSchemaStringValueAssertion = {
                        type: 'string',
                        enum: [ty.value],
                    };
                    return addMetaInfo(ret, ty);
                }
            case 'boolean':
                {
                    const ret: JsonSchema.JsonSchemaBooleanValueAssertion = {
                        type: 'boolean',
                        enum: [ty.value],
                    };
                    return addMetaInfo(ret, ty);
                }
            default:
                throw new Error(`Unknown primitive-value assertion: ${typeof ty.value}`);
            }
        }
    case 'never':
        {
            const ret: JsonSchema.JsonSchemaNullAssertion = {
                type: 'null',
            };
            return addMetaInfo(ret, ty);
        }
    case 'any':
        {
            const ret: JsonSchema.JsonSchemaAnyAssertion = {
                type: ['null', 'number', 'string', 'boolean', 'array', 'object'],
            };
            return addMetaInfo(ret, ty);
        }
    case 'unknown':
        {
            const ret: JsonSchema.JsonSchemaUnknownAssertion = {
                type: ['number', 'string', 'boolean', 'array', 'object'],
            };
            return addMetaInfo(ret, ty);
        }
    default:
        throw new Error(`Unknown type assertion: ${(ty as any).kind}`);
    }
}


export function generateJsonSchemaObject(types: TypeAssertionMap) {
    const ret: JsonSchema.JsonSchemaRootAssertion = {
        $schema: 'http://json-schema.org/draft-06/schema#',
        definitions: {},
    };
    for (const ty of types.entries()) {
        if (ty[1].ty.noOutput) {
            continue;
        }
        (ret.definitions as object)[ty[0]] = generateJsonSchemaInner(ty[1].ty, 0);
    }
    return ret;
}


export function generateJsonSchema(types: TypeAssertionMap, asTs?: boolean): string {
    const ret = generateJsonSchemaObject(types);

    if (asTs) {
        return `\nconst schema = ${JSON.stringify(ret, null, 2)};\nexport default schema;\n`;
    } else {
        return JSON.stringify(ret, null, 2);
    }
}
