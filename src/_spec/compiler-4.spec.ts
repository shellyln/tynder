
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
                    [['number'], {kind: 'primitive', primitiveName: 'number'}, false, 'comment Bar.propNames'],
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
    // TODO: array length
    // TODO: spread and '?' length
    // TODO: decorators
    // TODO: deep cherrypick and patch
    // TODO: error reporting
    // TODO: directives
    // TODO: import statement
});
