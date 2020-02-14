
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
        `),
        compile(``),
        compile(`//`),
        compile(`//a`),
        compile(`//@tynder-external P`),
        compile(`#`),
        compile(`/**/`),
        compile(`/***/`),
        compile(`/**a*/`),
        compile(`import;`),
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
});
