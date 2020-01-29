
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

        // TODO: type, enum, export

        const ty = getType(schema, 'C');

        expect(0).toEqual(0);
    });
    // TODO: error message decorators + error reporting
});
