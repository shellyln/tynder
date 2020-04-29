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
    ggg4: (Bar | null);
    ggg5: Array<(Bar | null)>;
    ggg6: Array<Array<(Bar | null)>>;
    ggg7: (Bar | undefined);
    ggg8: Array<(Bar | undefined)>;
    ggg9: Array<Array<(Bar | undefined)>>;
    ggg10: (Bar | null | undefined);
    ggg11: Array<(Bar | null | undefined)>;
    ggg12: Array<Array<(Bar | null | undefined)>>;
    hhh1: number;
    hhh2: number[];
    hhh3: Array<number[]>;
    hhh4: (number | null);
    hhh5: Array<(number | null)>;
    hhh6: Array<Array<(number | null)>>;
    hhh7: (number | undefined);
    hhh8: Array<(number | undefined)>;
    hhh9: Array<Array<(number | undefined)>>;
    hhh10: (number | null | undefined);
    hhh11: Array<(number | null | undefined)>;
    hhh12: Array<Array<(number | null | undefined)>>;
}

interface User {
    userName: (Foo['name']);
    primaryEmail: (Foo['email']);
    primaryAliasName: (Bar['foo']['name']);
    aliasNames: (Bar['foo']['name'])[];
}

