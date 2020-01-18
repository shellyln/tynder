
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
            type BarA = 3;
            type BarB = 7n;
            type BarC = 'XB';
            type BarD = true;
        `);

        {
            expect(Array.from(schema.keys())).toEqual([
                'FooA', 'FooB', 'FooC', 'FooD', 'FooE', 'FooF', 'BarA', 'BarB', 'BarC', 'BarD',
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
            expect(validate<number>(3, ty)).toEqual({value: 3});
            expect(validate<number>(BigInt(7), ty)).toEqual(null);
            expect(validate<number>('XB', ty)).toEqual(null);
            expect(validate<number>(true, ty)).toEqual(null);
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
            expect(validate<BigInt>({}, ty)).toEqual(null);
            expect(validate<BigInt>([], ty)).toEqual(null);
            expect(validate<BigInt>(3, ty)).toEqual(null);
            expect(validate<BigInt>(BigInt(7), ty)).toEqual({value: BigInt(7)});
            expect(validate<BigInt>('XB', ty)).toEqual(null);
            expect(validate<BigInt>(true, ty)).toEqual(null);
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
            expect(validate<string>({}, ty)).toEqual(null);
            expect(validate<string>([], ty)).toEqual(null);
            expect(validate<string>(3, ty)).toEqual(null);
            expect(validate<string>(BigInt(7), ty)).toEqual(null);
            expect(validate<string>('XB', ty)).toEqual({value: 'XB'});
            expect(validate<string>(true, ty)).toEqual(null);
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
            expect(validate<boolean>({}, ty)).toEqual(null);
            expect(validate<boolean>([], ty)).toEqual(null);
            expect(validate<boolean>(3, ty)).toEqual(null);
            expect(validate<boolean>(BigInt(7), ty)).toEqual(null);
            expect(validate<boolean>('XB', ty)).toEqual(null);
            expect(validate<boolean>(true, ty)).toEqual({value: true});
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
            expect(validate<null>({}, ty)).toEqual(null);
            expect(validate<null>([], ty)).toEqual(null);
            expect(validate<null>(3, ty)).toEqual(null);
            expect(validate<null>(BigInt(7), ty)).toEqual(null);
            expect(validate<null>('XB', ty)).toEqual(null);
            expect(validate<null>(true, ty)).toEqual(null);
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
            expect(validate<undefined>({}, ty)).toEqual(null);
            expect(validate<undefined>([], ty)).toEqual(null);
            expect(validate<undefined>(3, ty)).toEqual(null);
            expect(validate<undefined>(BigInt(7), ty)).toEqual(null);
            expect(validate<undefined>('XB', ty)).toEqual(null);
            expect(validate<undefined>(true, ty)).toEqual(null);
        }
        {
            const rhs: TypeAssertion = {
                name: 'BarA',
                typeName: 'BarA',
                kind: 'primitive-value',
                value: 3,
            };
            const ty = getType(schema, 'BarA');
            expect(ty).toEqual(rhs);
            expect(validate<number>(0, ty)).toEqual(null);
            expect(validate<number>(1, ty)).toEqual(null);
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
            expect(validate<number>(3, ty)).toEqual({value: 3});
            expect(validate<number>(BigInt(7), ty)).toEqual(null);
            expect(validate<number>('XB', ty)).toEqual(null);
            expect(validate<number>(true, ty)).toEqual(null);
        }
        {
            const rhs: TypeAssertion = {
                name: 'BarB',
                typeName: 'BarB',
                kind: 'primitive-value',
                value: BigInt(7),
            };
            const ty = getType(schema, 'BarB');
            expect(ty).toEqual(rhs);
            expect(validate<BigInt>(0, ty)).toEqual(null);
            expect(validate<BigInt>(1, ty)).toEqual(null);
            expect(validate<BigInt>(BigInt(0), ty)).toEqual(null);
            expect(validate<BigInt>(BigInt(1), ty)).toEqual(null);
            expect(validate<BigInt>('', ty)).toEqual(null);
            expect(validate<BigInt>('1', ty)).toEqual(null);
            expect(validate<BigInt>(false, ty)).toEqual(null);
            expect(validate<BigInt>(true, ty)).toEqual(null);
            expect(validate<BigInt>(null, ty)).toEqual(null);
            expect(validate<BigInt>(void 0, ty)).toEqual(null);
            expect(validate<BigInt>({}, ty)).toEqual(null);
            expect(validate<BigInt>([], ty)).toEqual(null);
            expect(validate<BigInt>(3, ty)).toEqual(null);
            expect(validate<BigInt>(BigInt(7), ty)).toEqual({value: BigInt(7)});
            expect(validate<BigInt>('XB', ty)).toEqual(null);
            expect(validate<BigInt>(true, ty)).toEqual(null);
        }
        {
            const rhs: TypeAssertion = {
                name: 'BarC',
                typeName: 'BarC',
                kind: 'primitive-value',
                value: 'XB',
            };
            const ty = getType(schema, 'BarC');
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
            expect(validate<string>('XB', ty)).toEqual({value: 'XB'});
            expect(validate<string>(true, ty)).toEqual(null);
        }
        {
            const rhs: TypeAssertion = {
                name: 'BarD',
                typeName: 'BarD',
                kind: 'primitive-value',
                value: true,
            };
            const ty = getType(schema, 'BarD');
            expect(ty).toEqual(rhs);
            expect(validate<boolean>(0, ty)).toEqual(null);
            expect(validate<boolean>(1, ty)).toEqual(null);
            expect(validate<boolean>(BigInt(0), ty)).toEqual(null);
            expect(validate<boolean>(BigInt(1), ty)).toEqual(null);
            expect(validate<boolean>('', ty)).toEqual(null);
            expect(validate<boolean>('1', ty)).toEqual(null);
            expect(validate<boolean>(false, ty)).toEqual(null);
            expect(validate<boolean>(true, ty)).toEqual({value: true});
            expect(validate<boolean>(null, ty)).toEqual(null);
            expect(validate<boolean>(void 0, ty)).toEqual(null);
            expect(validate<boolean>({}, ty)).toEqual(null);
            expect(validate<boolean>([], ty)).toEqual(null);
            expect(validate<boolean>(3, ty)).toEqual(null);
            expect(validate<boolean>(BigInt(7), ty)).toEqual(null);
            expect(validate<boolean>('XB', ty)).toEqual(null);
            expect(validate<boolean>(true, ty)).toEqual({value: true});
        }
    });
    it("compiler-array-of-primitive", function() {
        const schemas = [compile(`
            type FooA = number[];
            type FooB = bigint[];
            type FooC = string[];
            type FooD = boolean[];
            type FooE = null[];
            type FooF = undefined[];
            type BarA = 3[];
            type BarB = 7n[];
            type BarC = 'XB'[];
            type BarD = true[];
        `), compile(`
            type FooA = Array<number>;
            type FooB = Array<bigint>;
            type FooC = Array<string>;
            type FooD = Array<boolean>;
            type FooE = Array<null>;
            type FooF = Array<undefined>;
            type BarA = Array<3>;
            type BarB = Array<7n>;
            type BarC = Array<'XB'>;
            type BarD = Array<true>;
        `)];

        for (const schema of schemas) {
            {
                expect(Array.from(schema.keys())).toEqual([
                    'FooA', 'FooB', 'FooC', 'FooD', 'FooE', 'FooF', 'BarA', 'BarB', 'BarC', 'BarD',
                ]);
            }
            {
                const rhs: TypeAssertion = {
                    name: 'FooA',
                    typeName: 'FooA',
                    kind: 'repeated',
                    min: null,
                    max: null,
                    repeated: {
                        kind: 'primitive',
                        primitiveName: 'number',
                    },
                };
                const ty = getType(schema, 'FooA');
                expect(ty).toEqual(rhs);
                expect(validate<any>(0, ty)).toEqual(null);
                expect(validate<any>(1, ty)).toEqual(null);
                expect(validate<any>(BigInt(0), ty)).toEqual(null);
                expect(validate<any>(BigInt(1), ty)).toEqual(null);
                expect(validate<any>('', ty)).toEqual(null);
                expect(validate<any>('1', ty)).toEqual(null);
                expect(validate<any>(false, ty)).toEqual(null);
                expect(validate<any>(true, ty)).toEqual(null);
                expect(validate<any>(null, ty)).toEqual(null);
                expect(validate<any>(void 0, ty)).toEqual(null);
                expect(validate<any>({}, ty)).toEqual(null);
                expect(validate<any>([], ty)).toEqual({value: []});
                expect(validate<any>([0], ty)).toEqual({value: [0]});
                expect(validate<any>([BigInt(0)], ty)).toEqual(null);
                expect(validate<any>([''], ty)).toEqual(null);
                expect(validate<any>([false], ty)).toEqual(null);
                expect(validate<any>([null], ty)).toEqual(null);
                expect(validate<any>([void 0], ty)).toEqual(null);
                expect(validate<any>([3], ty)).toEqual({value: [3]});
                expect(validate<any>([BigInt(7)], ty)).toEqual(null);
                expect(validate<any>(['XB'], ty)).toEqual(null);
                expect(validate<any>([true], ty)).toEqual(null);
            }
            {
                const rhs: TypeAssertion = {
                    name: 'FooB',
                    typeName: 'FooB',
                    kind: 'repeated',
                    min: null,
                    max: null,
                    repeated: {
                        kind: 'primitive',
                        primitiveName: 'bigint',
                    },
                };
                const ty = getType(schema, 'FooB');
                expect(ty).toEqual(rhs);
                expect(validate<any>(0, ty)).toEqual(null);
                expect(validate<any>(1, ty)).toEqual(null);
                expect(validate<any>(BigInt(0), ty)).toEqual(null);
                expect(validate<any>(BigInt(1), ty)).toEqual(null);
                expect(validate<any>('', ty)).toEqual(null);
                expect(validate<any>('1', ty)).toEqual(null);
                expect(validate<any>(false, ty)).toEqual(null);
                expect(validate<any>(true, ty)).toEqual(null);
                expect(validate<any>(null, ty)).toEqual(null);
                expect(validate<any>(void 0, ty)).toEqual(null);
                expect(validate<any>({}, ty)).toEqual(null);
                expect(validate<any>([], ty)).toEqual({value: []});
                expect(validate<any>([0], ty)).toEqual(null);
                expect(validate<any>([BigInt(0)], ty)).toEqual({value: [BigInt(0)]});
                expect(validate<any>([''], ty)).toEqual(null);
                expect(validate<any>([false], ty)).toEqual(null);
                expect(validate<any>([null], ty)).toEqual(null);
                expect(validate<any>([void 0], ty)).toEqual(null);
                expect(validate<any>([3], ty)).toEqual(null);
                expect(validate<any>([BigInt(7)], ty)).toEqual({value: [BigInt(7)]});
                expect(validate<any>(['XB'], ty)).toEqual(null);
                expect(validate<any>([true], ty)).toEqual(null);
            }
            {
                const rhs: TypeAssertion = {
                    name: 'FooC',
                    typeName: 'FooC',
                    kind: 'repeated',
                    min: null,
                    max: null,
                    repeated: {
                        kind: 'primitive',
                        primitiveName: 'string',
                    },
                };
                const ty = getType(schema, 'FooC');
                expect(ty).toEqual(rhs);
                expect(validate<any>(0, ty)).toEqual(null);
                expect(validate<any>(1, ty)).toEqual(null);
                expect(validate<any>(BigInt(0), ty)).toEqual(null);
                expect(validate<any>(BigInt(1), ty)).toEqual(null);
                expect(validate<any>('', ty)).toEqual(null);
                expect(validate<any>('1', ty)).toEqual(null);
                expect(validate<any>(false, ty)).toEqual(null);
                expect(validate<any>(true, ty)).toEqual(null);
                expect(validate<any>(null, ty)).toEqual(null);
                expect(validate<any>(void 0, ty)).toEqual(null);
                expect(validate<any>({}, ty)).toEqual(null);
                expect(validate<any>([], ty)).toEqual({value: []});
                expect(validate<any>([0], ty)).toEqual(null);
                expect(validate<any>([BigInt(0)], ty)).toEqual(null);
                expect(validate<any>([''], ty)).toEqual({value: ['']});
                expect(validate<any>([false], ty)).toEqual(null);
                expect(validate<any>([null], ty)).toEqual(null);
                expect(validate<any>([void 0], ty)).toEqual(null);
                expect(validate<any>([3], ty)).toEqual(null);
                expect(validate<any>([BigInt(7)], ty)).toEqual(null);
                expect(validate<any>(['XB'], ty)).toEqual({value: ['XB']});
                expect(validate<any>([true], ty)).toEqual(null);
            }
            {
                const rhs: TypeAssertion = {
                    name: 'FooD',
                    typeName: 'FooD',
                    kind: 'repeated',
                    min: null,
                    max: null,
                    repeated: {
                        kind: 'primitive',
                        primitiveName: 'boolean',
                    },
                };
                const ty = getType(schema, 'FooD');
                expect(ty).toEqual(rhs);
                expect(validate<any>(0, ty)).toEqual(null);
                expect(validate<any>(1, ty)).toEqual(null);
                expect(validate<any>(BigInt(0), ty)).toEqual(null);
                expect(validate<any>(BigInt(1), ty)).toEqual(null);
                expect(validate<any>('', ty)).toEqual(null);
                expect(validate<any>('1', ty)).toEqual(null);
                expect(validate<any>(false, ty)).toEqual(null);
                expect(validate<any>(true, ty)).toEqual(null);
                expect(validate<any>(null, ty)).toEqual(null);
                expect(validate<any>(void 0, ty)).toEqual(null);
                expect(validate<any>({}, ty)).toEqual(null);
                expect(validate<any>([], ty)).toEqual({value: []});
                expect(validate<any>([0], ty)).toEqual(null);
                expect(validate<any>([BigInt(0)], ty)).toEqual(null);
                expect(validate<any>([''], ty)).toEqual(null);
                expect(validate<any>([false], ty)).toEqual({value: [false]});
                expect(validate<any>([null], ty)).toEqual(null);
                expect(validate<any>([void 0], ty)).toEqual(null);
                expect(validate<any>([3], ty)).toEqual(null);
                expect(validate<any>([BigInt(7)], ty)).toEqual(null);
                expect(validate<any>(['XB'], ty)).toEqual(null);
                expect(validate<any>([true], ty)).toEqual({value: [true]});
            }
            {
                const rhs: TypeAssertion = {
                    name: 'FooE',
                    typeName: 'FooE',
                    kind: 'repeated',
                    min: null,
                    max: null,
                    repeated: {
                        kind: 'primitive',
                        primitiveName: 'null',
                    },
                };
                const ty = getType(schema, 'FooE');
                expect(ty).toEqual(rhs);
                expect(validate<any>(0, ty)).toEqual(null);
                expect(validate<any>(1, ty)).toEqual(null);
                expect(validate<any>(BigInt(0), ty)).toEqual(null);
                expect(validate<any>(BigInt(1), ty)).toEqual(null);
                expect(validate<any>('', ty)).toEqual(null);
                expect(validate<any>('1', ty)).toEqual(null);
                expect(validate<any>(false, ty)).toEqual(null);
                expect(validate<any>(true, ty)).toEqual(null);
                expect(validate<any>(null, ty)).toEqual(null);
                expect(validate<any>(void 0, ty)).toEqual(null);
                expect(validate<any>({}, ty)).toEqual(null);
                expect(validate<any>([], ty)).toEqual({value: []});
                expect(validate<any>([0], ty)).toEqual(null);
                expect(validate<any>([BigInt(0)], ty)).toEqual(null);
                expect(validate<any>([''], ty)).toEqual(null);
                expect(validate<any>([false], ty)).toEqual(null);
                expect(validate<any>([null], ty)).toEqual({value: [null]});
                expect(validate<any>([void 0], ty)).toEqual(null);
                expect(validate<any>([3], ty)).toEqual(null);
                expect(validate<any>([BigInt(7)], ty)).toEqual(null);
                expect(validate<any>(['XB'], ty)).toEqual(null);
                expect(validate<any>([true], ty)).toEqual(null);
            }
            {
                const rhs: TypeAssertion = {
                    name: 'FooF',
                    typeName: 'FooF',
                    kind: 'repeated',
                    min: null,
                    max: null,
                    repeated: {
                        kind: 'primitive',
                        primitiveName: 'undefined',
                    },
                };
                const ty = getType(schema, 'FooF');
                expect(ty).toEqual(rhs);
                expect(validate<any>(0, ty)).toEqual(null);
                expect(validate<any>(1, ty)).toEqual(null);
                expect(validate<any>(BigInt(0), ty)).toEqual(null);
                expect(validate<any>(BigInt(1), ty)).toEqual(null);
                expect(validate<any>('', ty)).toEqual(null);
                expect(validate<any>('1', ty)).toEqual(null);
                expect(validate<any>(false, ty)).toEqual(null);
                expect(validate<any>(true, ty)).toEqual(null);
                expect(validate<any>(null, ty)).toEqual(null);
                expect(validate<any>(void 0, ty)).toEqual(null);
                expect(validate<any>({}, ty)).toEqual(null);
                expect(validate<any>([], ty)).toEqual({value: []});
                expect(validate<any>([0], ty)).toEqual(null);
                expect(validate<any>([BigInt(0)], ty)).toEqual(null);
                expect(validate<any>([''], ty)).toEqual(null);
                expect(validate<any>([false], ty)).toEqual(null);
                expect(validate<any>([null], ty)).toEqual(null);
                expect(validate<any>([void 0], ty)).toEqual({value: [void 0]});
                expect(validate<any>([3], ty)).toEqual(null);
                expect(validate<any>([BigInt(7)], ty)).toEqual(null);
                expect(validate<any>(['XB'], ty)).toEqual(null);
                expect(validate<any>([true], ty)).toEqual(null);
            }
            {
                const rhs: TypeAssertion = {
                    name: 'BarA',
                    typeName: 'BarA',
                    kind: 'repeated',
                    min: null,
                    max: null,
                    repeated: {
                        kind: 'primitive-value',
                        value: 3,
                    },
                };
                const ty = getType(schema, 'BarA');
                expect(ty).toEqual(rhs);
                expect(validate<any>(0, ty)).toEqual(null);
                expect(validate<any>(1, ty)).toEqual(null);
                expect(validate<any>(BigInt(0), ty)).toEqual(null);
                expect(validate<any>(BigInt(1), ty)).toEqual(null);
                expect(validate<any>('', ty)).toEqual(null);
                expect(validate<any>('1', ty)).toEqual(null);
                expect(validate<any>(false, ty)).toEqual(null);
                expect(validate<any>(true, ty)).toEqual(null);
                expect(validate<any>(null, ty)).toEqual(null);
                expect(validate<any>(void 0, ty)).toEqual(null);
                expect(validate<any>({}, ty)).toEqual(null);
                expect(validate<any>([], ty)).toEqual({value: []});
                expect(validate<any>([0], ty)).toEqual(null);
                expect(validate<any>([BigInt(0)], ty)).toEqual(null);
                expect(validate<any>([''], ty)).toEqual(null);
                expect(validate<any>([false], ty)).toEqual(null);
                expect(validate<any>([null], ty)).toEqual(null);
                expect(validate<any>([void 0], ty)).toEqual(null);
                expect(validate<any>([3], ty)).toEqual({value: [3]});
                expect(validate<any>([BigInt(7)], ty)).toEqual(null);
                expect(validate<any>(['XB'], ty)).toEqual(null);
                expect(validate<any>([true], ty)).toEqual(null);
            }
            {
                const rhs: TypeAssertion = {
                    name: 'BarB',
                    typeName: 'BarB',
                    kind: 'repeated',
                    min: null,
                    max: null,
                    repeated: {
                        kind: 'primitive-value',
                        value: BigInt(7),
                    },
                };
                const ty = getType(schema, 'BarB');
                expect(ty).toEqual(rhs);
                expect(validate<any>(0, ty)).toEqual(null);
                expect(validate<any>(1, ty)).toEqual(null);
                expect(validate<any>(BigInt(0), ty)).toEqual(null);
                expect(validate<any>(BigInt(1), ty)).toEqual(null);
                expect(validate<any>('', ty)).toEqual(null);
                expect(validate<any>('1', ty)).toEqual(null);
                expect(validate<any>(false, ty)).toEqual(null);
                expect(validate<any>(true, ty)).toEqual(null);
                expect(validate<any>(null, ty)).toEqual(null);
                expect(validate<any>(void 0, ty)).toEqual(null);
                expect(validate<any>({}, ty)).toEqual(null);
                expect(validate<any>([], ty)).toEqual({value: []});
                expect(validate<any>([0], ty)).toEqual(null);
                expect(validate<any>([BigInt(0)], ty)).toEqual(null);
                expect(validate<any>([''], ty)).toEqual(null);
                expect(validate<any>([false], ty)).toEqual(null);
                expect(validate<any>([null], ty)).toEqual(null);
                expect(validate<any>([void 0], ty)).toEqual(null);
                expect(validate<any>([3], ty)).toEqual(null);
                expect(validate<any>([BigInt(7)], ty)).toEqual({value: [BigInt(7)]});
                expect(validate<any>(['XB'], ty)).toEqual(null);
                expect(validate<any>([true], ty)).toEqual(null);
            }
            {
                const rhs: TypeAssertion = {
                    name: 'BarC',
                    typeName: 'BarC',
                    kind: 'repeated',
                    min: null,
                    max: null,
                    repeated: {
                        kind: 'primitive-value',
                        value: 'XB',
                    },
                };
                const ty = getType(schema, 'BarC');
                expect(ty).toEqual(rhs);
                expect(validate<any>(0, ty)).toEqual(null);
                expect(validate<any>(1, ty)).toEqual(null);
                expect(validate<any>(BigInt(0), ty)).toEqual(null);
                expect(validate<any>(BigInt(1), ty)).toEqual(null);
                expect(validate<any>('', ty)).toEqual(null);
                expect(validate<any>('1', ty)).toEqual(null);
                expect(validate<any>(false, ty)).toEqual(null);
                expect(validate<any>(true, ty)).toEqual(null);
                expect(validate<any>(null, ty)).toEqual(null);
                expect(validate<any>(void 0, ty)).toEqual(null);
                expect(validate<any>({}, ty)).toEqual(null);
                expect(validate<any>([], ty)).toEqual({value: []});
                expect(validate<any>([0], ty)).toEqual(null);
                expect(validate<any>([BigInt(0)], ty)).toEqual(null);
                expect(validate<any>([''], ty)).toEqual(null);
                expect(validate<any>([false], ty)).toEqual(null);
                expect(validate<any>([null], ty)).toEqual(null);
                expect(validate<any>([void 0], ty)).toEqual(null);
                expect(validate<any>([3], ty)).toEqual(null);
                expect(validate<any>([BigInt(7)], ty)).toEqual(null);
                expect(validate<any>(['XB'], ty)).toEqual({value: ['XB']});
                expect(validate<any>([true], ty)).toEqual(null);
            }
            {
                const rhs: TypeAssertion = {
                    name: 'BarD',
                    typeName: 'BarD',
                    kind: 'repeated',
                    min: null,
                    max: null,
                    repeated: {
                        kind: 'primitive-value',
                        value: true,
                    },
                };
                const ty = getType(schema, 'BarD');
                expect(ty).toEqual(rhs);
                expect(validate<any>(0, ty)).toEqual(null);
                expect(validate<any>(1, ty)).toEqual(null);
                expect(validate<any>(BigInt(0), ty)).toEqual(null);
                expect(validate<any>(BigInt(1), ty)).toEqual(null);
                expect(validate<any>('', ty)).toEqual(null);
                expect(validate<any>('1', ty)).toEqual(null);
                expect(validate<any>(false, ty)).toEqual(null);
                expect(validate<any>(true, ty)).toEqual(null);
                expect(validate<any>(null, ty)).toEqual(null);
                expect(validate<any>(void 0, ty)).toEqual(null);
                expect(validate<any>({}, ty)).toEqual(null);
                expect(validate<any>([], ty)).toEqual({value: []});
                expect(validate<any>([0], ty)).toEqual(null);
                expect(validate<any>([BigInt(0)], ty)).toEqual(null);
                expect(validate<any>([''], ty)).toEqual(null);
                expect(validate<any>([false], ty)).toEqual(null);
                expect(validate<any>([null], ty)).toEqual(null);
                expect(validate<any>([void 0], ty)).toEqual(null);
                expect(validate<any>([3], ty)).toEqual(null);
                expect(validate<any>([BigInt(7)], ty)).toEqual(null);
                expect(validate<any>(['XB'], ty)).toEqual(null);
                expect(validate<any>([true], ty)).toEqual({value: [true]});
            }
        }
    });
    it("compiler-interface-1", function() {
        const schema = compile(`
            type X = string;
            interface Foo {
                a1: number;
                a2: bigint;
                a3: string;
                a4: boolean;
                a5: null;
                a6: undefined;
                a7: X;
            }
        `);
        {
            expect(Array.from(schema.keys())).toEqual([
                'X', 'Foo',
            ]);
        }
        {
            const rhs: TypeAssertion = {
                name: 'Foo',
                typeName: 'Foo',
                kind: 'object',
                members: [
                    ['a1', {
                        name: 'a1',
                        kind: 'primitive',
                        primitiveName: 'number',
                    }],
                    ['a2', {
                        name: 'a2',
                        kind: 'primitive',
                        primitiveName: 'bigint',
                    }],
                    ['a3', {
                        name: 'a3',
                        kind: 'primitive',
                        primitiveName: 'string',
                    }],
                    ['a4', {
                        name: 'a4',
                        kind: 'primitive',
                        primitiveName: 'boolean',
                    }],
                    ['a5', {
                        name: 'a5',
                        kind: 'primitive',
                        primitiveName: 'null',
                    }],
                    ['a6', {
                        name: 'a6',
                        kind: 'primitive',
                        primitiveName: 'undefined',
                    }],
                    ['a7', {
                        name: 'a7',
                        typeName: 'X',
                        kind: 'primitive',
                        primitiveName: 'string',
                    }],
                ],
            };
            const ty = getType(schema, 'Foo');
            expect(ty).toEqual(rhs);
            {
                const v = {
                    a1: 3,
                    a2: BigInt(5),
                    a3: 'C',
                    a4: true,
                    a5: null,
                    a6: void 0,
                    a7: '',
                };
                expect(validate<any>(v, ty)).toEqual({value: v});
            }
            {
                const v = {
                    // a1
                    a2: BigInt(5),
                    a3: 'C',
                    a4: true,
                    a5: null,
                    a6: void 0,
                    a7: '',
                };
                expect(validate<any>(v, ty)).toEqual(null);
            }
            {
                const v = {
                    a1: 3,
                    // a2
                    a3: 'C',
                    a4: true,
                    a5: null,
                    a6: void 0,
                    a7: '',
                };
                expect(validate<any>(v, ty)).toEqual(null);
            }
            {
                const v = {
                    a1: 3,
                    a2: BigInt(5),
                    // a3
                    a4: true,
                    a5: null,
                    a6: void 0,
                    a7: '',
                };
                expect(validate<any>(v, ty)).toEqual(null);
            }
            {
                const v = {
                    a1: 3,
                    a2: BigInt(5),
                    a3: 'C',
                    // a4
                    a5: null,
                    a6: void 0,
                    a7: '',
                };
                expect(validate<any>(v, ty)).toEqual(null);
            }
            {
                const v = {
                    a1: 3,
                    a2: BigInt(5),
                    a3: 'C',
                    a4: true,
                    // a5
                    a6: void 0,
                    a7: '',
                };
                expect(validate<any>(v, ty)).toEqual(null);
            }
            {
                const v = {
                    a1: 3,
                    a2: BigInt(5),
                    a3: 'C',
                    a4: true,
                    a5: null,
                    // a6
                    a7: '',
                };
                expect(validate<any>(v, ty)).toEqual(null);
            }
            {
                const v = {
                    a1: 3,
                    a2: BigInt(5),
                    a3: 'C',
                    a4: true,
                    a5: null,
                    a6: void 0,
                    // a7
                };
                expect(validate<any>(v, ty)).toEqual(null);
            }
            {
                const v = {
                    a1: BigInt(99), // wrong
                    a2: BigInt(5),
                    a3: 'C',
                    a4: true,
                    a5: null,
                    a6: void 0,
                    a7: '',
                };
                expect(validate<any>(v, ty)).toEqual(null);
            }
            {
                const v = {
                    a1: 3,
                    a2: 99, // wrong
                    a3: 'C',
                    a4: true,
                    a5: null,
                    a6: void 0,
                    a7: '',
                };
                expect(validate<any>(v, ty)).toEqual(null);
            }
            {
                const v = {
                    a1: 3,
                    a2: BigInt(5),
                    a3: 7, // wrong
                    a4: true,
                    a5: null,
                    a6: void 0,
                    a7: '',
                };
                expect(validate<any>(v, ty)).toEqual(null);
            }
            {
                const v = {
                    a1: 3,
                    a2: BigInt(5),
                    a3: 'C',
                    a4: '', // wrong
                    a5: null,
                    a6: void 0,
                    a7: '',
                };
                expect(validate<any>(v, ty)).toEqual(null);
            }
            {
                const v = {
                    a1: 3,
                    a2: BigInt(5),
                    a3: 'C',
                    a4: true,
                    a5: void 0, // wrong
                    a6: void 0,
                    a7: '',
                };
                expect(validate<any>(v, ty)).toEqual(null);
            }
            {
                const v = {
                    a1: 3,
                    a2: BigInt(5),
                    a3: 'C',
                    a4: true,
                    a5: null,
                    a6: null, // wrong
                    a7: '',
                };
                expect(validate<any>(v, ty)).toEqual(null);
            }
            {
                const v = {
                    a1: 3,
                    a2: BigInt(5),
                    a3: 'C',
                    a4: true,
                    a5: null,
                    a6: void 0,
                    a7: 99, // wrong
                };
                expect(validate<any>(v, ty)).toEqual(null);
            }
        }
    });
    it("compiler-interface-2 (optional types)", function() {
        const schema = compile(`
            type X = string;
            interface Foo {
                a1?: number;
                a2?: bigint;
                a3?: string;
                a4?: boolean;
                a5?: null;
                a6?: undefined;
                a7?: X;
            }
        `);
        {
            expect(Array.from(schema.keys())).toEqual([
                'X', 'Foo',
            ]);
        }
        {
            const rhs: TypeAssertion = {
                name: 'Foo',
                typeName: 'Foo',
                kind: 'object',
                members: [
                    ['a1', {
                        name: 'a1',
                        kind: 'optional',
                        optional: {
                            kind: 'primitive',
                            primitiveName: 'number',
                        }
                    }],
                    ['a2', {
                        name: 'a2',
                        kind: 'optional',
                        optional: {
                            kind: 'primitive',
                            primitiveName: 'bigint',
                        }
                    }],
                    ['a3', {
                        name: 'a3',
                        kind: 'optional',
                        optional: {
                            kind: 'primitive',
                            primitiveName: 'string',
                        }
                    }],
                    ['a4', {
                        name: 'a4',
                        kind: 'optional',
                        optional: {
                            kind: 'primitive',
                            primitiveName: 'boolean',
                        }
                    }],
                    ['a5', {
                        name: 'a5',
                        kind: 'optional',
                        optional: {
                            kind: 'primitive',
                            primitiveName: 'null',
                        }
                    }],
                    ['a6', {
                        name: 'a6',
                        kind: 'optional',
                        optional: {
                            kind: 'primitive',
                            primitiveName: 'undefined',
                        }
                    }],
                    ['a7', {
                        name: 'a7',
                        typeName: 'X',
                        kind: 'optional',
                        optional: {
                            name: 'X',
                            typeName: 'X',
                            kind: 'primitive',
                            primitiveName: 'string',
                        }
                    }],
                ],
            };
            const ty = getType(schema, 'Foo');
            expect(ty).toEqual(rhs);
            {
                const v = {
                    a1: 3,
                    a2: BigInt(5),
                    a3: 'C',
                    a4: true,
                    a5: null,
                    a6: void 0,
                    a7: '',
                };
                expect(validate<any>(v, ty)).toEqual({value: v});
            }
            {
                const v = {};
                expect(validate<any>(v, ty)).toEqual({value: v});
            }
        }
    });
    it("compiler-interface-3 (extends)", function() {
        const schema = compile(`
            type X = string;
            interface P {
                a1: number;
                a2: bigint;
            }
            interface Q {
                a3: string;
                a4: boolean;
            }
            interface R extends Q {
                a5: null;
                a6: undefined;
                a7: X;
            }
            interface Foo {
                a1: number;
                a2: bigint;
                a3: string;
                a4: boolean;
                a5: null;
                a6: undefined;
                a7: X;
            }
        `);
        {
            expect(Array.from(schema.keys())).toEqual([
                'X', 'P', 'Q', 'R', 'Foo',
            ]);
        }
        {
            const rhs: TypeAssertion = {
                name: 'Foo',
                typeName: 'Foo',
                kind: 'object',
                members: [
                    ['a1', {
                        name: 'a1',
                        kind: 'primitive',
                        primitiveName: 'number',
                    }],
                    ['a2', {
                        name: 'a2',
                        kind: 'primitive',
                        primitiveName: 'bigint',
                    }],
                    ['a3', {
                        name: 'a3',
                        kind: 'primitive',
                        primitiveName: 'string',
                    }],
                    ['a4', {
                        name: 'a4',
                        kind: 'primitive',
                        primitiveName: 'boolean',
                    }],
                    ['a5', {
                        name: 'a5',
                        kind: 'primitive',
                        primitiveName: 'null',
                    }],
                    ['a6', {
                        name: 'a6',
                        kind: 'primitive',
                        primitiveName: 'undefined',
                    }],
                    ['a7', {
                        name: 'a7',
                        typeName: 'X',
                        kind: 'primitive',
                        primitiveName: 'string',
                    }],
                ],
            };
            const ty = getType(schema, 'Foo');
            expect(ty).toEqual(rhs);
            {
                const v = {
                    a1: 3,
                    a2: BigInt(5),
                    a3: 'C',
                    a4: true,
                    a5: null,
                    a6: void 0,
                    a7: '',
                };
                expect(validate<any>(v, ty)).toEqual({value: v});
            }
        }
    });
});
