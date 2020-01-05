
import { TypeAssertionSetValue }  from '../types';
import { validate,
         getType }                from '../validator';
import { pick,
         merge }                  from '../picker';
import { parse,
         compile }                from '../compiler';
import { generateTypeScriptCode } from '../codegen';



describe("compiler", function() {
    it("compiler-1", function() {
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
                }
                interface A extends B,C, D,DD { // BUG: if extends D, codegen output 'extends D, D'
                    e: (string[])|(@minValue(3) number[])|(boolean[]);
                    f: X | boolean;
                    @match(/^[A-F]+$/)
                    g: string;
                    h?: C;
                    i: [string, number?, string?];
                    j: [...<number, 1..2>, string];
                    k: Y;
                }
                interface AA extends A {}
                type Y = boolean;
                interface D {
                    d90: string;
                }
                interface DD {
                    d91: string;
                }
            `);
            // console.log(JSON.stringify(getType(schema2, 'X'), null, 2));
            // console.log(JSON.stringify(getType(schema2, 'C'), null, 2));
            /*
            */
            console.log(JSON.stringify(getType(schema2, 'A'), null, 2));
            const ctx = {checkAll: true};
            expect(validate({
                a: 5,
                c: [['', '', '', '', '', '', '', '', '', '']],
                d: 10,
                // d2: true,  // TODO: BUG: error reporter reports no error message (optional > oneOf)
                           // TODO: BUG: error reporter doesn't get the name 'd2'  <- due to OptionalAssertion
                d3: 11,
                // d4: 11,    // TODO: BUG: error reporter doesn't get the name 'd4' (optional > enum)
                           //                                           <- due to OptionalAssertion
                d90: '',
                d91: '',
                e: [true, false],
                f: true,
                g: 'DEBCB',
                i: ['q', 12, 13], // TODO: BUG: spread/optional quantity
                j: [1, 2, 'aaa'],
                k: false,
                z: 'aaaaaaaaa',
            }, getType(schema2, 'A'), ctx)).toEqual({} as any);
            console.log(generateTypeScriptCode(schema2));
            console.log(JSON.stringify(ctx));
        } catch (e) {
            throw e;
        }
        expect(1).toEqual(1);
    });
    it("compiler-2", function() {
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
        const ctx = {checkAll: true};
        console.log(JSON.stringify(validate({b: 6, c: '1234'}, getType(z, 'A'), ctx)));
        console.log(JSON.stringify(ctx));
        expect(1).toEqual(1);
    });
});
