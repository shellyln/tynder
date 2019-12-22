// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


export type PrimitiveValueTypes = number | bigint | string | boolean | null | undefined;
export type PrimitiveValueTypeNames = 'number' | 'bigint' | 'string' | 'boolean' | 'null' | 'undefined';
export type OptionalPrimitiveValueTypeNames = 'number?' | 'bigint?' | 'string?' | 'boolean?' | 'null?' | 'undefined?';
export type PlaceholderTypeNames = 'never' | 'any' | 'unknown';
export type OptionalPlaceholderTypeNames = 'never?' | 'any?' | 'unknown?';


export type ErrorMessages = Partial<{
    invalidValue: string,
    invalidLength: string,
    invalidType: string,
    required: string,
}>;


export interface TypeAssertionBase {
    messageId?: string;
    message?: string;
    messages?: ErrorMessages;
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
    minValue?: number | string | null; // TODO: bigint
    maxValue?: number | string | null;
    greaterThanValue?: number | string | null;
    lessThanValue?: number | string | null;
    minLength?: number | null;
    maxLength?: number | null;
    pattern?: RegExp | null;
    primitiveName: PrimitiveValueTypeNames;
}


export interface PrimitiveValueTypeAssertion extends TypeAssertionBase {
    kind: 'primitive-value';
    value: PrimitiveValueTypes;
}


export interface RepeatedAssertion extends TypeAssertionBase {
    kind: 'repeated';
    min: number | null;
    max: number | null;
    repeated: TypeAssertion;
}


export interface SpreadAssertion extends TypeAssertionBase {
    kind: 'spread';
    min: number | null;
    max: number | null;
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


export interface ObjectAssertion extends TypeAssertionBase {
    kind: 'object';
    members: Array<[string, TypeAssertion]>;
    // TODO: extended types (for codegen, recursive typedef)
    // TODO: extended members name (for codegen)
}


export type TypeAssertion =
    NeverTypeAssertion |
    AnyTypeAssertion |
    UnknownTypeAssertion |
    PrimitiveTypeAssertion |
    PrimitiveValueTypeAssertion |
    RepeatedAssertion |
    SpreadAssertion |
    SequenceAssertion |
    OneOfAssertion |
    OptionalAssertion |
    ObjectAssertion;


export interface TypeAssertionErrorMessage {
    code?: string;
    message: string;
}


export interface Context {
    checkAll?: boolean;
    errors: TypeAssertionErrorMessage[];
    // maxDepth: number;
    // depth: number;
    mapper?: (value: any, ty: TypeAssertion) => any;
}


export interface TypeAssertionSetValue {
    ty: TypeAssertion;
    exported: boolean;
}


export type TypeAssertionMap = Map<string, TypeAssertionSetValue>;
