// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln



export interface JsonSchemaObjectPropertyAssertion {
    [propName: string]: JsonSchemaAssertion;
}

export interface JsonSchemaAssertionBase {
    description?: string;
}

export interface JsonSchemaNullAssertion extends JsonSchemaAssertionBase {
    type: 'null';
}

export interface JsonSchemaAnyAssertion extends JsonSchemaAssertionBase {
    type: Array<'null' | 'number' | 'string' | 'boolean' | 'array' | 'object'>;
}

export interface JsonSchemaUnknownAssertion extends JsonSchemaAssertionBase {
    type: Array<'number' | 'string' | 'boolean' | 'array' | 'object'>;
}

export interface JsonSchemaNumberAssertion extends JsonSchemaAssertionBase {
    type: 'number' | Array<'number' | 'null'>;
    multipleOf?: number;
    maximum?: number;
    exclusiveMaximum?: number;
    minimum?: number;
    exclusiveMinimum?: number;
}

export interface JsonSchemaNumberValueAssertion extends JsonSchemaAssertionBase {
    type: 'number';
    enum: number[];
}

export interface JsonSchemaBigintNumberValueAssertion extends JsonSchemaAssertionBase {
    type: 'number';
    enum: string[];
}

export interface JsonSchemaStringAssertion extends JsonSchemaAssertionBase {
    type: 'string' | Array<'string' | 'null'>;
    maxLength?: number;
    minLength?: number;
    pattern?: string;
}

export interface JsonSchemaStringValueAssertion extends JsonSchemaAssertionBase {
    type: 'string';
    enum: string[];
}

export interface JsonSchemaBooleanAssertion extends JsonSchemaAssertionBase {
    type: 'boolean' | Array<'boolean' | 'null'>;
}

export interface JsonSchemaBooleanValueAssertion extends JsonSchemaAssertionBase {
    type: 'boolean';
    enum: boolean[];
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

export interface JsonSchemaTsEnumAssertion extends JsonSchemaAssertionBase {
    type: Array<'string' | 'number'>;
    enum: Array<string | number>;
}

export interface JsonSchemaAnyOfAssertion extends JsonSchemaAssertionBase {
    anyOf: JsonSchemaAssertion[];
}

export interface JsonSchemaOneOfAssertion extends JsonSchemaAssertionBase {
    oneOf: JsonSchemaAssertion[];
}

export interface JsonSchemaAllOfAssertion extends JsonSchemaAssertionBase {
    allOf: JsonSchemaAssertion[];
}

export interface JsonSchemaNotAssertion extends JsonSchemaAssertionBase {
    not: JsonSchemaAssertion;
}

export interface JsonSchemaRefAssertion extends JsonSchemaAssertionBase {
    $ref: string;
}

export type JsonSchemaAssertion =
    JsonSchemaNullAssertion |
    JsonSchemaAnyAssertion |
    JsonSchemaUnknownAssertion |
    JsonSchemaNumberAssertion |
    JsonSchemaNumberValueAssertion |
    JsonSchemaBigintNumberValueAssertion |
    JsonSchemaStringAssertion |
    JsonSchemaStringValueAssertion |
    JsonSchemaBooleanAssertion |
    JsonSchemaBooleanValueAssertion |
    JsonSchemaArrayAssertion |
    JsonSchemaObjectAssertion |
    JsonSchemaTsEnumAssertion |
    JsonSchemaAnyOfAssertion |
    JsonSchemaOneOfAssertion |
    JsonSchemaAllOfAssertion |
    JsonSchemaRefAssertion;

export interface JsonSchemaRootAssertion extends Partial<JsonSchemaObjectAssertion> {
    $schema?: string;
    $id?: string;
    title?: string;
    definitions?: JsonSchemaObjectPropertyAssertion;
}
