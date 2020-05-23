
import { TypeAssertion,
         ValidationContext } from '../types';
import { validate,
         isType,
         assertType,
         getType }           from '../validator';
import { pick,
         patch }             from '../picker';
import { compile }           from '../compiler';
import { generateTypeScriptCode } from '../codegen';
import { serialize,
         deserialize,
         deserializeFromObject } from '../serializer';
import { stereotypes as dateStereotypes } from '../stereotypes/date';
import { constraints as uniqueConstraints } from '../constraints/unique';
import  primitivesSchema,
       { Schema as PrimitivesSchema } from '../../examples/schema/_compiled/primitives';



describe("fix-5", function() {
    it("unique-1", function() {
        const ty = getType(deserializeFromObject(primitivesSchema), PrimitivesSchema.NumberType);
        expect(ty).toEqual({
            kind: 'primitive',
            primitiveName: 'number',
            typeName: 'NumberType',
            name: 'NumberType',
        });
    });
});
