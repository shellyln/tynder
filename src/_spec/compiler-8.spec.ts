
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



describe("compiler-8", function() {
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

    it("compiler-error-reporting-reporter-2-1", function() {
        // no tests (single type test pattern of compiler-error-reporting-reporter-1-1)
    });
    it("compiler-error-reporting-reporter-2-2", function() {
        const schemas = [compile(`
            @msg(${mkmsg('A')})
            export type A = string;
        `), compile(`
            export type A = @msg(${mkmsg('A')}) string;
        `)];
        for (const schema of schemas) {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                schema,
            };
            expect(validate(1, getType(schema, 'A'), ctx)).toEqual(null);
            expect(ctx.errors).toEqual([{
                code: 'TypeUnmatched',
                message: 'A:typeUnmatched: ? A string',
                dataPath: 'A',
                constraints: {},
                value: 1,
            }]);
        }
    });
    it("compiler-error-reporting-reporter-2-2b", function() {
        const schemas = [compile(`
            @msg(${mkmsg('A')})
            export type A = string;
        `), compile(`
            export type A = @msg(${mkmsg('A')}) string;
        `)];
        for (const schema of schemas) {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                schema,
            };
            expect(validate([1], getType(schema, 'A'), ctx)).toEqual(null);
            expect(ctx.errors).toEqual([{
                code: 'TypeUnmatched',
                message: 'A:typeUnmatched: ? A string',
                dataPath: 'A',
                constraints: {},
            }]);
        }
    });
    it("compiler-error-reporting-reporter-2-2c", function() {
        const schemas = [compile(`
            @msg(${mkmsg('A')})
            export type A = string[];
        `), compile(`
            export type A = @msg(${mkmsg('A')}) (string[]);
        `)];
        for (const schema of schemas) {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                schema,
            };
            expect(validate('1', getType(schema, 'A'), ctx)).toEqual(null);
            expect(ctx.errors).toEqual([{
                code: 'TypeUnmatched',
                message: 'A:typeUnmatched: ? A (repeated string)', // TODO:
                dataPath: 'A',
                constraints: {},
                value: '1',
            }]);
        }
    });
    it("compiler-error-reporting-reporter-2-2d", function() {
        const schemas = [compile(`
            @msg(${mkmsg('A')})
            export type A = string[];
        `), compile(`
            export type A = @msg(${mkmsg('A')}) (string[]);
        `)];
        for (const schema of schemas) {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                schema,
            };
            expect(validate([1], getType(schema, 'A'), ctx)).toEqual(null);
            expect(ctx.errors).toEqual([{
                code: 'TypeUnmatched',
                message: '"repeated item of ?" of "?" should be type "string".', // TODO:
                dataPath: 'A.(0:repeated)',
                constraints: {},
                value: 1,
            }]);
        }
    });
    it("compiler-error-reporting-reporter-2-2e", function() {
        const schemas = [compile(`
            @msg(${mkmsg('A')})
            export type A = [string];
        `), compile(`
            export type A = @msg(${mkmsg('A')}) [string];
        `)];
        for (const schema of schemas) {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                schema,
            };
            expect(validate('1', getType(schema, 'A'), ctx)).toEqual(null);
            expect(ctx.errors).toEqual([{
                code: 'TypeUnmatched',
                message: 'A:typeUnmatched: ? A (sequence)', // TODO:
                dataPath: 'A',
                constraints: {},
                value: '1',
            }]);
        }
    });
    it("compiler-error-reporting-reporter-2-2f", function() {
        const schemas = [compile(`
            @msg(${mkmsg('A')})
            export type A = [string];
        `), compile(`
            export type A = @msg(${mkmsg('A')}) [string];
        `)];
        for (const schema of schemas) {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                schema,
            };
            expect(validate([1], getType(schema, 'A'), ctx)).toEqual(null);
            expect(ctx.errors).toEqual([{
                code: 'TypeUnmatched',
                message: '"sequence item of ?" of "?" should be type "string".', // TODO:
                dataPath: 'A.(0:sequence)',
                constraints: {},
                value: 1,
            }]);
        }
    });
    it("compiler-error-reporting-reporter-2-3", function() {
        const schemas = [compile(`
            @msg(${mkmsg('A')})
            export type A =
                @range(3, 5)
                number;
        `), compile(`
            export type A =
                @msg(${mkmsg('A')})
                @range(3, 5)
                number;
        `)];
        for (const schema of schemas) {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                schema,
            };
            expect(validate(1, getType(schema, 'A'), ctx)).toEqual(null);
            expect(ctx.errors).toEqual([{
                code: 'ValueRangeUnmatched',
                message: 'A:valueRangeUnmatched: ? A 3 5', // TODO:
                dataPath: 'A',
                constraints: {minValue: 3, maxValue: 5},
                value: 1,
            }]);
        }
    });
    it("compiler-error-reporting-reporter-2-4", function() {
        const schemas = [compile(`
            @msg(${mkmsg('A')})
            export type A =
                @minLength(3) @maxLength(5)
                string;
        `), compile(`
            export type A =
                @msg(${mkmsg('A')})
                @minLength(3) @maxLength(5)
                string;
        `)];
        for (const schema of schemas) {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                schema,
            };
            expect(validate('1', getType(schema, 'A'), ctx)).toEqual(null);
            expect(ctx.errors).toEqual([{
                code: 'ValueLengthUnmatched',
                message: 'A:valueLengthUnmatched: ? A 3 5',
                dataPath: 'A',
                constraints: {minLength: 3, maxLength: 5},
                value: '1',
            }]);
        }
    });
    it("compiler-error-reporting-reporter-2-5", function() {
        const schemas = [compile(`
            @msg(${mkmsg('A')})
            export type A =
                @match(/^[0-9]+$/)
                string;
        `), compile(`
            export type A =
                @msg(${mkmsg('A')})
                @match(/^[0-9]+$/)
                string;
        `)];
        for (const schema of schemas) {
            for (const ty of [getType(deserialize(serialize(schema)), 'A'), getType(schema, 'A')]) {
                const ctx: Partial<ValidationContext> = {
                    checkAll: true,
                    schema,
                };
                expect(validate('A', ty, ctx)).toEqual(null);
                expect(ctx.errors).toEqual([{
                    code: 'ValuePatternUnmatched',
                    message: 'A:valuePatternUnmatched: ? A /^[0-9]+$/',
                    dataPath: 'A',
                    constraints: {pattern: '/^[0-9]+$/'},
                    value: 'A',
                }]);
            }
        }
    });
    it("compiler-error-reporting-reporter-2-5b", function() {
        const schemas = [compile(`
            @msg(${mkmsg('A')})
            export type A =
                @match(/^[0-9]+$/gi)
                string;
        `), compile(`
            export type A =
                @msg(${mkmsg('A')})
                @match(/^[0-9]+$/gi)
                string;
        `)];
        for (const schema of schemas) {
            for (const ty of [getType(deserialize(serialize(schema)), 'A'), getType(schema, 'A')]) {
                const ctx: Partial<ValidationContext> = {
                    checkAll: true,
                    schema,
                };
                expect(validate('A', ty, ctx)).toEqual(null);
                expect(ctx.errors).toEqual([{
                    code: 'ValuePatternUnmatched',
                    message: 'A:valuePatternUnmatched: ? A /^[0-9]+$/gi',
                    dataPath: 'A',
                    constraints: {pattern: '/^[0-9]+$/gi'},
                    value: 'A',
                }]);
            }
        }
    });
    it("compiler-error-reporting-reporter-2-6", function() {
        const schemas = [compile(`
            @msg(${mkmsg('A')})
            export type A =
                5;
        `), compile(`
            export type A =
                @msg(${mkmsg('A')})
                5;
        `)];
        for (const schema of schemas) {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                schema,
            };
            expect(validate(4, getType(schema, 'A'), ctx)).toEqual(null);
            expect(ctx.errors).toEqual([{
                code: 'ValueUnmatched',
                message: 'A:valueUnmatched: ? A 5',
                dataPath: 'A',
                constraints: {},
                value: 4,
            }]);
        }
    });
    it("compiler-error-reporting-reporter-2-7a", function() {
        const schemas = [compile(`
            @msg(${mkmsg('A')})
            export type A =
                [...<string,3..5>];
        `), compile(`
            export type A =
                @msg(${mkmsg('A')})
                [...<string,3..5>];
        `)];
        for (const schema of schemas) {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                schema,
            };
            expect(validate([1], getType(schema, 'A'), ctx)).toEqual(null);
            expect(ctx.errors).toEqual([{
                code: 'TypeUnmatched',                                           // TODO:
                message: '"sequence item of ?" of "?" should be type "string".', // TODO:
                dataPath: 'A.(0:sequence)',
                constraints: {min: 3, max: 5},
            }]);
        }
    });
    it("compiler-error-reporting-reporter-2-7b", function() {
        const schemas = [compile(`
            @msg(${mkmsg('A')})
            export type A =
                [...<string,3..5>];
        `), compile(`
            export type A =
                @msg(${mkmsg('A')})
                [...<string,3..5>];
        `)];
        for (const schema of schemas) {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                schema,
            };
            expect(validate(['1', '2'], getType(schema, 'A'), ctx)).toEqual(null);
            expect(ctx.errors).toEqual([{
                code: 'RepeatQtyUnmatched',
                message: '"sequence item of ?" of "?" should repeat 3..5 times.', // TODO:
                dataPath: 'A.(2:sequence)',
                constraints: {min: 3, max: 5},
            }]);
        }
    });
    it("compiler-error-reporting-reporter-2-7c", function() {
        const schemas = [compile(`
            @msg(${mkmsg('A')})
            export type A =
                [string?];
        `), compile(`
            export type A =
                @msg(${mkmsg('A')})
                [string?];
        `)];
        for (const schema of schemas) {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                schema,
            };
            expect(validate([1], getType(schema, 'A'), ctx)).toEqual(null);
            expect(ctx.errors).toEqual([{
                code: 'SequenceUnmatched',
                message: 'A:sequenceUnmatched: ? A',
                dataPath: 'A',
                constraints: {},
            }]);
        }
    });
    it("compiler-error-reporting-reporter-2-7d", function() {
        const schemas = [compile(`
            @msg(${mkmsg('A')})
            export type A =
                [string?];
        `), compile(`
            export type A =
                @msg(${mkmsg('A')})
                [string?];
        `)];
        for (const schema of schemas) {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                schema,
            };
            expect(validate(['1', '2'], getType(schema, 'A'), ctx)).toEqual(null);
            expect(ctx.errors).toEqual([{
                code: 'RepeatQtyUnmatched',
                message: '"sequence item of ?" of "?" should repeat 0..1 times.', // TODO:
                dataPath: 'A.(2:sequence)',
                constraints: {},
            }]);
        }
    });
    it("compiler-error-reporting-reporter-3", function() {
        const schemas = [compile(`
            export type A = string;
        `)];
        for (const schema of schemas) {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                schema,
                errorMessages: mkmsgobj('G'),
            };
            expect(validate(1, getType(schema, 'A'), ctx)).toEqual(null);
            expect(ctx.errors).toEqual([{
                code: 'TypeUnmatched',
                message: 'G:typeUnmatched: ? A string',
                dataPath: 'A',
                constraints: {},
                value: 1,
            }]);
        }
    });
});
