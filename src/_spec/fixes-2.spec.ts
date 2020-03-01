
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



describe("fix-2", function() {
    it("stereotype-1a", function() {
        const schema = compile(`
            interface Foo {
                @stereotype('date')
                @range('=today first-date-of-mo', '=today last-date-of-mo')
                a: string;

                @stereotype('date')
                @range('2020-01-01', '2030-12-31')
                b: string;

                @stereotype('date')
                @range('2020-01-01', '=today +2yr @12mo @31day')
                c: string;
            }
        `);
        const ty = getType(schema, 'Foo');
        {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                stereotypes: new Map([
                    ...dateStereotypes,
                ]),
            };
            const d = (new Date()).toISOString().slice(0, 10); // toISOString returns date in UTC
            const z = validate<any>({
                a: d,
                b: '2020-01-01',
                c: d,
            }, ty, ctx);
            expect(z).toEqual({value: {
                a: d,
                b: '2020-01-01',
                c: d,
            }});
        }
    });
    it("stereotype-1b", function() {
        const schema = compile(`
            interface Foo {
                @stereotype('lcdate')
                @range('=today first-date-of-mo', '=today last-date-of-mo')
                a: string;

                @stereotype('lcdate')
                @range('2020-01-01', '2030-12-31')
                b: string;

                @stereotype('lcdate')
                @range('2020-01-01', '=today +2yr @12mo @31day')
                c: string;
            }
        `);
        const ty = getType(schema, 'Foo');
        {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                stereotypes: new Map([
                    ...dateStereotypes,
                ]),
            };
            const d = (new Date(
                new Date().getTime() -
                new Date().getTimezoneOffset() * 60 * 1000))
                .toISOString().slice(0, 10); // toISOString returns date in UTC
            const z = validate<any>({
                a: d,
                b: '2020-01-01',
                c: d,
            }, ty, ctx);
            expect(z).toEqual({value: {
                a: d,
                b: '2020-01-01',
                c: d,
            }});
        }
    });
    it("stereotype-2a", function() {
        const schema = compile(`
            interface Foo {
                @stereotype('date')
                @range('=2020-02-22 first-date-of-mo', '=2020-02-22 last-date-of-mo')
                a: string;
            }
        `);
        const ty = getType(schema, 'Foo');
        {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                stereotypes: new Map([
                    ...dateStereotypes,
                ]),
            };
            const z = validate<any>({ a: '2020-02-14' }, ty, ctx);
            expect(z).toEqual({value: { a: '2020-02-14' }});
        }
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
        {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                stereotypes: new Map([
                    ...dateStereotypes,
                ]),
            };
            const z = validate<any>({ a: '2020-02-29' }, ty, ctx);
            expect(z).toEqual({value: { a: '2020-02-29' }});
        }
        {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                stereotypes: new Map([
                    ...dateStereotypes,
                ]),
            };
            const z = validate<any>({ a: '2020-01-31' }, ty, ctx);
            expect(z).toEqual(null);
        }
        {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                stereotypes: new Map([
                    ...dateStereotypes,
                ]),
            };
            const z = validate<any>({ a: '2020-03-01' }, ty, ctx);
            expect(z).toEqual(null);
        }
    });
    it("stereotype-2b", function() {
        const schema = compile(`
            interface Foo {
                @stereotype('lcdate')
                @range('=2020-02-22 first-date-of-mo', '=2020-02-22 last-date-of-mo')
                a: string;
            }
        `);
        const ty = getType(schema, 'Foo');
        {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                stereotypes: new Map([
                    ...dateStereotypes,
                ]),
            };
            const z = validate<any>({ a: '2020-02-14' }, ty, ctx);
            expect(z).toEqual({value: { a: '2020-02-14' }});
        }
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
        {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                stereotypes: new Map([
                    ...dateStereotypes,
                ]),
            };
            const z = validate<any>({ a: '2020-02-29' }, ty, ctx);
            expect(z).toEqual({value: { a: '2020-02-29' }});
        }
        {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                stereotypes: new Map([
                    ...dateStereotypes,
                ]),
            };
            const z = validate<any>({ a: '2020-01-31' }, ty, ctx);
            expect(z).toEqual(null);
        }
        {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                stereotypes: new Map([
                    ...dateStereotypes,
                ]),
            };
            const z = validate<any>({ a: '2020-03-01' }, ty, ctx);
            expect(z).toEqual(null);
        }
    });
    it("stereotype-3a", function() {
        const schema = compile(`
            interface Foo {
                @stereotype('date')
                @range('=2020-02-22 first-date-of-yr', '=2020-02-22 last-date-of-yr')
                a: string;
            }
        `);
        const ty = getType(schema, 'Foo');
        {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                stereotypes: new Map([
                    ...dateStereotypes,
                ]),
            };
            const z = validate<any>({ a: '2020-02-14' }, ty, ctx);
            expect(z).toEqual({value: { a: '2020-02-14' }});
        }
        {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                stereotypes: new Map([
                    ...dateStereotypes,
                ]),
            };
            const z = validate<any>({ a: '2020-01-01' }, ty, ctx);
            expect(z).toEqual({value: { a: '2020-01-01' }});
        }
        {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                stereotypes: new Map([
                    ...dateStereotypes,
                ]),
            };
            const z = validate<any>({ a: '2020-12-31' }, ty, ctx);
            expect(z).toEqual({value: { a: '2020-12-31' }});
        }
        {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                stereotypes: new Map([
                    ...dateStereotypes,
                ]),
            };
            const z = validate<any>({ a: '2019-12-31' }, ty, ctx);
            expect(z).toEqual(null);
        }
        {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                stereotypes: new Map([
                    ...dateStereotypes,
                ]),
            };
            const z = validate<any>({ a: '2021-01-01' }, ty, ctx);
            expect(z).toEqual(null);
        }
    });
    it("stereotype-3b", function() {
        const schema = compile(`
            interface Foo {
                @stereotype('lcdate')
                @range('=2020-02-22 first-date-of-yr', '=2020-02-22 last-date-of-yr')
                a: string;
            }
        `);
        const ty = getType(schema, 'Foo');
        {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                stereotypes: new Map([
                    ...dateStereotypes,
                ]),
            };
            const z = validate<any>({ a: '2020-02-14' }, ty, ctx);
            expect(z).toEqual({value: { a: '2020-02-14' }});
        }
        {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                stereotypes: new Map([
                    ...dateStereotypes,
                ]),
            };
            const z = validate<any>({ a: '2020-01-01' }, ty, ctx);
            expect(z).toEqual({value: { a: '2020-01-01' }});
        }
        {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                stereotypes: new Map([
                    ...dateStereotypes,
                ]),
            };
            const z = validate<any>({ a: '2020-12-31' }, ty, ctx);
            expect(z).toEqual({value: { a: '2020-12-31' }});
        }
        {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                stereotypes: new Map([
                    ...dateStereotypes,
                ]),
            };
            const z = validate<any>({ a: '2019-12-31' }, ty, ctx);
            expect(z).toEqual(null);
        }
        {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                stereotypes: new Map([
                    ...dateStereotypes,
                ]),
            };
            const z = validate<any>({ a: '2021-01-01' }, ty, ctx);
            expect(z).toEqual(null);
        }
    });
    it("forceCast-1", function() {
        const schema = compile(`
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
        `);
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
});
