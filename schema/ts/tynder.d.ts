export type PrimitiveValueTypes = (number | bigint | string | boolean | null | undefined);

export type PrimitiveValueTypeNames = ('number' | 'bigint' | 'string' | 'boolean' | 'null' | 'undefined');

export type OptionalPrimitiveValueTypeNames = ('number?' | 'bigint?' | 'string?' | 'boolean?' | 'null?' | 'undefined?');

export type PlaceholderTypeNames = ('never' | 'any' | 'unknown');

export type OptionalPlaceholderTypeNames = ('never?' | 'any?' | 'unknown?');

export enum ErrorTypes {
    InvalidDefinition = 1,
    Required,
    TypeUnmatched,
    RepeatQtyUnmatched,
    SequenceUnmatched,
    ValueRangeUnmatched,
    ValuePatternUnmatched,
    ValueLengthUnmatched,
    ValueUnmatched,
}

export interface ErrorMessages {
    invalidDefinition?: string;
    required?: string;
    typeUnmatched?: string;
    repeatQtyUnmatched?: string;
    sequenceUnmatched?: string;
    valueRangeUnmatched?: string;
    valuePatternUnmatched?: string;
    valueLengthUnmatched?: string;
    valueUnmatched?: string;
}

export interface TypeAssertionErrorMessage {
    code?: string;
    message: string;
}

export interface TypeAssertionBase {
    messageId?: string;
    message?: string;
    messages?: ErrorMessages;
    name?: string;
    typeName?: string;
    docComment?: string;
    passThruCodeBlock?: string;
    noOutput?: boolean;
}

export interface NeverTypeAssertion extends TypeAssertionBase {
    kind: 'never';
}

export interface AnyTypeAssertion extends TypeAssertionBase {
    kind: 'any';
}

export interface UnknownTypeAssertion extends TypeAssertionBase {
    kind: 'unknown';
}

export interface PrimitiveTypeAssertion extends TypeAssertionBase {
    kind: 'primitive';
    primitiveName: PrimitiveValueTypeNames;
    minValue?: (number | string | null);
    maxValue?: (number | string | null);
    greaterThanValue?: (number | string | null);
    lessThanValue?: (number | string | null);
    minLength?: (number | null);
    maxLength?: (number | null);
    pattern?: (RegExp | null);
}

export interface PrimitiveValueTypeAssertion extends TypeAssertionBase {
    kind: 'primitive-value';
    value: PrimitiveValueTypes;
}

export interface RepeatedAssertion extends TypeAssertionBase {
    kind: 'repeated';
    repeated: any;
    min: (number | null);
    max: (number | null);
}

export interface SpreadAssertion extends TypeAssertionBase {
    kind: 'spread';
    spread: any;
    min: (number | null);
    max: (number | null);
}

export interface SequenceAssertion extends TypeAssertionBase {
    kind: 'sequence';
    sequence: any[];
}

export interface OneOfAssertion extends TypeAssertionBase {
    kind: 'one-of';
    oneOf: any[];
}

export interface OptionalAssertion extends TypeAssertionBase {
    kind: 'optional';
    optional: any;
}

export interface EnumAssertion extends TypeAssertionBase {
    kind: 'enum';
    values: Array<[string, (number | string), string]>;
}

export type ObjectAssertionMember = ([string, any] | [string, any, boolean]);

export interface ObjectAssertion extends TypeAssertionBase {
    kind: 'object';
    members: ObjectAssertionMember[];
    baseTypes?: any[];
}

export type TypeAssertion = (NeverTypeAssertion | AnyTypeAssertion | UnknownTypeAssertion | PrimitiveTypeAssertion | PrimitiveValueTypeAssertion | RepeatedAssertion | SpreadAssertion | SequenceAssertion | OneOfAssertion | OptionalAssertion | EnumAssertion | ObjectAssertion);

export interface Context {
    checkAll?: boolean;
    errors: TypeAssertionErrorMessage[];
    typeStack: TypeAssertion[];
}

export interface TypeAssertionSetValue {
    ty: TypeAssertion;
    exported: boolean;
}

export type TypeAssertionMap = any;

