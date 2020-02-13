
import { TypeAssertion,
         ValidationContext } from '../types';
import { validate,
         getType }           from '../validator';
import { pick,
         patch }             from '../picker';
import { compile }           from '../compiler';
import { generateTypeScriptCode } from '../codegen';
import { serialize,
         deserialize }       from '../serializer';



describe("fix-1", function() {
    it("fix-interface-member-delimiter-1", function() {
        const schemas = [compile(`
            interface O {
                a: string;
                b: number;
            }
            type P =  {
                a: string;
                b: number;
            };
        `), compile(`
            interface O {
                a: string;
                b: number
            }
            type P = {
                a: string;
                b: number
            };
        `), compile(`
            interface O {
                a: string,
                b: number,
            }
            type P = {
                a: string,
                b: number,
            };
        `), compile(`
            interface O {
                a: string,
                b: number
            }
            type P = {
                a: string,
                b: number
            };
        `)]; // <- no errors
        {
            expect(Array.from(schemas[0].keys())).toEqual([
                'O', 'P',
            ]);
        }
        for (const schema of schemas) {
            {
                const rhs: TypeAssertion = {
                    name: 'O',
                    typeName: 'O',
                    kind: 'object',
                    members: [
                        ['a', {
                            name: 'a',
                            kind: 'primitive',
                            primitiveName: 'string',
                        }],
                        ['b', {
                            name: 'b',
                            kind: 'primitive',
                            primitiveName: 'number',
                        }],
                    ],
                };
                const ty = getType(schema, 'O');
                expect(ty).toEqual(rhs);
                expect(validate<any>({a: '', b: 0}, ty)).toEqual({value: {a: '', b: 0}});
            }
            {
                const rhs: TypeAssertion = {
                    name: 'P',
                    typeName: 'P',
                    kind: 'object',
                    members: [
                        ['a', {
                            name: 'a',
                            kind: 'primitive',
                            primitiveName: 'string',
                        }],
                        ['b', {
                            name: 'b',
                            kind: 'primitive',
                            primitiveName: 'number',
                        }],
                    ],
                };
                const ty = getType(schema, 'P');
                expect(ty).toEqual(rhs);
                expect(validate<any>({a: '', b: 0}, ty)).toEqual({value: {a: '', b: 0}});
            }
        }
    });
    it("fix-improve-error-messages-1", function() {
        const schemas = [compile(`
            @msgId()
            interface O {
            }
            @msgId
            type P = {
            };
            enum R {
            }
        `)];
        for (const schema of schemas) {
            {
                expect(1).toEqual(1);
            }
        }
    });
});
