
import { TypeAssertion,
         ObjectAssertion,
         AdditionalPropsMember,
         ValidationContext,
         ErrorMessages }     from '../types';
import { validate,
         getType }           from '../validator';
import { compile }           from '../compiler';
import { serialize,
         deserialize }       from '../serializer';



describe("compiler-7", function() {
    const myMessages: ErrorMessages = {
        invalidDefinition:     ':invalidDefinition: %{name} %{parentType}',
        required:              ':required: %{name} %{parentType}',
        typeUnmatched:         ':typeUnmatched: %{name} %{parentType} %{expectedType}',
        repeatQtyUnmatched:    ':repeatQtyUnmatched: %{name} %{parentType} %{repeatQty}',
        sequenceUnmatched:     ':sequenceUnmatched: %{name} %{parentType}',
        valueRangeUnmatched:   ':valueRangeUnmatched: %{name} %{parentType} %{minValue} %{maxValue}',
        valuePatternUnmatched: ':valuePatternUnmatched: %{name} %{parentType} %{pattern}',
        valueLengthUnmatched:  ':valueLengthUnmatched: %{name} %{parentType} %{minLength} %{maxLength}',
        valueUnmatched:        ':valueUnmatched: %{name} %{parentType} %{expectedValue}',
    };
    function mkmsgobj(s: string): ErrorMessages {
        const m: ErrorMessages = {
            invalidDefinition: s + myMessages.invalidDefinition,
            required: s + myMessages.required,
            typeUnmatched: s + myMessages.typeUnmatched,
            repeatQtyUnmatched: s + myMessages.repeatQtyUnmatched,
            sequenceUnmatched: s + myMessages.sequenceUnmatched,
            valueRangeUnmatched: s + myMessages.valueRangeUnmatched,
            valuePatternUnmatched: s + myMessages.valuePatternUnmatched,
            valueLengthUnmatched: s + myMessages.valueLengthUnmatched,
            valueUnmatched: s + myMessages.valueUnmatched,
        };
        return m;
    }
    function mkmsg(s: string): string {
        return JSON.stringify(mkmsgobj(s));
    }

    it("compiler-error-reporting-5", function() {
        const schema = compile(`
            @msg(${mkmsg('A')})
            interface A {
                @msg(${mkmsg('A.a1')})
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
            const ty = getType(schema, 'A');
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
                        messages: mkmsgobj('A.a1'),
                    }],
                    ['a2', {
                        name: 'a2',
                        kind: 'optional',
                        optional: {
                            kind: 'primitive',
                            primitiveName: 'number',
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
                messages: mkmsgobj('A'),
            };
            expect(ty).toEqual(rhs);
        }
        {
            const ty = getType(schema, 'B');
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
        {
            const ty = getType(schema, 'C');
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
                        messages: mkmsgobj('A.a1'),
                    }, true],
                    ['a2', {
                        name: 'a2',
                        kind: 'optional',
                        optional: {
                            kind: 'primitive',
                            primitiveName: 'number',
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
        {
            const ty = getType(schema, 'D');
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
        {
            const ty = getType(schema, 'E');
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
    });
    it("compiler-error-reporting-6", function() {
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
            const ty = getType(schema, 'A');
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
        {
            const ty = getType(schema, 'B');
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
        {
            const ty = getType(schema, 'C');
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
        {
            const ty = getType(schema, 'D');
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
        {
            const ty = getType(schema, 'E');
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
    });
    // TODO: error message decorators + error reporting
});
