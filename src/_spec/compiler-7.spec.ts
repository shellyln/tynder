
import { TypeAssertion,
         ValidationContext } from '../types';
import { validate,
         getType }           from '../validator';
import { compile }           from '../compiler';
import { generateTypeScriptCode } from '../codegen';



describe("compiler-6", function() {
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
    // TODO: primitives (any, unknown, never)
    // TODO: deep cherrypick and patch
});
