// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { TypeAssertion,
         TypeAssertionMap } from '../../types';
import * as JsonSchema      from '../../types/json-schema-types';



function addMetaInfo(a: JsonSchema.JsonSchemaAssertion, ty: TypeAssertion) {
    const a2 = {...a};
    let changed = false;

    if (ty.docComment) {
        a2.description = ty.docComment;
        changed = true;
    }
    switch (ty.kind) {
    case 'repeated':
        if (typeof ty.min === 'number') {
            (a2 as JsonSchema.JsonSchemaArrayAssertion).minItems = ty.min;
            changed = true;
        }
        if (typeof ty.max === 'number') {
            (a2 as JsonSchema.JsonSchemaArrayAssertion).maxItems = ty.max;
            changed = true;
        }
        break;
    case 'primitive':
        if (typeof ty.minValue === 'number') {
            (a2 as JsonSchema.JsonSchemaNumberAssertion).minimum = ty.minValue;
            changed = true;
        }
        if (typeof ty.maxValue === 'number') {
            (a2 as JsonSchema.JsonSchemaNumberAssertion).maximum = ty.maxValue;
            changed = true;
        }
        if (typeof ty.greaterThanValue === 'number') {
            (a2 as JsonSchema.JsonSchemaNumberAssertion).exclusiveMinimum = ty.greaterThanValue;
            changed = true;
        }
        if (typeof ty.lessThanValue === 'number') {
            (a2 as JsonSchema.JsonSchemaNumberAssertion).exclusiveMaximum = ty.lessThanValue;
            changed = true;
        }
        if (typeof ty.minLength === 'number') {
            (a2 as JsonSchema.JsonSchemaStringAssertion).minLength = ty.minLength;
            changed = true;
        }
        if (typeof ty.maxLength === 'number') {
            (a2 as JsonSchema.JsonSchemaStringAssertion).maxLength = ty.maxLength;
            changed = true;
        }
        if (ty.pattern) {
            (a2 as JsonSchema.JsonSchemaStringAssertion).pattern = ty.pattern.source;
            changed = true;
        }
        break;
    }
    return (changed ? a2 : a);
}

