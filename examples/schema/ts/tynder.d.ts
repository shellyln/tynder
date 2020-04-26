import * as fs from 'fs';

export type PrimitiveValueTypes = (number | bigint | string | boolean | null | undefined);

export type PrimitiveValueTypeNames = ('number' | 'bigint' | 'string' | 'boolean' | 'null' | 'undefined');

export type OptionalPrimitiveValueTypeNames = ('number?' | 'bigint?' | 'string?' | 'boolean?' | 'null?' | 'undefined?');

export type PlaceholderTypeNames = ('never' | 'any' | 'unknown');

export type OptionalPlaceholderTypeNames = ('never?' | 'any?' | 'unknown?');

export enum ErrorTypes {
    /** comment */
    InvalidDefinition = 1,
    /** comment */
    Required,
    /** comment */
    TypeUnmatched,
    /** comment */
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

export interface TypeAssertionErrorMessageConstraints {
    minValue?: (number | string | null);
    maxValue?: (number | string | null);
    greaterThanValue?: (number | string | null);
    lessThanValue?: (number | string | null);
    minLength?: (number | null);
    maxLength?: (number | null);
    min?: (number | null);
    max?: (number | null);
    pattern?: string;
}

export interface TypeAssertionErrorMessage {
    code: string;
    message: string;
    dataPath: string;
    constraints: TypeAssertionErrorMessageConstraints;
    value?: any;
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

export interface PrimitiveTypeAssertionConstraints {
    minValue?: (number | string | null);
    maxValue?: (number | string | null);
    greaterThanValue?: (number | string | null);
    lessThanValue?: (number | string | null);
    minLength?: (number | null);
    maxLength?: (number | null);
    pattern?: (RegExp | null);
}

export interface PrimitiveTypeAssertion extends TypeAssertionBase, PrimitiveTypeAssertionConstraints {
    kind: 'primitive';
    primitiveName: PrimitiveValueTypeNames;
}

export interface PrimitiveValueTypeAssertion extends TypeAssertionBase {
    kind: 'primitive-value';
    value: PrimitiveValueTypes;
}

export interface RepeatedAssertionConstraints {
    min: (number | null);
    max: (number | null);
}

export interface RepeatedAssertion extends TypeAssertionBase, RepeatedAssertionConstraints {
    kind: 'repeated';
    repeated: TypeAssertion;
}

export interface SpreadAssertion extends TypeAssertionBase, RepeatedAssertionConstraints {
    kind: 'spread';
    spread: TypeAssertion;
}

export interface SequenceAssertion extends TypeAssertionBase {
    kind: 'sequence';
    sequence: TypeAssertion[];
}

export interface OneOfAssertion extends TypeAssertionBase {
    kind: 'one-of';
    oneOf: TypeAssertion[];
}

export interface OptionalAssertion extends TypeAssertionBase {
    kind: 'optional';
    optional: TypeAssertion;
}

export interface EnumAssertion extends TypeAssertionBase {
    kind: 'enum';
    values: Array<any[]>;
}

export type ObjectAssertionMember = ([string, TypeAssertion] | [string, TypeAssertion, boolean] | [string, TypeAssertion, boolean, string]);

export type AdditionalPropsKey = Array<('string' | 'number' | RegExp)>;

export type AdditionalPropsMember = ([AdditionalPropsKey, TypeAssertion] | [AdditionalPropsKey, TypeAssertion, boolean] | [AdditionalPropsKey, TypeAssertion, boolean, string]);

export interface ObjectAssertion extends TypeAssertionBase {
    kind: 'object';
    members: ObjectAssertionMember[];
    additionalProps?: AdditionalPropsMember[];
    baseTypes?: Array<(ObjectAssertion | AssertionSymlink)>;
}

export interface AssertionSymlink extends TypeAssertionBase {
    kind: 'symlink';
    symlinkTargetName: string;
}

export type TypeAssertion = (NeverTypeAssertion | AnyTypeAssertion | UnknownTypeAssertion | PrimitiveTypeAssertion | PrimitiveValueTypeAssertion | RepeatedAssertion | SpreadAssertion | SequenceAssertion | OneOfAssertion | OptionalAssertion | EnumAssertion | ObjectAssertion | AssertionSymlink);

export interface ValidationContext {
    checkAll?: boolean;
    noAdditionalProps?: boolean;
    errorMessages?: ErrorMessages;
    errors: TypeAssertionErrorMessage[];
    typeStack: Array<(NeverTypeAssertion | AnyTypeAssertion | UnknownTypeAssertion | PrimitiveTypeAssertion | PrimitiveValueTypeAssertion | RepeatedAssertion | SpreadAssertion | SequenceAssertion | OneOfAssertion | OptionalAssertion | EnumAssertion | ObjectAssertion | AssertionSymlink | [TypeAssertion, (number | string | undefined)])>;
    schema?: TypeAssertionMap;
}

export interface TypeAssertionSetValue {
    ty: TypeAssertion;
    exported: boolean;
    resolved: boolean;
}

export type TypeAssertionMap = Map;

export interface SymbolResolverContext {
    nestLevel: number;
    symlinkStack: string[];
}

export interface CodegenContext {
    nestLevel: number;
    schema?: TypeAssertionMap;
}

