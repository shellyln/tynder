type NumberType = number;

interface A {
    numberTypeField: NumberType;
    integerTypeField: number;
    bigIntTypeField: bigint;
    stringTypeField: string;
    booleanTypeField: boolean;
    nullTypeField: null;
    undefinedTypeField: undefined;
    anyTypeField: any;
    unknownTypeField: unknown;
    neverTypeField: never;
    numberValueTypeField: 3;
    integerValueTypeField: number;
    bigIntValueTypeField: 7n;
    stringValueTypeField: 'XB';
    booleanValueTypeField: true;
}

interface B {
    numberTypeField?: NumberType;
    integerTypeField?: number;
    bigIntTypeField?: bigint;
    stringTypeField?: string;
    booleanTypeField?: boolean;
    nullTypeField?: null;
    undefinedTypeField?: undefined;
    anyTypeField?: any;
    unknownTypeField?: unknown;
    neverTypeField?: never;
    numberValueTypeField?: 3;
    integerValueTypeField?: number;
    bigIntValueTypeField?: 7n;
    stringValueTypeField?: 'XB';
    booleanValueTypeField?: true;
}

interface C extends A {}

interface D {
    numberTypeField?: NumberType;
    integerTypeField?: number;
    bigIntTypeField?: bigint;
    stringTypeField?: string;
    booleanTypeField?: boolean;
    nullTypeField?: null;
    undefinedTypeField?: undefined;
    anyTypeField?: any;
    unknownTypeField?: unknown;
    neverTypeField?: never;
    numberValueTypeField?: 3;
    integerValueTypeField?: number;
    bigIntValueTypeField?: 7n;
    stringValueTypeField?: 'XB';
    booleanValueTypeField?: true;
}

interface E {
    /** additional props */
    [propName0: string]: any;
}

interface Z1 {
    foo: (ACL['target']);
    bar: (ACL['value']);
    baz: (ACL['target']);
}

interface ACL {
    target: string;
    value: string;
}

interface Z2 {
    foo: (ACL['target']);
    bar: (ACL['value']);
    baz: (ACL['target']);
}

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
    Aaaaa = 99,
    Bbbbb = 'string bbbbb',
}

export enum ErrorTypes2 {
    Aaaaa = 99,
}

export enum ErrorTypes3 {
    Zzzzz,
    Aaaaa = 99,
}

interface Foo {
    name: string;
    email: string;
}

interface Bar {
    foo: Foo;
}

interface Baz {
    aaa1: string;
    aaa2: string;
    aaa3: string;
    aaa4: string;
    bbb1: number;
    bbb2: number;
    bbb3: number;
    bbb4: number;
    /** comment */
    ccc1: number;
    /** comment */
    ccc2: number;
    /** comment */
    ccc3: number;
    /** comment */
    ccc4: number;
    ddd1: [number, string];
    ddd2: any[];
    ddd3: any[];
    ddd4: any[];
    ddd5: any[];
    ddd6: any[];
    eee1: string[];
    eee2: string[];
    eee3: string[];
    eee4: string[];
    fff: ErrorTypes;
    ggg1: Bar;
    ggg2: Bar[];
    ggg3: Array<Bar[]>;
}

interface User {
    userName: (Foo['name']);
    primaryEmail: (Foo['email']);
    primaryAliasName: (Bar['foo']['name']);
    aliasNames: (Bar['foo']['name'])[];
}

