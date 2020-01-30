
import { TypeAssertion,
         ObjectAssertion,
         AdditionalPropsMember,
         ValidationContext } from '../types';
import { validate,
         getType }           from '../validator';
import { compile }           from '../compiler';
import { serialize,
         deserialize }       from '../serializer';



describe("compiler-7", function() {
    it("compiler-error-reporting-5", function() {
        expect(0).toEqual(0);
    });
    // TODO: error message decorators + error reporting
});
