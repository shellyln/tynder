
// tslint:disable-next-line: no-implicit-dependencies no-var-requires
const Ajv = require('ajv');

import { ValidationContext }        from '../types';
import { validate,
         getType }                  from '../validator';
import { pick,
         patch }                    from '../picker';
import { compile }                  from '../compiler';
import { generateJsonSchemaObject } from '../codegen';
import { serialize, deserialize }   from '../serializer';
import * as op                      from '../operators';



describe("foo", function() {
    it("foo-1", function() {
        try {
            /*
            const ast1 = parse(`
                export type A = string;
                type AA = (string);
                type AAA = string|number;
                type AAAA = string | number;
                type AAAAA = (string|number);
                type AAAAAA = {a: string, b: number};
                type AAAAAAA = (string|(number|'aaa')|{a: string, b: number}|[string, number]);
                type AAAAAAA2 = (string|(number|'aaa')|{a: string, b: number}|[string, @range(10, 20) number]);
                interface B {
                    a: string;
                    b?: number;
                    'b2'?: number;
                    @range(2, 5) @max(10) @min(3)
                    b3: number;
                    b4: @range(2, 5) @max(10) @min(3) number;
                    @msg({a: "1234", b: "3456"})
                    b5: number;
                    c: [string];
                    d: [string, number];
                    e: [1, 2, 'aaa'];
                    e2: [1, ...<string, 3..5>, 'aaa'];
                    e3: [...<string|number>];
                    f: Array<number>;
                    g: Array<Array<number>>;
                    g2: Array<{a: string, b: number}>;
                    h: Array<number[]>;
                    i: number[];
                    i2: number[3];
                    i3: number[3..];
                    i4: number[..3];
                    i5: number[1..3];
                    i6: (number)[];
                    i7: (number|string)[];
                    j: number[][];
                    j2: (number|string)[][];
                    k: number | string;
                    k2: number[] | string [];
                    k3: number[][] | string [][];
                    k4: number[][] | string [][] | string[][][];
                    k4b: @range(2, 5) @max(10) @min(3) number[][] |
                        @range(2, 5) @max(10) @min(3) string [][] |
                        @range(2, 5) @max(10) @min(3) string[][][];
                    k5: {} | string [][] | string[][][];
                    k6: {a: number} | string [][] | string[][][];
                    k7: {a: number, b:string} | string [][] | string[][][];
                    k8: {a: number, b:string} | {c?: boolean} | string[][][];
                    k9: (number[]) | (string []);
                    k10: (number[][]) | (string [][]);
                    k11: (number[3..4][5..6]) | (string [3..4][5..6]);
                    k12: (number[3..4][5..6]) | (string [3..4][5..6]) | (string[][3..4][5..6]);
                    k13: ({}) | (string [3..4][5..6]) | (string[][3..4][5..6]);
                    k14: ({a: number}) | (string [3..4][5..6]) | (string[][3..4][5..6]);
                    k15: ({a: number, b:string}) | (string [3..4][5..6]) | (string[][3..4][5..6]);
                    k16: ({a: number, b:string}) | ({c?: boolean}) | (string[][3..4][5..6]);
                }
                export interface C extends A {}
                export interface D extends A, B {
                    x: string;
                }
            `);
            */
            /*
            const ast2 = parse(`
                type A = @min(3) @range(5, 9) @msgId({a: '12345', b: [1, {c: 3}]}) string;
            `);
            */
            const schema2 = compile(`
                import * as fs from 'fs';
                external U, W;
                /** doc comment X - line 1
                 * doc comment X - line 2
                 */
                export type X = string | number | 'foo';
                type XX = number;
                /** doc comment S */
                enum S {
                    /** doc comment S.q */
                    q,
                    w = 3,
                    e,
                    r,
                    t = 10,
                    u = 'aaa',
                }
                export enum R {}
                interface B1111 {}
                /** doc comment B - line 1 */
                interface B {
                    @range(2, 5)
                    a: number;
                    /** doc comment B.b - line 1
                     * doc comment B.b - line 2
                     */
                    b?: string;
                }
                export interface C {
                    c?: string[10..20][];
                    d: string|number|boolean[1][2..3]|B|B[]|B|{/** doc comment C.d.p */p: string};
                    d2?: X;
                    d3?: U;
                    d4?: S;
                    [propName: /^[B][0-9]$/]: U;
                }
                interface A extends B,C, D,DD {
                    e: (string[])|(@minValue(3) number[])|(boolean[]);
                    f: X | boolean;
                    @match(/^[A-F]+$/)
                    g: string;
                    @msg('custom msg of A.h')
                    h?: C;
                    i: [string, number?, string?];
                    j: [...<number, 1..2>, string];
                    j2: [string, ...<number, 2..3>];
                    j3: string[..2];
                    k: Y;
                    l: B;
                    [propName: /^[a-z][0-9]$/ | number]?: string;
                    /** doc comment A.propName (C) */
                    [propName: /^[A][0-9]$/]: C;
                }
                interface AA extends A {}
                type Y = boolean;
                interface D {
                    d90: string;
                }
                interface DD {
                    d91: string;
                }

                interface H {
                // interface H extends HH { // <- recursive extend
                    a?: HH;
                    b: H | number;
                }
                interface HH extends H {c?:number;}

                /*
                interface HH extends H {c?:number;}
                interface H {
                    a?: HH;
                    // a?: H;
                    b: H | number;
                }
                */
            `);
            // console.log(JSON.stringify(getType(schema2, 'X'), null, 2));
            // console.log(JSON.stringify(getType(schema2, 'C'), null, 2));
            // console.log(JSON.stringify(getType(schema2, 'A'), null, 2));
            // console.log(JSON.stringify(getType(schema2, 'H'), null, 2));
            /*
            const ctx: Partial<ValidationContext> = {
                checkAll: true,
                // noAdditionalProps: true,
                schema: schema2,
            };
            expect(validate({
                a: 5,
                c: [['', '', '', '', '', '', '', '', '', '']],
                d: 10,
                // d2: true,
                d3: 11,
                // d4: 11,
                d90: '',
                d91: '',
                e: [true, false],
                // e: [0, 1, 2],
                f: true,
                g: 'DEBCB',
                // h: 1,
                i: ['q', 12, 'a'],
                j: [1, 2, 'aaa'],
                // j: ['', 1, 2, 'aaa'],
                // j: [1, 2, 3, 'aaa'],
                // j: '',
                j2: ['aaa', 1, 2, 3],
                // j2: ['aaa', '', 1, 2, 3],
                j3: ['', ''],
                // j3: ['', 0],
                // j3: '',
                k: false,
                l: {a: 5},
                z1: 'a',
                // A0: 1,
                // B0: 2,
            }, getType(schema2, 'A'), ctx)).toEqual({} as any);
            console.log(generateTypeScriptCode(schema2));
            console.log(generateProto3Code(schema2));
            // console.log(JSON.stringify(ctx));
            console.log(ctx.errors);

            delete ctx.errors;
            expect(validate({
                a: {a: {b: 2}, b: 1},
                b: {b: {b: 3}},
            }, getType(schema2, 'HH'), ctx)).toEqual({} as any);
            // console.log(JSON.stringify(ctx));
            console.log(ctx.errors);
            */
        } catch (e) {
            throw e;
        }
        expect(1).toEqual(1);
    });
    it("foo-2", function() {
        /*
        console.log(JSON.stringify(getType(z, 'A'), null, 2));
        */
        const z = compile(`
            type Foo = string;
            interface A {
                a: Foo;
                @range(3, 5)
                b: number;
                @maxLength(3)
                c: Foo;
            }
        `);
        const ctx: Partial<ValidationContext> = {checkAll: true};
        const r = validate({b: 6, c: '1234'}, getType(z, 'A'), ctx);
        // console.log(JSON.stringify(r));
        // console.log(ctx.errors);
        expect(1).toEqual(1);
    });
    it("foo-2b", function() {
        /*
        console.log(JSON.stringify(getType(z, 'A'), null, 2));
        */
        const z = compile(`
            type Foo = string;
            interface A {
                a: Foo;
                @range(3, 5)
                b: number;
                @maxLength(3)
                c: Foo;
            }
        `);
        const ctx: Partial<ValidationContext> = {checkAll: true};
        const subtype = op.picked(getType(z, 'A'), 'a', 'c');
        const original = {a: '', b: 3, c: '123', d: 0};
        const needle = pick(original, subtype, ctx);
        needle.a = '1';
        needle.b = 6;
        (needle as any).e = 5;
        try {
            const r = patch(original, needle, subtype, ctx);
            // console.log(r);
            expect(1).toEqual(1);
        } catch (e) {
            // console.log(e.message);
            // console.log(e.ctx?.errors);
            expect(1).toEqual(0);
        }
    });
    it("foo-4", function() {
        const z = compile(`
            type Foo = string;
            interface A {
                a: Foo;
                @range(3, 5)
                b: number;
                @maxLength(3)
                c: Foo;
            }
        `);
        const zz = deserialize(serialize(z));
        // console.log(zz.keys());
        expect(1).toEqual(1);
    });
    it("readme-examples-1", function() {
        {
            const mySchema = compile(`
                type Foo = string;
                interface A {
                    @maxLength(4)
                    a: Foo;
                    z?: boolean;
                }
            `);
            type Foo = string;
            interface A {
                a: Foo;
                z?: boolean;
            }
            {
                const validated1 = validate({
                    a: 'x',
                    b: 3,
                }, getType(mySchema, 'A')); // {value: {a: 'x', b: 3}}
                expect(validated1).toEqual({value: {a: 'x', b: 3}});


                const validated2 = validate({
                    aa: 'x',
                    b: 3,
                }, getType(mySchema, 'A')); // null

                if (validated2 === null) {
                    expect(1).toEqual(1);
                } else {
                    expect(1).toEqual(0);
                }


                const ctx3: Partial<ValidationContext> =
                {                            // To receive the error messages, define the context as a variable.
                    checkAll: true,          // (optional) Set to true to continue validation after the first error.
                    noAdditionalProps: true, // (optional) Do not allow implicit additional properties.
                    schema: mySchema,        // (optional) Pass "schema" to check for recursive types.
                };

                const validated3 = validate({
                    aa: 'x',
                    b: 3,
                }, getType(mySchema, 'A'), ctx3);

                if (validated3 === null) {
                    expect(1).toEqual(1);
                    // console.log(JSON.stringify(
                    //     ctx3.errors, // error messages
                    //     null, 2));
                } else {
                    expect(1).toEqual(0);
                }
            }
            {
                const original = {
                    a: 'x',
                    b: 3,
                };
                const needleType = op.picked(getType(mySchema, 'A'), 'a');


                try {
                    const needle1 = pick(original, needleType); // {a: 'x'}
                    const unknownInput1: unknown = { // Edit the needle data
                        ...needle1,
                        a: 'y',
                        q: 1234,
                    };
                    const changed1 = patch(original, unknownInput1, needleType); // {a: 'y', b: 3}
                    expect(changed1).toEqual({a: 'y', b: 3});
                } catch (e) {
                    expect(1).toEqual(0);
                    // console.log(e.message);
                    // console.log(e.ctx?.errors);
                }


                try {
                    const needle2 = pick(original, needleType); // {a: 'x'}
                    const unknownInput2: unknown = { // Edit the needle data
                        ...needle2,
                        a: 'yyyyy',
                        q: 1234,
                    };
                    const changed1 = patch(original, unknownInput2, needleType); // Throws an error
                    expect(1).toEqual(0);
                } catch (e) {
                    expect(1).toEqual(1);
                    // console.log(e.message);
                    // console.log(e.ctx?.errors);
                }


                try {
                    const ctx3: Partial<ValidationContext> =
                    {                     // To receive the error messages, define the context as a variable.
                        checkAll: true,   // (optional) Set to true to continue validation after the first error.
                        schema: mySchema, // (optional) Pass "schema" to check for recursive types.
                    };

                    const needle3 = pick({
                        aa: 'x',
                        b: 3,
                    }, needleType, ctx3); // Throws an error
                    expect(1).toEqual(0);
                } catch (e) {
                    expect(1).toEqual(1);
                    // console.log(e.message);
                    // console.log(e.ctx?.errors);
                }
            }
            {
                const unknownInput: unknown = {a: 'x'};
                const validated = validate<A>(unknownInput, getType(mySchema, 'A'));

                if (validated) {
                    const validatedInput = validated.value;
                    expect(validatedInput).toEqual({a: 'x'});
                } else {
                    expect(1).toEqual(0);
                }
            }
            {
                interface Store {
                    baz: A;
                }
                const store: Store = {
                    baz: {
                        a: 'x',
                        z: false,
                    }
                };

                const needleType = op.picked(getType(mySchema, 'A'), 'a');

                try {
                    const needle = pick(store.baz, needleType); // {a: 'x'}
                    const unknownInput: unknown = { // Edit the needle data
                        ...needle,
                        a: 'y',
                        q: 1234,
                    };
                    store.baz = patch(store.baz, unknownInput, needleType); // {a: 'y', z: false}
                    expect(store.baz).toEqual({a: 'y', z: false});
                } catch (e) {
                    expect(1).toEqual(0);
                    // console.log(e.message);
                    // console.log(e.ctx?.errors);
                }
            }
        }
    });
});
