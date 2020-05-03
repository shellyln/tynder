
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



describe("fix-1", function() {
    it("fix-interface-member-delimiter-1", function() {
        const schemas = [compile(`
            interface O {
                a: string;
                b: number;
            }
            type P =  {
                a: string;
                b: number;
            };
        `), compile(`
            interface O {
                a: string;
                b: number
            }
            type P = {
                a: string;
                b: number
            };
        `), compile(`
            interface O {
                a: string,
                b: number,
            }
            type P = {
                a: string,
                b: number,
            };
        `), compile(`
            interface O {
                a: string,
                b: number
            }
            type P = {
                a: string,
                b: number
            };
        `)]; // <- no errors
        {
            expect(Array.from(schemas[0].keys())).toEqual([
                'O', 'P',
            ]);
        }
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
                expect(validate<any>({a: '', b: 0}, ty)).toEqual({value: {a: '', b: 0}});
            }
            {
                const rhs: TypeAssertion = {
                    name: 'P',
                    typeName: 'P',
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
                const ty = getType(schema, 'P');
                expect(ty).toEqual(rhs);
                expect(validate<any>({a: '', b: 0}, ty)).toEqual({value: {a: '', b: 0}});
            }
        }
    });
    it("fix-improve-error-messages-1", function() {
        const schemas = [compile(`
            @msgId()
            interface O {
            }
            @msgId
            type P = {
            };
            enum R {
            }
            external S;
        `), compile(`
            @msgId()
            export interface O {
            }
            @msgId
            export type P = {
            };
            export enum R {
            }
            external S;
        `), compile(`
            interface P {
                [p: string]: string;
            }
        `), compile(`
            interface P {
                ['p': string]: string;
            }
        `), compile(`
            interface P {
                a: Partial<{}>;
            }
        `), compile(`
            interface P {
                a: Pick<{},'a'>;
            }
        `), compile(`
            interface P {
                a: Pick<{},'a'|'b'>;
            }
        `), compile(`
            interface P {
                a: Omit<{},'a'>;
            }
        `), compile(`
            interface P {
                a: Omit<{},'a'|'b'>;
            }
        `),
        compile(``),
        compile(`//`),
        compile(`//a`),
        compile(`//@tynder-external P`),
        compile(`#`),
        compile(`/**/`),
        compile(`/***/`),
        compile(`/**a*/`),
        compile(`import ;`),
        ]; // <- no errors
        for (const schema of schemas) {
            {
                expect(1).toEqual(1);
            }
        }
    });
    it("fix-improve-error-messages-2", function() {
        expect(() => compile(`
            type P = {
            }
        `)).toThrowMatching(err =>
            err.message.includes(
                'typeDef: Unexpected token has appeared. Expect ";".\n'));
        expect(() => compile(`
            export type P = {
            }
        `)).toThrowMatching(err =>
            err.message.includes(
                'typeDef: Unexpected token has appeared. Expect ";".\n'));
    });
    it("fix-improve-error-messages-3a", function() {
        expect(() => compile(`
            type P = {
        `)).toThrowMatching(err =>
            err.message.includes(
                'typeDef: Unexpected token has appeared.\n'));
        expect(() => compile(`
            export type P = {
        `)).toThrowMatching(err =>
            err.message.includes(
                'typeDef: Unexpected token has appeared.\n'));
    });
    it("fix-improve-error-messages-3b", function() {
        expect(() => compile(`
            type P = }
        `)).toThrowMatching(err =>
            err.message.includes(
                'typeDef: Unexpected token has appeared.\n'));
        expect(() => compile(`
            export type P = }
        `)).toThrowMatching(err =>
            err.message.includes(
                'typeDef: Unexpected token has appeared.\n'));
    });
    it("fix-improve-error-messages-3c", function() {
        expect(() => compile(`
            type P = {
                a: string;
        `)).toThrowMatching(err =>
            err.message.includes(
                'interfaceDefInner: Unexpected token has appeared. Expect "}".\n'));
        expect(() => compile(`
            export type P = {
                a: string;
        `)).toThrowMatching(err =>
            err.message.includes(
                'interfaceDefInner: Unexpected token has appeared. Expect "}".\n'));
    });
    it("fix-improve-error-messages-4", function() {
        expect(() => compile(`
            type P {
            }
        `)).toThrowMatching(err =>
            err.message.includes(
                'typeDef: Unexpected token has appeared. Expect "=".\n'));
        expect(() => compile(`
            export type P {
            }
        `)).toThrowMatching(err =>
            err.message.includes(
                'typeDef: Unexpected token has appeared. Expect "=".\n'));
    });
    it("fix-improve-error-messages-5", function() {
        expect(() => compile(`
            type = {
            }
        `)).toThrowMatching(err =>
            err.message.includes(
                'typeDef: Unexpected token has appeared. Expect symbol name.\n'));
        expect(() => compile(`
            export type = {
            }
        `)).toThrowMatching(err =>
            err.message.includes(
                'typeDef: Unexpected token has appeared. Expect symbol name.\n'));
    });
    it("fix-improve-error-messages-6", function() {
        expect(() => compile(`
            type P = {
                a: string
                b: number;
            };
        `)).toThrowMatching(err =>
            err.message.includes(
                'interfaceDefInner: Unexpected token has appeared. Expect "}".\n'));
        expect(() => compile(`
            export type P = {
                a: string
                b: number;
            };
        `)).toThrowMatching(err =>
            err.message.includes(
                'interfaceDefInner: Unexpected token has appeared. Expect "}".\n'));
    });
    it("fix-improve-error-messages-7", function() {
        expect(() => compile(`
            type P = {
                a string;
                b: number;
            };
        `)).toThrowMatching(err =>
            err.message.includes(
                '":" is needed.\n'));
        expect(() => compile(`
            export type P = {
                a string;
                b: number;
            };
        `)).toThrowMatching(err =>
            err.message.includes(
                '":" is needed.\n'));
    });
    it("fix-improve-error-messages-8a", function() {
        expect(() => compile(`
            interface P = {
            }
        `)).toThrowMatching(err =>
            err.message.includes(
                'interfaceDef: Unexpected token has appeared.\n'));
        expect(() => compile(`
            export interface P = {
            }
        `)).toThrowMatching(err =>
            err.message.includes(
                'interfaceDef: Unexpected token has appeared.\n'));
    });
    it("fix-improve-error-messages-8b", function() {
        expect(() => compile(`
            interface {
            }
        `)).toThrowMatching(err =>
            err.message.includes(
                'interfaceDef: Unexpected token has appeared. Expect symbol name.\n'));
        expect(() => compile(`
            export interface {
            }
        `)).toThrowMatching(err =>
            err.message.includes(
                'interfaceDef: Unexpected token has appeared. Expect symbol name.\n'));
    });
    it("fix-improve-error-messages-9", function() {
        expect(() => compile(`
            interface P extends {
            }
        `)).toThrowMatching(err =>
            err.message.includes(
                'interfaceExtendsClause: Unexpected token has appeared. Expect symbol name.\n'));
        expect(() => compile(`
            export interface P extends {
            }
        `)).toThrowMatching(err =>
            err.message.includes(
                'interfaceExtendsClause: Unexpected token has appeared. Expect symbol name.\n'));
    });
    it("fix-improve-error-messages-10", function() {
        expect(() => compile(`
            interface P extends Q {
            }
        `)).toThrowMatching(err =>
            err.message.includes(
                'Undefined symbol \'Q\' is referred.'));
        expect(() => compile(`
            export interface P extends Q {
            }
        `)).toThrowMatching(err =>
            err.message.includes(
                'Undefined symbol \'Q\' is referred.'));
    });
    it("fix-improve-error-messages-11a", function() {
        expect(() => compile(`
            interface P {
        `)).toThrowMatching(err =>
            err.message.includes(
                'interfaceDef: Unexpected token has appeared.\n'));
        expect(() => compile(`
            export interface P {
        `)).toThrowMatching(err =>
            err.message.includes(
                'interfaceDef: Unexpected token has appeared.\n'));
    });
    it("fix-improve-error-messages-11b", function() {
        expect(() => compile(`
            interface P }
        `)).toThrowMatching(err =>
            err.message.includes(
                'interfaceDef: Unexpected token has appeared.\n'));
        expect(() => compile(`
            export interface P }
        `)).toThrowMatching(err =>
            err.message.includes(
                'interfaceDef: Unexpected token has appeared.\n'));
    });
    it("fix-improve-error-messages-11c", function() {
        expect(() => compile(`
            interface P {
                a: string;
        `)).toThrowMatching(err =>
            err.message.includes(
                'interfaceDefInner: Unexpected token has appeared. Expect "}".\n'));
        expect(() => compile(`
            export interface P {
                a: string;
        `)).toThrowMatching(err =>
            err.message.includes(
                'interfaceDefInner: Unexpected token has appeared. Expect "}".\n'));
    });
    it("fix-improve-error-messages-12", function() {
        expect(() => compile(`
            interface P {
            };
        `)).toThrowMatching(err =>
            err.message.includes(
                'program: Unexpected token has appeared.\n'));
        expect(() => compile(`
            export interface P {
            };
        `)).toThrowMatching(err =>
            err.message.includes(
                'program: Unexpected token has appeared.\n'));
    });
    it("fix-improve-error-messages-13", function() {
        expect(() => compile(`
            interface P {
                a: string
                b: number;
            };
        `)).toThrowMatching(err =>
            err.message.includes(
                'interfaceDefInner: Unexpected token has appeared. Expect "}".\n'));
        expect(() => compile(`
            export interface P {
                a: string
                b: number;
            };
        `)).toThrowMatching(err =>
            err.message.includes(
                'interfaceDefInner: Unexpected token has appeared. Expect "}".\n'));
    });
    it("fix-improve-error-messages-14", function() {
        expect(() => compile(`
            interface P {
                a string;
                b: number;
            };
        `)).toThrowMatching(err =>
            err.message.includes(
                '":" is needed.'));
        expect(() => compile(`
            export interface P {
                a string;
                b: number;
            };
        `)).toThrowMatching(err =>
            err.message.includes(
                '":" is needed.'));
    });
    it("fix-improve-error-messages-15a", function() {
        expect(() => compile(`
            enum P = {
            }
        `)).toThrowMatching(err =>
            err.message.includes(
                'enumDef: Unexpected token has appeared.\n'));
        expect(() => compile(`
            export enum P = {
            }
        `)).toThrowMatching(err =>
            err.message.includes(
                'enumDef: Unexpected token has appeared.\n'));
    });
    it("fix-improve-error-messages-15b", function() {
        expect(() => compile(`
            enum {
            }
        `)).toThrowMatching(err =>
            err.message.includes(
                'enumDef: Unexpected token has appeared. Expect symbol name.\n'));
        expect(() => compile(`
            export enum {
            }
        `)).toThrowMatching(err =>
            err.message.includes(
                'enumDef: Unexpected token has appeared. Expect symbol name.\n'));
    });
    it("fix-improve-error-messages-16a", function() {
        expect(() => compile(`
            enum P {
        `)).toThrowMatching(err =>
            err.message.includes(
                'enumDef: Unexpected token has appeared.\n'));
        expect(() => compile(`
            export enum P {
        `)).toThrowMatching(err =>
            err.message.includes(
                'enumDef: Unexpected token has appeared.\n'));
    });
    it("fix-improve-error-messages-16b", function() {
        expect(() => compile(`
            enum P }
        `)).toThrowMatching(err =>
            err.message.includes(
                'enumDef: Unexpected token has appeared.\n'));
        expect(() => compile(`
            export enum P }
        `)).toThrowMatching(err =>
            err.message.includes(
                'enumDef: Unexpected token has appeared.\n'));
    });
    it("fix-improve-error-messages-17", function() {
        expect(() => compile(`
            enum P {
                A
                B
            }
        `)).toThrowMatching(err =>
            err.message.includes(
                'enumDef: Unexpected token has appeared. Expect "}".\n'));
        expect(() => compile(`
            export enum P {
                A
                B
            }
        `)).toThrowMatching(err =>
            err.message.includes(
                'enumDef: Unexpected token has appeared. Expect "}".\n'));
    });
    it("fix-improve-error-messages-18a", function() {
        expect(() => compile(`
            enum P {
                A =
            }
        `)).toThrowMatching(err =>
            err.message.includes(
                'enumKeyValue: Unexpected token has appeared.\n'));
        expect(() => compile(`
            export enum P {
                A =
            }
        `)).toThrowMatching(err =>
            err.message.includes(
                'enumKeyValue: Unexpected token has appeared.\n'));
    });
    it("fix-improve-error-messages-18b", function() {
        expect(() => compile(`
            enum P {
                A = B
            }
        `)).toThrowMatching(err =>
            err.message.includes(
                'enumKeyValue: Unexpected token has appeared.\n'));
        expect(() => compile(`
            export enum P {
                A = B
            }
        `)).toThrowMatching(err =>
            err.message.includes(
                'enumKeyValue: Unexpected token has appeared.\n'));
    });
    it("fix-improve-error-messages-19", function() {
        expect(() => compile(`
            external
        `)).toThrowMatching(err =>
            err.message.includes(
                'program: Unexpected token has appeared.\n'));
    });
    it("fix-improve-error-messages-20", function() {
        expect(() => compile(`
            external A
        `)).toThrowMatching(err =>
            err.message.includes(
                'externalTypeDef: Unexpected token has appeared. Expect ";".\n'));
    });
    it("fix-improve-error-messages-21", function() {
        expect(() => compile(`
            external A = B
        `)).toThrowMatching(err =>
            err.message.includes(
                'externalTypeDef: Unexpected token has appeared. Expect ";".\n'));
    });
    it("fix-improve-error-messages-23", function() {
        expect(() => compile(`
            external A B
        `)).toThrowMatching(err =>
            err.message.includes(
                'externalTypeDef: Unexpected token has appeared. Expect ";".\n'));
    });
    it("fix-improve-error-messages-24", function() {
        expect(() => compile(`
            import
        `)).toThrowMatching(err =>
            err.message.includes(
                'importStatement: Unexpected token has appeared. Expect ";".\n'));
    });
    it("fix-improve-error-messages-24b", function() {
        expect(() => compile(`
            declare var
        `)).toThrowMatching(err =>
            err.message.includes(
                'declareVarStatement: Unexpected token has appeared. Expect ";".\n'));
    });
    it("fix-improve-error-messages-24c", function() {
        expect(() => compile(`
            declare let
        `)).toThrowMatching(err =>
            err.message.includes(
                'declareVarStatement: Unexpected token has appeared. Expect ";".\n'));
    });
    it("fix-improve-error-messages-24d", function() {
        expect(() => compile(`
            declare const
        `)).toThrowMatching(err =>
            err.message.includes(
                'declareVarStatement: Unexpected token has appeared. Expect ";".\n'));
    });
    it("fix-improve-error-messages-24e", function() {
        expect(() => compile(`
            declare
        `)).toThrowMatching(err =>
            err.message.includes(
                'declareVarStatement: Unexpected token has appeared. Expect "var|let|const".\n'));
    });
    it("fix-improve-error-messages-25", function() {
        expect(() => compile(`
            //@tynder-
        `)).toThrowMatching(err =>
            err.message.includes(
                'Unknown directive is appeared: @tynder-'));
    });
    it("fix-improve-error-messages-26", function() {
        expect(() => compile(`
            interface P {
                a: string[a];
            }
        `)).toThrowMatching(err =>
            err.message.includes(
                'interfaceDefInner: Unexpected token has appeared. Expect "}".\n'));
    });
    it("fix-improve-error-messages-27a", function() {
        expect(() => compile(`
            interface P {
                a: Array<string,>;
            }
        `)).toThrowMatching(err =>
            err.message.includes(
                'complexArrayType: Unexpected token has appeared. Expect array size.\n'));
    });
    it("fix-improve-error-messages-27b", function() {
        expect(() => compile(`
            interface P {
                a: Array<string,qqq>;
            }
        `)).toThrowMatching(err =>
            err.message.includes(
                'complexArrayType: Unexpected token has appeared. Expect array size.\n'));
    });
    it("fix-improve-error-messages-27c", function() {
        expect(() => compile(`
            interface P {
                a: Array<string,10;
            }
        `)).toThrowMatching(err =>
            err.message.includes(
                '\'>\' is expected in Array type.\n'));
    });
    it("fix-improve-error-messages-28", function() {
        expect(() => compile(`
            interface P {
                a: Pick<{}>;
            }
        `)).toThrowMatching(err =>
            err.message.includes(
                'interface member type is needed.\n'));
        expect(() => compile(`
            interface P {
                a: Omit<{}>;
            }
        `)).toThrowMatching(err =>
            err.message.includes(
                'interface member type is needed.\n'));
    });
    it("fix-improve-error-messages-29", function() {
        expect(() => compile(`
            interface P {
                a: Pick<{},'a'|>;
            }
        `)).toThrowMatching(err =>
            err.message.includes(
                '\'>\' is expected in Pick|Omit type.\n'));
        expect(() => compile(`
            interface P {
                a: Omit<{},'a'|>;
            }
        `)).toThrowMatching(err =>
            err.message.includes(
                '\'>\' is expected in Pick|Omit type.\n'));
    });
    it("fix-improve-error-messages-30", function() {
        expect(() => compile(`
            interface P {
                a: Pick<{},10>;
            }
        `)).toThrowMatching(err =>
            err.message.includes(
                'interface member type is needed.\n'));
        expect(() => compile(`
            interface P {
                a: Omit<{},10>;
            }
        `)).toThrowMatching(err =>
            err.message.includes(
                'interface member type is needed.\n'));
    });
    it("fix-improve-error-messages-31", function() {
        expect(() => compile(`
            interface P {
                a: Pick<{},a>;
            }
        `)).toThrowMatching(err =>
            err.message.includes(
                'interface member type is needed.\n'));
        expect(() => compile(`
            interface P {
                a: Omit<{},a>;
            }
        `)).toThrowMatching(err =>
            err.message.includes(
                'interface member type is needed.\n'));
    });
    it("fix-improve-error-messages-32", function() {
        expect(() => compile(`
            interface P {
                a: Partial<{},>;
            }
        `)).toThrowMatching(err =>
            err.message.includes(
                '\'>\' is expected in Partial type.\n'));
    });
    it("fix-improve-error-messages-33", function() {
        expect(() => compile(`
            interface P {
                a: Partial<{},'a'>;
            }
        `)).toThrowMatching(err =>
            err.message.includes(
                '\'>\' is expected in Partial type.\n'));
    });
    it("fix-improve-error-messages-34", function() {
        expect(() => compile(`
            interface P {
                a: Partial<{};
            }
        `)).toThrowMatching(err =>
            err.message.includes(
                '\'>\' is expected in Partial type.\n'));
    });
    it("fix-improve-error-messages-35a", function() {
        expect(() => compile(`
            interface P {
                []: string;
            }
        `)).toThrowMatching(err =>
            err.message.includes(
                'interfaceDef: Unexpected token has appeared.\n'));
    });
    it("fix-improve-error-messages-35b", function() {
        expect(() => compile(`
            interface P {
                [propNames: 111]: string;
            }
        `)).toThrowMatching(err =>
            err.message.includes(
                'interfaceDef: Unexpected token has appeared.\n'));
    });
    it("fix-improve-error-messages-35c", function() {
        expect(() => compile(`
            interface P {
                ['p': string|]: string;
            }
        `)).toThrowMatching(err =>
            err.message.includes(
                'interfaceDef: Unexpected token has appeared.\n'));
    });
    it("fix-improve-error-messages-35d", function() {
        expect(() => compile(`
            interface P {
                [p]: string;
            }
        `)).toThrowMatching(err =>
            err.message.includes(
                '":" is needed.\n'));
    });
    it("fix-improve-error-messages-35e", function() {
        expect(() => compile(`
            interface P {
                [propNames: string : string;
            }
        `)).toThrowMatching(err =>
            err.message.includes(
                'interfaceKey: Unexpected token has appeared. Expect "]".\n'));
    });
    it("fix-improve-validation-message-1", function() {
        const schema = compile(`
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
                type: 'file';
            }

            /** Folder entry */
            interface Folder extends EntryBase {
                /** Entry type */
                type: 'folder';
                /** Child entries */
                entries: Entry[];
            }

            /** Entry (union type) */
            type Entry = File | Folder;
            type Foo = string[]|number;
        `);
        {
            const ctx: Partial<ValidationContext> = {checkAll: true};
            const z = validate<any>({type: 'file', name: '', acl: [{}]}, getType(schema, 'File'), ctx);
            expect(ctx.errors).toEqual([{
                code: 'Required',
                message: '"target" of "ACL" is required.',
                dataPath: 'File:acl.(0:repeated).ACL:target',
                constraints: {},
            }, {
                code: 'Required',
                message: '"value" of "ACL" is required.',
                dataPath: 'File:acl.(0:repeated).ACL:value',
                constraints: {},
            }] as any);
        }
        {
            const ctx: Partial<ValidationContext> = {checkAll: true};
            const z = validate<any>({type: 'file', name: '', acl: [1]}, getType(schema, 'File'), ctx);
            expect(ctx.errors).toEqual([{
                code: 'TypeUnmatched',
                message: '"acl" of "File" should be type "ACL".',
                dataPath: 'File:acl.(0:repeated).ACL',
                constraints: {},
                value: 1,
            }] as any);
        }
    });
    it("dotted-types-1", function() {
        const schema = compile(`
            interface Z1 {
                foo: ACL.target;
                bar: ACL.value;
                //@maxLength(10) // TODO: BUG: can't set to kind === symlink
                baz: ACL.target;
            }
            interface ACL {
                target: string;
                @minLength(0)
                value: string;
            }
            interface Z2 {
                foo: ACL.target;
                bar: ACL.value;
                @maxLength(10)
                baz: ACL.target;
            }
        `);
        {
            const rhs: TypeAssertion = {
                name: 'Z1',
                typeName: 'Z1',
                kind: 'object',
                members: [
                    ['foo', {kind: 'primitive', primitiveName: 'string', name: 'foo', typeName: 'ACL.target'}],
                    ['bar', {kind: 'primitive', primitiveName: 'string', name: 'bar', typeName: 'ACL.value', minLength: 0}],
                    ['baz', {kind: 'primitive', primitiveName: 'string', name: 'baz', typeName: 'ACL.target'}],
                ],
            };
            const ty = getType(schema, 'Z1');
            expect(ty).toEqual(rhs);
        }
        {
            const rhs: TypeAssertion = {
                name: 'Z2',
                typeName: 'Z2',
                kind: 'object',
                members: [
                    ['foo', {kind: 'primitive', primitiveName: 'string', name: 'foo', typeName: 'ACL.target'}],
                    ['bar', {kind: 'primitive', primitiveName: 'string', name: 'bar', typeName: 'ACL.value', minLength: 0}],
                    ['baz', {kind: 'primitive', primitiveName: 'string', name: 'baz', typeName: 'ACL.target', maxLength: 10}],
                ],
            };
            const ty = getType(schema, 'Z2');
            expect(ty).toEqual(rhs);
        }
    });
});
