
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
