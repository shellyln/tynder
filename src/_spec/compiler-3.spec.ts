
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
});
