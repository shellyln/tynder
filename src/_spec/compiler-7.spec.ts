
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
        invalidDefinition:       ':invalidDefinition: %{name} %{parentType}',
        required:                ':required: %{name} %{parentType}',
        typeUnmatched:           ':typeUnmatched: %{name} %{parentType} %{expectedType}',
        additionalPropUnmatched: ':additionalPropUnmatched %{name} %{parentType}',
        repeatQtyUnmatched:      ':repeatQtyUnmatched: %{name} %{parentType} %{repeatQty}',
        sequenceUnmatched:       ':sequenceUnmatched: %{name} %{parentType}',
        valueRangeUnmatched:     ':valueRangeUnmatched: %{name} %{parentType} %{minValue} %{maxValue}',
        valuePatternUnmatched:   ':valuePatternUnmatched: %{name} %{parentType} %{pattern}',
        valueLengthUnmatched:    ':valueLengthUnmatched: %{name} %{parentType} %{minLength} %{maxLength}',
        valueUnmatched:          ':valueUnmatched: %{name} %{parentType} %{expectedValue}',
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
            @msg(${mkmsg('C')})
            interface C extends A {
                @msg('MSG_C.c1')
                c1: string;
            }
            /** Comment D */
            @msg(${mkmsg('D')})
            type D = string;
            /** Comment E */
            @msg(${mkmsg('E')})
            enum E {
                P,
                Q,
                R,
            }
            interface F {
                @msg(${mkmsg('F.f1')})
                f1: B;
                @msg('MSG_F.f2')
                f2?: A;
            }
        `);

        {
            expect(Array.from(schema.keys())).toEqual([
                'A', 'B', 'C', 'D', 'E', 'F',
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
                        message: 'MSG_B.b2', // NOTE: 'messages' is overwritten by 'B.b2's 'message'. Only one of 'message' or 'messages' can be set.
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
                messages: mkmsgobj('C'),
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
                messages: mkmsgobj('D'),
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
                messages: mkmsgobj('E'),
                docComment: 'Comment E',
            };
            expect(ty).toEqual(rhs);
        }
        {
            const ty = getType(schema, 'F');
            expect(false).toEqual(schema.get('F')?.exported as any);
            const rhs: TypeAssertion = {
                name: 'F',
                typeName: 'F',
                kind: 'object',
                members: [
                    ['f1', {
                        name: 'f1',
                        typeName: 'B',
                        kind: 'object',
                        members: [...(getType(schema, 'B') as ObjectAssertion).members],
                        messages: mkmsgobj('F.f1'), // NOTE: 'messages' is overwritten by 'B.b2's 'message'. Only one of 'message' or 'messages' can be set.
                        docComment: 'Comment B',
                    }],
                    ['f2', {
                        name: 'f2',
                        typeName: 'A',
                        kind: 'optional',
                        optional: {
                            name: 'A',
                            typeName: 'A',
                            kind: 'object',
                            members: [...(getType(schema, 'A') as ObjectAssertion).members],
                            additionalProps: [...((getType(schema, 'A') as ObjectAssertion).additionalProps as AdditionalPropsMember[])],
                            message: 'MSG_F.f2',
                        },
                        message: 'MSG_F.f2',
                    }],
                ],
            };
            expect(ty).toEqual(rhs);
        }
    });
    it("compiler-error-reporting-6", function() {
        const schema = compile(`
            @msg(${mkmsg('A')})
            export interface A {
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
            export interface B {
                @msg('MSG_B.b1')
                b1: boolean;
                /** Comment B.b2 */
                @msg('MSG_B.b2')
                b2: A;
            }
            @msg(${mkmsg('C')})
            export interface C extends A {
                @msg('MSG_C.c1')
                c1: string;
            }
            /** Comment D */
            @msg(${mkmsg('D')})
            export type D = string;
            /** Comment E */
            @msg(${mkmsg('E')})
            export enum E {
                P,
                Q,
                R,
            }
            export interface F {
                @msg(${mkmsg('F.f1')})
                f1: B;
                @msg('MSG_F.f2')
                f2?: A;
            }
        `);

        {
            expect(Array.from(schema.keys())).toEqual([
                'A', 'B', 'C', 'D', 'E', 'F',
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
                        messages: mkmsgobj('A.a1'),
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
                messages: mkmsgobj('A'),
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
                        message: 'MSG_B.b2', // NOTE: 'messages' is overwritten by 'B.b2's 'message'. Only one of 'message' or 'messages' can be set.
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
                        messages: mkmsgobj('A.a1'),
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
                messages: mkmsgobj('C'),
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
                messages: mkmsgobj('D'),
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
                messages: mkmsgobj('E'),
                docComment: 'Comment E',
            };
            expect(ty).toEqual(rhs);
        }
        {
            const ty = getType(schema, 'F');
            expect(true).toEqual(schema.get('F')?.exported as any);
            const rhs: TypeAssertion = {
                name: 'F',
                typeName: 'F',
                kind: 'object',
                members: [
                    ['f1', {
                        name: 'f1',
                        typeName: 'B',
                        kind: 'object',
                        members: [...(getType(schema, 'B') as ObjectAssertion).members],
                        messages: mkmsgobj('F.f1'), // NOTE: 'messages' is overwritten by 'B.b2's 'message'. Only one of 'message' or 'messages' can be set.
                        docComment: 'Comment B',
                    }],
                    ['f2', {
                        name: 'f2',
                        typeName: 'A',
                        kind: 'optional',
                        optional: {
                            name: 'A',
                            typeName: 'A',
                            kind: 'object',
                            members: [...(getType(schema, 'A') as ObjectAssertion).members],
                            additionalProps: [...((getType(schema, 'A') as ObjectAssertion).additionalProps as AdditionalPropsMember[])],
                            message: 'MSG_F.f2',
                        },
                        message: 'MSG_F.f2',
                    }],
                ],
            };
            expect(ty).toEqual(rhs);
        }
    });
    it("compiler-error-reporting-reporter-1-1", function() {
        const schema = compile(`
            @msg(${mkmsg('A')})
            export interface A {
                @msg(${mkmsg('A.a1')})
                a1: string;
            }
        `);
        const ctx: Partial<ValidationContext> = {
            checkAll: true,
            schema,
        };
        expect(validate({}, getType(schema, 'A'), ctx)).toEqual(null);
        expect(ctx.errors).toEqual([{
            code: 'Required',
            message: 'A.a1:required: a1 A',
            dataPath: 'A.a1',
            constraints: {},
        }]);
    });
    it("compiler-error-reporting-reporter-1-2", function() {
        const schemas = [compile(`
            @msg(${mkmsg('A')})
            export interface A {
                @msg(${mkmsg('A.a1')})
                a1: string;
            }
        `), compile(`
            @msg(${mkmsg('A')})
            export interface A {
                @msg(${mkmsg('A.a1')})
                a1?: string;
            }
        `)];
        for (const schema of schemas) {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                schema,
            };
            expect(validate({a1: 1}, getType(schema, 'A'), ctx)).toEqual(null);
            expect(ctx.errors).toEqual([{
                code: 'TypeUnmatched',
                message: 'A.a1:typeUnmatched: a1 A string',
                dataPath: 'A.a1',
                constraints: {},
                value: 1,
            }]);
        }
    });
    it("compiler-error-reporting-reporter-1-2b", function() {
        const schemas = [compile(`
            @msg(${mkmsg('A')})
            export interface A {
                @msg(${mkmsg('A.a1')})
                a1: string;
            }
        `), compile(`
            @msg(${mkmsg('A')})
            export interface A {
                @msg(${mkmsg('A.a1')})
                a1?: string;
            }
        `)];
        for (const schema of schemas) {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                schema,
            };
            expect(validate({a1: [1]}, getType(schema, 'A'), ctx)).toEqual(null);
            expect(ctx.errors).toEqual([{
                code: 'TypeUnmatched',
                message: 'A.a1:typeUnmatched: a1 A string',
                dataPath: 'A.a1',
                constraints: {},
            }]);
        }
    });
    it("compiler-error-reporting-reporter-1-2c", function() {
        const schemas = [compile(`
            @msg(${mkmsg('A')})
            export interface A {
                @msg(${mkmsg('A.a1')})
                a1: string[];
            }
        `), compile(`
            @msg(${mkmsg('A')})
            export interface A {
                @msg(${mkmsg('A.a1')})
                a1?: string[];
            }
        `)];
        for (const schema of schemas) {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                schema,
            };
            expect(validate({a1: '1'}, getType(schema, 'A'), ctx)).toEqual(null);
            expect(ctx.errors).toEqual([{
                code: 'TypeUnmatched',
                message: 'A.a1:typeUnmatched: a1 A (repeated string)',
                dataPath: 'A.a1',
                constraints: {},
                value: '1',
            }]);
        }
    });
    it("compiler-error-reporting-reporter-1-2d", function() {
        const schemas = [compile(`
            @msg(${mkmsg('A')})
            export interface A {
                @msg(${mkmsg('A.a1')})
                a1: string[];
            }
        `), compile(`
            @msg(${mkmsg('A')})
            export interface A {
                @msg(${mkmsg('A.a1')})
                a1?: string[];
            }
        `)];
        for (const schema of schemas) {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                schema,
            };
            expect(validate({a1: [1]}, getType(schema, 'A'), ctx)).toEqual(null);
            expect(ctx.errors).toEqual([{
                code: 'TypeUnmatched',
                message: '"repeated item of a1" of "A" should be type "string".', // TODO:
                dataPath: 'A.a1.(0:repeated)',
                constraints: {},
                value: 1,
            }]);
        }
    });
    it("compiler-error-reporting-reporter-1-2e", function() {
        const schemas = [compile(`
            @msg(${mkmsg('A')})
            export interface A {
                @msg(${mkmsg('A.a1')})
                a1: [string];
            }
        `), compile(`
            @msg(${mkmsg('A')})
            export interface A {
                @msg(${mkmsg('A.a1')})
                a1?: [string];
            }
        `)];
        for (const schema of schemas) {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                schema,
            };
            expect(validate({a1: '1'}, getType(schema, 'A'), ctx)).toEqual(null);
            expect(ctx.errors).toEqual([{
                code: 'TypeUnmatched',
                message: 'A.a1:typeUnmatched: a1 A (sequence)',
                dataPath: 'A.a1',
                constraints: {},
                value: '1',
            }]);
        }
    });
    it("compiler-error-reporting-reporter-1-2f", function() {
        const schemas = [compile(`
            @msg(${mkmsg('A')})
            export interface A {
                @msg(${mkmsg('A.a1')})
                a1: [string];
            }
        `), compile(`
            @msg(${mkmsg('A')})
            export interface A {
                @msg(${mkmsg('A.a1')})
                a1?: [string];
            }
        `)];
        for (const schema of schemas) {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                schema,
            };
            expect(validate({a1: [1]}, getType(schema, 'A'), ctx)).toEqual(null);
            expect(ctx.errors).toEqual([{
                code: 'TypeUnmatched',
                message: '"sequence item of a1" of "A" should be type "string".', // TODO:
                dataPath: 'A.a1.(0:sequence)',
                constraints: {},
                value: 1,
            }]);
        }
    });
    it("compiler-error-reporting-reporter-1-3", function() {
        const schemas = [compile(`
            @msg(${mkmsg('A')})
            export interface A {
                @msg(${mkmsg('A.a1')})
                @range(3, 5)
                a1: number;
            }
        `), compile(`
            @msg(${mkmsg('A')})
            export interface A {
                @msg(${mkmsg('A.a1')})
                @range(3, 5)
                a1?: number;
            }
        `)];
        for (const schema of schemas) {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                schema,
            };
            expect(validate({a1: 1}, getType(schema, 'A'), ctx)).toEqual(null);
            expect(ctx.errors).toEqual([{
                code: 'ValueRangeUnmatched',
                message: 'A.a1:valueRangeUnmatched: a1 A 3 5',
                dataPath: 'A.a1',
                constraints: {minValue: 3, maxValue: 5},
                value: 1,
            }]);
        }
    });
    it("compiler-error-reporting-reporter-1-4", function() {
        const schemas = [compile(`
            @msg(${mkmsg('A')})
            export interface A {
                @msg(${mkmsg('A.a1')})
                @minLength(3) @maxLength(5)
                a1: string;
            }
        `), compile(`
            @msg(${mkmsg('A')})
            export interface A {
                @msg(${mkmsg('A.a1')})
                @minLength(3) @maxLength(5)
                a1?: string;
            }
        `)];
        for (const schema of schemas) {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                schema,
            };
            expect(validate({a1: '1'}, getType(schema, 'A'), ctx)).toEqual(null);
            expect(ctx.errors).toEqual([{
                code: 'ValueLengthUnmatched',
                message: 'A.a1:valueLengthUnmatched: a1 A 3 5',
                dataPath: 'A.a1',
                constraints: {minLength: 3, maxLength: 5},
                value: '1',
            }]);
        }
    });
    it("compiler-error-reporting-reporter-1-5", function() {
        const schemas = [compile(`
            @msg(${mkmsg('A')})
            export interface A {
                @msg(${mkmsg('A.a1')})
                @match(/^[0-9]+$/)
                a1: string;
            }
        `), compile(`
            @msg(${mkmsg('A')})
            export interface A {
                @msg(${mkmsg('A.a1')})
                @match(/^[0-9]+$/)
                a1?: string;
            }
        `)];
        for (const schema of schemas) {
            for (const ty of [getType(deserialize(serialize(schema)), 'A'), getType(schema, 'A')]) {
                const ctx: Partial<ValidationContext> = {
                    checkAll: true,
                    schema,
                };
                expect(validate({a1: 'A'}, ty, ctx)).toEqual(null);
                expect(ctx.errors).toEqual([{
                    code: 'ValuePatternUnmatched',
                    message: 'A.a1:valuePatternUnmatched: a1 A /^[0-9]+$/',
                    dataPath: 'A.a1',
                    constraints: {pattern: '/^[0-9]+$/'},
                    value: 'A',
                }]);
            }
        }
    });
    it("compiler-error-reporting-reporter-1-5b", function() {
        const schemas = [compile(`
            @msg(${mkmsg('A')})
            export interface A {
                @msg(${mkmsg('A.a1')})
                @match(/^[0-9]+$/gi)
                a1: string;
            }
        `), compile(`
            @msg(${mkmsg('A')})
            export interface A {
                @msg(${mkmsg('A.a1')})
                @match(/^[0-9]+$/gi)
                a1?: string;
            }
        `)];
        for (const schema of schemas) {
            for (const ty of [getType(deserialize(serialize(schema)), 'A'), getType(schema, 'A')]) {
                const ctx: Partial<ValidationContext> = {
                    checkAll: true,
                    schema,
                };
                expect(validate({a1: 'A'}, ty, ctx)).toEqual(null);
                expect(ctx.errors).toEqual([{
                    code: 'ValuePatternUnmatched',
                    message: 'A.a1:valuePatternUnmatched: a1 A /^[0-9]+$/gi',
                    dataPath: 'A.a1',
                    constraints: {pattern: '/^[0-9]+$/gi'},
                    value: 'A',
                }]);
            }
        }
    });
    it("compiler-error-reporting-reporter-1-6", function() {
        const schemas = [compile(`
            @msg(${mkmsg('A')})
            export interface A {
                @msg(${mkmsg('A.a1')})
                a1: 5;
            }
        `), compile(`
            @msg(${mkmsg('A')})
            export interface A {
                @msg(${mkmsg('A.a1')})
                a1?: 5;
            }
        `)];
        for (const schema of schemas) {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                schema,
            };
            expect(validate({a1: 4}, getType(schema, 'A'), ctx)).toEqual(null);
            expect(ctx.errors).toEqual([{
                code: 'ValueUnmatched',
                message: 'A.a1:valueUnmatched: a1 A 5',
                dataPath: 'A.a1',
                constraints: {},
                value: 4,
            }]);
        }
    });
    it("compiler-error-reporting-reporter-1-7a", function() {
        const schemas = [compile(`
            @msg(${mkmsg('A')})
            export interface A {
                @msg(${mkmsg('A.a1')})
                a1: [...<string,3..5>];
            }
        `), compile(`
            @msg(${mkmsg('A')})
            export interface A {
                @msg(${mkmsg('A.a1')})
                a1?: [...<string,3..5>];
            }
        `)];
        for (const schema of schemas) {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                schema,
            };
            expect(validate({a1: [1]}, getType(schema, 'A'), ctx)).toEqual(null);
            expect(ctx.errors).toEqual([{
                code: 'TypeUnmatched',                                            // TODO: expect SequenceUnmatched?
                message: '"sequence item of a1" of "A" should be type "string".', // TODO: custom error message is ignored
                dataPath: 'A.a1.(0:sequence)',
                constraints: {min: 3, max: 5},
            }]);
        }
    });
    it("compiler-error-reporting-reporter-1-7b", function() {
        const schemas = [compile(`
            @msg(${mkmsg('A')})
            export interface A {
                @msg(${mkmsg('A.a1')})
                a1: [...<string,3..5>];
            }
        `), compile(`
            @msg(${mkmsg('A')})
            export interface A {
                @msg(${mkmsg('A.a1')})
                a1?: [...<string,3..5>];
            }
        `)];
        for (const schema of schemas) {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                schema,
            };
            expect(validate({a1: ['1', '2']}, getType(schema, 'A'), ctx)).toEqual(null);
            expect(ctx.errors).toEqual([{
                code: 'RepeatQtyUnmatched',
                message: '"sequence item of a1" of "A" should repeat 3..5 times.', // TODO: custom error message is ignored
                dataPath: 'A.a1.(2:sequence)',
                constraints: {min: 3, max: 5},
            }]);
        }
    });
    it("compiler-error-reporting-reporter-1-7c", function() {
        const schemas = [compile(`
            @msg(${mkmsg('A')})
            export interface A {
                @msg(${mkmsg('A.a1')})
                a1: [string?];
            }
        `), compile(`
            @msg(${mkmsg('A')})
            export interface A {
                @msg(${mkmsg('A.a1')})
                a1?: [string?];
            }
        `)];
        for (const schema of schemas) {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                schema,
            };
            expect(validate({a1: [1]}, getType(schema, 'A'), ctx)).toEqual(null);
            expect(ctx.errors).toEqual([{
                code: 'SequenceUnmatched',
                message: 'A.a1:sequenceUnmatched: a1 A',
                dataPath: 'A.a1',
                constraints: {},
            }]);
        }
    });
    it("compiler-error-reporting-reporter-1-7d", function() {
        const schemas = [compile(`
            @msg(${mkmsg('A')})
            export interface A {
                @msg(${mkmsg('A.a1')})
                a1: [string?];
            }
        `), compile(`
            @msg(${mkmsg('A')})
            export interface A {
                @msg(${mkmsg('A.a1')})
                a1?: [string?];
            }
        `)];
        for (const schema of schemas) {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                schema,
            };
            expect(validate({a1: ['1', '2']}, getType(schema, 'A'), ctx)).toEqual(null);
            expect(ctx.errors).toEqual([{
                code: 'RepeatQtyUnmatched',
                message: '"sequence item of a1" of "A" should repeat 0..1 times.', // TODO: custom error message is ignored
                dataPath: 'A.a1.(2:sequence)',
                constraints: {},
            }]);
        }
    });
});
