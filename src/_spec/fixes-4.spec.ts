
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
    })
});
