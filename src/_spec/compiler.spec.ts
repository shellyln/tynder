
import { TypeAssertionSetValue } from '../types';
import { validate,
         getType }               from '../validator';
import { pick,
         merge }                 from '../picker';
import { parse,
         compile }               from '../compiler';
import { generateTypedefCode }   from '../codegen';



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
            /*
            const schema2 = compile(`
                type X = string | number;
                interface B {
                    @range(2, 5)
                    a: number;
                    b?: string;
                }
                interface C {
                    c?: string[10..20][];
                    d: string|number|boolean[1][2..3];
                }
                interface A extends B,C{
                    e: (string[])|(@minValue(3) number[])|(boolean[]);
                    f: X | boolean;
                    @match(/^[A-F]+$/)
                    g: string;
                }
            `);
            console.log(JSON.stringify(getType(schema2, 'A'), null, 2));
            expect(validate({
                a: 5,
                c: [['', '', '', '', '', '', '', '', '', '']],
                d: 10,
                e: [true, false],
                f: true,
                g: 'DEBCB',
                z: 'aaaaaaaaa',
            }, getType(schema2, 'A'), {checkAll: true})).toEqual({} as any);
            console.log(generateTypedefCode(schema2));
            */
        } catch (e) {
            throw e;
        }
        expect(1).toEqual(1);
    });
    it("compiler-2", function() {
        /*
        const z = compile(`
            type Foo = string;
            interface A {
                a: Foo;
            }
        `);
        console.log(JSON.stringify(getType(z, 'A'), null, 2));
        */
        expect(1).toEqual(1);
    });
});
