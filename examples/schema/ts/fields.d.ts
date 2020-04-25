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
}

interface User {
    userName: (Foo['name']);
    primaryEmail: (Foo['email']);
    primaryAliasName: (Bar['foo']['name']);
    aliasNames: (Bar['foo']['name'])[];
}

