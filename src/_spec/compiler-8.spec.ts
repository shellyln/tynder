
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

    it("compiler-error-reporting-reporter-2-1", function() {
        expect(0).toEqual(0);
    });
    // TODO: error message decorators + error reporting
});