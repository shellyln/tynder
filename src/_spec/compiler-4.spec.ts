
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
    // TODO: doc comments (+ extends)
    // TODO: array length
    // TODO: spread and '?' length
    // TODO: decorators
    // TODO: deep cherrypick and patch
    // TODO: error reporting
    // TODO: directives
    // TODO: import statement
});
