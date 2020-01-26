
import { TypeAssertion,
         ValidationContext } from '../types';
import { validate,
         getType }           from '../validator';
import { compile }           from '../compiler';



describe("compiler-4", function() {
    it("compiler-exported-types-1", function() {
        const schema = compile(`
            export type Foo = string | number;
            type Bar = string | number;
        `);

        {
            expect(Array.from(schema.keys())).toEqual([
                'Foo', 'Bar',
            ]);
        }
        {
            const rhs: TypeAssertion = {
                name: 'Foo',
                typeName: 'Foo',
                kind: 'one-of',
                oneOf: [{
                    kind: 'primitive',
                    primitiveName: 'string',
                }, {
                    kind: 'primitive',
                    primitiveName: 'number',
                }],
            };
            const ty = getType(schema, 'Foo');
            expect(ty).toEqual(rhs);
            expect(schema.get('Foo')?.exported).toEqual(true);
        }
        {
            const rhs: TypeAssertion = {
                name: 'Bar',
                typeName: 'Bar',
                kind: 'one-of',
                oneOf: [{
                    kind: 'primitive',
                    primitiveName: 'string',
                }, {
                    kind: 'primitive',
                    primitiveName: 'number',
                }],
            };
            const ty = getType(schema, 'Bar');
            expect(ty).toEqual(rhs);
            expect(schema.get('Bar')?.exported).toEqual(false);
        }
    });
    it("compiler-exported-types-2", function() {
        const schema = compile(`
            export interface Foo {}
            interface Bar {}
        `);

        {
            expect(Array.from(schema.keys())).toEqual([
                'Foo', 'Bar',
            ]);
        }
        {
            const rhs: TypeAssertion = {
                name: 'Foo',
                typeName: 'Foo',
                kind: 'object',
                members: [],
            };
            const ty = getType(schema, 'Foo');
            expect(ty).toEqual(rhs);
            expect(schema.get('Foo')?.exported).toEqual(true);
        }
        {
            const rhs: TypeAssertion = {
                name: 'Bar',
                typeName: 'Bar',
                kind: 'object',
                members: [],
            };
            const ty = getType(schema, 'Bar');
            expect(ty).toEqual(rhs);
            expect(schema.get('Bar')?.exported).toEqual(false);
        }
    });
    it("compiler-exported-types-3", function() {
        const schema = compile(`
            export enum Foo {}
            enum Bar {}
        `);

        {
            expect(Array.from(schema.keys())).toEqual([
                'Foo', 'Bar',
            ]);
        }
        {
            const rhs: TypeAssertion = {
                name: 'Foo',
                typeName: 'Foo',
                kind: 'enum',
                values: [],
            };
            const ty = getType(schema, 'Foo');
            expect(ty).toEqual(rhs);
            expect(schema.get('Foo')?.exported).toEqual(true);
        }
        {
            const rhs: TypeAssertion = {
                name: 'Bar',
                typeName: 'Bar',
                kind: 'enum',
                values: [],
            };
            const ty = getType(schema, 'Bar');
            expect(ty).toEqual(rhs);
            expect(schema.get('Bar')?.exported).toEqual(false);
        }
    });
    it("compiler-doc-comments-1", function() {
        const schema = compile(`
            /* comment1 */
            export type Foo = string | number;
            /*
             * comment2
             */
            type Bar = string | number;
        `);

        {
            expect(Array.from(schema.keys())).toEqual([
                'Foo', 'Bar',
            ]);
        }
        {
            const rhs: TypeAssertion = {
                name: 'Foo',
                typeName: 'Foo',
                kind: 'one-of',
                oneOf: [{
                    kind: 'primitive',
                    primitiveName: 'string',
                }, {
                    kind: 'primitive',
                    primitiveName: 'number',
                }],
            };
            const ty = getType(schema, 'Foo');
            expect(ty).toEqual(rhs);
            expect(schema.get('Foo')?.exported).toEqual(true);
        }
        {
            const rhs: TypeAssertion = {
                name: 'Bar',
                typeName: 'Bar',
                kind: 'one-of',
                oneOf: [{
                    kind: 'primitive',
                    primitiveName: 'string',
                }, {
                    kind: 'primitive',
                    primitiveName: 'number',
                }],
            };
            const ty = getType(schema, 'Bar');
            expect(ty).toEqual(rhs);
            expect(schema.get('Bar')?.exported).toEqual(false);
        }
    });
    it("compiler-doc-comments-2", function() {
        const schema = compile(`
            /** comment1 */
            export type Foo = string | number;
            /**
             * comment2
             */
            type Bar = string | number;
        `);

        {
            expect(Array.from(schema.keys())).toEqual([
                'Foo', 'Bar',
            ]);
        }
        {
            const rhs: TypeAssertion = {
                name: 'Foo',
                typeName: 'Foo',
                kind: 'one-of',
                oneOf: [{
                    kind: 'primitive',
                    primitiveName: 'string',
                }, {
                    kind: 'primitive',
                    primitiveName: 'number',
                }],
                docComment: 'comment1',
            };
            const ty = getType(schema, 'Foo');
            expect(ty).toEqual(rhs);
            expect(schema.get('Foo')?.exported).toEqual(true);
        }
        {
            const rhs: TypeAssertion = {
                name: 'Bar',
                typeName: 'Bar',
                kind: 'one-of',
                oneOf: [{
                    kind: 'primitive',
                    primitiveName: 'string',
                }, {
                    kind: 'primitive',
                    primitiveName: 'number',
                }],
                docComment: '* comment2',
            };
            const ty = getType(schema, 'Bar');
            expect(ty).toEqual(rhs);
            expect(schema.get('Bar')?.exported).toEqual(false);
        }
    });
    it("compiler-doc-comments-3", function() {
        const schema = compile(`
            /** comment X */
            type X = string;
            /** comment Foo */
            export interface Foo {
                /** comment Foo.a */
                a: number;
                /** comment Foo.b */
                b: X;
                c: X;
                /** comment Foo.d */
                d: string;
                /** comment Foo.propNames */
                [propNames: string]: string;
            }
            /** comment Bar */
            interface Bar extends Foo {
                /** comment Bar.e */
                e: number;
                /** comment Bar.propNames */
                [propNames: number]: number;
            }
        `);

        {
            expect(Array.from(schema.keys())).toEqual([
                'X', 'Foo', 'Bar',
            ]);
        }
        {
            const rhs: TypeAssertion = {
                name: 'X',
                typeName: 'X',
                kind: 'primitive',
                primitiveName: 'string',
                docComment: 'comment X',
            };
            const ty = getType(schema, 'X');
            expect(ty).toEqual(rhs);
            expect(schema.get('X')?.exported).toEqual(false);
        }
        {
            const rhs: TypeAssertion = {
                name: 'Foo',
                typeName: 'Foo',
                kind: 'object',
                members: [
                    ['a',
                        {name: 'a', kind: 'primitive', primitiveName: 'number'},
                        false, 'comment Foo.a',
                    ],
                    ['b',
                        {name: 'b', typeName: 'X', kind: 'primitive', primitiveName: 'string', docComment: 'comment X'},
                        false, 'comment Foo.b',
                    ],
                    ['c',
                        {name: 'c', typeName: 'X', kind: 'primitive', primitiveName: 'string', docComment: 'comment X'},
                    ],
                    ['d',
                        {name: 'd', kind: 'primitive', primitiveName: 'string'},
                        false, 'comment Foo.d',
                    ],
                ],
                additionalProps: [
                    [['string'], {kind: 'primitive', primitiveName: 'string'}, false, 'comment Foo.propNames'],
                ],
                docComment: 'comment Foo',
            };
            const ty = getType(schema, 'Foo');
            expect(ty).toEqual(rhs);
            expect(schema.get('Foo')?.exported).toEqual(true);
        }
        {
            const rhs: TypeAssertion = {
                name: 'Bar',
                typeName: 'Bar',
                kind: 'object',
                members: [
                    ['e',
                        {name: 'e', kind: 'primitive', primitiveName: 'number'},
                        false, 'comment Bar.e',
                    ],
                    ['a',
                        {name: 'a', kind: 'primitive', primitiveName: 'number'},
                        true, 'comment Foo.a',
                    ],
                    ['b',
                        {name: 'b', typeName: 'X', kind: 'primitive', primitiveName: 'string', docComment: 'comment X'},
                        true, 'comment Foo.b',
                    ],
                    ['c',
                        {name: 'c', typeName: 'X', kind: 'primitive', primitiveName: 'string', docComment: 'comment X'},
                        true,
                    ],
                    ['d',
                        {name: 'd', kind: 'primitive', primitiveName: 'string'},
                        true, 'comment Foo.d',
                    ],
                ],
                additionalProps: [
                    [['string'], {kind: 'primitive', primitiveName: 'string'}, true, 'comment Foo.propNames'],
                    [['number'], {kind: 'primitive', primitiveName: 'number'}, false, 'comment Bar.propNames'], // TODO: concat order
                ],
                baseTypes: [getType(schema, 'Foo') as any],
                docComment: 'comment Bar',
            };
            const ty = getType(schema, 'Bar');
            expect(ty).toEqual(rhs);
            expect(schema.get('Bar')?.exported).toEqual(false);
        }
    });
    it("compiler-doc-comments-4", function() {
        const schema = compile(`
            /** comment Foo */
            export enum Foo {
                /** comment Foo.A */
                A,
                /** comment Foo.B */
                B = 'bbb',
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
                    ['A', 0, 'comment Foo.A'],
                    ['B', 'bbb', 'comment Foo.B'],
                ],
                docComment: 'comment Foo',
            };
            const ty = getType(schema, 'Foo');
            expect(ty).toEqual(rhs);
            expect(schema.get('Foo')?.exported).toEqual(true);
        }
    });
    it("compiler-array-length-1", function() {
        const schemas = [compile(`
            type X = string[3..5];
        `), compile(`
            type X = Array<string, 3..5>;
        `)];

        {
            expect(Array.from(schemas[0].keys())).toEqual([
                'X',
            ]);
            expect(Array.from(schemas[1].keys())).toEqual([
                'X',
            ]);
        }
        for (const schema of schemas) {
            {
                const rhs: TypeAssertion = {
                    name: 'X',
                    typeName: 'X',
                    kind: 'repeated',
                    min: 3,
                    max: 5,
                    repeated: {
                        kind: 'primitive',
                        primitiveName: 'string',
                    },
                };
                const ty = getType(schema, 'X');
                expect(ty).toEqual(rhs);
                expect(validate<any>([], ty)).toEqual(null);
                expect(validate<any>(['1'], ty)).toEqual(null);
                expect(validate<any>(['1', '2'], ty)).toEqual(null);
                expect(validate<any>(['1', '2', '3'], ty)).toEqual({value: ['1', '2', '3']});
                expect(validate<any>(['1', '2', '3', '4'], ty)).toEqual({value: ['1', '2', '3', '4']});
                expect(validate<any>(['1', '2', '3', '4', '5'], ty)).toEqual({value: ['1', '2', '3', '4', '5']});
                expect(validate<any>(['1', '2', '3', '4', '5', '6'], ty)).toEqual(null);
            }
        }
    });
    it("compiler-array-length-2", function() {
        const schemas = [compile(`
            type X = string[..5];
        `), compile(`
            type X = Array<string, ..5>;
        `)];

        {
            expect(Array.from(schemas[0].keys())).toEqual([
                'X',
            ]);
            expect(Array.from(schemas[1].keys())).toEqual([
                'X',
            ]);
        }
        for (const schema of schemas) {
            {
                const rhs: TypeAssertion = {
                    name: 'X',
                    typeName: 'X',
                    kind: 'repeated',
                    min: null,
                    max: 5,
                    repeated: {
                        kind: 'primitive',
                        primitiveName: 'string',
                    },
                };
                const ty = getType(schema, 'X');
                expect(ty).toEqual(rhs);
                expect(validate<any>([], ty)).toEqual({value: []});
                expect(validate<any>(['1'], ty)).toEqual({value: ['1']});
                expect(validate<any>(['1', '2'], ty)).toEqual({value: ['1', '2']});
                expect(validate<any>(['1', '2', '3'], ty)).toEqual({value: ['1', '2', '3']});
                expect(validate<any>(['1', '2', '3', '4'], ty)).toEqual({value: ['1', '2', '3', '4']});
                expect(validate<any>(['1', '2', '3', '4', '5'], ty)).toEqual({value: ['1', '2', '3', '4', '5']});
                expect(validate<any>(['1', '2', '3', '4', '5', '6'], ty)).toEqual(null);
            }
        }
    });
    it("compiler-array-length-3", function() {
        const schemas = [compile(`
            type X = string[3..];
        `), compile(`
            type X = Array<string, 3..>;
        `)];

        {
            expect(Array.from(schemas[0].keys())).toEqual([
                'X',
            ]);
            expect(Array.from(schemas[1].keys())).toEqual([
                'X',
            ]);
        }
        for (const schema of schemas) {
            {
                const rhs: TypeAssertion = {
                    name: 'X',
                    typeName: 'X',
                    kind: 'repeated',
                    min: 3,
                    max: null,
                    repeated: {
                        kind: 'primitive',
                        primitiveName: 'string',
                    },
                };
                const ty = getType(schema, 'X');
                expect(ty).toEqual(rhs);
                expect(validate<any>([], ty)).toEqual(null);
                expect(validate<any>(['1'], ty)).toEqual(null);
                expect(validate<any>(['1', '2'], ty)).toEqual(null);
                expect(validate<any>(['1', '2', '3'], ty)).toEqual({value: ['1', '2', '3']});
                expect(validate<any>(['1', '2', '3', '4'], ty)).toEqual({value: ['1', '2', '3', '4']});
                expect(validate<any>(['1', '2', '3', '4', '5'], ty)).toEqual({value: ['1', '2', '3', '4', '5']});
                expect(validate<any>(['1', '2', '3', '4', '5', '6'], ty)).toEqual({value: ['1', '2', '3', '4', '5', '6']});
            }
        }
    });
    it("compiler-array-length-4", function() {
        const schemas = [compile(`
            type X = string[];
        `), compile(`
            type X = Array<string>;
        `)];

        {
            expect(Array.from(schemas[0].keys())).toEqual([
                'X',
            ]);
            expect(Array.from(schemas[1].keys())).toEqual([
                'X',
            ]);
        }
        for (const schema of schemas) {
            {
                const rhs: TypeAssertion = {
                    name: 'X',
                    typeName: 'X',
                    kind: 'repeated',
                    min: null,
                    max: null,
                    repeated: {
                        kind: 'primitive',
                        primitiveName: 'string',
                    },
                };
                const ty = getType(schema, 'X');
                expect(ty).toEqual(rhs);
                expect(validate<any>([], ty)).toEqual({value: []});
                expect(validate<any>(['1'], ty)).toEqual({value: ['1']});
                expect(validate<any>(['1', '2'], ty)).toEqual({value: ['1', '2']});
                expect(validate<any>(['1', '2', '3'], ty)).toEqual({value: ['1', '2', '3']});
                expect(validate<any>(['1', '2', '3', '4'], ty)).toEqual({value: ['1', '2', '3', '4']});
                expect(validate<any>(['1', '2', '3', '4', '5'], ty)).toEqual({value: ['1', '2', '3', '4', '5']});
                expect(validate<any>(['1', '2', '3', '4', '5', '6'], ty)).toEqual({value: ['1', '2', '3', '4', '5', '6']});
            }
        }
    });
    it("compiler-spread-length-1", function() {
        const schemas = [compile(`
            type X = [number, ...<string, 3..5>, boolean];
        `)];

        {
            expect(Array.from(schemas[0].keys())).toEqual([
                'X',
            ]);
        }
        for (const schema of schemas) {
            {
                const rhs: TypeAssertion = {
                    name: 'X',
                    typeName: 'X',
                    kind: 'sequence',
                    sequence: [{
                        kind: 'primitive',
                        primitiveName: 'number',
                    }, {
                        kind: 'spread',
                        min: 3,
                        max: 5,
                        spread: {
                            kind: 'primitive',
                            primitiveName: 'string',
                        },
                    }, {
                        kind: 'primitive',
                        primitiveName: 'boolean',
                    }],
                };
                const ty = getType(schema, 'X');
                expect(ty).toEqual(rhs);
                expect(validate<any>([], ty)).toEqual(null);
                expect(validate<any>([0, false], ty)).toEqual(null);
                expect(validate<any>([0, '1', false], ty)).toEqual(null);
                expect(validate<any>([0, '1', '2', false], ty)).toEqual(null);
                expect(validate<any>([0, '1', '2', '3', false], ty)).toEqual({value: [0, '1', '2', '3', false]});
                expect(validate<any>([0, '1', '2', '3', '4', false], ty)).toEqual({value: [0, '1', '2', '3', '4', false]});
                expect(validate<any>([0, '1', '2', '3', '4', '5', false], ty)).toEqual({value: [0, '1', '2', '3', '4', '5', false]});
                expect(validate<any>([0, '1', '2', '3', '4', '5', '6', false], ty)).toEqual(null);
            }
        }
    });
    it("compiler-spread-length-2", function() {
        const schemas = [compile(`
            type X = [number, ...<string, ..5>, boolean];
        `)];

        {
            expect(Array.from(schemas[0].keys())).toEqual([
                'X',
            ]);
        }
        for (const schema of schemas) {
            {
                const rhs: TypeAssertion = {
                    name: 'X',
                    typeName: 'X',
                    kind: 'sequence',
                    sequence: [{
                        kind: 'primitive',
                        primitiveName: 'number',
                    }, {
                        kind: 'spread',
                        min: null,
                        max: 5,
                        spread: {
                            kind: 'primitive',
                            primitiveName: 'string',
                        },
                    }, {
                        kind: 'primitive',
                        primitiveName: 'boolean',
                    }],
                };
                const ty = getType(schema, 'X');
                expect(ty).toEqual(rhs);
                expect(validate<any>([], ty)).toEqual(null);
                expect(validate<any>([0, false], ty)).toEqual({value: [0, false]});
                expect(validate<any>([0, '1', false], ty)).toEqual({value: [0, '1', false]});
                expect(validate<any>([0, '1', '2', false], ty)).toEqual({value: [0, '1', '2', false]});
                expect(validate<any>([0, '1', '2', '3', false], ty)).toEqual({value: [0, '1', '2', '3', false]});
                expect(validate<any>([0, '1', '2', '3', '4', false], ty)).toEqual({value: [0, '1', '2', '3', '4', false]});
                expect(validate<any>([0, '1', '2', '3', '4', '5', false], ty)).toEqual({value: [0, '1', '2', '3', '4', '5', false]});
                expect(validate<any>([0, '1', '2', '3', '4', '5', '6', false], ty)).toEqual(null);
            }
        }
    });
    it("compiler-spread-length-3", function() {
        const schemas = [compile(`
            type X = [number, ...<string, 3..>, boolean];
        `)];

        {
            expect(Array.from(schemas[0].keys())).toEqual([
                'X',
            ]);
        }
        for (const schema of schemas) {
            {
                const rhs: TypeAssertion = {
                    name: 'X',
                    typeName: 'X',
                    kind: 'sequence',
                    sequence: [{
                        kind: 'primitive',
                        primitiveName: 'number',
                    }, {
                        kind: 'spread',
                        min: 3,
                        max: null,
                        spread: {
                            kind: 'primitive',
                            primitiveName: 'string',
                        },
                    }, {
                        kind: 'primitive',
                        primitiveName: 'boolean',
                    }],
                };
                const ty = getType(schema, 'X');
                expect(ty).toEqual(rhs);
                expect(validate<any>([], ty)).toEqual(null);
                expect(validate<any>([0, false], ty)).toEqual(null);
                expect(validate<any>([0, '1', false], ty)).toEqual(null);
                expect(validate<any>([0, '1', '2', false], ty)).toEqual(null);
                expect(validate<any>([0, '1', '2', '3', false], ty)).toEqual({value: [0, '1', '2', '3', false]});
                expect(validate<any>([0, '1', '2', '3', '4', false], ty)).toEqual({value: [0, '1', '2', '3', '4', false]});
                expect(validate<any>([0, '1', '2', '3', '4', '5', false], ty)).toEqual({value: [0, '1', '2', '3', '4', '5', false]});
                expect(validate<any>([0, '1', '2', '3', '4', '5', '6', false], ty)).toEqual({value: [0, '1', '2', '3', '4', '5', '6', false]});
            }
        }
    });
    it("compiler-spread-length-4", function() {
        const schemas = [compile(`
            type X = [number, ...<string>, boolean];
        `)];

        {
            expect(Array.from(schemas[0].keys())).toEqual([
                'X',
            ]);
        }
        for (const schema of schemas) {
            {
                const rhs: TypeAssertion = {
                    name: 'X',
                    typeName: 'X',
                    kind: 'sequence',
                    sequence: [{
                        kind: 'primitive',
                        primitiveName: 'number',
                    }, {
                        kind: 'spread',
                        min: null,
                        max: null,
                        spread: {
                            kind: 'primitive',
                            primitiveName: 'string',
                        },
                    }, {
                        kind: 'primitive',
                        primitiveName: 'boolean',
                    }],
                };
                const ty = getType(schema, 'X');
                expect(ty).toEqual(rhs);
                expect(validate<any>([], ty)).toEqual(null);
                expect(validate<any>([0, false], ty)).toEqual({value: [0, false]});
                expect(validate<any>([0, '1', false], ty)).toEqual({value: [0, '1', false]});
                expect(validate<any>([0, '1', '2', false], ty)).toEqual({value: [0, '1', '2', false]});
                expect(validate<any>([0, '1', '2', '3', false], ty)).toEqual({value: [0, '1', '2', '3', false]});
                expect(validate<any>([0, '1', '2', '3', '4', false], ty)).toEqual({value: [0, '1', '2', '3', '4', false]});
                expect(validate<any>([0, '1', '2', '3', '4', '5', false], ty)).toEqual({value: [0, '1', '2', '3', '4', '5', false]});
                expect(validate<any>([0, '1', '2', '3', '4', '5', '6', false], ty)).toEqual({value: [0, '1', '2', '3', '4', '5', '6', false]});
            }
        }
    });



    it("compiler-spread-length-5", function() {
        const schemas = [compile(`
            type X = [number, ...<string, 3..5>];
        `)];

        {
            expect(Array.from(schemas[0].keys())).toEqual([
                'X',
            ]);
        }
        for (const schema of schemas) {
            {
                const rhs: TypeAssertion = {
                    name: 'X',
                    typeName: 'X',
                    kind: 'sequence',
                    sequence: [{
                        kind: 'primitive',
                        primitiveName: 'number',
                    }, {
                        kind: 'spread',
                        min: 3,
                        max: 5,
                        spread: {
                            kind: 'primitive',
                            primitiveName: 'string',
                        },
                    }],
                };
                const ty = getType(schema, 'X');
                expect(ty).toEqual(rhs);
                expect(validate<any>([], ty)).toEqual(null);
                expect(validate<any>([0], ty)).toEqual(null);
                expect(validate<any>([0, '1'], ty)).toEqual(null);
                expect(validate<any>([0, '1', '2'], ty)).toEqual(null);
                expect(validate<any>([0, '1', '2', '3'], ty)).toEqual({value: [0, '1', '2', '3']});
                expect(validate<any>([0, '1', '2', '3', '4'], ty)).toEqual({value: [0, '1', '2', '3', '4']});
                expect(validate<any>([0, '1', '2', '3', '4', '5'], ty)).toEqual({value: [0, '1', '2', '3', '4', '5']});
                expect(validate<any>([0, '1', '2', '3', '4', '5', '6'], ty)).toEqual(null);
            }
        }
    });
    it("compiler-spread-length-6", function() {
        const schemas = [compile(`
            type X = [number, ...<string, ..5>];
        `)];

        {
            expect(Array.from(schemas[0].keys())).toEqual([
                'X',
            ]);
        }
        for (const schema of schemas) {
            {
                const rhs: TypeAssertion = {
                    name: 'X',
                    typeName: 'X',
                    kind: 'sequence',
                    sequence: [{
                        kind: 'primitive',
                        primitiveName: 'number',
                    }, {
                        kind: 'spread',
                        min: null,
                        max: 5,
                        spread: {
                            kind: 'primitive',
                            primitiveName: 'string',
                        },
                    }],
                };
                const ty = getType(schema, 'X');
                expect(ty).toEqual(rhs);
                expect(validate<any>([], ty)).toEqual(null);
                expect(validate<any>([0], ty)).toEqual({value: [0]});
                expect(validate<any>([0, '1'], ty)).toEqual({value: [0, '1']});
                expect(validate<any>([0, '1', '2'], ty)).toEqual({value: [0, '1', '2']});
                expect(validate<any>([0, '1', '2', '3'], ty)).toEqual({value: [0, '1', '2', '3']});
                expect(validate<any>([0, '1', '2', '3', '4'], ty)).toEqual({value: [0, '1', '2', '3', '4']});
                expect(validate<any>([0, '1', '2', '3', '4', '5'], ty)).toEqual({value: [0, '1', '2', '3', '4', '5']});
                expect(validate<any>([0, '1', '2', '3', '4', '5', '6'], ty)).toEqual(null);
            }
        }
    });
    it("compiler-spread-length-7", function() {
        const schemas = [compile(`
            type X = [number, ...<string, 3..>];
        `)];

        {
            expect(Array.from(schemas[0].keys())).toEqual([
                'X',
            ]);
        }
        for (const schema of schemas) {
            {
                const rhs: TypeAssertion = {
                    name: 'X',
                    typeName: 'X',
                    kind: 'sequence',
                    sequence: [{
                        kind: 'primitive',
                        primitiveName: 'number',
                    }, {
                        kind: 'spread',
                        min: 3,
                        max: null,
                        spread: {
                            kind: 'primitive',
                            primitiveName: 'string',
                        },
                    }],
                };
                const ty = getType(schema, 'X');
                expect(ty).toEqual(rhs);
                expect(validate<any>([], ty)).toEqual(null);
                expect(validate<any>([0], ty)).toEqual(null);
                expect(validate<any>([0, '1'], ty)).toEqual(null);
                expect(validate<any>([0, '1', '2'], ty)).toEqual(null);
                expect(validate<any>([0, '1', '2', '3'], ty)).toEqual({value: [0, '1', '2', '3']});
                expect(validate<any>([0, '1', '2', '3', '4'], ty)).toEqual({value: [0, '1', '2', '3', '4']});
                expect(validate<any>([0, '1', '2', '3', '4', '5'], ty)).toEqual({value: [0, '1', '2', '3', '4', '5']});
                expect(validate<any>([0, '1', '2', '3', '4', '5', '6'], ty)).toEqual({value: [0, '1', '2', '3', '4', '5', '6']});
            }
        }
    });
    it("compiler-spread-length-8", function() {
        const schemas = [compile(`
            type X = [number, ...<string>];
        `)];

        {
            expect(Array.from(schemas[0].keys())).toEqual([
                'X',
            ]);
        }
        for (const schema of schemas) {
            {
                const rhs: TypeAssertion = {
                    name: 'X',
                    typeName: 'X',
                    kind: 'sequence',
                    sequence: [{
                        kind: 'primitive',
                        primitiveName: 'number',
                    }, {
                        kind: 'spread',
                        min: null,
                        max: null,
                        spread: {
                            kind: 'primitive',
                            primitiveName: 'string',
                        },
                    }],
                };
                const ty = getType(schema, 'X');
                expect(ty).toEqual(rhs);
                expect(validate<any>([], ty)).toEqual(null);
                expect(validate<any>([0], ty)).toEqual({value: [0]});
                expect(validate<any>([0, '1'], ty)).toEqual({value: [0, '1']});
                expect(validate<any>([0, '1', '2'], ty)).toEqual({value: [0, '1', '2']});
                expect(validate<any>([0, '1', '2', '3'], ty)).toEqual({value: [0, '1', '2', '3']});
                expect(validate<any>([0, '1', '2', '3', '4'], ty)).toEqual({value: [0, '1', '2', '3', '4']});
                expect(validate<any>([0, '1', '2', '3', '4', '5'], ty)).toEqual({value: [0, '1', '2', '3', '4', '5']});
                expect(validate<any>([0, '1', '2', '3', '4', '5', '6'], ty)).toEqual({value: [0, '1', '2', '3', '4', '5', '6']});
            }
        }
    });
    // TODO: spread and '?' length
    // TODO: decorators
    // TODO: deep cherrypick and patch
    // TODO: error reporting
    // TODO: directives
    // TODO: import statement
});
