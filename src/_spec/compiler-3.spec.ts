
import { TypeAssertion,
         ValidationContext } from '../types';
import { validate,
         getType }           from '../validator';
import { compile }           from '../compiler';
import { serialize,
         deserialize }       from '../serializer';



describe("compiler-3", function() {
    it("compiler-op-intersection-1", function() {
        const schemas = [compile(`
            interface A {
                a: string;
            }
            interface B extends A {
                b: number;
            }
            interface C {
                c: boolean;
            }
            type D = B & C;
        `), compile(`
            type D = B & C;
            interface C {
                c: boolean;
            }
            interface B extends A {
                b: number;
            }
            interface A {
                a: string;
            }
        `)];
        {
            expect(Array.from(schemas[0].keys())).toEqual([
                'A', 'B', 'C', 'D',
            ]);
            expect(Array.from(schemas[1].keys())).toEqual([
                'D', 'C', 'B', 'A',
            ]);
        }
        for (const schema of schemas) {
            {
                const rhs: TypeAssertion = {
                    name: 'D',
                    typeName: 'D',
                    kind: 'object',
                    members: [
                        ['b', {
                            name: 'b',
                            kind: 'primitive',
                            primitiveName: 'number',
                        }],
                        ['a', {
                            name: 'a',
                            kind: 'primitive',
                            primitiveName: 'string',
                        }],
                        ['c', {
                            name: 'c',
                            kind: 'primitive',
                            primitiveName: 'boolean',
                        }],
                    ],
                };
                const ty = getType(schema, 'D');
                expect(ty).toEqual(rhs);
                {
                    const v = {
                        a: '',
                        b: 0,
                        c: false,
                    };
                    expect(validate<any>(v, ty, {schema})).toEqual({value: v});
                }
            }
        }
    });
    it("compiler-op-subtract+omit-1", function() {
        const schemas = [compile(`
            interface A {
                a: string;
            }
            interface B extends A {
                b: number;
            }
            interface C {
                b: bigint;
                c: boolean;
            }
            type D = B - C;
        `), compile(`
            type D = B - C;
            interface C {
                b: bigint;
                c: boolean;
            }
            interface B extends A {
                b: number;
            }
            interface A {
                a: string;
            }
        `), compile(`
            type D = Omit<B, 'b' | 'c'>;
            interface C {
                b: bigint;
                c: boolean;
            }
            interface B extends A {
                b: number;
            }
            interface A {
                a: string;
            }
        `)];
        {
            expect(Array.from(schemas[0].keys())).toEqual([
                'A', 'B', 'C', 'D',
            ]);
            expect(Array.from(schemas[1].keys())).toEqual([
                'D', 'C', 'B', 'A',
            ]);
            expect(Array.from(schemas[2].keys())).toEqual([
                'D', 'C', 'B', 'A',
            ]);
        }
        for (const schema of schemas) {
            {
                const rhs: TypeAssertion = {
                    name: 'D',
                    typeName: 'D',
                    kind: 'object',
                    members: [
                        ['a', {
                            name: 'a',
                            kind: 'primitive',
                            primitiveName: 'string',
                        }],
                    ],
                };
                const ty = getType(schema, 'D');
                expect(ty).toEqual(rhs);
                {
                    const v = {
                        a: '',
                    };
                    expect(validate<any>(v, ty, {schema, noAdditionalProps: true})).toEqual({value: v});
                }
                {
                    const v = {
                        a: '',
                        b: 0,
                        c: false,
                    };
                    expect(validate<any>(v, ty, {schema, noAdditionalProps: true})).toEqual(null);
                }
            }
        }
    });
    it("compiler-op-pick-1", function() {
        const schemas = [compile(`
            interface A {
                a: string;
                b: number;
            }
            interface B extends A {
                c: boolean;
                d: bigint;
            }
            type C = Pick<B, 'a' | 'c'>;
        `), compile(`
            type C = Pick<B, 'a' | 'c'>;
            interface B extends A {
                c: boolean;
                d: bigint;
            }
            interface A {
                a: string;
                b: number;
            }
        `)];
        {
            expect(Array.from(schemas[0].keys())).toEqual([
                'A', 'B', 'C',
            ]);
            expect(Array.from(schemas[1].keys())).toEqual([
                'C', 'B', 'A',
            ]);
        }
        for (const schema of schemas) {
            {
                const rhs: TypeAssertion = {
                    name: 'C',
                    typeName: 'C',
                    kind: 'object',
                    members: [
                        ['a', {
                            name: 'a',
                            kind: 'primitive',
                            primitiveName: 'string',
                        }],
                        ['c', {
                            name: 'c',
                            kind: 'primitive',
                            primitiveName: 'boolean',
                        }],
                    ],
                };
                const ty = getType(schema, 'C');
                expect(ty).toEqual(rhs);
                {
                    const v = {
                        a: '',
                        c: false,
                    };
                    expect(validate<any>(v, ty, {schema, noAdditionalProps: true})).toEqual({value: v});
                }
                {
                    const v = {
                        a: '',
                        b: 0,
                        c: false,
                        d: BigInt(5),
                    };
                    expect(validate<any>(v, ty, {schema, noAdditionalProps: true})).toEqual(null);
                }
            }
        }
    });
    it("compiler-op-partial-1", function() {
        const schemas = [compile(`
            interface A {
                a: string;
                b: number;
            }
            interface B extends A {
                c: boolean;
                d: bigint;
            }
            type C = Partial<B>;
        `), compile(`
            type C = Partial<B>;
            interface B extends A {
                c: boolean;
                d: bigint;
            }
            interface A {
                a: string;
                b: number;
            }
        `)];
        {
            expect(Array.from(schemas[0].keys())).toEqual([
                'A', 'B', 'C',
            ]);
            expect(Array.from(schemas[1].keys())).toEqual([
                'C', 'B', 'A',
            ]);
        }
        for (const schema of schemas) {
            {
                const rhs: TypeAssertion = {
                    name: 'C',
                    typeName: 'C',
                    kind: 'object',
                    members: [
                        ['c', {
                            name: 'c',
                            kind: 'optional',
                            optional: {
                                kind: 'primitive',
                                primitiveName: 'boolean',
                            },
                        }],
                        ['d', {
                            name: 'd',
                            kind: 'optional',
                            optional: {
                                kind: 'primitive',
                                primitiveName: 'bigint',
                            },
                        }],
                        ['a', {
                            name: 'a',
                            kind: 'optional',
                            optional: {
                                kind: 'primitive',
                                primitiveName: 'string',
                            },
                        }],
                        ['b', {
                            name: 'b',
                            kind: 'optional',
                            optional: {
                                kind: 'primitive',
                                primitiveName: 'number',
                            },
                        }],
                    ],
                };
                const ty = getType(schema, 'C');
                expect(ty).toEqual(rhs);
                {
                    const v = {
                        a: '',
                        c: false,
                    };
                    expect(validate<any>(v, ty, {schema, noAdditionalProps: true})).toEqual({value: v});
                }
                {
                    const v = {
                        a: '',
                        b: 0,
                        c: false,
                        d: BigInt(5),
                    };
                    expect(validate<any>(v, ty, {schema, noAdditionalProps: true})).toEqual({value: v});
                }
            }
        }
    });
    it("compiler-enum-1", function() {
        const schema = compile(`
            enum Foo {
                AAA,
                BBB,
                CCC,
                DDD,
                EEE,
            }
        `);

        {
            expect(Array.from(schema.keys())).toEqual([
                'Foo',
            ]);
        }
        {
            const rhs: TypeAssertion = {
                name: 'Foo',
                typeName: 'Foo',
                kind: 'enum',
                values: [
                    ['AAA', 0],
                    ['BBB', 1],
                    ['CCC', 2],
                    ['DDD', 3],
                    ['EEE', 4],
                ],
            };
            const ty = getType(schema, 'Foo');
            expect(ty).toEqual(rhs);
            expect(validate<number>(-1, ty)).toEqual(null);
            expect(validate<number>(0, ty)).toEqual({value: 0});
            expect(validate<number>(1, ty)).toEqual({value: 1});
            expect(validate<number>(2, ty)).toEqual({value: 2});
            expect(validate<number>(3, ty)).toEqual({value: 3});
            expect(validate<number>(4, ty)).toEqual({value: 4});
            expect(validate<number>(5, ty)).toEqual(null);
        }
    });
    it("compiler-enum-2", function() {
        const schema = compile(`
            enum Foo {
                AAA = 2,
                BBB,
                CCC = 10,
                DDD,
                EEE,
            }
        `);

        {
            expect(Array.from(schema.keys())).toEqual([
                'Foo',
            ]);
        }
        {
            const rhs: TypeAssertion = {
                name: 'Foo',
                typeName: 'Foo',
                kind: 'enum',
                values: [
                    ['AAA', 2],
                    ['BBB', 3],
                    ['CCC', 10],
                    ['DDD', 11],
                    ['EEE', 12],
                ],
            };
            const ty = getType(schema, 'Foo');
            expect(ty).toEqual(rhs);
            expect(validate<number>(-1, ty)).toEqual(null);
            expect(validate<number>(0, ty)).toEqual(null);
            expect(validate<number>(1, ty)).toEqual(null);
            expect(validate<number>(2, ty)).toEqual({value: 2});
            expect(validate<number>(3, ty)).toEqual({value: 3});
            expect(validate<number>(4, ty)).toEqual(null);
            expect(validate<number>(9, ty)).toEqual(null);
            expect(validate<number>(10, ty)).toEqual({value: 10});
            expect(validate<number>(11, ty)).toEqual({value: 11});
            expect(validate<number>(12, ty)).toEqual({value: 12});
            expect(validate<number>(13, ty)).toEqual(null);
        }
    });
    it("compiler-enum-3", function() {
        const schema = compile(`
            enum Foo {
                AAA = 'XA',
                BBB = 'XB',
                CCC = 'XC',
                DDD = 'XD',
                EEE = 'XE',
            }
        `);

        {
            expect(Array.from(schema.keys())).toEqual([
                'Foo',
            ]);
        }
        {
            const rhs: TypeAssertion = {
                name: 'Foo',
                typeName: 'Foo',
                kind: 'enum',
                values: [
                    ['AAA', 'XA'],
                    ['BBB', 'XB'],
                    ['CCC', 'XC'],
                    ['DDD', 'XD'],
                    ['EEE', 'XE'],
                ],
            };
            const ty = getType(schema, 'Foo');
            expect(ty).toEqual(rhs);
            expect(validate<number>(-1, ty)).toEqual(null);
            expect(validate<number>(0, ty)).toEqual(null);
            expect(validate<number>(1, ty)).toEqual(null);
            expect(validate<string>('XA', ty)).toEqual({value: 'XA'});
            expect(validate<string>('XB', ty)).toEqual({value: 'XB'});
            expect(validate<string>('XC', ty)).toEqual({value: 'XC'});
            expect(validate<string>('XD', ty)).toEqual({value: 'XD'});
            expect(validate<string>('XE', ty)).toEqual({value: 'XE'});
            expect(validate<number>('AAA', ty)).toEqual(null);
            expect(validate<number>('AA', ty)).toEqual(null);
            expect(validate<number>('', ty)).toEqual(null);
        }
    });
    it("compiler-enum-4", function() {
        const schema = compile(`
            enum Foo {
                AAA = 'XA',
                BBB,
                CCC,
                DDD = 10,
                EEE,
                FFF = 'XF',
            }
        `);

        {
            expect(Array.from(schema.keys())).toEqual([
                'Foo',
            ]);
        }
        {
            const rhs: TypeAssertion = {
                name: 'Foo',
                typeName: 'Foo',
                kind: 'enum',
                values: [
                    ['AAA', 'XA'],
                    ['BBB', 0],
                    ['CCC', 1],
                    ['DDD', 10],
                    ['EEE', 11],
                    ['FFF', 'XF'],
                ],
            };
            const ty = getType(schema, 'Foo');
            expect(ty).toEqual(rhs);
            expect(validate<number>(-1, ty)).toEqual(null);
            expect(validate<number>(0, ty)).toEqual({value: 0});
            expect(validate<number>(1, ty)).toEqual({value: 1});
            expect(validate<number>(2, ty)).toEqual(null);
            expect(validate<number>(9, ty)).toEqual(null);
            expect(validate<number>(10, ty)).toEqual({value: 10});
            expect(validate<number>(11, ty)).toEqual({value: 11});
            expect(validate<number>(12, ty)).toEqual(null);
            expect(validate<string>('XA', ty)).toEqual({value: 'XA'});
            expect(validate<number>('XB', ty)).toEqual(null);
            expect(validate<number>('XC', ty)).toEqual(null);
            expect(validate<number>('XD', ty)).toEqual(null);
            expect(validate<number>('XE', ty)).toEqual(null);
            expect(validate<string>('XF', ty)).toEqual({value: 'XF'});
            expect(validate<number>('AAA', ty)).toEqual(null);
            expect(validate<number>('AA', ty)).toEqual(null);
            expect(validate<number>('', ty)).toEqual(null);
        }
    });
    it("compiler-enum-5", function() {
        const schema = compile(`
            enum Foo {
                AAA = 'XA',
                BBB,
                CCC,
                DDD = 'XD',
                EEE,
                FFF = 'XF',
            }
        `);

        {
            expect(Array.from(schema.keys())).toEqual([
                'Foo',
            ]);
        }
        {
            const rhs: TypeAssertion = {
                name: 'Foo',
                typeName: 'Foo',
                kind: 'enum',
                values: [
                    ['AAA', 'XA'],
                    ['BBB', 0],
                    ['CCC', 1],
                    ['DDD', 'XD'],
                    ['EEE', 2],
                    ['FFF', 'XF'],
                ],
            };
            const ty = getType(schema, 'Foo');
            expect(ty).toEqual(rhs);
            expect(validate<number>(-1, ty)).toEqual(null);
            expect(validate<number>(0, ty)).toEqual({value: 0});
            expect(validate<number>(1, ty)).toEqual({value: 1});
            expect(validate<number>(2, ty)).toEqual({value: 2});
            expect(validate<number>(3, ty)).toEqual(null);
            expect(validate<string>('XA', ty)).toEqual({value: 'XA'});
            expect(validate<number>('XB', ty)).toEqual(null);
            expect(validate<number>('XC', ty)).toEqual(null);
            expect(validate<string>('XD', ty)).toEqual({value: 'XD'});
            expect(validate<number>('XE', ty)).toEqual(null);
            expect(validate<string>('XF', ty)).toEqual({value: 'XF'});
            expect(validate<number>('AAA', ty)).toEqual(null);
            expect(validate<number>('AA', ty)).toEqual(null);
            expect(validate<number>('', ty)).toEqual(null);
        }
    });
    it("compiler-additional-props-1", function() {
        const schemas = [compile(`
            interface A {
                [propNames1: /^A+$/]: string;
                [propNames2: /^B+$/]: string;
            }
            interface C extends A {
                [propNames3: /^C+$/]: number;
                [propNames4: /^D+$/]: number;
            }
        `), compile(`
            interface C extends A {
                [propNames3: /^C+$/]: number;
                [propNames4: /^D+$/]: number;
            }
            interface A {
                [propNames1: /^A+$/]: string;
                [propNames2: /^B+$/]: string;
            }
        `)];

        {
            expect(Array.from(schemas[0].keys())).toEqual([
                'A', 'C',
            ]);
            expect(Array.from(schemas[1].keys())).toEqual([
                'C', 'A',
            ]);
        }
        for (const schema of schemas) {
            {
                const rhs: TypeAssertion = {
                    name: 'C',
                    typeName: 'C',
                    kind: 'object',
                    members: [],
                    additionalProps: [
                        [[/^A+$/], {kind: 'primitive', primitiveName: 'string'}, true],
                        [[/^B+$/], {kind: 'primitive', primitiveName: 'string'}, true],
                        [[/^C+$/], {kind: 'primitive', primitiveName: 'number'}],
                        [[/^D+$/], {kind: 'primitive', primitiveName: 'number'}],
                    ],
                    baseTypes: [{
                        name: 'A',
                        typeName: 'A',
                        kind: 'object',
                        members: [],
                        additionalProps: [
                            [[/^A+$/], {kind: 'primitive', primitiveName: 'string'}],
                            [[/^B+$/], {kind: 'primitive', primitiveName: 'string'}],
                        ],
                    }],
                };
                const ty = getType(schema, 'C');
                expect(ty).toEqual(rhs);
                expect(validate<any>({}, ty)).toEqual({value: {}});
                expect(validate<any>({'A': ''}, ty)).toEqual({value: {'A': ''}});
                expect(validate<any>({'A': 0}, ty)).toEqual(null);
                expect(validate<any>({'B': ''}, ty)).toEqual({value: {'B': ''}});
                expect(validate<any>({'B': 0}, ty)).toEqual(null);
                expect(validate<any>({'C': ''}, ty)).toEqual(null);
                expect(validate<any>({'C': 0}, ty)).toEqual({value: {'C': 0}});
                expect(validate<any>({'D': ''}, ty)).toEqual(null);
                expect(validate<any>({'D': 0}, ty)).toEqual({value: {'D': 0}});
                expect(validate<any>({'E': ''}, ty)).toEqual(null);
                expect(validate<any>({'E': 0}, ty)).toEqual(null);
                expect(validate<any>({0: ''}, ty)).toEqual(null);
                expect(validate<any>({0: 0}, ty)).toEqual(null);
                expect(validate<any>([], ty)).toEqual({value: []});
                expect(validate<any>([''], ty)).toEqual(null);
                expect(validate<any>([0], ty)).toEqual(null);
            }
        }
    });
    it("compiler-additional-props-2", function() {
        const schemas = [compile(`
            interface A {
                [propNames1: /^A+$/]: string;
                [propNames2: /^B+$/]: string;
            }
            interface C extends A {
                [propNames3: /^C+$/]: number;
                [propNames4: /^C+$/]: string;
            }
        `), compile(`
            interface C extends A {
                [propNames3: /^C+$/]: number;
                [propNames4: /^C+$/]: string;
            }
            interface A {
                [propNames1: /^A+$/]: string;
                [propNames2: /^B+$/]: string;
            }
        `)];

        {
            expect(Array.from(schemas[0].keys())).toEqual([
                'A', 'C',
            ]);
            expect(Array.from(schemas[1].keys())).toEqual([
                'C', 'A',
            ]);
        }
        for (const schema of schemas) {
            {
                const rhs: TypeAssertion = {
                    name: 'C',
                    typeName: 'C',
                    kind: 'object',
                    members: [],
                    additionalProps: [
                        [[/^A+$/], {kind: 'primitive', primitiveName: 'string'}, true],
                        [[/^B+$/], {kind: 'primitive', primitiveName: 'string'}, true],
                        [[/^C+$/], {kind: 'primitive', primitiveName: 'number'}],
                        [[/^C+$/], {kind: 'primitive', primitiveName: 'string'}],
                    ],
                    baseTypes: [{
                        name: 'A',
                        typeName: 'A',
                        kind: 'object',
                        members: [],
                        additionalProps: [
                            [[/^A+$/], {kind: 'primitive', primitiveName: 'string'}],
                            [[/^B+$/], {kind: 'primitive', primitiveName: 'string'}],
                        ],
                    }],
                };
                const ty = getType(schema, 'C');
                expect(ty).toEqual(rhs);
                expect(validate<any>({}, ty)).toEqual({value: {}});
                expect(validate<any>({'A': ''}, ty)).toEqual({value: {'A': ''}});
                expect(validate<any>({'A': 0}, ty)).toEqual(null);
                expect(validate<any>({'B': ''}, ty)).toEqual({value: {'B': ''}});
                expect(validate<any>({'B': 0}, ty)).toEqual(null);
                expect(validate<any>({'C': ''}, ty)).toEqual({value: {'C': ''}});
                expect(validate<any>({'C': 0}, ty)).toEqual({value: {'C': 0}});
                expect(validate<any>({'D': ''}, ty)).toEqual(null);
                expect(validate<any>({'D': 0}, ty)).toEqual(null);
                expect(validate<any>({'E': ''}, ty)).toEqual(null);
                expect(validate<any>({'E': 0}, ty)).toEqual(null);
                expect(validate<any>({0: ''}, ty)).toEqual(null);
                expect(validate<any>({0: 0}, ty)).toEqual(null);
                expect(validate<any>([], ty)).toEqual({value: []});
                expect(validate<any>([''], ty)).toEqual(null);
                expect(validate<any>([0], ty)).toEqual(null);
            }
        }
    });
    it("compiler-additional-props-3", function() {
        const schemas = [compile(`
            interface A {
                [propNames1: /^A+$/]: string;
                [propNames2: number | /^B+$/]: string;
            }
            interface C extends A {
                [propNames3: /^C+$/]: number;
                [propNames4: /^D+$/ | number]: number;
            }
        `), compile(`
            interface C extends A {
                [propNames3: /^C+$/]: number;
                [propNames4: /^D+$/ | number]: number;
            }
            interface A {
                [propNames1: /^A+$/]: string;
                [propNames2: number | /^B+$/]: string;
            }
        `)];

        {
            expect(Array.from(schemas[0].keys())).toEqual([
                'A', 'C',
            ]);
            expect(Array.from(schemas[1].keys())).toEqual([
                'C', 'A',
            ]);
        }
        for (const schema of schemas) {
            {
                const rhs: TypeAssertion = {
                    name: 'C',
                    typeName: 'C',
                    kind: 'object',
                    members: [],
                    additionalProps: [
                        [[/^A+$/], {kind: 'primitive', primitiveName: 'string'}, true],
                        [['number', /^B+$/], {kind: 'primitive', primitiveName: 'string'}, true],
                        [[/^C+$/], {kind: 'primitive', primitiveName: 'number'}],
                        [[/^D+$/, 'number'], {kind: 'primitive', primitiveName: 'number'}],
                    ],
                    baseTypes: [{
                        name: 'A',
                        typeName: 'A',
                        kind: 'object',
                        members: [],
                        additionalProps: [
                            [[/^A+$/], {kind: 'primitive', primitiveName: 'string'}],
                            [['number', /^B+$/], {kind: 'primitive', primitiveName: 'string'}],
                        ],
                    }],
                };
                const ty = getType(schema, 'C');
                expect(ty).toEqual(rhs);
                expect(validate<any>({}, ty)).toEqual({value: {}});
                expect(validate<any>({'A': ''}, ty)).toEqual({value: {'A': ''}});
                expect(validate<any>({'A': 0}, ty)).toEqual(null);
                expect(validate<any>({'B': ''}, ty)).toEqual({value: {'B': ''}});
                expect(validate<any>({'B': 0}, ty)).toEqual(null);
                expect(validate<any>({'C': ''}, ty)).toEqual(null);
                expect(validate<any>({'C': 0}, ty)).toEqual({value: {'C': 0}});
                expect(validate<any>({'D': ''}, ty)).toEqual(null);
                expect(validate<any>({'D': 0}, ty)).toEqual({value: {'D': 0}});
                expect(validate<any>({'E': ''}, ty)).toEqual(null);
                expect(validate<any>({'E': 0}, ty)).toEqual(null);
                expect(validate<any>({0: ''}, ty)).toEqual({value: {'0': ''}});
                expect(validate<any>({0: 0}, ty)).toEqual({value: {'0': 0}});
                expect(validate<any>([], ty)).toEqual({value: []});
                expect(validate<any>([''], ty)).toEqual({value: ['']});
                expect(validate<any>([0], ty)).toEqual({value: [0]});
            }
        }
    });
    it("compiler-additional-props-4", function() {
        const schemas = [compile(`
            interface A {
                [propNames1: /^A+$/]: string;
                [propNames2: /^B+$/]?: string;
            }
            interface C extends A {
                [propNames3: /^C+$/]: number;
                [propNames4: /^D+$/]: number;
            }
        `), compile(`
            interface C extends A {
                [propNames3: /^C+$/]: number;
                [propNames4: /^D+$/]: number;
            }
            interface A {
                [propNames1: /^A+$/]: string;
                [propNames2: /^B+$/]?: string;
            }
        `)];

        {
            expect(Array.from(schemas[0].keys())).toEqual([
                'A', 'C',
            ]);
            expect(Array.from(schemas[1].keys())).toEqual([
                'C', 'A',
            ]);
        }
        for (const schema of schemas) {
            {
                const rhs: TypeAssertion = {
                    name: 'C',
                    typeName: 'C',
                    kind: 'object',
                    members: [],
                    additionalProps: [
                        [[/^A+$/], {kind: 'primitive', primitiveName: 'string'}, true],
                        [[/^B+$/], {kind: 'optional', optional: {kind: 'primitive', primitiveName: 'string'}}, true],
                        [[/^C+$/], {kind: 'primitive', primitiveName: 'number'}],
                        [[/^D+$/], {kind: 'primitive', primitiveName: 'number'}],
                    ],
                    baseTypes: [{
                        name: 'A',
                        typeName: 'A',
                        kind: 'object',
                        members: [],
                        additionalProps: [
                            [[/^A+$/], {kind: 'primitive', primitiveName: 'string'}],
                            [[/^B+$/], {kind: 'optional', optional: {kind: 'primitive', primitiveName: 'string'}}],
                        ],
                    }],
                };
                const ty = getType(schema, 'C');
                expect(ty).toEqual(rhs);
                expect(validate<any>({}, ty)).toEqual({value: {}});
                expect(validate<any>({'A': ''}, ty)).toEqual({value: {'A': ''}});
                expect(validate<any>({'A': 0}, ty)).toEqual(null);
                expect(validate<any>({'B': ''}, ty)).toEqual({value: {'B': ''}});
                expect(validate<any>({'B': 0}, ty)).toEqual(null);
                expect(validate<any>({'C': ''}, ty)).toEqual(null);
                expect(validate<any>({'C': 0}, ty)).toEqual({value: {'C': 0}});
                expect(validate<any>({'D': ''}, ty)).toEqual(null);
                expect(validate<any>({'D': 0}, ty)).toEqual({value: {'D': 0}});
                expect(validate<any>({'E': ''}, ty)).toEqual({value: {'E': ''}});
                expect(validate<any>({'E': 0}, ty)).toEqual({value: {'E': 0}});
                expect(validate<any>({0: ''}, ty)).toEqual({value: {'0': ''}});
                expect(validate<any>({0: 0}, ty)).toEqual({value: {'0': 0}});
                expect(validate<any>([], ty)).toEqual({value: []});
                expect(validate<any>([''], ty)).toEqual({value: ['']});
                expect(validate<any>([0], ty)).toEqual({value: [0]});
            }
        }
    });
    it("compiler-additional-props-5a", function() {
        const schemas = [compile(`
            interface C {
                [propNames3: string]: number;
                [propNames4: number]: string;
            }
        `)];

        {
            expect(Array.from(schemas[0].keys())).toEqual([
                'C',
            ]);
        }
        for (const schema of schemas) {
            {
                const rhs: TypeAssertion = {
                    name: 'C',
                    typeName: 'C',
                    kind: 'object',
                    members: [],
                    additionalProps: [
                        [['string'], {kind: 'primitive', primitiveName: 'number'}],
                        [['number'], {kind: 'primitive', primitiveName: 'string'}],
                    ],
                };
                const ty = getType(schema, 'C');
                expect(ty).toEqual(rhs);
                expect(validate<any>({}, ty)).toEqual({value: {}});
                expect(validate<any>({'A': ''}, ty)).toEqual(null);
                expect(validate<any>({'A': 0}, ty)).toEqual({value: {'A': 0}});
                expect(validate<any>({'B': ''}, ty)).toEqual(null);
                expect(validate<any>({'B': 0}, ty)).toEqual({value: {'B': 0}});
                expect(validate<any>({'C': ''}, ty)).toEqual(null);
                expect(validate<any>({'C': 0}, ty)).toEqual({value: {'C': 0}});
                expect(validate<any>({0: ''}, ty)).toEqual({value: {'0': ''}});
                // expect(validate<any>({0: 0}, ty)).toEqual(null); // TODO:
                expect(validate<any>([], ty)).toEqual({value: []});
                expect(validate<any>([''], ty)).toEqual({value: ['']});
                // expect(validate<any>([0], ty)).toEqual(null);    // TODO:
            }
        }
    });
    it("compiler-additional-props-5b", function() {
        const schemas = [compile(`
            interface C {
                [propNames4: number]: string;
                [propNames3: string]: number;
            }
        `)];

        {
            expect(Array.from(schemas[0].keys())).toEqual([
                'C',
            ]);
        }
        for (const schema of schemas) {
            {
                const rhs: TypeAssertion = {
                    name: 'C',
                    typeName: 'C',
                    kind: 'object',
                    members: [],
                    additionalProps: [
                        [['number'], {kind: 'primitive', primitiveName: 'string'}],
                        [['string'], {kind: 'primitive', primitiveName: 'number'}],
                    ],
                };
                const ty = getType(schema, 'C');
                expect(ty).toEqual(rhs);
                expect(validate<any>({}, ty)).toEqual({value: {}});
                expect(validate<any>({'A': ''}, ty)).toEqual(null);
                expect(validate<any>({'A': 0}, ty)).toEqual({value: {'A': 0}});
                expect(validate<any>({'B': ''}, ty)).toEqual(null);
                expect(validate<any>({'B': 0}, ty)).toEqual({value: {'B': 0}});
                expect(validate<any>({'C': ''}, ty)).toEqual(null);
                expect(validate<any>({'C': 0}, ty)).toEqual({value: {'C': 0}});
                expect(validate<any>({0: ''}, ty)).toEqual({value: {'0': ''}});
                // expect(validate<any>({0: 0}, ty)).toEqual(null); // TODO:
                expect(validate<any>([], ty)).toEqual({value: []});
                expect(validate<any>([''], ty)).toEqual({value: ['']});
                // expect(validate<any>([0], ty)).toEqual(null);    // TODO:
            }
        }
    });
    it("compiler-additional-props-5c", function() {
        const schemas = [compile(`
            interface C {
                [propNames4: number]: string;
            }
        `)];

        {
            expect(Array.from(schemas[0].keys())).toEqual([
                'C',
            ]);
        }
        for (const schema of schemas) {
            {
                const rhs: TypeAssertion = {
                    name: 'C',
                    typeName: 'C',
                    kind: 'object',
                    members: [],
                    additionalProps: [
                        [['number'], {kind: 'primitive', primitiveName: 'string'}],
                    ],
                };
                const ty = getType(schema, 'C');
                expect(ty).toEqual(rhs);
                expect(validate<any>({}, ty)).toEqual({value: {}});
                expect(validate<any>({'A': ''}, ty)).toEqual(null);
                expect(validate<any>({'A': 0}, ty)).toEqual(null);
                expect(validate<any>({'B': ''}, ty)).toEqual(null);
                expect(validate<any>({'B': 0}, ty)).toEqual(null);
                expect(validate<any>({'C': ''}, ty)).toEqual(null);
                expect(validate<any>({'C': 0}, ty)).toEqual(null);
                expect(validate<any>({0: ''}, ty)).toEqual({value: {0: ''}});
                expect(validate<any>({0: 0}, ty)).toEqual(null);
                expect(validate<any>([], ty)).toEqual({value: []});
                expect(validate<any>([''], ty)).toEqual({value: ['']});
                expect(validate<any>([0], ty)).toEqual(null);
            }
        }
    });
    it("compiler-additional-props-5d", function() {
        const schemas = [compile(`
            interface C {
                [propNames4: number | string]: string;
            }
        `)];

        {
            expect(Array.from(schemas[0].keys())).toEqual([
                'C',
            ]);
        }
        for (const schema of schemas) {
            {
                const rhs: TypeAssertion = {
                    name: 'C',
                    typeName: 'C',
                    kind: 'object',
                    members: [],
                    additionalProps: [
                        [['number', 'string'], {kind: 'primitive', primitiveName: 'string'}],
                    ],
                };
                const ty = getType(schema, 'C');
                expect(ty).toEqual(rhs);
                expect(validate<any>({}, ty)).toEqual({value: {}});
                expect(validate<any>({'A': ''}, ty)).toEqual({value: {'A': ''}});
                expect(validate<any>({'A': 0}, ty)).toEqual(null);
                expect(validate<any>({'B': ''}, ty)).toEqual({value: {'B': ''}});
                expect(validate<any>({'B': 0}, ty)).toEqual(null);
                expect(validate<any>({'C': ''}, ty)).toEqual({value: {'C': ''}});
                expect(validate<any>({'C': 0}, ty)).toEqual(null);
                expect(validate<any>({0: ''}, ty)).toEqual({value: {0: ''}});
                expect(validate<any>({0: 0}, ty)).toEqual(null);
                expect(validate<any>([], ty)).toEqual({value: []});
                expect(validate<any>([''], ty)).toEqual({value: ['']});
                expect(validate<any>([0], ty)).toEqual(null);
            }
        }
    });
    it("compiler-additional-props-6", function() {
        const schemas = [compile(`
            interface C {
                a?: string;
            }
        `)];

        {
            expect(Array.from(schemas[0].keys())).toEqual([
                'C',
            ]);
        }
        for (const schema of schemas) {
            {
                const rhs: TypeAssertion = {
                    name: 'C',
                    typeName: 'C',
                    kind: 'object',
                    members: [
                        ['a', {
                            name: 'a',
                            kind: 'optional',
                            optional: {
                                kind: 'primitive',
                                primitiveName: 'string',
                            },
                        }],
                    ],
                };
                const ty = getType(schema, 'C');
                expect(ty).toEqual(rhs);
                expect(validate<any>({}, ty)).toEqual({value: {}});
                expect(validate<any>({'a': ''}, ty)).toEqual({value: {'a': ''}});
                expect(validate<any>({'a': 0}, ty)).toEqual(null);
                expect(validate<any>({'A': ''}, ty)).toEqual({value: {'A': ''}});
                expect(validate<any>({'A': 0}, ty)).toEqual({value: {'A': 0}});
                expect(validate<any>({'B': ''}, ty)).toEqual({value: {'B': ''}});
                expect(validate<any>({'B': 0}, ty)).toEqual({value: {'B': 0}});
                expect(validate<any>({'C': ''}, ty)).toEqual({value: {'C': ''}});
                expect(validate<any>({'C': 0}, ty)).toEqual({value: {'C': 0}});
                expect(validate<any>({0: ''}, ty)).toEqual({value: {0: ''}});
                expect(validate<any>({0: 0}, ty)).toEqual({value: {0: 0}});
                expect(validate<any>([], ty)).toEqual({value: []});
                expect(validate<any>([''], ty)).toEqual({value: ['']});
                expect(validate<any>([0], ty)).toEqual({value: [0]});
            }
        }
    });
    it("compiler-additional-props-6b", function() {
        const schemas = [compile(`
            interface C {
                a?: string;
            }
        `)];

        {
            expect(Array.from(schemas[0].keys())).toEqual([
                'C',
            ]);
        }
        for (const schema of schemas) {
            {
                const rhs: TypeAssertion = {
                    name: 'C',
                    typeName: 'C',
                    kind: 'object',
                    members: [
                        ['a', {
                            name: 'a',
                            kind: 'optional',
                            optional: {
                                kind: 'primitive',
                                primitiveName: 'string',
                            },
                        }],
                    ],
                };
                const ty = getType(schema, 'C');
                expect(ty).toEqual(rhs);
                expect(validate<any>({}, ty, {noAdditionalProps: true})).toEqual({value: {}});
                expect(validate<any>({'a': ''}, ty, {noAdditionalProps: true})).toEqual({value: {'a': ''}});
                expect(validate<any>({'a': 0}, ty, {noAdditionalProps: true})).toEqual(null);
                expect(validate<any>({'A': ''}, ty, {noAdditionalProps: true})).toEqual(null);
                expect(validate<any>({'A': 0}, ty, {noAdditionalProps: true})).toEqual(null);
                expect(validate<any>({'B': ''}, ty, {noAdditionalProps: true})).toEqual(null);
                expect(validate<any>({'B': 0}, ty, {noAdditionalProps: true})).toEqual(null);
                expect(validate<any>({'C': ''}, ty, {noAdditionalProps: true})).toEqual(null);
                expect(validate<any>({'C': 0}, ty, {noAdditionalProps: true})).toEqual(null);
                expect(validate<any>({0: ''}, ty, {noAdditionalProps: true})).toEqual(null);
                expect(validate<any>({0: 0}, ty, {noAdditionalProps: true})).toEqual(null);
                expect(validate<any>([], ty, {noAdditionalProps: true})).toEqual({value: []});
                expect(validate<any>([''], ty, {noAdditionalProps: true})).toEqual(null);
                expect(validate<any>([0], ty, {noAdditionalProps: true})).toEqual(null);
            }
        }
    });
});
