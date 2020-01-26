
import { TypeAssertion,
         ValidationContext } from '../types';
import { validate,
         getType }           from '../validator';
import { compile }           from '../compiler';



describe("compiler-5", function() {
    it("compiler-spread-optional-length-1", function() {
        const schemas = [compile(`
            type X = [number, string?, boolean?];
        `)];

        {
            expect(Array.from(schemas[0].keys())).toEqual([
                'X',
            ]);
        }
        for (const schema of schemas) {
            {
                const rhs: TypeAssertion = {
                    name: 'X',
                    typeName: 'X',
                    kind: 'sequence',
                    sequence: [{
                        kind: 'primitive',
                        primitiveName: 'number',
                    }, {
                        kind: 'optional',
                        optional: {
                            kind: 'primitive',
                            primitiveName: 'string',
                        },
                    }, {
                        kind: 'optional',
                        optional: {
                            kind: 'primitive',
                            primitiveName: 'boolean',
                        },
                    }],
                };
                const ty = getType(schema, 'X');
                expect(ty).toEqual(rhs);
                expect(validate<any>([], ty)).toEqual(null);

                expect(validate<any>([0], ty)).toEqual({value: [0]});
                expect(validate<any>([0, '1'], ty)).toEqual({value: [0, '1']});
                expect(validate<any>([0, '1', '2'], ty)).toEqual(null);

                expect(validate<any>([0, false], ty)).toEqual(null);
                expect(validate<any>([0, '1', false], ty)).toEqual({value: [0, '1', false]});
                expect(validate<any>([0, '1', '2', false], ty)).toEqual(null);

                expect(validate<any>([0, false, true], ty)).toEqual(null);
                expect(validate<any>([0, '1', false, true], ty)).toEqual(null);
                expect(validate<any>([0, '1', '2', false, true], ty)).toEqual(null);
            }
        }
    });
    // TODO: spread and '?' length
    // TODO: decorators
    // TODO: deep cherrypick and patch
    // TODO: error reporting
    // TODO: directives
    // TODO: import statement
});
