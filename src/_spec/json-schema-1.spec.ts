
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
                [propNames: /^[e-f]$/]: number;
                i?: string;
            }
        `);
        const schema = generateJsonSchemaObject(z);

        const ajv = new Ajv({allErrors: true});
        // tslint:disable-next-line: no-implicit-dependencies
        ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));
        const ajvValidate = ajv.addSchema(schema).getSchema('#/definitions/A');

        expect(ajvValidate({a: 'z', b: 5, c: '123'})).toEqual(true);

        expect(ajvValidate({b: 5, c: '123'})).toEqual(false);
        expect(ajvValidate.errors).toEqual([{
            keyword: 'required',
            dataPath: '',
            schemaPath: '#/required',
            params: { missingProperty: 'a' },
            message: 'should have required property \'a\'',
        }]);

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
            keyword: 'required',
            dataPath: '',
            schemaPath: '#/required',
            params: { missingProperty: 'a' },
            message: 'should have required property \'a\'',
        }, {
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

        expect(ajvValidate({a: 'z', b: 5, c: '123', d: 11})).toEqual(false);
        expect(ajvValidate.errors).toEqual([{
            keyword: 'additionalProperties',
            dataPath: '',
            schemaPath: '#/additionalProperties',
            params: { additionalProperty: 'd' },
            message: 'should NOT have additional properties',
        }]);

        expect(ajvValidate({a: 'z', b: 5, c: '123', d: '11'})).toEqual(false);
        expect(ajvValidate.errors).toEqual([{
            keyword: 'additionalProperties',
            dataPath: '',
            schemaPath: '#/additionalProperties',
            params: { additionalProperty: 'd' },
            message: 'should NOT have additional properties',
        }]);

        expect(ajvValidate({a: 'z', b: 5, c: '123', e: 11})).toEqual(true);

        expect(ajvValidate({a: 'z', b: 5, c: '123', e: '11'})).toEqual(false);
        expect(ajvValidate.errors).toEqual([{
            keyword: 'type',
            dataPath: '[\'e\']',
            schemaPath: '#/patternProperties/%5E%5Be-f%5D%24/type',
            params: { type: 'number' },
            message: 'should be number',
        }]);

        expect(ajvValidate({a: 'z', b: 5, c: '123', i: '11'})).toEqual(true);

        expect(ajvValidate({a: 'z', b: 5, c: '123', i: 11})).toEqual(false);
        expect(ajvValidate.errors).toEqual([{
            keyword: 'type',
            dataPath: '.i',
            schemaPath: '#/properties/i/type',
            params: { type: 'string' },
            message: 'should be string',
        }]);
    });
    it("json-schema-1-2", function() {
        const z = compile(`
            type Foo = string;
            interface A {
                a: Foo;
                @range(3, 5)
                b: number;
                @maxLength(3)
                c: Foo;
                [propNames: /^[e-f]$/]: number;
                i?: string;
            }
            interface B {
                x: A;
            }
        `);
        const schema = generateJsonSchemaObject(z);

        const ajv = new Ajv({allErrors: true});
        // tslint:disable-next-line: no-implicit-dependencies
        ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));
        const ajvValidate = ajv.addSchema(schema).getSchema('#/definitions/B');

        expect(ajvValidate({x: {a: 'z', b: 5, c: '123'}})).toEqual(true);

        expect(ajvValidate({x: {b: 5, c: '123'}})).toEqual(false);
        expect(ajvValidate.errors).toEqual([{
            keyword: 'required',
            dataPath: '.x',
            schemaPath: '#/required',
            params: { missingProperty: 'a' },
            message: 'should have required property \'a\'',
        }]);

        expect(ajvValidate({x: {a: 1, b: 5, c: '123'}})).toEqual(false);
        expect(ajvValidate.errors).toEqual([{
            keyword: 'type',
            dataPath: '.x.a',
            schemaPath: '#/definitions/Foo/type',
            params: { type: 'string' },
            message: 'should be string',
        }]);
    });
    it("json-schema-1-3", function() {
        const z = compile(`
            type Foo = string;
            type A = {
                a: Foo,
                @range(3, 5)
                b: number,
                @maxLength(3)
                c: Foo,
                [propNames: /^[e-f]$/]: number,
                i?: string,
            };
            type B = {
                x: A,
            };
        `);
        const schema = generateJsonSchemaObject(z);

        const ajv = new Ajv({allErrors: true});
        // tslint:disable-next-line: no-implicit-dependencies
        ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));
        const ajvValidate = ajv.addSchema(schema).getSchema('#/definitions/B');

        expect(ajvValidate({x: {a: 'z', b: 5, c: '123'}})).toEqual(true);

        expect(ajvValidate({x: {b: 5, c: '123'}})).toEqual(false);
        expect(ajvValidate.errors).toEqual([{
            keyword: 'required',
            dataPath: '.x',
            schemaPath: '#/required',
            params: { missingProperty: 'a' },
            message: 'should have required property \'a\'',
        }]);

        expect(ajvValidate({x: {a: 1, b: 5, c: '123'}})).toEqual(false);
        expect(ajvValidate.errors).toEqual([{
            keyword: 'type',
            dataPath: '.x.a',
            schemaPath: '#/definitions/Foo/type',
            params: { type: 'string' },
            message: 'should be string',
        }]);
    });
    it("json-schema-1-4", function() {
        const z = compile(`
            type Foo = string|number;
        `);
        const schema = generateJsonSchemaObject(z);

        const ajv = new Ajv({allErrors: true});
        // tslint:disable-next-line: no-implicit-dependencies
        ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));
        const ajvValidate = ajv.addSchema(schema).getSchema('#/definitions/Foo');

        expect(ajvValidate(11)).toEqual(true);
        expect(ajvValidate('11')).toEqual(true);

        expect(ajvValidate(true)).toEqual(false);
        expect(ajvValidate.errors).toEqual([{
            keyword: 'type',
            dataPath: '',
            schemaPath: '#/anyOf/0/type',
            params: { type: 'string' },
            message: 'should be string',
        }, {
            keyword: 'type',
            dataPath: '',
            schemaPath: '#/anyOf/1/type',
            params: { type: 'number' },
            message: 'should be number',
        }, {
            keyword: 'anyOf',
            dataPath: '',
            schemaPath: '#/anyOf',
            params: {},
            message: 'should match some schema in anyOf',
        }]);
    });
    it("json-schema-1-5", function() {
        const z = compile(`
            type Foo = number[];
        `);
        const schema = generateJsonSchemaObject(z);

        const ajv = new Ajv({allErrors: true});
        // tslint:disable-next-line: no-implicit-dependencies
        ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));
        const ajvValidate = ajv.addSchema(schema).getSchema('#/definitions/Foo');

        expect(ajvValidate([11, 13])).toEqual(true);

        expect(ajvValidate([11, 13, '17'])).toEqual(false);
        expect(ajvValidate.errors).toEqual([{
            keyword: 'type',
            dataPath: '[2]',
            schemaPath: '#/items/type',
            params: { type: 'number' },
            message: 'should be number',
        }]);
    });
    it("json-schema-1-6", function() {
        const z = compile(`
            type Foo = (number|boolean)[];
        `);
        const schema = generateJsonSchemaObject(z);

        const ajv = new Ajv({allErrors: true});
        // tslint:disable-next-line: no-implicit-dependencies
        ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));
        const ajvValidate = ajv.addSchema(schema).getSchema('#/definitions/Foo');

        expect(ajvValidate([11, 13, false])).toEqual(true);

        expect(ajvValidate([11, 13, '17'])).toEqual(false);
        expect(ajvValidate.errors).toEqual([{
            keyword: 'type',
            dataPath: '[2]',
            schemaPath: '#/items/anyOf/0/type',
            params: { type: 'number' },
            message: 'should be number',
        }, {
            keyword: 'type',
            dataPath: '[2]',
            schemaPath: '#/items/anyOf/1/type',
            params: { type: 'boolean' },
            message: 'should be boolean',
        }, {
            keyword: 'anyOf',
            dataPath: '[2]',
            schemaPath: '#/items/anyOf',
            params: {},
            message: 'should match some schema in anyOf',
        }]);
    });
    it("json-schema-1-6", function() {
        const z = compile(`
            type Foo = [number, boolean];
        `);
        const schema = generateJsonSchemaObject(z);

        const ajv = new Ajv({allErrors: true});
        // tslint:disable-next-line: no-implicit-dependencies
        ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));
        const ajvValidate = ajv.addSchema(schema).getSchema('#/definitions/Foo');

        expect(ajvValidate([11, false])).toEqual(true);     // NOTE: In JSON Schema, compile to `(number | boolean)[]`
        expect(ajvValidate([false, 11, 13])).toEqual(true);

        expect(ajvValidate([11, 13, '17'])).toEqual(false);
        expect(ajvValidate.errors).toEqual([{
            keyword: 'type',
            dataPath: '[2]',
            schemaPath: '#/items/anyOf/0/type',
            params: { type: 'number' },
            message: 'should be number',
        }, {
            keyword: 'type',
            dataPath: '[2]',
            schemaPath: '#/items/anyOf/1/type',
            params: { type: 'boolean' },
            message: 'should be boolean',
        }, {
            keyword: 'anyOf',
            dataPath: '[2]',
            schemaPath: '#/items/anyOf',
            params: {},
            message: 'should match some schema in anyOf',
        }]);
    });
    it("json-schema-1-7", function() {
        const z = compile(`
            enum Foo {
                A = 'a',
                B = 10,
                C = 'b',
            }
        `);
        const schema = generateJsonSchemaObject(z);

        const ajv = new Ajv({allErrors: true});
        // tslint:disable-next-line: no-implicit-dependencies
        ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));
        const ajvValidate = ajv.addSchema(schema).getSchema('#/definitions/Foo');

        expect(ajvValidate('a')).toEqual(true);
        expect(ajvValidate(10)).toEqual(true);
        expect(ajvValidate('b')).toEqual(true);

        expect(ajvValidate(11)).toEqual(false);
        expect(ajvValidate.errors).toEqual([{
            keyword: 'enum',
            dataPath: '',
            schemaPath: '#/enum',
            params: { allowedValues: ['a', 10, 'b'] },
            message: 'should be equal to one of the allowed values',
        }]);

        expect(ajvValidate('c')).toEqual(false);
        expect(ajvValidate.errors).toEqual([{
            keyword: 'enum',
            dataPath: '',
            schemaPath: '#/enum',
            params: { allowedValues: ['a', 10, 'b'] },
            message: 'should be equal to one of the allowed values',
        }]);
    });
});
