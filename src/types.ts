// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { PrimitiveTypeAssertionConstraints,
         RepeatedAssertionConstraints,
         ErrorMessages,
         TypeAssertion } from './types/tynder-schema-types';

export * from './types/tynder-schema-types';



// https://stackoverflow.com/questions/41980195/recursive-partialt-in-typescript
export type RecursivePartial<T> = {
    [P in keyof T]?:
      T[P] extends (infer U)[] ? RecursivePartial<U>[] :
      T[P] extends object ? RecursivePartial<T[P]> :
      T[P];
};


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



export interface Stereotype {
    tryParse: (value: any) => {value: any} | null; // for data
    evaluateFormula: (valueOrFormula: any) => any; // for PrimitiveValue and decorator comparison values
    compare: (a: any, b: any) => number;
    doCast: boolean;
}


export type CustomConstraint = (data: any, args: any) => boolean;


export interface CustomConstraintInfo {
    kinds?: Array<TypeAssertion['kind']>; // If undefined, all the kinds are allowed.
    check: CustomConstraint;
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
        >;                            // NOTE: DO NOT reassign!
                                      //   Push or pop items instead of reassign.

    recordTypeFieldValidated?: boolean;

    // === additional infos ===
    schema?: TypeAssertionMap;        //   To resolve 'symlink' assertion,
                                      //   the context need to have a schema instance.

    stereotypes?: Map<string, Stereotype>;
    customConstraints?: Map<string, CustomConstraintInfo>;
}


export interface TypeAssertionSetValue {
    ty: TypeAssertion;
    exported: boolean;
    resolved: boolean;
    // isDeclare: boolean // TODO: for non-pass-thru declare statements
}


export type TypeAssertionMap = Map<string, TypeAssertionSetValue>;


export interface SymbolResolverOperators {
    [propName: string]: (...args: Array<TypeAssertion | string>) => TypeAssertion;
}


export interface ResolveSymbolOptions {
    isDeserialization?: boolean;
}

export interface SymbolResolverContext extends ResolveSymbolOptions {
    nestLevel: number;
    symlinkStack: string[]; // For detecting recursive type
    operators?: SymbolResolverOperators; // TODO: Add it to resolve backref in type operator's operands
}


export interface CodegenContext {
    nestLevel: number;
    schema?: TypeAssertionMap; // To resolve 'symlink' assertion, the context need to have a schema instance.
}