function generateJsonSchemaInner(schema: TypeAssertionMap, ty: TypeAssertion, nestLevel: number): JsonSchema.JsonSchemaAssertion {
    if (0 < nestLevel && ty.typeName) {
        const ret: JsonSchema.JsonSchemaRefAssertion = {
            $ref: `#/definitions/${ty.typeName.replace(/\./g, '/properties/')}`,
        };
        const r2 = addMetaInfo(ret, ty);
        if (ret !== r2) {
            // NOTE: `$ref` cannot have value constraints.
            return generateJsonSchemaInner(schema, ty, 0);
        } else {
            return ret;
        }
    }

    switch (ty.kind) {
    case 'symlink':
        {
            const ret: JsonSchema.JsonSchemaRefAssertion = {
                $ref: `#/definitions/${ty.symlinkTargetName}`,
            };
            const r2 = addMetaInfo(ret, ty);
            if (ret !== r2) {
                // NOTE: `$ref` cannot have value constraints.
                const t2 = schema.get(ty.symlinkTargetName)?.ty;
                if (t2) {
                    return generateJsonSchemaInner(schema, t2, 0);
                } else {
                    // Drop constraints.
                    return ret;
                }
            } else {
                return ret;
            }
        }
    case 'repeated':
        {
            const ret: JsonSchema.JsonSchemaArrayAssertion = {
                type: 'array',
                items: generateJsonSchemaInner(schema, ty.repeated, nestLevel + 1),
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
                items: { anyOf: ty.sequence.map(x => generateJsonSchemaInner(schema, x, nestLevel + 1)) },
            };
            return addMetaInfo(ret, ty);
        }
    case 'spread':
        {
            return generateJsonSchemaInner(schema, ty.spread, nestLevel + 1);
        }
    case 'one-of':
        {
            const ret: JsonSchema.JsonSchemaAnyOfAssertion = {
                anyOf: ty.oneOf.map(x => generateJsonSchemaInner(schema, x, nestLevel + 1)),
            };
            return addMetaInfo(ret, ty);
        }
    case 'optional':
        {
            const ret: JsonSchema.JsonSchemaOneOfAssertion = {
                oneOf: [
                    generateJsonSchemaInner(schema, ty.optional, nestLevel + 1),
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
            const patternProperties: JsonSchema.JsonSchemaObjectPropertyAssertion = {};
            let patternPropsCount = 0;
            const required: string[] = [];
            for (const m of ty.members) {
                const z = generateJsonSchemaInner(schema,
                    m[1].kind === 'optional' ?
                        m[1].optional :
                        m[1],
                    nestLevel + 1);

                if (m[3]) {
                    z.description = m[3];
                } else {
                    delete z.description;
                }
                properties[m[0]] = z;

                if (m[1].kind !== 'optional') {
                    required.push(m[0]);
                }
            }
            for (const m of ty.additionalProps || []) {
                const z = generateJsonSchemaInner(schema, m[1], nestLevel + 1);
                if (m[3]) {
                    z.description = m[3];
                } else {
                    delete z.description;
                }
                for (const k of m[0]) {
                    patternPropsCount++;
                    switch (k) {
                    case 'number':
                        patternProperties['^[0-9]+$'] = z;
                        break;
                    case 'string':
                        patternProperties['^.*$'] = z;
                        break;
                    default:
                        patternProperties[k.source] = z;
                        break;
                    }
                }
            }
            const ret: JsonSchema.JsonSchemaObjectAssertion = {
                type: 'object',
                properties,
                ...(0 < patternPropsCount ? {patternProperties} : {}),
                ...(0 < required.length ? {required} : {}),
                additionalProperties: false,
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
            case 'number':
                {
                    const ret: JsonSchema.JsonSchemaNumberAssertion = {
                        type: 'number',
                    };
                    return addMetaInfo(ret, ty);
                }
            case 'bigint':
                {
                    const ret: JsonSchema.JsonSchemaBigIntAssertion = {
                        type: ['integer', 'string'],
                    };
                    return addMetaInfo(ret, ty);
                }
            case 'integer':
                {
                    const ret: JsonSchema.JsonSchemaNumberAssertion = {
                        type: 'integer',
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
            // TODO: Function, DateStr, DateTimeStr
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
                    const ret: JsonSchema.JsonSchemaBigIntNumberValueAssertion = {
                        type: ['integer', 'string'],
                        enum: [ty.value.toString()],
                    };
                    if (BigInt(Number.MIN_SAFE_INTEGER) <= ty.value && ty.value <= BigInt(Number.MAX_SAFE_INTEGER)) {
                        ret.enum.push(Number(ty.value));
                    }
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
    case 'any': case 'unknown':
        {
            const ret: JsonSchema.JsonSchemaAnyAssertion = {
                type: ['null', 'integer', 'number', 'string', 'boolean', 'array', 'object'],
            };
            return addMetaInfo(ret, ty);
        }
    case 'operator':
        throw new Error(`Unexpected type assertion: ${(ty as any).kind}`);
    default:
        throw new Error(`Unknown type assertion: ${(ty as any).kind}`);
    }
}


export function generateJsonSchemaObject(schema: TypeAssertionMap) {
    const ret: JsonSchema.JsonSchemaRootAssertion = {
        $schema: 'http://json-schema.org/draft-06/schema#',
        definitions: {},
    };
    for (const ty of schema.entries()) {
        if (ty[1].ty.kind === 'never' && ty[1].ty.passThruCodeBlock) {
            continue;
        }
        (ret.definitions as object)[ty[0]] = generateJsonSchemaInner(schema, ty[1].ty, 0);
    }
    return ret;
}


export function generateJsonSchema(schema: TypeAssertionMap, asTs?: boolean): string {
    const ret = generateJsonSchemaObject(schema);

    if (asTs) {
        return (
            `\n// tslint:disable: object-literal-key-quotes\n` +
            `const schema = ${JSON.stringify(ret, null, 2)};\nexport default schema;` +
            `\n// tslint:enable: object-literal-key-quotes\n`
        );
    } else {
        return JSON.stringify(ret, null, 2);
    }
}
