
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



    it("compiler-decorators-1", function() {
        const schemas = [compile(`
            type X = @minLength(3) @maxLength(5) string;
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
                    kind: 'primitive',
                    primitiveName: 'string',
                    minLength: 3,
                    maxLength: 5,
                };
                const ty = getType(schema, 'X');
                expect(ty).toEqual(rhs);
                expect(validate<any>('', ty)).toEqual(null);
                expect(validate<any>('1', ty)).toEqual(null);
                expect(validate<any>('12', ty)).toEqual(null);
                expect(validate<any>('123', ty)).toEqual({value: '123'});
                expect(validate<any>('1234', ty)).toEqual({value: '1234'});
                expect(validate<any>('12345', ty)).toEqual({value: '12345'});
                expect(validate<any>('123456', ty)).toEqual(null);
            }
        }
    });
    it("compiler-decorators-2", function() {
        const schemas = [compile(`
            interface X {
                a: @minLength(3) @maxLength(5) string;
            }
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
                    kind: 'object',
                    members: [
                        ['a', {
                            name: 'a',
                            kind: 'primitive',
                            primitiveName: 'string',
                            minLength: 3,
                            maxLength: 5,
                        }]
                    ],
                };
                const ty = getType(schema, 'X');
                expect(ty).toEqual(rhs);
                expect(validate<any>({a: ''}, ty)).toEqual(null);
                expect(validate<any>({a: '1'}, ty)).toEqual(null);
                expect(validate<any>({a: '12'}, ty)).toEqual(null);
                expect(validate<any>({a: '123'}, ty)).toEqual({value: {a: '123'}});
                expect(validate<any>({a: '1234'}, ty)).toEqual({value: {a: '1234'}});
                expect(validate<any>({a: '12345'}, ty)).toEqual({value: {a: '12345'}});
                expect(validate<any>({a: '123456'}, ty)).toEqual(null);
            }
        }
    });
    it("compiler-decorators-3", function() {
        const schemas = [compile(`
            interface X {
                a?: @minLength(3) @maxLength(5) string;
            }
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
                    kind: 'object',
                    members: [
                        ['a', {
                            name: 'a',
                            kind: 'optional',
                            optional: {
                                kind: 'primitive',
                                primitiveName: 'string',
                                minLength: 3,
                                maxLength: 5,
                            }
                        }]
                    ],
                };
                const ty = getType(schema, 'X');
                expect(ty).toEqual(rhs);
                expect(validate<any>({a: ''}, ty)).toEqual(null);
                expect(validate<any>({a: '1'}, ty)).toEqual(null);
                expect(validate<any>({a: '12'}, ty)).toEqual(null);
                expect(validate<any>({a: '123'}, ty)).toEqual({value: {a: '123'}});
                expect(validate<any>({a: '1234'}, ty)).toEqual({value: {a: '1234'}});
                expect(validate<any>({a: '12345'}, ty)).toEqual({value: {a: '12345'}});
                expect(validate<any>({a: '123456'}, ty)).toEqual(null);
            }
        }
    });



    it("compiler-decorators-4", function() {
        const schemas = [compile(`
            type X = @minValue(3) @maxValue(5) number;
        `), compile(`
            type X = @range(3, 5) number;
        `)];

        {
            expect(Array.from(schemas[0].keys())).toEqual([
                'X',
            ]);
            expect(Array.from(schemas[1].keys())).toEqual([
                'X',
            ]);
        }
        for (const schema of schemas) {
            {
                const rhs: TypeAssertion = {
                    name: 'X',
                    typeName: 'X',
                    kind: 'primitive',
                    primitiveName: 'number',
                    minValue: 3,
                    maxValue: 5,
                };
                const ty = getType(schema, 'X');
                expect(ty).toEqual(rhs);
                expect(validate<any>(0, ty)).toEqual(null);
                expect(validate<any>(1, ty)).toEqual(null);
                expect(validate<any>(2, ty)).toEqual(null);
                expect(validate<any>(3, ty)).toEqual({value: 3});
                expect(validate<any>(4, ty)).toEqual({value: 4});
                expect(validate<any>(5, ty)).toEqual({value: 5});
                expect(validate<any>(6, ty)).toEqual(null);
            }
        }
    });
    it("compiler-decorators-5", function() {
        const schemas = [compile(`
            interface X {
                a: @minValue(3) @maxValue(5) number;
            }
        `), compile(`
            interface X {
                a: @range(3, 5) number;
            }
        `)];

        {
            expect(Array.from(schemas[0].keys())).toEqual([
                'X',
            ]);
            expect(Array.from(schemas[1].keys())).toEqual([
                'X',
            ]);
        }
        for (const schema of schemas) {
            {
                const rhs: TypeAssertion = {
                    name: 'X',
                    typeName: 'X',
                    kind: 'object',
                    members: [
                        ['a', {
                            name: 'a',
                            kind: 'primitive',
                            primitiveName: 'number',
                            minValue: 3,
                            maxValue: 5,
                        }]
                    ],
                };
                const ty = getType(schema, 'X');
                expect(ty).toEqual(rhs);
                expect(validate<any>({a: 0}, ty)).toEqual(null);
                expect(validate<any>({a: 1}, ty)).toEqual(null);
                expect(validate<any>({a: 2}, ty)).toEqual(null);
                expect(validate<any>({a: 3}, ty)).toEqual({value: {a: 3}});
                expect(validate<any>({a: 4}, ty)).toEqual({value: {a: 4}});
                expect(validate<any>({a: 5}, ty)).toEqual({value: {a: 5}});
                expect(validate<any>({a: 6}, ty)).toEqual(null);
            }
        }
    });
    it("compiler-decorators-6", function() {
        const schemas = [compile(`
            interface X {
                a?: @minValue(3) @maxValue(5) number;
            }
        `), compile(`
            interface X {
                a?: @range(3, 5) number;
            }
        `)];

        {
            expect(Array.from(schemas[0].keys())).toEqual([
                'X',
            ]);
            expect(Array.from(schemas[1].keys())).toEqual([
                'X',
            ]);
        }
        for (const schema of schemas) {
            {
                const rhs: TypeAssertion = {
                    name: 'X',
                    typeName: 'X',
                    kind: 'object',
                    members: [
                        ['a', {
                            name: 'a',
                            kind: 'optional',
                            optional: {
                                kind: 'primitive',
                                primitiveName: 'number',
                                minValue: 3,
                                maxValue: 5,
                            }
                        }]
                    ],
                };
                const ty = getType(schema, 'X');
                expect(ty).toEqual(rhs);
                expect(validate<any>({a: 0}, ty)).toEqual(null);
                expect(validate<any>({a: 1}, ty)).toEqual(null);
                expect(validate<any>({a: 2}, ty)).toEqual(null);
                expect(validate<any>({a: 3}, ty)).toEqual({value: {a: 3}});
                expect(validate<any>({a: 4}, ty)).toEqual({value: {a: 4}});
                expect(validate<any>({a: 5}, ty)).toEqual({value: {a: 5}});
                expect(validate<any>({a: 6}, ty)).toEqual(null);
            }
        }
    });



    it("compiler-decorators-7", function() {
        const schemas = [compile(`
            type X = @greaterThan(3) @lessThan(5) number;
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
                    kind: 'primitive',
                    primitiveName: 'number',
                    greaterThanValue: 3,
                    lessThanValue: 5,
                };
                const ty = getType(schema, 'X');
                expect(ty).toEqual(rhs);
                expect(validate<any>(0, ty)).toEqual(null);
                expect(validate<any>(1, ty)).toEqual(null);
                expect(validate<any>(2, ty)).toEqual(null);
                expect(validate<any>(3, ty)).toEqual(null);
                expect(validate<any>(4, ty)).toEqual({value: 4});
                expect(validate<any>(5, ty)).toEqual(null);
                expect(validate<any>(6, ty)).toEqual(null);
            }
        }
    });
    it("compiler-decorators-8", function() {
        const schemas = [compile(`
            interface X {
                a: @greaterThan(3) @lessThan(5) number;
            }
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
                    kind: 'object',
                    members: [
                        ['a', {
                            name: 'a',
                            kind: 'primitive',
                            primitiveName: 'number',
                            greaterThanValue: 3,
                            lessThanValue: 5,
                        }]
                    ],
                };
                const ty = getType(schema, 'X');
                expect(ty).toEqual(rhs);
                expect(validate<any>({a: 0}, ty)).toEqual(null);
                expect(validate<any>({a: 1}, ty)).toEqual(null);
                expect(validate<any>({a: 2}, ty)).toEqual(null);
                expect(validate<any>({a: 3}, ty)).toEqual(null);
                expect(validate<any>({a: 4}, ty)).toEqual({value: {a: 4}});
                expect(validate<any>({a: 5}, ty)).toEqual(null);
                expect(validate<any>({a: 6}, ty)).toEqual(null);
            }
        }
    });
    it("compiler-decorators-9", function() {
        const schemas = [compile(`
            interface X {
                a?: @greaterThan(3) @lessThan(5) number;
            }
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
                    kind: 'object',
                    members: [
                        ['a', {
                            name: 'a',
                            kind: 'optional',
                            optional: {
                                kind: 'primitive',
                                primitiveName: 'number',
                                greaterThanValue: 3,
                                lessThanValue: 5,
                            }
                        }]
                    ],
                };
                const ty = getType(schema, 'X');
                expect(ty).toEqual(rhs);
                expect(validate<any>({a: 0}, ty)).toEqual(null);
                expect(validate<any>({a: 1}, ty)).toEqual(null);
                expect(validate<any>({a: 2}, ty)).toEqual(null);
                expect(validate<any>({a: 3}, ty)).toEqual(null);
                expect(validate<any>({a: 4}, ty)).toEqual({value: {a: 4}});
                expect(validate<any>({a: 5}, ty)).toEqual(null);
                expect(validate<any>({a: 6}, ty)).toEqual(null);
            }
        }
    });
    // TODO: decorators
    // TODO: deep cherrypick and patch
    // TODO: error reporting
    // TODO: directives
    // TODO: import statement
});
