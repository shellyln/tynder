
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
                @msgId('MSG_A.a3')
                a3: string[];
                @msgId('MSG_A.a4')
                [propNames: string]: any;
            }
            @msgId('MSG_B')
            interface B {
                @msgId('MSG_B.b1')
                b1: boolean;
                @msgId('MSG_B.b2')
                b2: A;
            }
            @msgId('MSG_C')
            interface C extends A {
                @msgId('MSG_C.c1')
                c1: string;
            }
            @msgId('MSG_D')
            type D = string;
            @msgId('MSG_E')
            enum E {
                P,
                Q,
                R,
            }
        `);

        {
            const ty = getType(schema, 'A');
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
                    }],
                ],
                additionalProps: [
                    [['string'], {
                        'kind': 'any',
                        'messageId': 'MSG_A.a4',
                    }],
                ],
                messageId: 'MSG_A',
            };
            expect(ty).toEqual(rhs);
        }
        {
            const ty = getType(schema, 'B');
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
                    }],
                ],
                messageId: 'MSG_B',
            };
            expect(ty).toEqual(rhs);
        }
        {
            const ty = getType(schema, 'C');
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
                    }, true],
                ],
                baseTypes: [
                    getType(schema, 'A') as any,
                ],
                additionalProps: [
                    [['string'], {
                        kind: 'any',
                        messageId: 'MSG_A.a4',
                    }, true]
                ],
                messageId: 'MSG_C',
            };
            expect(ty).toEqual(rhs);
        }
        {
            const ty = getType(schema, 'D');
            const rhs: TypeAssertion = {
                name: 'D',
                typeName: 'D',
                kind: 'primitive',
                primitiveName: 'string',
                messageId: 'MSG_D',
            };
            expect(ty).toEqual(rhs);
        }
        {
            const ty = getType(schema, 'E');
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
            };
            expect(ty).toEqual(rhs);
        }
        // TODO: export
    });
    // TODO: error message decorators + error reporting
});
