
import { TypeAssertion,
         ValidationContext } from '../types';
import { validate,
         getType }           from '../validator';
import { compile }           from '../compiler';
import { generateTypeScriptCode } from '../codegen';



describe("compiler-7", function() {
    it("compiler-import-statement-1", function() {
        const schemas = [compile(`
            import from 'foo';
            import * as foo from 'foo';
            import {\na, b as bb} from 'foo';
        `)];

        {
            expect(Array.from(schemas[0].keys())).toEqual([
                '__$$$gensym_0$$$__',
                '__$$$gensym_1$$$__',
                '__$$$gensym_2$$$__',
            ]);
        }
        for (const schema of schemas) {
            {
                const rhs: TypeAssertion = {
                    kind: 'never',
                    passThruCodeBlock: `import from 'foo';`,
                };
                const ty = getType(schema, '__$$$gensym_0$$$__');
                expect(ty).toEqual(rhs);
            }
            {
                const rhs: TypeAssertion = {
                    kind: 'never',
                    passThruCodeBlock: `import * as foo from 'foo';`,
                };
                const ty = getType(schema, '__$$$gensym_1$$$__');
                expect(ty).toEqual(rhs);
            }
            {
                const rhs: TypeAssertion = {
                    kind: 'never',
                    passThruCodeBlock: `import {\na, b as bb} from 'foo';`,
                };
                const ty = getType(schema, '__$$$gensym_2$$$__');
                expect(ty).toEqual(rhs);
            }
            {
                expect(generateTypeScriptCode(schema).trim()).toEqual(
                    `import from 'foo';\n\n` +
                    `import * as foo from 'foo';\n\n` +
                    `import {\na, b as bb} from 'foo';`
                );
            }
        }
    });
    it("compiler-directives-1", function() {
        const schemas = [compile(`
            /// @tynder-external P, Q, R
            // @tynder-external S

            type X = Q;
            interface Y { a: R; }
        `), compile(`
            external P, Q, R;
            external S;

            type X = Q;
            interface Y { a: R; }
        `)];

        {
            expect(Array.from(schemas[0].keys())).toEqual([
                'P', 'Q', 'R', 'S', 'X', 'Y',
            ]);
            expect(Array.from(schemas[1].keys())).toEqual([
                'P', 'Q', 'R', 'S', 'X', 'Y',
            ]);
        }
        for (const schema of schemas) {
            {
                const rhs: TypeAssertion = {
                    name: 'P',
                    typeName: 'P',
                    kind: 'any',
                    noOutput: true,
                };
                const ty = getType(schema, 'P');
                expect(ty).toEqual(rhs);
                expect(validate<any>(3, ty)).toEqual({value: 3});
            }
            {
                const rhs: TypeAssertion = {
                    name: 'X',
                    typeName: 'X',
                    kind: 'any',
                };
                const ty = getType(schema, 'X');
                expect(ty).toEqual(rhs);
                expect(validate<any>(3, ty)).toEqual({value: 3});
            }
            {
                const rhs: TypeAssertion = {
                    name: 'Y',
                    typeName: 'Y',
                    kind: 'object',
                    members: [['a', {
                        name: 'a',
                        typeName: 'R',
                        kind: 'any',
                    }]],
                };
                const ty = getType(schema, 'Y');
                expect(ty).toEqual(rhs);
                expect(validate<any>({a: 3}, ty)).toEqual({value: {a: 3}});
                expect(validate<any>({b: 3}, ty)).toEqual(null);
            }
        }
    });
    it("compiler-primitive", function() {
        const schema = compile(`
            type FooA = any;
            type FooB = unknown;
            type FooC = never;
        `);

        {
            expect(Array.from(schema.keys())).toEqual([
                'FooA', 'FooB', 'FooC',
            ]);
        }
        {
            const rhs: TypeAssertion = {
                name: 'FooA',
                typeName: 'FooA',
                kind: 'any',
            };
            const ty = getType(schema, 'FooA');
            expect(ty).toEqual(rhs);
            expect(validate<any>(0, ty)).toEqual({value: 0});
            expect(validate<any>(1, ty)).toEqual({value: 1});
            expect(validate<any>(BigInt(0), ty)).toEqual({value: BigInt(0)});
            expect(validate<any>(BigInt(1), ty)).toEqual({value: BigInt(1)});
            expect(validate<any>('', ty)).toEqual({value: ''});
            expect(validate<any>('1', ty)).toEqual({value: '1'});
            expect(validate<any>(false, ty)).toEqual({value: false});
            expect(validate<any>(true, ty)).toEqual({value: true});
            expect(validate<any>(null, ty)).toEqual({value: null});
            expect(validate<any>(void 0, ty)).toEqual({value: void 0});
            expect(validate<any>({}, ty)).toEqual({value: {}});
            expect(validate<any>([], ty)).toEqual({value: []});
            expect(validate<any>(3, ty)).toEqual({value: 3});
            expect(validate<any>(BigInt(7), ty)).toEqual({value: BigInt(7)});
            expect(validate<any>('XB', ty)).toEqual({value: 'XB'});
            expect(validate<any>(true, ty)).toEqual({value: true});
        }
        {
            const rhs: TypeAssertion = {
                name: 'FooB',
                typeName: 'FooB',
                kind: 'unknown',
            };
            const ty = getType(schema, 'FooB');
            expect(ty).toEqual(rhs);
            expect(validate<any>(0, ty)).toEqual({value: 0});
            expect(validate<any>(1, ty)).toEqual({value: 1});
            expect(validate<any>(BigInt(0), ty)).toEqual({value: BigInt(0)});
            expect(validate<any>(BigInt(1), ty)).toEqual({value: BigInt(1)});
            expect(validate<any>('', ty)).toEqual({value: ''});
            expect(validate<any>('1', ty)).toEqual({value: '1'});
            expect(validate<any>(false, ty)).toEqual({value: false});
            expect(validate<any>(true, ty)).toEqual({value: true});
            expect(validate<any>(null, ty)).toEqual(null);
            expect(validate<any>(void 0, ty)).toEqual(null);
            expect(validate<any>({}, ty)).toEqual({value: {}});
            expect(validate<any>([], ty)).toEqual({value: []});
            expect(validate<any>(3, ty)).toEqual({value: 3});
            expect(validate<any>(BigInt(7), ty)).toEqual({value: BigInt(7)});
            expect(validate<any>('XB', ty)).toEqual({value: 'XB'});
            expect(validate<any>(true, ty)).toEqual({value: true});
        }
        {
            const rhs: TypeAssertion = {
                name: 'FooC',
                typeName: 'FooC',
                kind: 'never',
            };
            const ty = getType(schema, 'FooC');
            expect(ty).toEqual(rhs);
            expect(validate<string>(0, ty)).toEqual(null);
            expect(validate<string>(1, ty)).toEqual(null);
            expect(validate<string>(BigInt(0), ty)).toEqual(null);
            expect(validate<string>(BigInt(1), ty)).toEqual(null);
            expect(validate<string>('', ty)).toEqual(null);
            expect(validate<string>('1', ty)).toEqual(null);
            expect(validate<string>(false, ty)).toEqual(null);
            expect(validate<string>(true, ty)).toEqual(null);
            expect(validate<string>(null, ty)).toEqual(null);
            expect(validate<string>(void 0, ty)).toEqual(null);
            expect(validate<string>({}, ty)).toEqual(null);
            expect(validate<string>([], ty)).toEqual(null);
            expect(validate<string>(3, ty)).toEqual(null);
            expect(validate<string>(BigInt(7), ty)).toEqual(null);
            expect(validate<string>('XB', ty)).toEqual(null);
            expect(validate<string>(true, ty)).toEqual(null);
        }
    });
    // TODO: primitives (any, unknown, never)
    // TODO: deep cherrypick and patch
});
