
import { TypeAssertion,
         ValidationContext,
         SerializedSchemaInfo }     from '../types';
import { validate,
         getType }                  from '../validator';
import { pick,
         patch }                    from '../picker';
import { compile }                  from '../compiler';
import { generateJsonSchemaObject } from '../codegen';
import { TynderSchemaVersion,
         serializeToObject,
         serialize,
         deserializeFromObject,
         deserialize }              from '../serializer';
import * as op                      from '../operators';



describe("compiler", function() {
    it("compiler-primitive", function() {
        const schema = compile(`
            type FooA = number;
            type FooB = bigint;
            type FooC = string;
            type FooD = boolean;
            type FooE = null;
            type FooF = undefined;
        `);

        {
            expect(Array.from(schema.keys())).toEqual([
                'FooA', 'FooB', 'FooC', 'FooD', 'FooE', 'FooF',
            ]);
        }
        {
            const rhs: TypeAssertion = {
                name: 'FooA',
                typeName: 'FooA',
                kind: 'primitive',
                primitiveName: 'number',
            };
            const ty = getType(schema, 'FooA');
            expect(ty).toEqual(rhs);
            expect(validate<number>(0, ty)).toEqual({value: 0});
            expect(validate<number>(1, ty)).toEqual({value: 1});
            expect(validate<number>(BigInt(0), ty)).toEqual(null);
            expect(validate<number>(BigInt(1), ty)).toEqual(null);
            expect(validate<number>('', ty)).toEqual(null);
            expect(validate<number>('1', ty)).toEqual(null);
            expect(validate<number>(false, ty)).toEqual(null);
            expect(validate<number>(true, ty)).toEqual(null);
            expect(validate<number>(null, ty)).toEqual(null);
            expect(validate<number>(void 0, ty)).toEqual(null);
            expect(validate<number>({}, ty)).toEqual(null);
            expect(validate<number>([], ty)).toEqual(null);
        }
        {
            const rhs: TypeAssertion = {
                name: 'FooB',
                typeName: 'FooB',
                kind: 'primitive',
                primitiveName: 'bigint',
            };
            const ty = getType(schema, 'FooB');
            expect(ty).toEqual(rhs);
            expect(validate<BigInt>(0, ty)).toEqual(null);
            expect(validate<BigInt>(1, ty)).toEqual(null);
            expect(validate<BigInt>(BigInt(0), ty)).toEqual({value: BigInt(0)});
            expect(validate<BigInt>(BigInt(1), ty)).toEqual({value: BigInt(1)});
            expect(validate<BigInt>('', ty)).toEqual(null);
            expect(validate<BigInt>('1', ty)).toEqual(null);
            expect(validate<BigInt>(false, ty)).toEqual(null);
            expect(validate<BigInt>(true, ty)).toEqual(null);
            expect(validate<BigInt>(null, ty)).toEqual(null);
            expect(validate<BigInt>(void 0, ty)).toEqual(null);
            expect(validate<number>({}, ty)).toEqual(null);
            expect(validate<number>([], ty)).toEqual(null);
        }
        {
            const rhs: TypeAssertion = {
                name: 'FooC',
                typeName: 'FooC',
                kind: 'primitive',
                primitiveName: 'string',
            };
            const ty = getType(schema, 'FooC');
            expect(ty).toEqual(rhs);
            expect(validate<string>(0, ty)).toEqual(null);
            expect(validate<string>(1, ty)).toEqual(null);
            expect(validate<string>(BigInt(0), ty)).toEqual(null);
            expect(validate<string>(BigInt(1), ty)).toEqual(null);
            expect(validate<string>('', ty)).toEqual({value: ''});
            expect(validate<string>('1', ty)).toEqual({value: '1'});
            expect(validate<string>(false, ty)).toEqual(null);
            expect(validate<string>(true, ty)).toEqual(null);
            expect(validate<string>(null, ty)).toEqual(null);
            expect(validate<string>(void 0, ty)).toEqual(null);
            expect(validate<number>({}, ty)).toEqual(null);
            expect(validate<number>([], ty)).toEqual(null);
        }
        {
            const rhs: TypeAssertion = {
                name: 'FooD',
                typeName: 'FooD',
                kind: 'primitive',
                primitiveName: 'boolean',
            };
            const ty = getType(schema, 'FooD');
            expect(ty).toEqual(rhs);
            expect(validate<boolean>(0, ty)).toEqual(null);
            expect(validate<boolean>(1, ty)).toEqual(null);
            expect(validate<boolean>(BigInt(0), ty)).toEqual(null);
            expect(validate<boolean>(BigInt(1), ty)).toEqual(null);
            expect(validate<boolean>('', ty)).toEqual(null);
            expect(validate<boolean>('1', ty)).toEqual(null);
            expect(validate<boolean>(false, ty)).toEqual({value: false});
            expect(validate<boolean>(true, ty)).toEqual({value: true});
            expect(validate<boolean>(null, ty)).toEqual(null);
            expect(validate<boolean>(void 0, ty)).toEqual(null);
            expect(validate<number>({}, ty)).toEqual(null);
            expect(validate<number>([], ty)).toEqual(null);
        }
        {
            const rhs: TypeAssertion = {
                name: 'FooE',
                typeName: 'FooE',
                kind: 'primitive',
                primitiveName: 'null',
            };
            const ty = getType(schema, 'FooE');
            expect(ty).toEqual(rhs);
            expect(validate<null>(0, ty)).toEqual(null);
            expect(validate<null>(1, ty)).toEqual(null);
            expect(validate<null>(BigInt(0), ty)).toEqual(null);
            expect(validate<null>(BigInt(1), ty)).toEqual(null);
            expect(validate<null>('', ty)).toEqual(null);
            expect(validate<null>('1', ty)).toEqual(null);
            expect(validate<null>(false, ty)).toEqual(null);
            expect(validate<null>(true, ty)).toEqual(null);
            expect(validate<null>(null, ty)).toEqual({value: null});
            expect(validate<null>(void 0, ty)).toEqual(null);
            expect(validate<number>({}, ty)).toEqual(null);
            expect(validate<number>([], ty)).toEqual(null);
        }
        {
            const rhs: TypeAssertion = {
                name: 'FooF',
                typeName: 'FooF',
                kind: 'primitive',
                primitiveName: 'undefined',
            };
            const ty = getType(schema, 'FooF');
            expect(ty).toEqual(rhs);
            expect(validate<undefined>(0, ty)).toEqual(null);
            expect(validate<undefined>(1, ty)).toEqual(null);
            expect(validate<undefined>(BigInt(0), ty)).toEqual(null);
            expect(validate<undefined>(BigInt(1), ty)).toEqual(null);
            expect(validate<undefined>('', ty)).toEqual(null);
            expect(validate<undefined>('1', ty)).toEqual(null);
            expect(validate<undefined>(false, ty)).toEqual(null);
            expect(validate<undefined>(true, ty)).toEqual(null);
            expect(validate<undefined>(null, ty)).toEqual(null);
            expect(validate<undefined>(void 0, ty)).toEqual({value: void 0});
            expect(validate<number>({}, ty)).toEqual(null);
            expect(validate<number>([], ty)).toEqual(null);
        }
    });
});
