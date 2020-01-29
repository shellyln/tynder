
import { TypeAssertion,
         ValidationContext } from '../types';
import { validate,
         getType }           from '../validator';
import { compile }           from '../compiler';
import { serialize,
         deserialize }       from '../serializer';



describe("compiler-6", function() {
    it("compiler-error-reporting-1", function() {
        const schema = compile(`
            interface A {
                a1: string;
                a2?: number;
                a3: string[];
                [propNames: string]: any;
            }
            interface B {
                b1: boolean;
                b2: A;
            }
            interface C {
                c1: string;
                c2: B;
                c3?: A;
            }
        `);

        const ty = getType(schema, 'C');

        expect(0).toEqual(0);
    });
    // TODO: error message decorators + error reporting
});
