
import { TypeAssertion,
         ValidationContext } from '../types';
import { validate,
         isType,
         getType }           from '../validator';
import { pick,
         patch }             from '../picker';
import { compile }           from '../compiler';
import { generateTypeScriptCode } from '../codegen';
import { serialize,
         deserialize }       from '../serializer';
import { stereotypes as dateStereotypes } from '../stereotypes/date';
import { constraints as uniqueConstraints } from '../constraints/unique';



describe("fix-3", function() {
    it("unique-1", function() {
        const schemas = [compile(`
            interface A {
                @constraint('unique')
                a: string[];
            }
        `), compile(`
            interface A {
                @constraint('unique')
                a?: string[];
            }
        `)];
        for (const schema of schemas) {
            const ty = getType(schema, 'A');
            {
                const ctx: Partial<ValidationContext> = {
                    checkAll: true,
                    stereotypes: new Map([
                        ...dateStereotypes,
                    ]),
                    customConstraints: new Map([
                        ...uniqueConstraints,
                    ]),
                };
                const z = validate<any>({ a: ['x', 'y', 'z'] }, ty, ctx);
                expect(z).toEqual({value: { a: ['x', 'y', 'z'] }});
            }
            {
                const ctx: Partial<ValidationContext> = {
                    checkAll: true,
                    stereotypes: new Map([
                        ...dateStereotypes,
                    ]),
                    customConstraints: new Map([
                        ...uniqueConstraints,
                    ]),
                };
                const z = validate<any>({ a: ['x', 'y', 'x'] }, ty, ctx);
                expect(z).toEqual(null);
            }
        }
    });
    it("unique-2", function() {
        const schemas = [compile(`
            interface A {
                @constraint('unique', ['p', 'r'])
                a: {p: string | null, q: string, r: string}[];
            }
        `), compile(`
            interface A {
                @constraint('unique', ['p', 'r'])
                a?: {p: string | null, q: string, r: string}[];
            }
        `)];
        for (const schema of schemas) {
            const ty = getType(schema, 'A');
            {
                const ctx: Partial<ValidationContext> = {
                    checkAll: true,
                    stereotypes: new Map([
                        ...dateStereotypes,
                    ]),
                    customConstraints: new Map([
                        ...uniqueConstraints,
                    ]),
                };
                const z = validate<any>({a: [
                    {p: '1', q: '2', r: '3'},
                    {p: '2', q: '3', r: '4'},
                    {p: '3', q: '4', r: '5'},
                ]}, ty, ctx);
                expect(z).toEqual({value: {a: [
                    {p: '1', q: '2', r: '3'},
                    {p: '2', q: '3', r: '4'},
                    {p: '3', q: '4', r: '5'},
                ]}});
            }
            {
                const ctx: Partial<ValidationContext> = {
                    checkAll: true,
                    stereotypes: new Map([
                        ...dateStereotypes,
                    ]),
                    customConstraints: new Map([
                        ...uniqueConstraints,
                    ]),
                };
                const z = validate<any>({a: [
                    {p: '1', q: '2', r: '3'},
                    {p: '2', q: '3', r: '4'},
                    {p: '1', q: '4', r: '3'},
                ]}, ty, ctx);
                expect(z).toEqual(null);
            }
            {
                const ctx: Partial<ValidationContext> = {
                    checkAll: true,
                    stereotypes: new Map([
                        ...dateStereotypes,
                    ]),
                    customConstraints: new Map([
                        ...uniqueConstraints,
                    ]),
                };
                const z = validate<any>({a: [
                    {p: '1', q: '2', r: '3'},
                    {p: '2', q: '3', r: '4'},
                    {p: null, q: '4', r: '5'},
                    {p: null, q: '4', r: '5'},
                ]}, ty, ctx);
                expect(z).toEqual(null);
            }
        }
    });
    it("unique-3", function() {
        const schemas = [compile(`
            interface A {
                @constraint('unique-non-null', ['p', 'r'])
                a: {p: string | null, q: string, r: string}[];
            }
        `), compile(`
            interface A {
                @constraint('unique-non-null', ['p', 'r'])
                a?: {p: string | null, q: string, r: string}[];
            }
        `)];
        for (const schema of schemas) {
            const ty = getType(schema, 'A');
            {
                const ctx: Partial<ValidationContext> = {
                    checkAll: true,
                    stereotypes: new Map([
                        ...dateStereotypes,
                    ]),
                    customConstraints: new Map([
                        ...uniqueConstraints,
                    ]),
                };
                const z = validate<any>({a: [
                    {p: '1', q: '2', r: '3'},
                    {p: '2', q: '3', r: '4'},
                    {p: '3', q: '4', r: '5'},
                ]}, ty, ctx);
                expect(z).toEqual({value: {a: [
                    {p: '1', q: '2', r: '3'},
                    {p: '2', q: '3', r: '4'},
                    {p: '3', q: '4', r: '5'},
                ]}});
            }
            {
                const ctx: Partial<ValidationContext> = {
                    checkAll: true,
                    stereotypes: new Map([
                        ...dateStereotypes,
                    ]),
                    customConstraints: new Map([
                        ...uniqueConstraints,
                    ]),
                };
                const z = validate<any>({a: [
                    {p: '1', q: '2', r: '3'},
                    {p: '2', q: '3', r: '4'},
                    {p: '1', q: '4', r: '3'},
                ]}, ty, ctx);
                expect(z).toEqual(null);
            }
            {
                const ctx: Partial<ValidationContext> = {
                    checkAll: true,
                    stereotypes: new Map([
                        ...dateStereotypes,
                    ]),
                    customConstraints: new Map([
                        ...uniqueConstraints,
                    ]),
                };
                const z = validate<any>({a: [
                    {p: '1', q: '2', r: '3'},
                    {p: '2', q: '3', r: '4'},
                    {p: null, q: '4', r: '5'},
                    {p: null, q: '4', r: '5'},
                ]}, ty, ctx);
                expect(z).toEqual({value: {a: [
                    {p: '1', q: '2', r: '3'},
                    {p: '2', q: '3', r: '4'},
                    {p: null, q: '4', r: '5'},
                    {p: null, q: '4', r: '5'},
                ]}});
            }
        }
    });
    it("gen-d.ts-addtional-props-1", function() {
        let src = `
        export interface MetaViewsIndex {
            [viewResourceName: string]: {
                [profileName: string]: {
                    id: string;
                    name: string;
                };
            };
        }`;
        src = src.replace(/\s+/g, ' ').trim();

        let dts = generateTypeScriptCode(compile(src));
        dts = dts.replace(/\s+/g, ' ').trim();

        let exp = `
        export interface MetaViewsIndex {
            [propName0: string]: {
                [propName0: string]: {
                    id: string;
                    name: string;
                };
            };
        }`;
        exp = exp.replace(/\s+/g, ' ').trim();

        expect(dts).toEqual(exp);
    });
    it("gen-d.ts-addtional-props-2", function() {
        let src = `
        export interface MetaViewsIndex {
            [viewResourceName: string]?: {
                [profileName: string]?: {
                    id: string;
                    name: string;
                };
            };
        }`;
        src = src.replace(/\s+/g, ' ').trim();

        let dts = generateTypeScriptCode(compile(src));
        dts = dts.replace(/\s+/g, ' ').trim();

        let exp = `
        export interface MetaViewsIndex {
            [propName0: string]?: {
                [propName0: string]?: {
                    id: string;
                    name: string;
                };
            };
        }`;
        exp = exp.replace(/\s+/g, ' ').trim();

        expect(dts).toEqual(exp);
    });
    it("gen-d.ts-addtional-props-3", function() {
        let src = `
        export interface MetaViewsIndex {
            foo: string;
            [viewResourceName: string]?: {
                [profileName: string]?: {
                    id: string;
                    name: string;
                };
            };
        }`;
        src = src.replace(/\s+/g, ' ').trim();

        let dts = generateTypeScriptCode(compile(src));
        dts = dts.replace(/\s+/g, ' ').trim();

        let exp = `
        export interface MetaViewsIndex {
            foo: string;
            [propName0: string]?: {
                [propName0: string]?: {
                    id: string;
                    name: string;
                };
            };
        }`;
        exp = exp.replace(/\s+/g, ' ').trim();

        expect(dts).toEqual(exp);
    });
    it("gen-d.ts-addtional-props-4", function() {
        let src = `
        export interface MetaViewsIndex {
            foo?: string;
        }`;
        src = src.replace(/\s+/g, ' ').trim();

        let dts = generateTypeScriptCode(compile(src));
        dts = dts.replace(/\s+/g, ' ').trim();

        let exp = `
        export interface MetaViewsIndex {
            foo?: string;
        }`;
        exp = exp.replace(/\s+/g, ' ').trim();

        expect(dts).toEqual(exp);
    });
    it("gen-dts-empty-object-1", function() {
        let src = `
        export interface MetaFields {
            properties: {
                [fieldName: string]: {};
            };
            revision?: number;
        }
        export interface MetaLayout {
            layout: {}[];
            revision?: number;
        }`;
        src = src.replace(/\s+/g, ' ').trim();

        let dts = generateTypeScriptCode(compile(src));
        dts = dts.replace(/\s+/g, ' ').trim();

        let exp = `
        export interface MetaFields {
            properties: {
                [propName0: string]: {};
            };
            revision?: number;
        }
        export interface MetaLayout {
            layout: {}[];
            revision?: number;
        }`;
        exp = exp.replace(/\s+/g, ' ').trim();

        expect(dts).toEqual(exp);
    });
    it("type-guard-1", function() {
        const schemas = [compile(`
            interface O {
                a: string;
                b: number;
            }
        `)];
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
                const unk = {a: 'qwerty', b: 0};
                expect(isType<{a: string, b: number}>(unk, ty) && unk.a === 'qwerty').toEqual(true);
            }
        }
    });
    it("gen-d.ts-non-ascii-symbol-1", function() {
        let src = `
        export interface MetaViewsIndex {
            '1foo'?: string;
        }`;
        src = src.replace(/\s+/g, ' ').trim();

        let dts = generateTypeScriptCode(compile(src));
        dts = dts.replace(/\s+/g, ' ').trim();

        let exp = `
        export interface MetaViewsIndex {
            '1foo'?: string;
        }`;
        exp = exp.replace(/\s+/g, ' ').trim();

        expect(dts).toEqual(exp);
    });
    it("gen-d.ts-enum-1", function() {
        let src = `
        enum Foo {
            A
        }`;
        src = src.replace(/\s+/g, ' ').trim();

        let dts = generateTypeScriptCode(compile(src));
        dts = dts.replace(/\s+/g, ' ').trim();

        let exp = `
        enum Foo {
            A,
        }`;
        exp = exp.replace(/\s+/g, ' ').trim();

        expect(dts).toEqual(exp);
    });
    it("gen-d.ts-enum-2", function() {
        let src = `
        export enum Foo {
            A
        }`;
        src = src.replace(/\s+/g, ' ').trim();

        let dts = generateTypeScriptCode(compile(src));
        dts = dts.replace(/\s+/g, ' ').trim();

        let exp = `
        export enum Foo {
            A,
        }`;
        exp = exp.replace(/\s+/g, ' ').trim();

        expect(dts).toEqual(exp);
    });
    it("gen-d.ts-enum-3", function() {
        let src = `
        const enum Foo {
            A
        }`;
        src = src.replace(/\s+/g, ' ').trim();

        let dts = generateTypeScriptCode(compile(src));
        dts = dts.replace(/\s+/g, ' ').trim();

        let exp = `
        const enum Foo {
            A,
        }`;
        exp = exp.replace(/\s+/g, ' ').trim();

        expect(dts).toEqual(exp);
    });
    it("gen-d.ts-enum-4", function() {
        let src = `
        export const enum Foo {
            A
        }`;
        src = src.replace(/\s+/g, ' ').trim();

        let dts = generateTypeScriptCode(compile(src));
        dts = dts.replace(/\s+/g, ' ').trim();

        let exp = `
        export const enum Foo {
            A,
        }`;
        exp = exp.replace(/\s+/g, ' ').trim();

        expect(dts).toEqual(exp);
    });
    it("gen-d.ts-pass-through-1", function() {
        let src = `
        // @tynder-pass-through function foo(x: string) { return x; }
        `;
        src = src.replace(/\s+/g, ' ').trim();

        let dts = generateTypeScriptCode(compile(src));
        dts = dts.replace(/\s+/g, ' ').trim();

        let exp = `
        function foo(x: string) {
            return x;
        }
        `;
        exp = exp.replace(/\s+/g, ' ').trim();

        expect(dts).toEqual(exp);
    });
    it("gen-d.ts-pass-through-2", function() {
        let src = `
        /* @tynder-pass-through
        function foo(x: string) {
            return x;
        }
        */
        `;
        src = src.replace(/\s+/g, ' ').trim();

        let dts = generateTypeScriptCode(compile(src));
        dts = dts.replace(/\s+/g, ' ').trim();

        let exp = `
        function foo(x: string) {
            return x;
        }
        `;
        exp = exp.replace(/\s+/g, ' ').trim();

        expect(dts).toEqual(exp);
    });
    it("compiler-comments", function() {
        const schema = compile(`
            /* comment1 */
            /*
            comment2
            */
            // comment3
            # comment4
            type FooA = any;
            /* comment1 */
            /*
            comment2
            */
            // comment3
            # comment4
            type FooB = unknown;
            /* comment1 */
            /*
            comment2
            */
            // comment3
            # comment4
            type FooC = never;
            /* comment1 */
            /*
            comment2
            */
            // comment3
            # comment4
        `);

        {
            expect(Array.from(schema.keys())).toEqual([
                'FooA', 'FooB', 'FooC',
            ]);
        }
        {
            const rhs: TypeAssertion = {
                name: 'FooA',
                typeName: 'FooA',
                kind: 'any',
            };
            const ty = getType(schema, 'FooA');
            expect(ty).toEqual(rhs);
            expect(validate<any>(0, ty)).toEqual({value: 0});
            expect(validate<any>(1, ty)).toEqual({value: 1});
            expect(validate<any>(BigInt(0), ty)).toEqual({value: BigInt(0)});
            expect(validate<any>(BigInt(1), ty)).toEqual({value: BigInt(1)});
            expect(validate<any>('', ty)).toEqual({value: ''});
            expect(validate<any>('1', ty)).toEqual({value: '1'});
            expect(validate<any>(false, ty)).toEqual({value: false});
            expect(validate<any>(true, ty)).toEqual({value: true});
            expect(validate<any>(null, ty)).toEqual({value: null});
            expect(validate<any>(void 0, ty)).toEqual({value: void 0});
            expect(validate<any>({}, ty)).toEqual({value: {}});
            expect(validate<any>([], ty)).toEqual({value: []});
            expect(validate<any>(3, ty)).toEqual({value: 3});
            expect(validate<any>(BigInt(7), ty)).toEqual({value: BigInt(7)});
            expect(validate<any>('XB', ty)).toEqual({value: 'XB'});
            expect(validate<any>(true, ty)).toEqual({value: true});
        }
        {
            const rhs: TypeAssertion = {
                name: 'FooB',
                typeName: 'FooB',
                kind: 'unknown',
            };
            const ty = getType(schema, 'FooB');
            expect(ty).toEqual(rhs);
            expect(validate<any>(0, ty)).toEqual({value: 0});
            expect(validate<any>(1, ty)).toEqual({value: 1});
            expect(validate<any>(BigInt(0), ty)).toEqual({value: BigInt(0)});
            expect(validate<any>(BigInt(1), ty)).toEqual({value: BigInt(1)});
            expect(validate<any>('', ty)).toEqual({value: ''});
            expect(validate<any>('1', ty)).toEqual({value: '1'});
            expect(validate<any>(false, ty)).toEqual({value: false});
            expect(validate<any>(true, ty)).toEqual({value: true});
            expect(validate<any>(null, ty)).toEqual({value: null});
            expect(validate<any>(void 0, ty)).toEqual({value: void 0});
            expect(validate<any>({}, ty)).toEqual({value: {}});
            expect(validate<any>([], ty)).toEqual({value: []});
            expect(validate<any>(3, ty)).toEqual({value: 3});
            expect(validate<any>(BigInt(7), ty)).toEqual({value: BigInt(7)});
            expect(validate<any>('XB', ty)).toEqual({value: 'XB'});
            expect(validate<any>(true, ty)).toEqual({value: true});
        }
        {
            const rhs: TypeAssertion = {
                name: 'FooC',
                typeName: 'FooC',
                kind: 'never',
            };
            const ty = getType(schema, 'FooC');
            expect(ty).toEqual(rhs);
            expect(validate<string>(0, ty)).toEqual(null);
            expect(validate<string>(1, ty)).toEqual(null);
            expect(validate<string>(BigInt(0), ty)).toEqual(null);
            expect(validate<string>(BigInt(1), ty)).toEqual(null);
            expect(validate<string>('', ty)).toEqual(null);
            expect(validate<string>('1', ty)).toEqual(null);
            expect(validate<string>(false, ty)).toEqual(null);
            expect(validate<string>(true, ty)).toEqual(null);
            expect(validate<string>(null, ty)).toEqual(null);
            expect(validate<string>(void 0, ty)).toEqual(null);
            expect(validate<string>({}, ty)).toEqual(null);
            expect(validate<string>([], ty)).toEqual(null);
            expect(validate<string>(3, ty)).toEqual(null);
            expect(validate<string>(BigInt(7), ty)).toEqual(null);
            expect(validate<string>('XB', ty)).toEqual(null);
            expect(validate<string>(true, ty)).toEqual(null);
        }
    });
    it("external-0", function() {
        const schemas = [compile(`
            external Foo;
        `), compile(`
            // @tynder-external Foo
        `), compile(`
            /* @tynder-external
            Foo
            */
        `)];
        for (const schema of schemas) {
            const ty = getType(schema, 'Foo');
            {
                expect(ty).toEqual({
                    kind: 'any',
                    typeName: 'Foo',
                    name: 'Foo',
                    noOutput: true,
                } as any);
            }
        }
    });
    it("external-1", function() {
        const schemas = [compile(`
            external Foo, Bar, Baz;
        `), compile(`
            // @tynder-external Foo, Bar, Baz
        `), compile(`
            /* @tynder-external
            Foo, Bar, Baz
            */
        `), compile(`
            /* @tynder-external
            Foo,
            Bar, Baz
            */
        `)];
        for (const schema of schemas) {
            const ty = getType(schema, 'Foo');
            {
                expect(ty).toEqual({
                    kind: 'any',
                    typeName: 'Foo',
                    name: 'Foo',
                    noOutput: true,
                } as any);
            }
        }
        for (const schema of schemas) {
            const ty = getType(schema, 'Bar');
            {
                expect(ty).toEqual({
                    kind: 'any',
                    typeName: 'Bar',
                    name: 'Bar',
                    noOutput: true,
                } as any);
            }
        }
        for (const schema of schemas) {
            const ty = getType(schema, 'Baz');
            {
                expect(ty).toEqual({
                    kind: 'any',
                    typeName: 'Baz',
                    name: 'Baz',
                    noOutput: true,
                } as any);
            }
        }
    });
    it("external-2", function() {
        const schemas = [compile(`
            external Foo: string[], Bar: Foo | string, Baz: {a: string}[];
        `), compile(`
            // @tynder-external Foo: string[], Bar: Foo | string, Baz: {a: string}[]
        `), compile(`
            /* @tynder-external
            Foo: string[], Bar: Foo | string, Baz: {a: string}[]
            */
        `), compile(`
            /* @tynder-external
            Foo: string[],
            Bar: Foo | string, Baz: {a: string}[]
            */
        `)];
        for (const schema of schemas) {
            const ty = getType(schema, 'Foo');
            {
                expect(ty).toEqual({
                    kind: 'repeated',
                    min: null,
                    max: null,
                    repeated: {
                        kind: 'primitive',
                        primitiveName: 'string',
                    },
                    typeName: 'Foo',
                    name: 'Foo',
                    noOutput: true,
                } as any);
            }
        }
        for (const schema of schemas) {
            const ty = getType(schema, 'Bar');
            {
                expect(ty).toEqual({
                    kind: 'one-of',
                    oneOf: [
                        {
                            kind: 'repeated',
                            min: null,
                            max: null,
                            repeated: {
                                kind: 'primitive',
                                primitiveName: 'string',
                            },
                            typeName: 'Foo',
                            name: 'Foo',
                            noOutput: true,
                        },
                        {
                            kind: 'primitive',
                            primitiveName: 'string',
                        }
                    ],
                    typeName: 'Bar',
                    name: 'Bar',
                    noOutput: true,
                } as any);
            }
        }
        for (const schema of schemas) {
            const ty = getType(schema, 'Baz');
            {
                expect(ty).toEqual({
                    kind: 'repeated',
                    min: null,
                    max: null,
                    repeated: {
                        kind: 'object',
                        members: [
                            [
                                'a',
                                {
                                    kind: 'primitive',
                                    primitiveName: 'string',
                                    name: 'a',
                                }
                            ]
                        ]
                    },
                    typeName: 'Baz',
                    name: 'Baz',
                    noOutput: true,
                } as any);
            }
        }
    });
    it("external-3", function() {
        const schemas = [compile(`
            external Foo: @match(/^[0-9]{2,4}-[0-9]{1,4}-[0-9]{4}$/) string;
        `), compile(`
            // @tynder-external Foo: @match(/^[0-9]{2,4}-[0-9]{1,4}-[0-9]{4}$/) string
        `), compile(`
            /* @tynder-external
            Foo: @match(/^[0-9]{2,4}-[0-9]{1,4}-[0-9]{4}$/) string
            */
        `), compile(`
            /* @tynder-external
            Foo: @match(/^[0-9]{2,4}-[0-9]{1,4}-[0-9]{4}$/) string
            */
        `)];
        for (const schema of schemas) {
            const ty = getType(schema, 'Foo');
            {
                expect(ty).toEqual({
                    kind: 'primitive',
                    primitiveName: 'string',
                    pattern: /^[0-9]{2,4}-[0-9]{1,4}-[0-9]{4}$/,
                    typeName: 'Foo',
                    name: 'Foo',
                    noOutput: true,
                } as any);
            }
        }
    });
    it("compiler-const-enum-output-1", function() {
        const schemas = [compile(`
            enum A1 { X }
            export enum A2 { X }
            const enum A3 { X }
            export const enum A4 { X }
            /** comment1 */
            enum B1 { X }
            /** comment2 */
            export enum B2 { X }
            /** comment3 */
            const enum B3 { X }
            /** comment4 */
            export const enum B4 { X }
        `)];

        for (const schema of schemas) {
            {
                expect(generateTypeScriptCode(schema).trim()).toEqual(
                    `enum A1 {\n    X,\n}\n\n` +
                    `export enum A2 {\n    X,\n}\n\n` +
                    `const enum A3 {\n    X,\n}\n\n` +
                    `export const enum A4 {\n    X,\n}\n\n` +
                    `/** comment1 */\nenum B1 {\n    X,\n}\n\n` +
                    `/** comment2 */\nexport enum B2 {\n    X,\n}\n\n` +
                    `/** comment3 */\nconst enum B3 {\n    X,\n}\n\n` +
                    `/** comment4 */\nexport const enum B4 {\n    X,\n}`
                );
            }
        }
    });
    it("declare-type-1", function() {
        const schemas = [compile(`
            /** comment */
            export declare type Foo = @minLength(3) string;
        `)];
        for (const schema of schemas) {
            const ty = getType(schema, 'Foo');
            {
                expect(ty).toEqual({
                    kind: 'primitive',
                    primitiveName: 'string',
                    minLength: 3,
                    typeName: 'Foo',
                    name: 'Foo',
                    docComment: 'comment',
                } as any);
            }
        }
    });
});
