
import { TypeAssertion,
         ValidationContext } from '../types';
import { validate,
         getType }           from '../validator';
import { compile }           from '../compiler';



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
    // TODO: mixed enum
    // TODO: additional props (+ extends)
    // TODO: exported types
    // TODO: import statement
    // TODO: doc comments (+ extends)
    // TODO: array length
    // TODO: spread and '?' length
    // TODO: decorators
    // TODO: deep cherrypick and patch
    // TODO: error reporting
    // TODO: directives
});
