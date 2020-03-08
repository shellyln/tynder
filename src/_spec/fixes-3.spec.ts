
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
import { stereotypes as dateStereotypes } from '../stereotypes/date';



describe("fix-3", function() {
    it("forceCast-1", function() {
        const schemas = [compile(`
            interface Foo {
                @forceCast a: number;
                @forceCast b: bigint;
                @forceCast c: integer;
                @forceCast d: string;
                @forceCast e: boolean;
                @forceCast f: null;
                @forceCast g: undefined;
                @forceCast h: any;
                @forceCast i: unknown;
            }
        `), compile(`
            interface Foo {
                @forceCast a?: number;
                @forceCast b?: bigint;
                @forceCast c?: integer;
                @forceCast d?: string;
                @forceCast e?: boolean;
                @forceCast f?: null;
                @forceCast g?: undefined;
                @forceCast h?: any;
                @forceCast i?: unknown;
            }
        `)];
        for (const schema of schemas) {
            const ty = getType(schema, 'Foo');
            {
                const ctx: Partial<ValidationContext> = {
                    checkAll: true,
                };
                const z = validate<any>({
                    a: '33',
                    b: '33',
                    c: '33',
                    d: '33',
                    e: '33',
                    f: '33',
                    g: '33',
                    h: '33',
                    i: '33',
                }, ty, ctx);
                expect(z).toEqual({value: {
                    a: 33,
                    b: BigInt(33),
                    c: 33,
                    d: '33',
                    e: true,
                    f: null,
                    g: void 0,
                    h: '33',
                    i: '33',
                }});
            }
            {
                const ctx: Partial<ValidationContext> = {
                    checkAll: true,
                };
                const z = validate<any>({
                    a: 33,
                    b: 33,
                    c: 33,
                    d: 33,
                    e: 33,
                    f: 33,
                    g: 33,
                    h: 33,
                    i: 33,
                }, ty, ctx);
                expect(z).toEqual({value: {
                    a: 33,
                    b: BigInt(33),
                    c: 33,
                    d: '33',
                    e: true,
                    f: null,
                    g: void 0,
                    h: 33,
                    i: 33,
                }});
            }
            {
                const ctx: Partial<ValidationContext> = {
                    checkAll: true,
                };
                const z = validate<any>({
                    a: -33.33,
                    b: -33,
                    c: -33.33,
                    d: -33.33,
                    e: -33.33,
                    f: -33.33,
                    g: -33.33,
                    h: -33.33,
                    i: -33.33,
                }, ty, ctx);
                expect(z).toEqual({value: {
                    a: -33.33,
                    b: BigInt(-33), // forceCast('bigint', -33.33) returns NaN
                    c: -33,
                    d: '-33.33',
                    e: true,
                    f: null,
                    g: void 0,
                    h: -33.33,
                    i: -33.33,
                }});
            }
            {
                const ctx: Partial<ValidationContext> = {
                    checkAll: true,
                };
                const z = validate<any>({
                    a: -33.33,
                    b: -33.33,
                    c: -33.33,
                    d: -33.33,
                    e: -33.33,
                    f: -33.33,
                    g: -33.33,
                    h: -33.33,
                    i: -33.33,
                }, ty, ctx);
                expect(z).toEqual(null);
                expect(ctx.errors).toEqual([{
                    code: 'TypeUnmatched',
                    message: '"b" of "Foo" should be type "bigint".',
                    dataPath: 'Foo:b',
                    constraints: {},
                    value: -33.33,
                }]);
            }
            {
                const ctx: Partial<ValidationContext> = {
                    checkAll: true,
                };
                const z = validate<any>({
                    a: '-33.33',
                    b: '-33',
                    c: '-33.33',
                    d: '-33.33',
                    e: '-33.33',
                    f: '-33.33',
                    g: '-33.33',
                    h: '-33.33',
                    i: '-33.33',
                }, ty, ctx);
                expect(z).toEqual({value: {
                    a: -33.33,
                    b: BigInt(-33), // forceCast('bigint', -33.33) returns NaN
                    c: -33,
                    d: '-33.33',
                    e: true,
                    f: null,
                    g: void 0,
                    h: '-33.33',
                    i: '-33.33',
                }});
            }
            {
                const ctx: Partial<ValidationContext> = {
                    checkAll: true,
                };
                const z = validate<any>({
                    a: 0,
                    b: 0,
                    c: 0,
                    d: 0,
                    e: 0,
                    f: 0,
                    g: 0,
                    h: 0,
                    i: 0,
                }, ty, ctx);
                expect(z).toEqual({value: {
                    a: 0,
                    b: BigInt(0),
                    c: 0,
                    d: '0',
                    e: false,
                    f: null,
                    g: void 0,
                    h: 0,
                    i: 0,
                }});
            }
            {
                const ctx: Partial<ValidationContext> = {
                    checkAll: true,
                };
                const z = validate<any>({
                    a: BigInt(33),
                    b: BigInt(33),
                    c: BigInt(33),
                    d: BigInt(33),
                    e: BigInt(33),
                    f: BigInt(33),
                    g: BigInt(33),
                    h: BigInt(33),
                    i: BigInt(33),
                }, ty, ctx);
                expect(z).toEqual({value: {
                    a: 33,
                    b: BigInt(33),
                    c: 33,
                    d: '33',
                    e: true,
                    f: null,
                    g: void 0,
                    h: BigInt(33),
                    i: BigInt(33),
                }});
            }
            {
                const ctx: Partial<ValidationContext> = {
                    checkAll: true,
                };
                const z = validate<any>({
                    a: BigInt(0),
                    b: BigInt(0),
                    c: BigInt(0),
                    d: BigInt(0),
                    e: BigInt(0),
                    f: BigInt(0),
                    g: BigInt(0),
                    h: BigInt(0),
                    i: BigInt(0),
                }, ty, ctx);
                expect(z).toEqual({value: {
                    a: 0,
                    b: BigInt(0),
                    c: 0,
                    d: '0',
                    e: false,
                    f: null,
                    g: void 0,
                    h: BigInt(0),
                    i: BigInt(0),
                }});
            }
            {
                const ctx: Partial<ValidationContext> = {
                    checkAll: true,
                };
                const z = validate<any>({
                    a: true,
                    b: true,
                    c: true,
                    d: true,
                    e: true,
                    f: true,
                    g: true,
                    h: true,
                    i: true,
                }, ty, ctx);
                expect(z).toEqual({value: {
                    a: 1,
                    b: BigInt(1),
                    c: 1,
                    d: 'true',
                    e: true,
                    f: null,
                    g: void 0,
                    h: true,
                    i: true,
                }});
            }
            {
                const ctx: Partial<ValidationContext> = {
                    checkAll: true,
                };
                const z = validate<any>({
                    a: null,
                    b: null,
                    c: null,
                    d: null,
                    e: null,
                    f: null,
                    g: null,
                    h: null,
                    i: null,
                }, ty, ctx);
                expect(z).toEqual({value: {
                    a: 0,
                    b: BigInt(0),
                    c: 0,
                    d: 'null',
                    e: false,
                    f: null,
                    g: void 0,
                    h: null,
                    i: null,
                }});
            }
            {
                const ctx: Partial<ValidationContext> = {
                    checkAll: true,
                };
                const z = validate<any>({
                    a: void 0,
                    b: void 0,
                    c: void 0,
                    d: void 0,
                    e: void 0,
                    f: void 0,
                    g: void 0,
                    h: void 0,
                    i: void 0,
                }, ty, ctx);
                expect(z).toEqual({value: {
                    a: 0,
                    b: BigInt(0),
                    c: 0,
                    d: 'undefined',
                    e: false,
                    f: null,
                    g: void 0,
                    h: void 0,
                    i: void 0,
                }});
            }
        }
    });
    it("compareNaN-1", function() {
        const schema = compile(`
            interface Foo {
                a: number;
                b: NaN;
            }
        `);
        const ty = getType(schema, 'Foo');
        {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
            };
            const z = validate<any>({
                a: NaN,
                b: NaN,
            }, ty, ctx);
            expect(z).toEqual({value: {
                a: NaN,
                b: NaN,
            }});
        }
    });
    it("recordType-1", function() {
        const schemas = [compile(`
            interface ACL {
                target: string;
                value: string;
            }

            /** Entry base */
            interface EntryBase {
                /** Entry name */
                name: string;
                /** ACL infos */
                acl: ACL[];
            }

            /** File entry */
            interface File extends EntryBase {
                /** Entry type */
                @recordType
                type: 'file';
            }

            /** Folder entry */
            interface Folder extends EntryBase {
                /** Entry type */
                @recordType
                type: 'folder';
                /** Child entries */
                entries: Entry[];
            }

            /** Entry (union type) */
            type Entry = Folder | File;
            type Foo = string[]|number;
        `), compile(`
            interface ACL {
                target: string;
                value: string;
            }

            /** Entry base */
            interface EntryBase {
                /** Entry name */
                name: string;
                /** ACL infos */
                acl: ACL[];
            }

            /** File entry */
            interface File extends EntryBase {
                /** Entry type */
                @recordType
                type?: 'file';
            }

            /** Folder entry */
            interface Folder extends EntryBase {
                /** Entry type */
                @recordType
                type?: 'folder';
                /** Child entries */
                entries: Entry[];
            }

            /** Entry (union type) */
            type Entry = Folder | File;
            type Foo = string[]|number;
        `)];
        for (const schema of schemas) {
            const ctx: Partial<ValidationContext> = {checkAll: true};
            const z = validate<any>({type: 'file', name: '', acl: [{}]}, getType(schema, 'Entry'), ctx);
            expect(ctx.errors).toEqual([{
                code: 'Required',
                message: '"target" of "ACL" is required.',
                dataPath: 'Entry:File:acl.(0:repeated).ACL:target',
                constraints: {},
            }, {
                code: 'Required',
                message: '"value" of "ACL" is required.',
                dataPath: 'Entry:File:acl.(0:repeated).ACL:value',
                constraints: {},
            }] as any);
        }
        for (const schema of schemas) {
            const ctx: Partial<ValidationContext> = {checkAll: true};
            const z = validate<any>({type: 'file', name: '', acl: [1]}, getType(schema, 'Entry'), ctx);
            expect(ctx.errors).toEqual([{
                code: 'TypeUnmatched',
                message: '"acl" of "File" should be type "ACL".',
                dataPath: 'Entry:File:acl.(0:repeated).ACL',
                constraints: {},
                value: 1,
            }] as any);
        }
    });
    it("stereotype-date-fy-1", function() {
        const schemas = [compile(`
            interface Foo {
                @stereotype('date')
                @range('=2020-08-31 first-date-of-fy(9)', '=2020-08-31 first-date-of-fy(9)')
                a: string;
            }
        `), compile(`
            interface Foo {
                @stereotype('date')
                @range('=2020-08-31 first-date-of-fy(9)', '=2020-08-31 first-date-of-fy(9)')
                a?: string;
            }
        `), compile(`
            interface Foo {
                @stereotype('lcdate')
                @range('=2020-08-31 first-date-of-fy(9)', '=2020-08-31 first-date-of-fy(9)')
                a: string;
            }
        `), compile(`
            interface Foo {
                @stereotype('lcdate')
                @range('=2020-08-31 first-date-of-fy(9)', '=2020-08-31 first-date-of-fy(9)')
                a?: string;
            }
        `)];
        for (const schema of schemas) {
            const ty = getType(schema, 'Foo');
            {
                const ctx: Partial<ValidationContext> = {
                    checkAll: true,
                    stereotypes: new Map([
                        ...dateStereotypes,
                    ]),
                };
                const z = validate<any>({ a: '2019-09-01' }, ty, ctx);
                expect(z).toEqual({value: { a: '2019-09-01' }});
            }
        }
    });
    it("stereotype-date-fy-2", function() {
        const schemas = [compile(`
            interface Foo {
                @stereotype('date')
                @range('=2020-09-01 first-date-of-fy(9)', '=2020-09-01 first-date-of-fy(9)')
                a: string;
            }
        `), compile(`
            interface Foo {
                @stereotype('date')
                @range('=2020-09-01 first-date-of-fy(9)', '=2020-09-01 first-date-of-fy(9)')
                a?: string;
            }
        `), compile(`
            interface Foo {
                @stereotype('lcdate')
                @range('=2020-09-01 first-date-of-fy(9)', '=2020-09-01 first-date-of-fy(9)')
                a: string;
            }
        `), compile(`
            interface Foo {
                @stereotype('lcdate')
                @range('=2020-09-01 first-date-of-fy(9)', '=2020-09-01 first-date-of-fy(9)')
                a?: string;
            }
        `)];
        for (const schema of schemas) {
            const ty = getType(schema, 'Foo');
            {
                const ctx: Partial<ValidationContext> = {
                    checkAll: true,
                    stereotypes: new Map([
                        ...dateStereotypes,
                    ]),
                };
                const z = validate<any>({ a: '2020-09-01' }, ty, ctx);
                expect(z).toEqual({value: { a: '2020-09-01' }});
            }
        }
    });
    it("stereotype-date-fy-3", function() {
        const schemas = [compile(`
            interface Foo {
                @stereotype('date')
                @range('=2020-01-31 first-date-of-fy(2)', '=2020-01-31 first-date-of-fy(2)')
                a: string;
            }
        `), compile(`
            interface Foo {
                @stereotype('date')
                @range('=2020-01-31 first-date-of-fy(2)', '=2020-01-31 first-date-of-fy(2)')
                a?: string;
            }
        `), compile(`
            interface Foo {
                @stereotype('lcdate')
                @range('=2020-01-31 first-date-of-fy(2)', '=2020-01-31 first-date-of-fy(2)')
                a: string;
            }
        `), compile(`
            interface Foo {
                @stereotype('lcdate')
                @range('=2020-01-31 first-date-of-fy(2)', '=2020-01-31 first-date-of-fy(2)')
                a?: string;
            }
        `)];
        for (const schema of schemas) {
            const ty = getType(schema, 'Foo');
            {
                const ctx: Partial<ValidationContext> = {
                    checkAll: true,
                    stereotypes: new Map([
                        ...dateStereotypes,
                    ]),
                };
                const z = validate<any>({ a: '2019-02-01' }, ty, ctx);
                expect(z).toEqual({value: { a: '2019-02-01' }});
            }
        }
    });
    it("stereotype-date-fy-4", function() {
        const schemas = [compile(`
            interface Foo {
                @stereotype('date')
                @range('=2020-02-01 first-date-of-fy(2)', '=2020-02-01 first-date-of-fy(2)')
                a: string;
            }
        `), compile(`
            interface Foo {
                @stereotype('date')
                @range('=2020-02-01 first-date-of-fy(2)', '=2020-02-01 first-date-of-fy(2)')
                a?: string;
            }
        `), compile(`
            interface Foo {
                @stereotype('lcdate')
                @range('=2020-02-01 first-date-of-fy(2)', '=2020-02-01 first-date-of-fy(2)')
                a: string;
            }
        `), compile(`
            interface Foo {
                @stereotype('lcdate')
                @range('=2020-02-01 first-date-of-fy(2)', '=2020-02-01 first-date-of-fy(2)')
                a?: string;
            }
        `)];
        for (const schema of schemas) {
            const ty = getType(schema, 'Foo');
            {
                const ctx: Partial<ValidationContext> = {
                    checkAll: true,
                    stereotypes: new Map([
                        ...dateStereotypes,
                    ]),
                };
                const z = validate<any>({ a: '2020-02-01' }, ty, ctx);
                expect(z).toEqual({value: { a: '2020-02-01' }});
            }
        }
    });
    it("stereotype-date-fy-5", function() {
        const schemas = [compile(`
            interface Foo {
                @stereotype('date')
                @range('=2020-11-30 first-date-of-fy(12)', '=2020-11-30 first-date-of-fy(12)')
                a: string;
            }
        `), compile(`
            interface Foo {
                @stereotype('date')
                @range('=2020-11-30 first-date-of-fy(12)', '=2020-11-30 first-date-of-fy(12)')
                a?: string;
            }
        `), compile(`
            interface Foo {
                @stereotype('lcdate')
                @range('=2020-11-30 first-date-of-fy(12)', '=2020-11-30 first-date-of-fy(12)')
                a: string;
            }
        `), compile(`
            interface Foo {
                @stereotype('lcdate')
                @range('=2020-11-30 first-date-of-fy(12)', '=2020-11-30 first-date-of-fy(12)')
                a?: string;
            }
        `)];
        for (const schema of schemas) {
            const ty = getType(schema, 'Foo');
            {
                const ctx: Partial<ValidationContext> = {
                    checkAll: true,
                    stereotypes: new Map([
                        ...dateStereotypes,
                    ]),
                };
                const z = validate<any>({ a: '2019-12-01' }, ty, ctx);
                expect(z).toEqual({value: { a: '2019-12-01' }});
            }
        }
    });
    it("stereotype-date-fy-6", function() {
        const schemas = [compile(`
            interface Foo {
                @stereotype('date')
                @range('=2020-12-01 first-date-of-fy(12)', '=2020-12-01 first-date-of-fy(12)')
                a: string;
            }
        `), compile(`
            interface Foo {
                @stereotype('date')
                @range('=2020-12-01 first-date-of-fy(12)', '=2020-12-01 first-date-of-fy(12)')
                a?: string;
            }
        `), compile(`
            interface Foo {
                @stereotype('lcdate')
                @range('=2020-12-01 first-date-of-fy(12)', '=2020-12-01 first-date-of-fy(12)')
                a: string;
            }
        `), compile(`
            interface Foo {
                @stereotype('lcdate')
                @range('=2020-12-01 first-date-of-fy(12)', '=2020-12-01 first-date-of-fy(12)')
                a?: string;
            }
        `)];
        for (const schema of schemas) {
            const ty = getType(schema, 'Foo');
            {
                const ctx: Partial<ValidationContext> = {
                    checkAll: true,
                    stereotypes: new Map([
                        ...dateStereotypes,
                    ]),
                };
                const z = validate<any>({ a: '2020-12-01' }, ty, ctx);
                expect(z).toEqual({value: { a: '2020-12-01' }});
            }
        }
    });
    it("meta-1", function() {
        const schema = compile(`
            @meta({ objectId: '0ffc31e6-f534-4e49-b6d7-a3ec21f49637' })
            interface A {
                @meta({
                    fieldId: '82bd5832-c399-4d4c-8bc4-b76a95823ebf',
                    fieldType: 'checkbox',
                })
                a: ('foo' | 'bar' | 'baz')[];
            }
        `);
        const ty = getType(schema, 'A');
        expect(ty).toEqual({
            kind: 'object',
            members: [['a', {
                kind: 'repeated',
                repeated: {
                    kind: 'one-of',
                    oneOf: [{
                        kind: 'primitive-value',
                        value: 'foo',
                    }, {
                        kind: 'primitive-value',
                        value: 'bar',
                    }, {
                        kind: 'primitive-value',
                        value: 'baz',
                    }],
                },
                name: 'a',
                min: null,
                max: null,
                meta: { fieldId: '82bd5832-c399-4d4c-8bc4-b76a95823ebf', fieldType: 'checkbox' },
            }]],
            typeName: 'A',
            name: 'A',
            meta: { objectId: '0ffc31e6-f534-4e49-b6d7-a3ec21f49637' },
        } as any);
    });
});
