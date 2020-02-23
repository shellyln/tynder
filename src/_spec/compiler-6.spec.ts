
import { TypeAssertion,
         ObjectAssertion,
         AdditionalPropsMember,
         ValidationContext } from '../types';
import { validate,
         getType }           from '../validator';
import { compile }           from '../compiler';
import { serialize,
         deserialize }       from '../serializer';



describe("compiler-6", function() {
    it("compiler-error-reporting-1", function() {
        const schema = compile(`
            @msgId('MSG_A')
            interface A {
                @msgId('MSG_A.a1')
                a1: string;
                @msgId('MSG_A.a2')
                a2?: number;
                /** Comment A.a3 */
                @msgId('MSG_A.a3')
                a3: string[];
                /** Comment A.a4 */
                @msgId('MSG_A.a4')
                [propNames: string]: any;
            }
            /** Comment B */
            @msgId('MSG_B')
            interface B {
                @msgId('MSG_B.b1')
                b1: boolean;
                /** Comment B.b2 */
                @msgId('MSG_B.b2')
                b2: A;
            }
            @msgId('MSG_C')
            interface C extends A {
                @msgId('MSG_C.c1')
                c1: string;
            }
            /** Comment D */
            @msgId('MSG_D')
            type D = string;
            /** Comment E */
            @msgId('MSG_E')
            enum E {
                P,
                Q,
                R,
            }
        `);

        {
            expect(Array.from(schema.keys())).toEqual([
                'A', 'B', 'C', 'D', 'E',
            ]);
        }
        {
            // const ty = getType(schema, 'A');
            for (const ty of [getType(deserialize(serialize(schema)), 'A'), getType(schema, 'A')]) {
                expect(false).toEqual(schema.get('A')?.exported as any);
                const rhs: TypeAssertion = {
                    name: 'A',
                    typeName: 'A',
                    kind: 'object',
                    members: [
                        ['a1', {
                            name: 'a1',
                            kind: 'primitive',
                            primitiveName: 'string',
                            messageId: 'MSG_A.a1',
                        }],
                        ['a2', {
                            name: 'a2',
                            kind: 'optional',
                            optional: {
                                kind: 'primitive',
                                primitiveName: 'number',
                                messageId: 'MSG_A.a2',
                            },
                            messageId: 'MSG_A.a2',
                        }],
                        ['a3', {
                            name: 'a3',
                            kind: 'repeated',
                            min: null,
                            max: null,
                            repeated: {
                                kind: 'primitive',
                                primitiveName: 'string',
                            },
                            messageId: 'MSG_A.a3',
                        }, false, 'Comment A.a3'],
                    ],
                    additionalProps: [
                        [['string'], {
                            kind: 'any',
                            messageId: 'MSG_A.a4',
                        }, false, 'Comment A.a4'],
                    ],
                    messageId: 'MSG_A',
                };
                expect(ty).toEqual(rhs);
            }
        }
        {
            // const ty = getType(schema, 'B');
            for (const ty of [getType(deserialize(serialize(schema)), 'B'), getType(schema, 'B')]) {
                expect(false).toEqual(schema.get('B')?.exported as any);
                const rhs: TypeAssertion = {
                    name: 'B',
                    typeName: 'B',
                    kind: 'object',
                    members: [
                        ['b1', {
                            name: 'b1',
                            kind: 'primitive',
                            primitiveName: 'boolean',
                            messageId: 'MSG_B.b1',
                        }],
                        ['b2', {
                            name: 'b2',
                            typeName: 'A',
                            kind: 'object',
                            members: [...(getType(schema, 'A') as ObjectAssertion).members],
                            additionalProps: [...((getType(schema, 'A') as ObjectAssertion).additionalProps as AdditionalPropsMember[])],
                            messageId: 'MSG_B.b2',
                        }, false, 'Comment B.b2'],
                    ],
                    messageId: 'MSG_B',
                    docComment: 'Comment B',
                };
                expect(ty).toEqual(rhs);
            }
        }
        {
            // const ty = getType(schema, 'C');
            for (const ty of [getType(deserialize(serialize(schema)), 'C'), getType(schema, 'C')]) {
                expect(false).toEqual(schema.get('C')?.exported as any);
                const rhs: TypeAssertion = {
                    name: 'C',
                    typeName: 'C',
                    kind: 'object',
                    members: [
                        ['c1', {
                            name: 'c1',
                            kind: 'primitive',
                            primitiveName: 'string',
                            messageId: 'MSG_C.c1',
                        }],
                        ['a1', {
                            name: 'a1',
                            kind: 'primitive',
                            primitiveName: 'string',
                            messageId: 'MSG_A.a1',
                        }, true],
                        ['a2', {
                            name: 'a2',
                            kind: 'optional',
                            optional: {
                                kind: 'primitive',
                                primitiveName: 'number',
                                messageId: 'MSG_A.a2',
                            },
                            messageId: 'MSG_A.a2',
                        }, true],
                        ['a3', {
                            name: 'a3',
                            kind: 'repeated',
                            min: null,
                            max: null,
                            repeated: {
                                kind: 'primitive',
                                primitiveName: 'string',
                            },
                            messageId: 'MSG_A.a3',
                        }, true, 'Comment A.a3'],
                    ],
                    baseTypes: [
                        getType(schema, 'A') as any,
                    ],
                    additionalProps: [
                        [['string'], {
                            kind: 'any',
                            messageId: 'MSG_A.a4',
                        }, true, 'Comment A.a4']
                    ],
                    messageId: 'MSG_C',
                };
                expect(ty).toEqual(rhs);
            }
        }
        {
            // const ty = getType(schema, 'D');
            for (const ty of [getType(deserialize(serialize(schema)), 'D'), getType(schema, 'D')]) {
                expect(false).toEqual(schema.get('D')?.exported as any);
                const rhs: TypeAssertion = {
                    name: 'D',
                    typeName: 'D',
                    kind: 'primitive',
                    primitiveName: 'string',
                    messageId: 'MSG_D',
                    docComment: 'Comment D',
                };
                expect(ty).toEqual(rhs);
            }
        }
        {
            // const ty = getType(schema, 'E');
            for (const ty of [getType(deserialize(serialize(schema)), 'E'), getType(schema, 'E')]) {
                expect(false).toEqual(schema.get('E')?.exported as any);
                const rhs: TypeAssertion = {
                    name: 'E',
                    typeName: 'E',
                    kind: 'enum',
                    values: [
                        ['P', 0],
                        ['Q', 1],
                        ['R', 2],
                    ],
                    messageId: 'MSG_E',
                    docComment: 'Comment E',
                };
                expect(ty).toEqual(rhs);
            }
        }
    });
    it("compiler-error-reporting-2", function() {
        const schema = compile(`
            @msgId('MSG_A')
            export interface A {
                @msgId('MSG_A.a1')
                a1: string;
                @msgId('MSG_A.a2')
                a2?: number;
                /** Comment A.a3 */
                @msgId('MSG_A.a3')
                a3: string[];
                /** Comment A.a4 */
                @msgId('MSG_A.a4')
                [propNames: string]: any;
            }
            /** Comment B */
            @msgId('MSG_B')
            export interface B {
                @msgId('MSG_B.b1')
                b1: boolean;
                /** Comment B.b2 */
                @msgId('MSG_B.b2')
                b2: A;
            }
            @msgId('MSG_C')
            export interface C extends A {
                @msgId('MSG_C.c1')
                c1: string;
            }
            /** Comment D */
            @msgId('MSG_D')
            export type D = string;
            /** Comment E */
            @msgId('MSG_E')
            export enum E {
                P,
                Q,
                R,
            }
        `);

        {
            expect(Array.from(schema.keys())).toEqual([
                'A', 'B', 'C', 'D', 'E',
            ]);
        }
        {
            // const ty = getType(schema, 'A');
            for (const ty of [getType(deserialize(serialize(schema)), 'A'), getType(schema, 'A')]) {
                expect(true).toEqual(schema.get('A')?.exported as any);
                const rhs: TypeAssertion = {
                    name: 'A',
                    typeName: 'A',
                    kind: 'object',
                    members: [
                        ['a1', {
                            name: 'a1',
                            kind: 'primitive',
                            primitiveName: 'string',
                            messageId: 'MSG_A.a1',
                        }],
                        ['a2', {
                            name: 'a2',
                            kind: 'optional',
                            optional: {
                                kind: 'primitive',
                                primitiveName: 'number',
                                messageId: 'MSG_A.a2',
                            },
                            messageId: 'MSG_A.a2',
                        }],
                        ['a3', {
                            name: 'a3',
                            kind: 'repeated',
                            min: null,
                            max: null,
                            repeated: {
                                kind: 'primitive',
                                primitiveName: 'string',
                            },
                            messageId: 'MSG_A.a3',
                        }, false, 'Comment A.a3'],
                    ],
                    additionalProps: [
                        [['string'], {
                            kind: 'any',
                            messageId: 'MSG_A.a4',
                        }, false, 'Comment A.a4'],
                    ],
                    messageId: 'MSG_A',
                };
                expect(ty).toEqual(rhs);
            }
        }
        {
            // const ty = getType(schema, 'B');
            for (const ty of [getType(deserialize(serialize(schema)), 'B'), getType(schema, 'B')]) {
                expect(true).toEqual(schema.get('B')?.exported as any);
                const rhs: TypeAssertion = {
                    name: 'B',
                    typeName: 'B',
                    kind: 'object',
                    members: [
                        ['b1', {
                            name: 'b1',
                            kind: 'primitive',
                            primitiveName: 'boolean',
                            messageId: 'MSG_B.b1',
                        }],
                        ['b2', {
                            name: 'b2',
                            typeName: 'A',
                            kind: 'object',
                            members: [...(getType(schema, 'A') as ObjectAssertion).members],
                            additionalProps: [...((getType(schema, 'A') as ObjectAssertion).additionalProps as AdditionalPropsMember[])],
                            messageId: 'MSG_B.b2',
                        }, false, 'Comment B.b2'],
                    ],
                    messageId: 'MSG_B',
                    docComment: 'Comment B',
                };
                expect(ty).toEqual(rhs);
            }
        }
        {
            // const ty = getType(schema, 'C');
            for (const ty of [getType(deserialize(serialize(schema)), 'C'), getType(schema, 'C')]) {
                expect(true).toEqual(schema.get('C')?.exported as any);
                const rhs: TypeAssertion = {
                    name: 'C',
                    typeName: 'C',
                    kind: 'object',
                    members: [
                        ['c1', {
                            name: 'c1',
                            kind: 'primitive',
                            primitiveName: 'string',
                            messageId: 'MSG_C.c1',
                        }],
                        ['a1', {
                            name: 'a1',
                            kind: 'primitive',
                            primitiveName: 'string',
                            messageId: 'MSG_A.a1',
                        }, true],
                        ['a2', {
                            name: 'a2',
                            kind: 'optional',
                            optional: {
                                kind: 'primitive',
                                primitiveName: 'number',
                                messageId: 'MSG_A.a2',
                            },
                            messageId: 'MSG_A.a2',
                        }, true],
                        ['a3', {
                            name: 'a3',
                            kind: 'repeated',
                            min: null,
                            max: null,
                            repeated: {
                                kind: 'primitive',
                                primitiveName: 'string',
                            },
                            messageId: 'MSG_A.a3',
                        }, true, 'Comment A.a3'],
                    ],
                    baseTypes: [
                        getType(schema, 'A') as any,
                    ],
                    additionalProps: [
                        [['string'], {
                            kind: 'any',
                            messageId: 'MSG_A.a4',
                        }, true, 'Comment A.a4']
                    ],
                    messageId: 'MSG_C',
                };
                expect(ty).toEqual(rhs);
            }
        }
        {
            // const ty = getType(schema, 'D');
            for (const ty of [getType(deserialize(serialize(schema)), 'D'), getType(schema, 'D')]) {
                expect(true).toEqual(schema.get('D')?.exported as any);
                const rhs: TypeAssertion = {
                    name: 'D',
                    typeName: 'D',
                    kind: 'primitive',
                    primitiveName: 'string',
                    messageId: 'MSG_D',
                    docComment: 'Comment D',
                };
                expect(ty).toEqual(rhs);
            }
        }
        {
            // const ty = getType(schema, 'E');
            for (const ty of [getType(deserialize(serialize(schema)), 'E'), getType(schema, 'E')]) {
                expect(true).toEqual(schema.get('E')?.exported as any);
                const rhs: TypeAssertion = {
                    name: 'E',
                    typeName: 'E',
                    kind: 'enum',
                    values: [
                        ['P', 0],
                        ['Q', 1],
                        ['R', 2],
                    ],
                    messageId: 'MSG_E',
                    docComment: 'Comment E',
                };
                expect(ty).toEqual(rhs);
            }
        }
    });
    it("compiler-error-reporting-3", function() {
        const schema = compile(`
            @msg('MSG_A')
            interface A {
                @msg('MSG_A.a1')
                a1: string;
                @msg('MSG_A.a2')
                a2?: number;
                /** Comment A.a3 */
                @msg('MSG_A.a3')
                a3: string[];
                /** Comment A.a4 */
                @msg('MSG_A.a4')
                [propNames: string]: any;
            }
            /** Comment B */
            @msg('MSG_B')
            interface B {
                @msg('MSG_B.b1')
                b1: boolean;
                /** Comment B.b2 */
                @msg('MSG_B.b2')
                b2: A;
            }
            @msg('MSG_C')
            interface C extends A {
                @msg('MSG_C.c1')
                c1: string;
            }
            /** Comment D */
            @msg('MSG_D')
            type D = string;
            /** Comment E */
            @msg('MSG_E')
            enum E {
                P,
                Q,
                R,
            }
        `);

        {
            expect(Array.from(schema.keys())).toEqual([
                'A', 'B', 'C', 'D', 'E',
            ]);
        }
        {
            // const ty = getType(schema, 'A');
            for (const ty of [getType(deserialize(serialize(schema)), 'A'), getType(schema, 'A')]) {
                expect(false).toEqual(schema.get('A')?.exported as any);
                const rhs: TypeAssertion = {
                    name: 'A',
                    typeName: 'A',
                    kind: 'object',
                    members: [
                        ['a1', {
                            name: 'a1',
                            kind: 'primitive',
                            primitiveName: 'string',
                            message: 'MSG_A.a1',
                        }],
                        ['a2', {
                            name: 'a2',
                            kind: 'optional',
                            optional: {
                                kind: 'primitive',
                                primitiveName: 'number',
                                message: 'MSG_A.a2',
                            },
                            message: 'MSG_A.a2',
                        }],
                        ['a3', {
                            name: 'a3',
                            kind: 'repeated',
                            min: null,
                            max: null,
                            repeated: {
                                kind: 'primitive',
                                primitiveName: 'string',
                            },
                            message: 'MSG_A.a3',
                        }, false, 'Comment A.a3'],
                    ],
                    additionalProps: [
                        [['string'], {
                            kind: 'any',
                            message: 'MSG_A.a4',
                        }, false, 'Comment A.a4'],
                    ],
                    message: 'MSG_A',
                };
                expect(ty).toEqual(rhs);
            }
        }
        {
            // const ty = getType(schema, 'B');
            for (const ty of [getType(deserialize(serialize(schema)), 'B'), getType(schema, 'B')]) {
                expect(false).toEqual(schema.get('B')?.exported as any);
                const rhs: TypeAssertion = {
                    name: 'B',
                    typeName: 'B',
                    kind: 'object',
                    members: [
                        ['b1', {
                            name: 'b1',
                            kind: 'primitive',
                            primitiveName: 'boolean',
                            message: 'MSG_B.b1',
                        }],
                        ['b2', {
                            name: 'b2',
                            typeName: 'A',
                            kind: 'object',
                            members: [...(getType(schema, 'A') as ObjectAssertion).members],
                            additionalProps: [...((getType(schema, 'A') as ObjectAssertion).additionalProps as AdditionalPropsMember[])],
                            message: 'MSG_B.b2',
                        }, false, 'Comment B.b2'],
                    ],
                    message: 'MSG_B',
                    docComment: 'Comment B',
                };
                expect(ty).toEqual(rhs);
            }
        }
        {
            // const ty = getType(schema, 'C');
            for (const ty of [getType(deserialize(serialize(schema)), 'C'), getType(schema, 'C')]) {
                expect(false).toEqual(schema.get('C')?.exported as any);
                const rhs: TypeAssertion = {
                    name: 'C',
                    typeName: 'C',
                    kind: 'object',
                    members: [
                        ['c1', {
                            name: 'c1',
                            kind: 'primitive',
                            primitiveName: 'string',
                            message: 'MSG_C.c1',
                        }],
                        ['a1', {
                            name: 'a1',
                            kind: 'primitive',
                            primitiveName: 'string',
                            message: 'MSG_A.a1',
                        }, true],
                        ['a2', {
                            name: 'a2',
                            kind: 'optional',
                            optional: {
                                kind: 'primitive',
                                primitiveName: 'number',
                                message: 'MSG_A.a2',
                            },
                            message: 'MSG_A.a2',
                        }, true],
                        ['a3', {
                            name: 'a3',
                            kind: 'repeated',
                            min: null,
                            max: null,
                            repeated: {
                                kind: 'primitive',
                                primitiveName: 'string',
                            },
                            message: 'MSG_A.a3',
                        }, true, 'Comment A.a3'],
                    ],
                    baseTypes: [
                        getType(schema, 'A') as any,
                    ],
                    additionalProps: [
                        [['string'], {
                            kind: 'any',
                            message: 'MSG_A.a4',
                        }, true, 'Comment A.a4']
                    ],
                    message: 'MSG_C',
                };
                expect(ty).toEqual(rhs);
            }
        }
        {
            // const ty = getType(schema, 'D');
            for (const ty of [getType(deserialize(serialize(schema)), 'D'), getType(schema, 'D')]) {
                expect(false).toEqual(schema.get('D')?.exported as any);
                const rhs: TypeAssertion = {
                    name: 'D',
                    typeName: 'D',
                    kind: 'primitive',
                    primitiveName: 'string',
                    message: 'MSG_D',
                    docComment: 'Comment D',
                };
                expect(ty).toEqual(rhs);
            }
        }
        {
            // const ty = getType(schema, 'E');
            for (const ty of [getType(deserialize(serialize(schema)), 'E'), getType(schema, 'E')]) {
                expect(false).toEqual(schema.get('E')?.exported as any);
                const rhs: TypeAssertion = {
                    name: 'E',
                    typeName: 'E',
                    kind: 'enum',
                    values: [
                        ['P', 0],
                        ['Q', 1],
                        ['R', 2],
                    ],
                    message: 'MSG_E',
                    docComment: 'Comment E',
                };
                expect(ty).toEqual(rhs);
            }
        }
    });
    it("compiler-error-reporting-4", function() {
        const schema = compile(`
            @msg('MSG_A')
            export interface A {
                @msg('MSG_A.a1')
                a1: string;
                @msg('MSG_A.a2')
                a2?: number;
                /** Comment A.a3 */
                @msg('MSG_A.a3')
                a3: string[];
                /** Comment A.a4 */
                @msg('MSG_A.a4')
                [propNames: string]: any;
            }
            /** Comment B */
            @msg('MSG_B')
            export interface B {
                @msg('MSG_B.b1')
                b1: boolean;
                /** Comment B.b2 */
                @msg('MSG_B.b2')
                b2: A;
            }
            @msg('MSG_C')
            export interface C extends A {
                @msg('MSG_C.c1')
                c1: string;
            }
            /** Comment D */
            @msg('MSG_D')
            export type D = string;
            /** Comment E */
            @msg('MSG_E')
            export enum E {
                P,
                Q,
                R,
            }
        `);

        {
            expect(Array.from(schema.keys())).toEqual([
                'A', 'B', 'C', 'D', 'E',
            ]);
        }
        {
            // const ty = getType(schema, 'A');
            for (const ty of [getType(deserialize(serialize(schema)), 'A'), getType(schema, 'A')]) {
                expect(true).toEqual(schema.get('A')?.exported as any);
                const rhs: TypeAssertion = {
                    name: 'A',
                    typeName: 'A',
                    kind: 'object',
                    members: [
                        ['a1', {
                            name: 'a1',
                            kind: 'primitive',
                            primitiveName: 'string',
                            message: 'MSG_A.a1',
                        }],
                        ['a2', {
                            name: 'a2',
                            kind: 'optional',
                            optional: {
                                kind: 'primitive',
                                primitiveName: 'number',
                                message: 'MSG_A.a2',
                            },
                            message: 'MSG_A.a2',
                        }],
                        ['a3', {
                            name: 'a3',
                            kind: 'repeated',
                            min: null,
                            max: null,
                            repeated: {
                                kind: 'primitive',
                                primitiveName: 'string',
                            },
                            message: 'MSG_A.a3',
                        }, false, 'Comment A.a3'],
                    ],
                    additionalProps: [
                        [['string'], {
                            kind: 'any',
                            message: 'MSG_A.a4',
                        }, false, 'Comment A.a4'],
                    ],
                    message: 'MSG_A',
                };
                expect(ty).toEqual(rhs);
            }
        }
        {
            // const ty = getType(schema, 'B');
            for (const ty of [getType(deserialize(serialize(schema)), 'B'), getType(schema, 'B')]) {
                expect(true).toEqual(schema.get('B')?.exported as any);
                const rhs: TypeAssertion = {
                    name: 'B',
                    typeName: 'B',
                    kind: 'object',
                    members: [
                        ['b1', {
                            name: 'b1',
                            kind: 'primitive',
                            primitiveName: 'boolean',
                            message: 'MSG_B.b1',
                        }],
                        ['b2', {
                            name: 'b2',
                            typeName: 'A',
                            kind: 'object',
                            members: [...(getType(schema, 'A') as ObjectAssertion).members],
                            additionalProps: [...((getType(schema, 'A') as ObjectAssertion).additionalProps as AdditionalPropsMember[])],
                            message: 'MSG_B.b2',
                        }, false, 'Comment B.b2'],
                    ],
                    message: 'MSG_B',
                    docComment: 'Comment B',
                };
                expect(ty).toEqual(rhs);
            }
        }
        {
            // const ty = getType(schema, 'C');
            for (const ty of [getType(deserialize(serialize(schema)), 'C'), getType(schema, 'C')]) {
                expect(true).toEqual(schema.get('C')?.exported as any);
                const rhs: TypeAssertion = {
                    name: 'C',
                    typeName: 'C',
                    kind: 'object',
                    members: [
                        ['c1', {
                            name: 'c1',
                            kind: 'primitive',
                            primitiveName: 'string',
                            message: 'MSG_C.c1',
                        }],
                        ['a1', {
                            name: 'a1',
                            kind: 'primitive',
                            primitiveName: 'string',
                            message: 'MSG_A.a1',
                        }, true],
                        ['a2', {
                            name: 'a2',
                            kind: 'optional',
                            optional: {
                                kind: 'primitive',
                                primitiveName: 'number',
                                message: 'MSG_A.a2',
                            },
                            message: 'MSG_A.a2',
                        }, true],
                        ['a3', {
                            name: 'a3',
                            kind: 'repeated',
                            min: null,
                            max: null,
                            repeated: {
                                kind: 'primitive',
                                primitiveName: 'string',
                            },
                            message: 'MSG_A.a3',
                        }, true, 'Comment A.a3'],
                    ],
                    baseTypes: [
                        getType(schema, 'A') as any,
                    ],
                    additionalProps: [
                        [['string'], {
                            kind: 'any',
                            message: 'MSG_A.a4',
                        }, true, 'Comment A.a4']
                    ],
                    message: 'MSG_C',
                };
                expect(ty).toEqual(rhs);
            }
        }
        {
            // const ty = getType(schema, 'D');
            for (const ty of [getType(deserialize(serialize(schema)), 'D'), getType(schema, 'D')]) {
                expect(true).toEqual(schema.get('D')?.exported as any);
                const rhs: TypeAssertion = {
                    name: 'D',
                    typeName: 'D',
                    kind: 'primitive',
                    primitiveName: 'string',
                    message: 'MSG_D',
                    docComment: 'Comment D',
                };
                expect(ty).toEqual(rhs);
            }
        }
        {
            // const ty = getType(schema, 'E');
            for (const ty of [getType(deserialize(serialize(schema)), 'E'), getType(schema, 'E')]) {
                expect(true).toEqual(schema.get('E')?.exported as any);
                const rhs: TypeAssertion = {
                    name: 'E',
                    typeName: 'E',
                    kind: 'enum',
                    values: [
                        ['P', 0],
                        ['Q', 1],
                        ['R', 2],
                    ],
                    message: 'MSG_E',
                    docComment: 'Comment E',
                };
                expect(ty).toEqual(rhs);
            }
        }
    });
});
