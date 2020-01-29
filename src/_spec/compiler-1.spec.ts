
import { TypeAssertion } from '../types';
import { validate,
         getType }       from '../validator';
import { compile }       from '../compiler';
import { serialize,
         deserialize }   from '../serializer';



describe("compiler-1", function() {
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
});
