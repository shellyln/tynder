// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { PrimitiveTypeAssertionConstraints,
         RepeatedAssertionConstraints,
         ErrorMessages,
         TypeAssertion } from './types/tynder-schema-types';

export * from './types/tynder-schema-types';



export type TypeAssertionErrorMessageConstraints =
    Partial<Omit<PrimitiveTypeAssertionConstraints &
        RepeatedAssertionConstraints, 'pattern'> &
        {pattern: string}>;


export interface TypeAssertionErrorMessage {
    code: string;
    message: string;
    dataPath: string;
    constraints: TypeAssertionErrorMessageConstraints;
    value?: any; // Only number, bigint, string, boolean, undefined, null
}


export interface ValidationContext {
    checkAll?: boolean;
    noAdditionalProps?: boolean;
    errorMessages?: ErrorMessages;

    // maxDepth: number;
    // depth: number;
    mapper?: (value: any, ty: TypeAssertion) => any;

    // === returned values ===
    errors: TypeAssertionErrorMessage[];

    // === internal use ===
    typeStack: Array<                 // For error reporting (keyword substitutions)
        TypeAssertion |
        [TypeAssertion,
         number | string | undefined] // [1]: data index
        >;
                                      // NOTE: DO NOT reassign!
                                      //   Push or pop items instead of reassign.
    schema?: TypeAssertionMap;        //   To resolve 'symlink' assertion,
                                      //   the context need to have a schema instance.
}


export interface TypeAssertionSetValue {
    ty: TypeAssertion;
    exported: boolean;
    resolved: boolean;
}


export type TypeAssertionMap = Map<string, TypeAssertionSetValue>;


export interface SymbolResolverOperators {
    [propName: string]: (...args: Array<TypeAssertion | string>) => TypeAssertion;
}

export interface SymbolResolverContext {
    nestLevel: number;
    symlinkStack: string[]; // For detecting recursive type
    operators?: SymbolResolverOperators; // TODO: Add it to resolve backref in type operator's operands
}


export interface CodegenContext {
    nestLevel: number;
    schema?: TypeAssertionMap; // To resolve 'symlink' assertion, the context need to have a schema instance.
}
