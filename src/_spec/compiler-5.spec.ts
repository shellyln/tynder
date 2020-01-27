
import { TypeAssertion,
         ValidationContext } from '../types';
import { validate,
         getType }           from '../validator';
import { compile }           from '../compiler';



describe("compiler-5", function() {
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
                expect(validate<any>(4, ty)).toEqual(null);
            }
        }
    });
    it("compiler-decorators-1b", function() {
        const schemas = [compile(`
            type X = @maxLength(5) string;
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
                    maxLength: 5,
                };
                const ty = getType(schema, 'X');
                expect(ty).toEqual(rhs);
                expect(validate<any>('', ty)).toEqual({value: ''});
                expect(validate<any>('1', ty)).toEqual({value: '1'});
                expect(validate<any>('12', ty)).toEqual({value: '12'});
                expect(validate<any>('123', ty)).toEqual({value: '123'});
                expect(validate<any>('1234', ty)).toEqual({value: '1234'});
                expect(validate<any>('12345', ty)).toEqual({value: '12345'});
                expect(validate<any>('123456', ty)).toEqual(null);
                expect(validate<any>(4, ty)).toEqual(null);
            }
        }
    });
    it("compiler-decorators-1c", function() {
        const schemas = [compile(`
            type X = @minLength(3) string;
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
                };
                const ty = getType(schema, 'X');
                expect(ty).toEqual(rhs);
                expect(validate<any>('', ty)).toEqual(null);
                expect(validate<any>('1', ty)).toEqual(null);
                expect(validate<any>('12', ty)).toEqual(null);
                expect(validate<any>('123', ty)).toEqual({value: '123'});
                expect(validate<any>('1234', ty)).toEqual({value: '1234'});
                expect(validate<any>('12345', ty)).toEqual({value: '12345'});
                expect(validate<any>('123456', ty)).toEqual({value: '123456'});
                expect(validate<any>(4, ty)).toEqual(null);
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
                expect(validate<any>({a: 4}, ty)).toEqual(null);
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
                expect(validate<any>({a: 4}, ty)).toEqual(null);
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
                expect(validate<any>('4', ty)).toEqual(null);
            }
        }
    });
    it("compiler-decorators-4b", function() {
        const schemas = [compile(`
            type X = @maxValue(5) number;
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
                    maxValue: 5,
                };
                const ty = getType(schema, 'X');
                expect(ty).toEqual(rhs);
                expect(validate<any>(0, ty)).toEqual({value: 0});
                expect(validate<any>(1, ty)).toEqual({value: 1});
                expect(validate<any>(2, ty)).toEqual({value: 2});
                expect(validate<any>(3, ty)).toEqual({value: 3});
                expect(validate<any>(4, ty)).toEqual({value: 4});
                expect(validate<any>(5, ty)).toEqual({value: 5});
                expect(validate<any>(6, ty)).toEqual(null);
                expect(validate<any>('4', ty)).toEqual(null);
            }
        }
    });
    it("compiler-decorators-4c", function() {
        const schemas = [compile(`
            type X = @minValue(3) number;
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
                    minValue: 3,
                };
                const ty = getType(schema, 'X');
                expect(ty).toEqual(rhs);
                expect(validate<any>(0, ty)).toEqual(null);
                expect(validate<any>(1, ty)).toEqual(null);
                expect(validate<any>(2, ty)).toEqual(null);
                expect(validate<any>(3, ty)).toEqual({value: 3});
                expect(validate<any>(4, ty)).toEqual({value: 4});
                expect(validate<any>(5, ty)).toEqual({value: 5});
                expect(validate<any>(6, ty)).toEqual({value: 6});
                expect(validate<any>('4', ty)).toEqual(null);
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
                expect(validate<any>({a: '4'}, ty)).toEqual(null);
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
                expect(validate<any>({a: '4'}, ty)).toEqual(null);
            }
        }
    });
    it("compiler-decorators-7", function() {
        const schemas = [compile(`
            type X = @minValue('C') @maxValue('E') string;
        `), compile(`
            type X = @range('C', 'E') string;
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
                    primitiveName: 'string',
                    minValue: 'C',
                    maxValue: 'E',
                };
                const ty = getType(schema, 'X');
                expect(ty).toEqual(rhs);
                expect(validate<any>(0, ty)).toEqual(null);
                expect(validate<any>('A', ty)).toEqual(null);
                expect(validate<any>('B', ty)).toEqual(null);
                expect(validate<any>('C', ty)).toEqual({value: 'C'});
                expect(validate<any>('D', ty)).toEqual({value: 'D'});
                expect(validate<any>('E', ty)).toEqual({value: 'E'});
                expect(validate<any>('F', ty)).toEqual(null);
            }
        }
    });
    it("compiler-decorators-8", function() {
        const schemas = [compile(`
            interface X {
                a: @minValue('C') @maxValue('E') string;
            }
        `), compile(`
            interface X {
                a: @range('C', 'E') string;
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
                            primitiveName: 'string',
                            minValue: 'C',
                            maxValue: 'E',
                        }]
                    ],
                };
                const ty = getType(schema, 'X');
                expect(ty).toEqual(rhs);
                expect(validate<any>({a: 0}, ty)).toEqual(null);
                expect(validate<any>({a: 'A'}, ty)).toEqual(null);
                expect(validate<any>({a: 'B'}, ty)).toEqual(null);
                expect(validate<any>({a: 'C'}, ty)).toEqual({value: {a: 'C'}});
                expect(validate<any>({a: 'D'}, ty)).toEqual({value: {a: 'D'}});
                expect(validate<any>({a: 'E'}, ty)).toEqual({value: {a: 'E'}});
                expect(validate<any>({a: 'F'}, ty)).toEqual(null);
            }
        }
    });
    it("compiler-decorators-9", function() {
        const schemas = [compile(`
            interface X {
                a?: @minValue('C') @maxValue('E') string;
            }
        `), compile(`
            interface X {
                a?: @range('C', 'E') string;
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
                                primitiveName: 'string',
                                minValue: 'C',
                                maxValue: 'E',
                            }
                        }]
                    ],
                };
                const ty = getType(schema, 'X');
                expect(ty).toEqual(rhs);
                expect(validate<any>({a: 0}, ty)).toEqual(null);
                expect(validate<any>({a: 'A'}, ty)).toEqual(null);
                expect(validate<any>({a: 'B'}, ty)).toEqual(null);
                expect(validate<any>({a: 'C'}, ty)).toEqual({value: {a: 'C'}});
                expect(validate<any>({a: 'D'}, ty)).toEqual({value: {a: 'D'}});
                expect(validate<any>({a: 'E'}, ty)).toEqual({value: {a: 'E'}});
                expect(validate<any>({a: 'F'}, ty)).toEqual(null);
            }
        }
    });
    it("compiler-decorators-10", function() {
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
                expect(validate<any>('4', ty)).toEqual(null);
            }
        }
    });
    it("compiler-decorators-10a", function() {
        const schemas = [compile(`
            type X = @lessThan(5) number;
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
                    lessThanValue: 5,
                };
                const ty = getType(schema, 'X');
                expect(ty).toEqual(rhs);
                expect(validate<any>(0, ty)).toEqual({value: 0});
                expect(validate<any>(1, ty)).toEqual({value: 1});
                expect(validate<any>(2, ty)).toEqual({value: 2});
                expect(validate<any>(3, ty)).toEqual({value: 3});
                expect(validate<any>(4, ty)).toEqual({value: 4});
                expect(validate<any>(5, ty)).toEqual(null);
                expect(validate<any>(6, ty)).toEqual(null);
                expect(validate<any>('4', ty)).toEqual(null);
            }
        }
    });
    it("compiler-decorators-10b", function() {
        const schemas = [compile(`
            type X = @greaterThan(3) number;
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
                };
                const ty = getType(schema, 'X');
                expect(ty).toEqual(rhs);
                expect(validate<any>(0, ty)).toEqual(null);
                expect(validate<any>(1, ty)).toEqual(null);
                expect(validate<any>(2, ty)).toEqual(null);
                expect(validate<any>(3, ty)).toEqual(null);
                expect(validate<any>(4, ty)).toEqual({value: 4});
                expect(validate<any>(5, ty)).toEqual({value: 5});
                expect(validate<any>(6, ty)).toEqual({value: 6});
                expect(validate<any>('4', ty)).toEqual(null);
            }
        }
    });
    it("compiler-decorators-11", function() {
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
                expect(validate<any>({a: '4'}, ty)).toEqual(null);
            }
        }
    });
    it("compiler-decorators-12", function() {
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
                expect(validate<any>({a: '4'}, ty)).toEqual(null);
            }
        }
    });
    it("compiler-decorators-13", function() {
        const schemas = [compile(`
            type X = @greaterThan('C') @lessThan('E') string;
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
                    greaterThanValue: 'C',
                    lessThanValue: 'E',
                };
                const ty = getType(schema, 'X');
                expect(ty).toEqual(rhs);
                expect(validate<any>(0, ty)).toEqual(null);
                expect(validate<any>('A', ty)).toEqual(null);
                expect(validate<any>('B', ty)).toEqual(null);
                expect(validate<any>('C', ty)).toEqual(null);
                expect(validate<any>('D', ty)).toEqual({value: 'D'});
                expect(validate<any>('E', ty)).toEqual(null);
                expect(validate<any>('F', ty)).toEqual(null);
            }
        }
    });
    it("compiler-decorators-14", function() {
        const schemas = [compile(`
            interface X {
                a: @greaterThan('C') @lessThan('E') string;
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
                            greaterThanValue: 'C',
                            lessThanValue: 'E',
                        }]
                    ],
                };
                const ty = getType(schema, 'X');
                expect(ty).toEqual(rhs);
                expect(validate<any>({a: 0}, ty)).toEqual(null);
                expect(validate<any>({a: 'A'}, ty)).toEqual(null);
                expect(validate<any>({a: 'B'}, ty)).toEqual(null);
                expect(validate<any>({a: 'C'}, ty)).toEqual(null);
                expect(validate<any>({a: 'D'}, ty)).toEqual({value: {a: 'D'}});
                expect(validate<any>({a: 'E'}, ty)).toEqual(null);
                expect(validate<any>({a: 'F'}, ty)).toEqual(null);
            }
        }
    });
    it("compiler-decorators-15", function() {
        const schemas = [compile(`
            interface X {
                a?: @greaterThan('C') @lessThan('E') string;
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
                                greaterThanValue: 'C',
                                lessThanValue: 'E',
                            }
                        }]
                    ],
                };
                const ty = getType(schema, 'X');
                expect(ty).toEqual(rhs);
                expect(validate<any>({a: 0}, ty)).toEqual(null);
                expect(validate<any>({a: 'A'}, ty)).toEqual(null);
                expect(validate<any>({a: 'B'}, ty)).toEqual(null);
                expect(validate<any>({a: 'C'}, ty)).toEqual(null);
                expect(validate<any>({a: 'D'}, ty)).toEqual({value: {a: 'D'}});
                expect(validate<any>({a: 'E'}, ty)).toEqual(null);
                expect(validate<any>({a: 'F'}, ty)).toEqual(null);
            }
        }
    });
    it("compiler-decorators-16", function() {
        const schemas = [compile(`
            type X = @match(/^[C-E]$/) string;
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
                    pattern: /^[C-E]$/,
                };
                const ty = getType(schema, 'X');
                expect(ty).toEqual(rhs);
                expect(validate<any>(0, ty)).toEqual(null);
                expect(validate<any>('A', ty)).toEqual(null);
                expect(validate<any>('B', ty)).toEqual(null);
                expect(validate<any>('C', ty)).toEqual({value: 'C'});
                expect(validate<any>('D', ty)).toEqual({value: 'D'});
                expect(validate<any>('E', ty)).toEqual({value: 'E'});
                expect(validate<any>('F', ty)).toEqual(null);
            }
        }
    });
    it("compiler-decorators-17", function() {
        const schemas = [compile(`
            interface X {
                a: @match(/^[C-E]$/) string;
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
                            pattern: /^[C-E]$/,
                        }]
                    ],
                };
                const ty = getType(schema, 'X');
                expect(ty).toEqual(rhs);
                expect(validate<any>({a: 0}, ty)).toEqual(null);
                expect(validate<any>({a: 'A'}, ty)).toEqual(null);
                expect(validate<any>({a: 'B'}, ty)).toEqual(null);
                expect(validate<any>({a: 'C'}, ty)).toEqual({value: {a: 'C'}});
                expect(validate<any>({a: 'D'}, ty)).toEqual({value: {a: 'D'}});
                expect(validate<any>({a: 'E'}, ty)).toEqual({value: {a: 'E'}});
                expect(validate<any>({a: 'F'}, ty)).toEqual(null);
            }
        }
    });
    it("compiler-decorators-18", function() {
        const schemas = [compile(`
            interface X {
                a?: @match(/^[C-E]$/) string;
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
                                pattern: /^[C-E]$/,
                            }
                        }]
                    ],
                };
                const ty = getType(schema, 'X');
                expect(ty).toEqual(rhs);
                expect(validate<any>({a: 0}, ty)).toEqual(null);
                expect(validate<any>({a: 'A'}, ty)).toEqual(null);
                expect(validate<any>({a: 'B'}, ty)).toEqual(null);
                expect(validate<any>({a: 'C'}, ty)).toEqual({value: {a: 'C'}});
                expect(validate<any>({a: 'D'}, ty)).toEqual({value: {a: 'D'}});
                expect(validate<any>({a: 'E'}, ty)).toEqual({value: {a: 'E'}});
                expect(validate<any>({a: 'F'}, ty)).toEqual(null);
            }
        }
    });
    // TODO: decorators
    // TODO: deep cherrypick and patch
    // TODO: error reporting
    // TODO: directives
    // TODO: import statement
});
