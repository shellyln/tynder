
// tslint:disable-next-line: no-implicit-dependencies no-var-requires
const Ajv = require('ajv');

import { ValidationContext }        from '../types';
import { validate,
         getType }                  from '../validator';
import { pick,
         patch }                    from '../picker';
import { compile }                  from '../compiler';
import { generateJsonSchemaObject } from '../codegen';
import { serialize, deserialize }   from '../serializer';
import * as op                      from '../operators';



describe("json-schema-1", function() {
    it("json-schema-1-1", function() {
        const z = compile(`
            type Foo = string;
            interface A {
                a: Foo;
                @range(3, 5)
                b: number;
                @maxLength(3)
                c: Foo;
            }
        `);
        const schema = generateJsonSchemaObject(z);

        const ajv = new Ajv({allErrors: true});
        // tslint:disable-next-line: no-implicit-dependencies
        ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));
        const ajvValidate = ajv.addSchema(schema).getSchema('#/definitions/A');

        expect(ajvValidate({a: 'z', b: 5, c: '123'})).toEqual(true);
        expect(ajvValidate({b: 5, c: '123'})).toEqual(true);
        expect(ajvValidate({a: 1, b: 5, c: '123'})).toEqual(false);
        expect(ajvValidate.errors).toEqual([{
            keyword: 'type',
            dataPath: '.a',
            schemaPath: '#/definitions/Foo/type',
            params: { type: 'string' },
            message: 'should be string',
        }]);
        expect(ajvValidate({a: 'z', b: 6, c: '123'})).toEqual(false);
        expect(ajvValidate.errors).toEqual([{
            keyword: 'maximum',
            dataPath: '.b',
            schemaPath: '#/properties/b/maximum',
            params: { comparison: '<=', limit: 5, exclusive: false },
            message: 'should be <= 5',
        }]);
        expect(ajvValidate({a: 'z', b: 5, c: '1234'})).toEqual(false);
        expect(ajvValidate.errors).toEqual([{
            keyword: 'maxLength',
            dataPath: '.c',
            schemaPath: '#/properties/c/maxLength',
            params: { limit: 3 },
            message: 'should NOT be longer than 3 characters',
        }]);
        expect(ajvValidate({b: 6, c: '1234'})).toEqual(false);
        expect(ajvValidate.errors).toEqual([{
            keyword: 'maximum',
            dataPath: '.b',
            schemaPath: '#/properties/b/maximum',
            params: { comparison: '<=', limit: 5, exclusive: false },
            message: 'should be <= 5',
        }, {
            keyword: 'maxLength',
            dataPath: '.c',
            schemaPath: '#/properties/c/maxLength',
            params: { limit: 3 },
            message: 'should NOT be longer than 3 characters',
        }]);
    });
});
