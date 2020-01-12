// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


export type PrimitiveValueTypes = number | bigint | string | boolean | null | undefined;                               // TODO: function
export type PrimitiveValueTypeNames = 'number' | 'bigint' | 'string' | 'boolean' | 'null' | 'undefined';               // TODO: function
export type OptionalPrimitiveValueTypeNames = 'number?' | 'bigint?' | 'string?' | 'boolean?' | 'null?' | 'undefined?'; // TODO: function
export type PlaceholderTypeNames = 'never' | 'any' | 'unknown';
export type OptionalPlaceholderTypeNames = 'never?' | 'any?' | 'unknown?';



export enum ErrorTypes {
    InvalidDefinition = 1,
    Required,              // (all)
    TypeUnmatched,         // Never/Unknown/Primitive/Object
    RepeatQtyUnmatched,    // Repeated/Spread
    SequenceUnmatched,     // Sequence
    ValueRangeUnmatched,   // Primitive: minValue, maxValue, greaterThanValue, lessThanValue
    ValuePatternUnmatched, // Primitive: pattern
    ValueLengthUnmatched,  // Primitive: minLength, maxLength
    ValueUnmatched,        // PrimitiveValue
}


export type ErrorMessages = Partial<{
    invalidDefinition: string,
    required: string,
    typeUnmatched: string,
    repeatQtyUnmatched: string,
    sequenceUnmatched: string,
    valueRangeUnmatched: string,
    valuePatternUnmatched: string,
    valueLengthUnmatched: string,
    valueUnmatched: string,
}>;


export interface TypeAssertionErrorMessage {
    code?: string;
    message: string;
}


export interface TypeAssertionBase {
    messageId?: string;
    message?: string;
    messages?: ErrorMessages;
    name?: string;              // Member name or 'typeName' below. For error reporting and codegen.
    typeName?: string;          // Named user defined 'type' or 'interface' name. For error reporting and codegen.
    docComment?: string;        // Doc comment.
    passThruCodeBlock?: string; // Store a pass-thru code block (e.g. import statement). use it with kind===never
    noOutput?: boolean;         // If true, skip code generation.
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
    minValue?: number | string | null; // TODO: bigint
    maxValue?: number | string | null; // TODO: bigint
    greaterThanValue?: number | string | null;
    lessThanValue?: number | string | null;
    minLength?: number | null;
    maxLength?: number | null;
    pattern?: RegExp | null;
}


export interface PrimitiveValueTypeAssertion extends TypeAssertionBase {
    kind: 'primitive-value';
    value: PrimitiveValueTypes;
}


export interface RepeatedAssertion extends TypeAssertionBase {
    kind: 'repeated';
    repeated: TypeAssertion;
    min: number | null;
    max: number | null;
}


export interface SpreadAssertion extends TypeAssertionBase {
    kind: 'spread';
    spread: TypeAssertion;
    min: number | null;
    max: number | null;
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
    values: Array<[
        string,           // enum key
        number | string,  // enum value
        string?,          // doc comment
    ]>;
}


// TODO:
// export interface ObjectMemberInfo {
//     definedByAncestors?: boolean;
//     docComment?: string;
// }


export type ObjectAssertionMember = [
    string,         // name
    TypeAssertion,  // type
] | [
    string,         // name
    TypeAssertion,  // type
    boolean,        // If true, defined by ancestor types
];



export type AdditionalPropsKey = Array<'string' | 'number' | RegExp>;


export type AdditionalPropsMember = [
    AdditionalPropsKey,  // name
    TypeAssertion,       // type
] | [
    AdditionalPropsKey,  // name
    TypeAssertion,       // type
    boolean,             // If true, defined by ancestor types
];


export interface ObjectAssertion extends TypeAssertionBase {
    kind: 'object';
    members: ObjectAssertionMember[];
    additionalProps?: AdditionalPropsMember[];
    baseTypes?: Array<ObjectAssertion | AssertionSymlink>;
}


export interface AssertionSymlink extends TypeAssertionBase {
    kind: 'symlink';
    symlinkTargetName: string;
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
    EnumAssertion |
    ObjectAssertion |
    AssertionSymlink;


export interface ValidationContext {
    checkAll?: boolean;
    noAdditionalProps?: boolean;

    // maxDepth: number;
    // depth: number;
    mapper?: (value: any, ty: TypeAssertion) => any;

    // === returned values ===
    errors: TypeAssertionErrorMessage[];

    // === internal use ===
    typeStack: TypeAssertion[]; // For error reporting (keyword substitutions)
                                // NOTE: DO NOT reassign! Push or pop items instead of reassign.
    schema?: TypeAssertionMap;  // To resolve 'symlink' assertion, the context need to have a schema instance.
}


export interface TypeAssertionSetValue {
    ty: TypeAssertion;
    exported: boolean;
    resolved: boolean;
}


export type TypeAssertionMap = Map<string, TypeAssertionSetValue>;


export interface SymbolResolverContext {
    nestLevel: number;
    symlinkStack: string[]; // For detecting recursive type
}


export interface CodegenContext {
    nestLevel: number;
    schema?: TypeAssertionMap; // To resolve 'symlink' assertion, the context need to have a schema instance.
}
