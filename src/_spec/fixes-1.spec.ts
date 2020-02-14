
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
        compile(`//`),
        compile(`//a`),
        compile(`//@tynder-external P`),
        compile(`#`),
        compile(`/**/`),
        compile(`/***/`),
        compile(`/**a*/`),
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
    it("fix-improve-error-messages-8", function() {
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
});
