
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
            const z = validate<any>({ a: '2020-02-14T00:00' }, ty, ctx);
            expect(z).toEqual(null);
        }
        {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                stereotypes: new Map([
                    ...dateStereotypes,
                ]),
            };
            const z = validate<any>({ a: '2020-02-14T00:00Z' }, ty, ctx);
            expect(z).toEqual(null);
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
            const z = validate<any>({ a: '2020-02-14T00:00' }, ty, ctx);
            expect(z).toEqual(null);
        }
        {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                stereotypes: new Map([
                    ...dateStereotypes,
                ]),
            };
            const z = validate<any>({ a: '2020-02-14T00:00Z' }, ty, ctx);
            expect(z).toEqual(null);
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
            const z = validate<any>({ a: '2020-02-14T00:00' }, ty, ctx);
            expect(z).toEqual(null);
        }
        {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                stereotypes: new Map([
                    ...dateStereotypes,
                ]),
            };
            const z = validate<any>({ a: '2020-02-14T00:00Z' }, ty, ctx);
            expect(z).toEqual(null);
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
            const z = validate<any>({ a: '2020-02-14T00:00' }, ty, ctx);
            expect(z).toEqual(null);
        }
        {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                stereotypes: new Map([
                    ...dateStereotypes,
                ]),
            };
            const z = validate<any>({ a: '2020-02-14T00:00Z' }, ty, ctx);
            expect(z).toEqual(null);
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
    it("stereotype-4a", function() {
        const schema = compile(`
            interface Foo {
                @stereotype('datetime')
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
            expect(z).toEqual(null);
        }
        {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                stereotypes: new Map([
                    ...dateStereotypes,
                ]),
            };
            const z = validate<any>({ a: '2020-02-14T00:00' }, ty, ctx);
            expect(z).toEqual({value: { a: '2020-02-14T00:00' }});
        }
        {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                stereotypes: new Map([
                    ...dateStereotypes,
                ]),
            };
            const z = validate<any>({ a: '2020-02-14T00:00Z' }, ty, ctx);
            expect(z).toEqual({value: { a: '2020-02-14T00:00Z' }});
        }
        {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                stereotypes: new Map([
                    ...dateStereotypes,
                ]),
            };
            const z = validate<any>({ a: '2020-02-01' }, ty, ctx);
            expect(z).toEqual(null);
        }
        {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                stereotypes: new Map([
                    ...dateStereotypes,
                ]),
            };
            const z = validate<any>({ a: '2020-02-01T00:00' }, ty, ctx);
            expect(z).toEqual({value: { a: '2020-02-01T00:00' }});
        }
        {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                stereotypes: new Map([
                    ...dateStereotypes,
                ]),
            };
            const z = validate<any>({ a: '2020-02-01T00:00Z' }, ty, ctx);
            expect(z).toEqual({value: { a: '2020-02-01T00:00Z' }});
        }
        {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                stereotypes: new Map([
                    ...dateStereotypes,
                ]),
            };
            const z = validate<any>({ a: '2020-02-29' }, ty, ctx);
            expect(z).toEqual(null);
        }
        {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                stereotypes: new Map([
                    ...dateStereotypes,
                ]),
            };
            const z = validate<any>({ a: '2020-02-29T00:00' }, ty, ctx);
            expect(z).toEqual({value: { a: '2020-02-29T00:00' }});
        }
        {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                stereotypes: new Map([
                    ...dateStereotypes,
                ]),
            };
            const z = validate<any>({ a: '2020-02-29T00:00Z' }, ty, ctx);
            expect(z).toEqual({value: { a: '2020-02-29T00:00Z' }});
        }
        {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                stereotypes: new Map([
                    ...dateStereotypes,
                ]),
            };
            const z = validate<any>({ a: '2020-02-29T00:01' }, ty, ctx);
            expect(z).toEqual(null);
        }
        {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                stereotypes: new Map([
                    ...dateStereotypes,
                ]),
            };
            const z = validate<any>({ a: '2020-02-29T00:01Z' }, ty, ctx);
            expect(z).toEqual(null);
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
            const z = validate<any>({ a: '2020-01-31T23:59' }, ty, ctx);
            expect(z).toEqual(null);
        }
        {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                stereotypes: new Map([
                    ...dateStereotypes,
                ]),
            };
            const z = validate<any>({ a: '2020-01-31T23:59Z' }, ty, ctx);
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
        {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                stereotypes: new Map([
                    ...dateStereotypes,
                ]),
            };
            const z = validate<any>({ a: '2020-03-01T00:00' }, ty, ctx);
            expect(z).toEqual(null);
        }
        {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                stereotypes: new Map([
                    ...dateStereotypes,
                ]),
            };
            const z = validate<any>({ a: '2020-03-01T00:00Z' }, ty, ctx);
            expect(z).toEqual(null);
        }
    });
    it("stereotype-4b", function() {
        const schema = compile(`
            interface Foo {
                @stereotype('lcdatetime')
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
            expect(z).toEqual(null);
        }
        {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                stereotypes: new Map([
                    ...dateStereotypes,
                ]),
            };
            const z = validate<any>({ a: '2020-02-14T00:00' }, ty, ctx);
            expect(z).toEqual({value: { a: '2020-02-14T00:00' }});
        }
        {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                stereotypes: new Map([
                    ...dateStereotypes,
                ]),
            };
            const z = validate<any>({ a: '2020-02-14T00:00Z' }, ty, ctx);
            expect(z).toEqual({value: { a: '2020-02-14T00:00Z' }});
        }
        {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                stereotypes: new Map([
                    ...dateStereotypes,
                ]),
            };
            const z = validate<any>({ a: '2020-02-01' }, ty, ctx);
            expect(z).toEqual(null);
        }
        {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                stereotypes: new Map([
                    ...dateStereotypes,
                ]),
            };
            const z = validate<any>({ a: '2020-02-01T00:00' }, ty, ctx);
            expect(z).toEqual({value: { a: '2020-02-01T00:00' }});
        }
        {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                stereotypes: new Map([
                    ...dateStereotypes,
                ]),
            };
            const z = validate<any>({ a: '2020-02-01T00:00Z' }, ty, ctx);
            expect(z).toEqual({value: { a: '2020-02-01T00:00Z' }});
        }
        {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                stereotypes: new Map([
                    ...dateStereotypes,
                ]),
            };
            const z = validate<any>({ a: '2020-02-29' }, ty, ctx);
            expect(z).toEqual(null);
        }
        {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                stereotypes: new Map([
                    ...dateStereotypes,
                ]),
            };
            const z = validate<any>({ a: '2020-02-29T00:00' }, ty, ctx);
            expect(z).toEqual({value: { a: '2020-02-29T00:00' }});
        }
        {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                stereotypes: new Map([
                    ...dateStereotypes,
                ]),
            };
            const z = validate<any>({ a: '2020-02-29T00:00Z' }, ty, ctx);
            // expect(z).toEqual({value: { a: '2020-02-29T00:00Z' }}); // result will be chaged by your TZ
        }
        {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                stereotypes: new Map([
                    ...dateStereotypes,
                ]),
            };
            const z = validate<any>({ a: '2020-02-29T00:01' }, ty, ctx);
            expect(z).toEqual(null);
        }
        {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                stereotypes: new Map([
                    ...dateStereotypes,
                ]),
            };
            const z = validate<any>({ a: '2020-02-29T00:01Z' }, ty, ctx);
            // expect(z).toEqual(null); // result will be chaged by your TZ
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
            const z = validate<any>({ a: '2020-01-31T23:59' }, ty, ctx);
            expect(z).toEqual(null);
        }
        {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                stereotypes: new Map([
                    ...dateStereotypes,
                ]),
            };
            const z = validate<any>({ a: '2020-01-31T23:59Z' }, ty, ctx);
            // expect(z).toEqual(null); // result will be chaged by your TZ
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
        {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                stereotypes: new Map([
                    ...dateStereotypes,
                ]),
            };
            const z = validate<any>({ a: '2020-03-01T00:00' }, ty, ctx);
            expect(z).toEqual(null);
        }
        {
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                stereotypes: new Map([
                    ...dateStereotypes,
                ]),
            };
            const z = validate<any>({ a: '2020-03-01T00:00Z' }, ty, ctx);
            // expect(z).toEqual(null); // result will be chaged by your TZ
        }
    });
    it("stereotype-5a", function() {
        const schemas = [compile(`
            interface Foo {
                @stereotype('date')
                @range('=2020-02-22 @2021yr @4mo @11day', '=2019-10-11 @2021yr @4mo @11day')
                a: string;
            }
        `), compile(`
            interface Foo {
                @stereotype('date')
                @range('=2020-02-22 @2021yr @4mo @11day', '=2019-10-11 @2021yr @4mo @11day')
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
                const z = validate<any>({ a: '2021-04-11' }, ty, ctx);
                expect(z).toEqual({value: { a: '2021-04-11' }});
            }
        }
    });
    it("stereotype-5b", function() {
        const schemas = [compile(`
            interface Foo {
                @stereotype('lcdate')
                @range('=2020-02-22 @2021yr @4mo @11day', '=2019-10-11 @2021yr @4mo @11day')
                a: string;
            }
        `), compile(`
            interface Foo {
                @stereotype('lcdate')
                @range('=2020-02-22 @2021yr @4mo @11day', '=2019-10-11 @2021yr @4mo @11day')
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
                const z = validate<any>({ a: '2021-04-11' }, ty, ctx);
                expect(z).toEqual({value: { a: '2021-04-11' }});
            }
        }
    });
    it("stereotype-6a", function() {
        const schemas = [compile(`
            interface Foo {
                @stereotype('datetime')
                @range('=2020-02-22 @2021yr @4mo @11day @20hr @32min @43sec @973ms', '=2019-10-11 @2021yr @4mo @11day @20hr @32min @43sec @973ms')
                a: string;
            }
        `), compile(`
            interface Foo {
                @stereotype('datetime')
                @range('=2020-02-22 @2021yr @4mo @11day @20hr @32min @43sec @973ms', '=2019-10-11 @2021yr @4mo @11day @20hr @32min @43sec @973ms')
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
                const z = validate<any>({ a: '2021-04-11T20:32:43.973' }, ty, ctx);
                expect(z).toEqual({value: { a: '2021-04-11T20:32:43.973' }});
            }
            {
                const ctx: Partial<ValidationContext> = {
                    checkAll: true,
                    stereotypes: new Map([
                        ...dateStereotypes,
                    ]),
                };
                const z = validate<any>({ a: '2021-04-11T20:32:43.973Z' }, ty, ctx);
                expect(z).toEqual({value: { a: '2021-04-11T20:32:43.973Z' }});
            }
        }
    });
    it("stereotype-6b", function() {
        const schemas = [compile(`
            interface Foo {
                @stereotype('lcdatetime')
                @range('=2020-02-22 @2021yr @4mo @11day @20hr @32min @43sec @973ms', '=2019-10-11 @2021yr @4mo @11day @20hr @32min @43sec @973ms')
                a: string;
            }
        `), compile(`
            interface Foo {
                @stereotype('lcdatetime')
                @range('=2020-02-22 @2021yr @4mo @11day @20hr @32min @43sec @973ms', '=2019-10-11 @2021yr @4mo @11day @20hr @32min @43sec @973ms')
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
                const z = validate<any>({ a: '2021-04-11T20:32:43.973' }, ty, ctx);
                expect(z).toEqual({value: { a: '2021-04-11T20:32:43.973' }});
            }
            {
                const ctx: Partial<ValidationContext> = {
                    checkAll: true,
                    stereotypes: new Map([
                        ...dateStereotypes,
                    ]),
                };
                const z = validate<any>({ a: '2021-04-11T20:32:43.973Z' }, ty, ctx);
                // expect(z).toEqual(null); // result will be chaged by your TZ
            }
        }
    });
    it("stereotype-7a", function() {
        const schemas = [compile(`
            interface Foo {
                @stereotype('date')
                @range('=2020-02-05 +1yr +2mo +6days', '=2022-10-13 -1yr -6mo -2day')
                a: string;
            }
        `), compile(`
            interface Foo {
                @stereotype('date')
                @range('=2020-02-05 +1yr +2mo +6days', '=2022-10-13 -1yr -6mo -2day')
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
                const z = validate<any>({ a: '2021-04-11' }, ty, ctx);
                expect(z).toEqual({value: { a: '2021-04-11' }});
            }
        }
    });
    it("stereotype-7b", function() {
        const schemas = [compile(`
            interface Foo {
                @stereotype('lcdate')
                @range('=2020-02-05 +1yr +2mo +6days', '=2022-10-13 -1yr -6mo -2day')
                a: string;
            }
        `), compile(`
            interface Foo {
                @stereotype('lcdate')
                @range('=2020-02-05 +1yr +2mo +6days', '=2022-10-13 -1yr -6mo -2day')
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
                const z = validate<any>({ a: '2021-04-11' }, ty, ctx);
                expect(z).toEqual({value: { a: '2021-04-11' }});
            }
        }
    });
    it("stereotype-8a", function() {
        const schemas = [compile(`
            interface Foo {
                @stereotype('datetime')
                @range('=2020-02-05T01:02:03.456 +1yr +2mo +6days +19hr +30min +40sec +517ms',
                       '=2022-10-13T23:59:58.987 -1yr -6mo -2day -3hr -27min -15sec -14ms')
                a: string;
            }
        `), compile(`
            interface Foo {
                @stereotype('datetime')
                @range('=2020-02-05T01:02:03.456 +1yr +2mo +6days +19hr +30min +40sec +517ms',
                    '=2022-10-13T23:59:58.987 -1yr -6mo -2day -3hr -27min -15sec -14ms')
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
                const z = validate<any>({ a: '2021-04-11T20:32:43.973' }, ty, ctx);
                expect(z).toEqual({value: { a: '2021-04-11T20:32:43.973' }});
            }
            {
                const ctx: Partial<ValidationContext> = {
                    checkAll: true,
                    stereotypes: new Map([
                        ...dateStereotypes,
                    ]),
                };
                const z = validate<any>({ a: '2021-04-11T20:32:43.973Z' }, ty, ctx);
                expect(z).toEqual({value: { a: '2021-04-11T20:32:43.973Z' }});
            }
        }
    });
    it("stereotype-8b", function() {
        const schemas = [compile(`
            interface Foo {
                @stereotype('lcdatetime')
                @range('=2020-02-05T01:02:03.456 +1yr +2mo +6days +19hr +30min +40sec +517ms',
                       '=2022-10-13T23:59:58.987 -1yr -6mo -2day -3hr -27min -15sec -14ms')
                a: string;
            }
        `), compile(`
            interface Foo {
                @stereotype('lcdatetime')
                @range('=2020-02-05T01:02:03.456 +1yr +2mo +6days +19hr +30min +40sec +517ms',
                    '=2022-10-13T23:59:58.987 -1yr -6mo -2day -3hr -27min -15sec -14ms')
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
                const z = validate<any>({ a: '2021-04-11T20:32:43.973' }, ty, ctx);
                expect(z).toEqual({value: { a: '2021-04-11T20:32:43.973' }});
            }
            {
                const ctx: Partial<ValidationContext> = {
                    checkAll: true,
                    stereotypes: new Map([
                        ...dateStereotypes,
                    ]),
                };
                const z = validate<any>({ a: '2021-04-11T20:32:43.973Z' }, ty, ctx);
                // expect(z).toEqual(null); // result will be chaged by your TZ
            }
        }
    });
});
