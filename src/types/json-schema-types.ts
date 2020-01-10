// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln



export interface JsonSchemaObjectPropertyAssertion {
    [propName: string]: JsonSchemaAssertion;
}

export interface JsonSchemaAssertionBase {
    description?: string;
}

export interface JsonSchemaNumberAssertion extends JsonSchemaAssertionBase {
    type: 'number' | Array<'number' | 'null'>;
    multipleOf?: number;
    maximum?: number;
    exclusiveMaximum?: number;
    minimum?: number;
    exclusiveMinimum?: number;
}

export interface JsonSchemaStringAssertion extends JsonSchemaAssertionBase {
    type: 'string' | Array<'string' | 'null'>;
    maxLength?: number;
    minLength?: number;
    pattern?: string;
}

export interface JsonSchemaBooleanAssertion extends JsonSchemaAssertionBase {
    type: 'boolean' | Array<'boolean' | 'null'>;
}

export interface JsonSchemaArrayAssertion extends JsonSchemaAssertionBase {
    type: 'array' | Array<'array' | 'null'>;
    items: JsonSchemaAssertion;
    maxItems?: number;
    minItems?: number;
    uniqueItems?: boolean;
    maxContains?: number;
    minContains?: number;
}

export interface JsonSchemaObjectAssertion extends JsonSchemaAssertionBase {
    type: 'object' | Array<'object' | 'null'>;
    properties?: JsonSchemaObjectPropertyAssertion;
    maxProperties?: number;
    minProperties?: number;
    required?: string[];
    dependentRequired?: {}; // TODO:
    additionalProperties?: boolean;
    patternProperties?: JsonSchemaObjectPropertyAssertion;
    anyOf?: JsonSchemaAssertion[];
    oneOf?: JsonSchemaAssertion[];
    allOf?: JsonSchemaAssertion[];
}

export interface JsonSchemaEnumAssertion extends JsonSchemaAssertionBase {
    type: Array<'string' | 'number'>;
    enum: Array<string | number>;
}

export interface JsonSchemaAnyOfAssertion {
    anyOf: JsonSchemaAssertion[];
}

export interface JsonSchemaOneOfAssertion {
    oneOf: JsonSchemaAssertion[];
}

export interface JsonSchemaAllOfAssertion {
    allOf: JsonSchemaAssertion[];
}

export interface JsonSchemaNotAssertion {
    not: JsonSchemaAssertion;
}

export interface JsonSchemaRefAssertion extends JsonSchemaAssertionBase {
    $ref: string;
}

export type JsonSchemaAssertion =
    JsonSchemaNumberAssertion |
    JsonSchemaStringAssertion |
    JsonSchemaBooleanAssertion |
    JsonSchemaArrayAssertion |
    JsonSchemaObjectAssertion |
    JsonSchemaRefAssertion;

export interface JsonSchemaRootAssertion extends JsonSchemaObjectAssertion {
    $schema?: string;
    $id?: string;
    title?: string;
    definitions?: JsonSchemaObjectPropertyAssertion;
}
