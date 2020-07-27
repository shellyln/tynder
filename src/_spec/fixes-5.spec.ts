
import { TypeAssertion,
         ValidationContext } from '../types';
import { validate,
         isType,
         assertType,
         getType }           from '../validator';
import { pick,
         patch }             from '../picker';
import { compile }           from '../compiler';
import { generateTypeScriptCode } from '../codegen';
import { serialize,
         deserialize,
         deserializeFromObject } from '../serializer';
import { stereotypes as dateStereotypes } from '../stereotypes/date';
import { constraints as uniqueConstraints } from '../constraints/unique';
import  primitivesSchema,
       { Schema as PrimitivesSchema } from '../../examples/schema/_compiled/primitives';



describe("fix-5", function() {
    it("unique-1", function() {
        const ty = getType(deserializeFromObject(primitivesSchema), PrimitivesSchema.NumberType);
        expect(ty).toEqual({
            kind: 'primitive',
            primitiveName: 'number',
            typeName: 'NumberType',
            name: 'NumberType',
        });
    });

    it("empty-string-literal-1", function() {
        const schemas = [compile(`
            type A = '';
            type B = 'a';
        `), compile(`
            type A = "";
            type B = "a";
        `), compile(`
            type A = \`\`;
            type B = \`a\`;
        `)];
        for (const schema of schemas) {
            {
                expect(Array.from(schema.keys())).toEqual([
                    'A', 'B',
                ]);
            }
            for (const ty of [getType(deserialize(serialize(schema)), 'A'), getType(schema, 'A')]) {
                const rhs: TypeAssertion = {
                    name: 'A',
                    typeName: 'A',
                    kind: 'primitive-value',
                    value: '',
                };
                expect(ty).toEqual(rhs);
                expect(validate<string>(0, ty)).toEqual(null);
                expect(validate<string>(1, ty)).toEqual(null);
                expect(validate<string>(1.1, ty)).toEqual(null);
                expect(validate<string>(BigInt(0), ty)).toEqual(null);
                expect(validate<string>(BigInt(1), ty)).toEqual(null);
                expect(validate<string>('', ty)).toEqual({value: ''});
                expect(validate<string>('a', ty)).toEqual(null);
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
            for (const ty of [getType(deserialize(serialize(schema)), 'B'), getType(schema, 'B')]) {
                const rhs: TypeAssertion = {
                    name: 'B',
                    typeName: 'B',
                    kind: 'primitive-value',
                    value: 'a',
                };
                expect(ty).toEqual(rhs);
                expect(validate<string>(0, ty)).toEqual(null);
                expect(validate<string>(1, ty)).toEqual(null);
                expect(validate<string>(1.1, ty)).toEqual(null);
                expect(validate<string>(BigInt(0), ty)).toEqual(null);
                expect(validate<string>(BigInt(1), ty)).toEqual(null);
                expect(validate<string>('', ty)).toEqual(null);
                expect(validate<string>('a', ty)).toEqual({value: 'a'});
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
        }
    });
});
