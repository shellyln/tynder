
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
});
