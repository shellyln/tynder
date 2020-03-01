
import { TypeAssertion,
         ValidationContext } from '../types';
import { validate,
         getType }           from '../validator';
import { compile }           from '../compiler';
import { serialize,
         deserialize }       from '../serializer';



describe("compiler-2", function() {
    it("compiler-interface-1", function() {
        const schema = compile(`
            type X = string;
            interface Foo {
                a1: number;
                a2: bigint;
                a3: string;
                a4: boolean;
                a5: null;
                a6: undefined;
                a7: X;
                a8: integer;
            }
        `);
        {
            expect(Array.from(schema.keys())).toEqual([
                'X', 'Foo',
            ]);
        }
        {
            const rhs: TypeAssertion = {
                name: 'Foo',
                typeName: 'Foo',
                kind: 'object',
                members: [
                    ['a1', {
                        name: 'a1',
                        kind: 'primitive',
                        primitiveName: 'number',
                    }],
                    ['a2', {
                        name: 'a2',
                        kind: 'primitive',
                        primitiveName: 'bigint',
                    }],
                    ['a3', {
                        name: 'a3',
                        kind: 'primitive',
                        primitiveName: 'string',
                    }],
                    ['a4', {
                        name: 'a4',
                        kind: 'primitive',
                        primitiveName: 'boolean',
                    }],
                    ['a5', {
                        name: 'a5',
                        kind: 'primitive',
                        primitiveName: 'null',
                    }],
                    ['a6', {
                        name: 'a6',
                        kind: 'primitive',
                        primitiveName: 'undefined',
                    }],
                    ['a7', {
                        name: 'a7',
                        typeName: 'X',
                        kind: 'primitive',
                        primitiveName: 'string',
                    }],
                    ['a8', {
                        name: 'a8',
                        kind: 'primitive',
                        primitiveName: 'integer',
                    }],
                ],
            };
            // const ty = getType(schema, 'Foo');
            for (const ty of [getType(deserialize(serialize(schema)), 'Foo'), getType(schema, 'Foo')]) {
                expect(ty).toEqual(rhs);
                {
                    const v = {
                        a1: 3,
                        a2: BigInt(5),
                        a3: 'C',
                        a4: true,
                        a5: null,
                        a6: void 0,
                        a7: '',
                        a8: 5,
                    };
                    expect(validate<any>(v, ty)).toEqual({value: v});
                }
                {
                    const v = {
                        // a1
                        a2: BigInt(5),
                        a3: 'C',
                        a4: true,
                        a5: null,
                        a6: void 0,
                        a7: '',
                        a8: 5,
                    };
                    expect(validate<any>(v, ty)).toEqual(null);
                }
                {
                    const v = {
                        a1: 3,
                        // a2
                        a3: 'C',
                        a4: true,
                        a5: null,
                        a6: void 0,
                        a7: '',
                        a8: 5,
                    };
                    expect(validate<any>(v, ty)).toEqual(null);
                }
                {
                    const v = {
                        a1: 3,
                        a2: BigInt(5),
                        // a3
                        a4: true,
                        a5: null,
                        a6: void 0,
                        a7: '',
                        a8: 5,
                    };
                    expect(validate<any>(v, ty)).toEqual(null);
                }
                {
                    const v = {
                        a1: 3,
                        a2: BigInt(5),
                        a3: 'C',
                        // a4
                        a5: null,
                        a6: void 0,
                        a7: '',
                        a8: 5,
                    };
                    expect(validate<any>(v, ty)).toEqual(null);
                }
                {
                    const v = {
                        a1: 3,
                        a2: BigInt(5),
                        a3: 'C',
                        a4: true,
                        // a5
                        a6: void 0,
                        a7: '',
                        a8: 5,
                    };
                    expect(validate<any>(v, ty)).toEqual(null);
                }
                {
                    const v = {
                        a1: 3,
                        a2: BigInt(5),
                        a3: 'C',
                        a4: true,
                        a5: null,
                        // a6
                        a7: '',
                        a8: 5,
                    };
                    expect(validate<any>(v, ty)).toEqual(null);
                }
                {
                    const v = {
                        a1: 3,
                        a2: BigInt(5),
                        a3: 'C',
                        a4: true,
                        a5: null,
                        a6: void 0,
                        // a7
                        a8: 5,
                    };
                    expect(validate<any>(v, ty)).toEqual(null);
                }
                {
                    const v = {
                        a1: 3,
                        a2: BigInt(5),
                        a3: 'C',
                        a4: true,
                        a5: null,
                        a6: void 0,
                        a7: '',
                        // a8
                    };
                    expect(validate<any>(v, ty)).toEqual(null);
                }
                {
                    const v = {
                        a1: BigInt(99), // wrong
                        a2: BigInt(5),
                        a3: 'C',
                        a4: true,
                        a5: null,
                        a6: void 0,
                        a7: '',
                        a8: 5,
                    };
                    expect(validate<any>(v, ty)).toEqual(null);
                }
                {
                    const v = {
                        a1: 3,
                        a2: 99, // wrong
                        a3: 'C',
                        a4: true,
                        a5: null,
                        a6: void 0,
                        a7: '',
                        a8: 5,
                    };
                    expect(validate<any>(v, ty)).toEqual(null);
                }
                {
                    const v = {
                        a1: 3,
                        a2: BigInt(5),
                        a3: 7, // wrong
                        a4: true,
                        a5: null,
                        a6: void 0,
                        a7: '',
                        a8: 5,
                    };
                    expect(validate<any>(v, ty)).toEqual(null);
                }
                {
                    const v = {
                        a1: 3,
                        a2: BigInt(5),
                        a3: 'C',
                        a4: '', // wrong
                        a5: null,
                        a6: void 0,
                        a7: '',
                        a8: 5,
                    };
                    expect(validate<any>(v, ty)).toEqual(null);
                }
                {
                    const v = {
                        a1: 3,
                        a2: BigInt(5),
                        a3: 'C',
                        a4: true,
                        a5: void 0, // wrong
                        a6: void 0,
                        a7: '',
                        a8: 5,
                    };
                    expect(validate<any>(v, ty)).toEqual(null);
                }
                {
                    const v = {
                        a1: 3,
                        a2: BigInt(5),
                        a3: 'C',
                        a4: true,
                        a5: null,
                        a6: null, // wrong
                        a7: '',
                        a8: 5,
                    };
                    expect(validate<any>(v, ty)).toEqual(null);
                }
                {
                    const v = {
                        a1: 3,
                        a2: BigInt(5),
                        a3: 'C',
                        a4: true,
                        a5: null,
                        a6: void 0,
                        a7: 99, // wrong
                        a8: 5,
                    };
                    expect(validate<any>(v, ty)).toEqual(null);
                }
                {
                    const v = {
                        a1: 3,
                        a2: BigInt(5),
                        a3: 'C',
                        a4: true,
                        a5: null,
                        a6: void 0,
                        a7: '',
                        a8: 5.5, // wrong
                    };
                    expect(validate<any>(v, ty)).toEqual(null);
                }
            }
        }
    });
    it("compiler-interface-2 (optional types)", function() {
        const schemas = [compile(`
            type X = string;
            interface Foo {
                a1?: number;
                a2?: bigint;
                a3?: string;
                a4?: boolean;
                a5?: null;
                a6?: undefined;
                a7?: X;
                a8?: integer;
            }
        `), compile(`
            type X = string;
            type Foo = Partial<{
                a1: number,
                a2: bigint,
                a3: string,
                a4: boolean,
                a5: null,
                a6: undefined,
                a7: X,
                a8: integer,
            }>;
        `), compile(`
            type X = string;
            type Foo = Partial<{
                a1?: number,
                a2?: bigint,
                a3?: string,
                a4?: boolean,
                a5?: null,
                a6?: undefined,
                a7?: X,
                a8?: integer,
            }>;
        `), compile(`
            type X = string;
            interface Y {
                a1: number;
                a2: bigint;
                a3: string;
                a4: boolean;
                a5: null;
                a6: undefined;
                a7: X;
                a8: integer;
            }
            type Foo = Partial<Y>;
        `), compile(`
            type X = string;
            interface Y {
                a1?: number;
                a2?: bigint;
                a3?: string;
                a4?: boolean;
                a5?: null;
                a6?: undefined;
                a7?: X;
                a8?: integer;
            }
            type Foo = Partial<Y>;
        `)];
        {
            expect(Array.from(schemas[0].keys())).toEqual([
                'X', 'Foo',
            ]);
            expect(Array.from(schemas[1].keys())).toEqual([
                'X', 'Foo',
            ]);
            expect(Array.from(schemas[2].keys())).toEqual([
                'X', 'Foo',
            ]);
            expect(Array.from(schemas[3].keys())).toEqual([
                'X', 'Y', 'Foo',
            ]);
            expect(Array.from(schemas[4].keys())).toEqual([
                'X', 'Y', 'Foo',
            ]);
        }
        for (const schema of schemas) {
            {
                const rhs: TypeAssertion = {
                    name: 'Foo',
                    typeName: 'Foo',
                    kind: 'object',
                    members: [
                        ['a1', {
                            name: 'a1',
                            kind: 'optional',
                            optional: {
                                kind: 'primitive',
                                primitiveName: 'number',
                            }
                        }],
                        ['a2', {
                            name: 'a2',
                            kind: 'optional',
                            optional: {
                                kind: 'primitive',
                                primitiveName: 'bigint',
                            }
                        }],
                        ['a3', {
                            name: 'a3',
                            kind: 'optional',
                            optional: {
                                kind: 'primitive',
                                primitiveName: 'string',
                            }
                        }],
                        ['a4', {
                            name: 'a4',
                            kind: 'optional',
                            optional: {
                                kind: 'primitive',
                                primitiveName: 'boolean',
                            }
                        }],
                        ['a5', {
                            name: 'a5',
                            kind: 'optional',
                            optional: {
                                kind: 'primitive',
                                primitiveName: 'null',
                            }
                        }],
                        ['a6', {
                            name: 'a6',
                            kind: 'optional',
                            optional: {
                                kind: 'primitive',
                                primitiveName: 'undefined',
                            }
                        }],
                        ['a7', {
                            name: 'a7',
                            typeName: 'X',
                            kind: 'optional',
                            optional: {
                                name: 'X',
                                typeName: 'X',
                                kind: 'primitive',
                                primitiveName: 'string',
                            }
                        }],
                        ['a8', {
                            name: 'a8',
                            kind: 'optional',
                            optional: {
                                kind: 'primitive',
                                primitiveName: 'integer',
                            }
                        }],
                    ],
                };
                // const ty = getType(schema, 'Foo');
                for (const ty of [getType(deserialize(serialize(schema)), 'Foo'), getType(schema, 'Foo')]) {
                    expect(ty).toEqual(rhs);
                    {
                        const v = {
                            a1: 3,
                            a2: BigInt(5),
                            a3: 'C',
                            a4: true,
                            a5: null,
                            a6: void 0,
                            a7: '',
                            a8: 5,
                        };
                        expect(validate<any>(v, ty)).toEqual({value: v});
                    }
                    {
                        const v = {};
                        expect(validate<any>(v, ty)).toEqual({value: v});
                    }
                }
            }
        }
    });
    it("compiler-interface-3 (extends)", function() {
        const schemas = [compile(`
            type X = string;
            interface P {
                a1: number;
                a2: bigint;
            }
            interface Q {
                a3: string;
                a4: boolean;
            }
            interface R extends Q {
                a5: null;
                a6: undefined;
            }
            interface Foo extends P, R {
                a7: X;
                a8: integer;
            }
        `), compile(`
            interface Foo extends P, R {
                a7: X;
                a8: integer;
            }
            interface R extends Q {
                a5: null;
                a6: undefined;
            }
            interface Q {
                a3: string;
                a4: boolean;
            }
            interface P {
                a1: number;
                a2: bigint;
            }
            type X = string;
        `)];
        {
            expect(Array.from(schemas[0].keys())).toEqual([
                'X', 'P', 'Q', 'R', 'Foo',
            ]);
        }
        {
            expect(Array.from(schemas[1].keys())).toEqual([
                'Foo', 'R', 'Q', 'P', 'X',
            ]);
        }
        for (const schema of schemas) {
            {
                const tyP: TypeAssertion = {
                    name: 'P',
                    typeName: 'P',
                    kind: 'object',
                    members: [
                        ['a1', {
                            name: 'a1',
                            kind: 'primitive',
                            primitiveName: 'number',
                        }],
                        ['a2', {
                            name: 'a2',
                            kind: 'primitive',
                            primitiveName: 'bigint',
                        }],
                    ],
                };
                const tyQ: TypeAssertion = {
                    name: 'Q',
                    typeName: 'Q',
                    kind: 'object',
                    members: [
                        ['a3', {
                            name: 'a3',
                            kind: 'primitive',
                            primitiveName: 'string',
                        }],
                        ['a4', {
                            name: 'a4',
                            kind: 'primitive',
                            primitiveName: 'boolean',
                        }],
                    ],
                };
                const tyR: TypeAssertion = {
                    name: 'R',
                    typeName: 'R',
                    kind: 'object',
                    baseTypes: [tyQ],
                    members: [
                        ...([
                            ['a5', {
                                name: 'a5',
                                kind: 'primitive',
                                primitiveName: 'null',
                            }],
                            ['a6', {
                                name: 'a6',
                                kind: 'primitive',
                                primitiveName: 'undefined',
                            }],
                        ] as any[]),
                        ...tyQ.members.map(x => [x[0], x[1], true]),
                    ],
                };
                const rhs: TypeAssertion = {
                    name: 'Foo',
                    typeName: 'Foo',
                    kind: 'object',
                    baseTypes: [tyP, tyR],
                    members: [
                        ...([
                            ['a7', {
                                name: 'a7',
                                typeName: 'X',
                                kind: 'primitive',
                                primitiveName: 'string',
                            }],
                            ['a8', {
                                name: 'a8',
                                kind: 'primitive',
                                primitiveName: 'integer',
                            }],
                        ] as any[]),
                        ...tyP.members.map(x => [x[0], x[1], true]),
                        ...tyR.members.map(x => [x[0], x[1], true]),
                    ],
                };
                // const ty = getType(schema, 'Foo');
                for (const ty of [getType(deserialize(serialize(schema)), 'Foo'), getType(schema, 'Foo')]) {
                    expect(ty).toEqual(rhs);
                    {
                        const v = {
                            a1: 3,
                            a2: BigInt(5),
                            a3: 'C',
                            a4: true,
                            a5: null,
                            a6: void 0,
                            a7: '',
                            a8: 5,
                        };
                        expect(validate<any>(v, ty)).toEqual({value: v});
                    }
                }
            }
        }
    });
    it("compiler-interface-4 (recursive members (repeated))", function() {
        const schema = compile(`
            interface EntryBase {
                name: string;
            }
            interface File extends EntryBase {
                type: 'file';
            }
            interface Folder extends EntryBase {
                type: 'folder';
                entries: Entry[];
            }
            type Entry = File | Folder;
        `);
        {
            expect(Array.from(schema.keys())).toEqual([
                'EntryBase', 'File', 'Folder', 'Entry',
            ]);
        }
        {
            const tyBase: TypeAssertion = {
                name: 'EntryBase',
                typeName: 'EntryBase',
                kind: 'object',
                members: [
                    ['name', {
                        name: 'name',
                        kind: 'primitive',
                        primitiveName: 'string',
                    }],
                ],
            };
            const tyEntry: TypeAssertion = {
                name: 'Entry',
                typeName: 'Entry',
                kind: 'one-of',
                oneOf: [{
                    name: 'File',
                    typeName: 'File',
                    kind: 'object',
                    baseTypes: [tyBase],
                    members: [
                        ['type', {
                            name: 'type',
                            kind: 'primitive-value',
                            value: 'file',
                        }],
                        ['name', {
                            name: 'name',
                            kind: 'primitive',
                            primitiveName: 'string',
                        }, true],
                    ],
                }, { // replace it by 'rhs' later
                    name: 'Folder',
                    typeName: 'Folder',
                    kind: 'symlink',
                    symlinkTargetName: 'Folder',
                }],
            };
            const rhs: TypeAssertion = {
                name: 'Folder',
                typeName: 'Folder',
                kind: 'object',
                baseTypes: [tyBase],
                members: [
                    ['type', {
                        name: 'type',
                        kind: 'primitive-value',
                        value: 'folder',
                    }],
                    ['entries', {
                        name: 'entries',
                        kind: 'repeated',
                        min: null,
                        max: null,
                        repeated: {
                            name: 'Entry',
                            typeName: 'Entry',
                            kind: 'symlink',
                            symlinkTargetName: 'Entry',
                        }
                    }],
                    ['name', {
                        name: 'name',
                        kind: 'primitive',
                        primitiveName: 'string',
                    }, true],
                ],
            };
            tyEntry.oneOf[1] = rhs;
            let cnt = 0;
            for (const ty of [getType(deserialize(serialize(schema)), 'Entry'), getType(schema, 'Entry')]) {
                if (cnt !== 0) {
                    expect(ty).toEqual(tyEntry);
                }
                cnt++;
            }
            // const ty = getType(schema, 'Folder');
            cnt = 0;
            for (const ty of [getType(deserialize(serialize(schema)), 'Folder'), getType(schema, 'Folder')]) {
                if (cnt !== 0) {
                    expect(ty).toEqual(rhs);
                }
                {
                    const v = {
                        type: 'folder',
                        name: '/',
                        entries: [{
                            type: 'file',
                            name: 'a',
                        }, {
                            type: 'folder',
                            name: 'b',
                            entries: [{
                                type: 'file',
                                name: 'c',
                            }],
                        }],
                    };
                    try {
                        validate<any>(v, ty);
                        expect(0).toEqual(1);
                    } catch (e) {
                        if (cnt === 0) {
                            expect(e.message).toEqual('Unresolved symbol \'Folder\' is appeared.');
                        } else {
                            expect(e.message).toEqual('Unresolved symbol \'Entry\' is appeared.');
                        }
                    }
                    const ctx1: Partial<ValidationContext> = {};
                    expect(() => validate<any>(v, ty, ctx1)).toThrow(); // unresolved symlink 'Entry'
                    expect(ctx1.errors).toEqual([...(cnt === 0 ? [{
                        code: 'ValueUnmatched',
                        message: '"File" of "Entry" value should be "file".',
                        dataPath: 'Folder:entries.(1:repeated).Entry:File.type',
                        value: 'folder',
                        constraints: {},
                    }] : []), {
                        code: 'InvalidDefinition',
                        message: cnt === 0 ?
                            '"Folder" of "Entry" type definition is invalid.' :
                            '"entries" of "Folder" type definition is invalid.',
                        dataPath: cnt === 0 ?
                            'Folder:entries.(1:repeated).Entry:Folder' :
                            'Folder:entries.(0:repeated).Entry',
                        constraints: {}
                    }]);
                    expect(validate<any>(v, ty, {schema})).toEqual({value: v});
                }
                cnt++;
            }
        }
    });
    it("compiler-interface-5 (recursive members (spread))", function() {
        const schema = compile(`
            interface EntryBase {
                name: string;
            }
            interface File extends EntryBase {
                type: 'file';
            }
            interface Folder extends EntryBase {
                type: 'folder';
                entries: [...<Entry>];
            }
            type Entry = File | Folder;
        `);
        {
            expect(Array.from(schema.keys())).toEqual([
                'EntryBase', 'File', 'Folder', 'Entry',
            ]);
        }
        {
            const tyBase: TypeAssertion = {
                name: 'EntryBase',
                typeName: 'EntryBase',
                kind: 'object',
                members: [
                    ['name', {
                        name: 'name',
                        kind: 'primitive',
                        primitiveName: 'string',
                    }],
                ],
            };
            const tyEntry: TypeAssertion = {
                name: 'Entry',
                typeName: 'Entry',
                kind: 'one-of',
                oneOf: [{
                    name: 'File',
                    typeName: 'File',
                    kind: 'object',
                    baseTypes: [tyBase],
                    members: [
                        ['type', {
                            name: 'type',
                            kind: 'primitive-value',
                            value: 'file',
                        }],
                        ['name', {
                            name: 'name',
                            kind: 'primitive',
                            primitiveName: 'string',
                        }, true],
                    ],
                }, { // replace it by 'rhs' later
                    name: 'Folder',
                    typeName: 'Folder',
                    kind: 'symlink',
                    symlinkTargetName: 'Folder',
                }],
            };
            const rhs: TypeAssertion = {
                name: 'Folder',
                typeName: 'Folder',
                kind: 'object',
                baseTypes: [tyBase],
                members: [
                    ['type', {
                        name: 'type',
                        kind: 'primitive-value',
                        value: 'folder',
                    }],
                    ['entries', {
                        name: 'entries',
                        kind: 'sequence',
                        sequence: [{
                            kind: 'spread',
                            min: null,
                            max: null,
                            spread: {
                                name: 'Entry',
                                typeName: 'Entry',
                                kind: 'symlink',
                                symlinkTargetName: 'Entry',
                            },
                        }]
                    }],
                    ['name', {
                        name: 'name',
                        kind: 'primitive',
                        primitiveName: 'string',
                    }, true],
                ],
            };
            tyEntry.oneOf[1] = rhs;
            let cnt = 0;
            for (const ty of [getType(deserialize(serialize(schema)), 'Entry'), getType(schema, 'Entry')]) {
                if (cnt !== 0) {
                    expect(ty).toEqual(tyEntry);
                }
                cnt++;
            }
            // const ty = getType(schema, 'Folder');
            cnt = 0;
            for (const ty of [getType(deserialize(serialize(schema)), 'Folder'), getType(schema, 'Folder')]) {
                if (cnt !== 0) {
                    expect(ty).toEqual(rhs);
                }
                {
                    const v = {
                        type: 'folder',
                        name: '/',
                        entries: [{
                            type: 'file',
                            name: 'a',
                        }, {
                            type: 'folder',
                            name: 'b',
                            entries: [{
                                type: 'file',
                                name: 'c',
                            }],
                        }],
                    };
                    try {
                        validate<any>(v, ty);
                        expect(0).toEqual(1);
                    } catch (e) {
                        if (cnt === 0) {
                            expect(e.message).toEqual('Unresolved symbol \'Folder\' is appeared.');
                        } else {
                            expect(e.message).toEqual('Unresolved symbol \'Entry\' is appeared.');
                        }
                    }
                    const ctx1: Partial<ValidationContext> = {};
                    expect(() => validate<any>(v, ty, ctx1)).toThrow(); // unresolved symlink 'Entry'
                    expect(ctx1.errors).toEqual([...(cnt === 0 ? [{
                        code: 'ValueUnmatched',
                        message: '"File" of "Entry" value should be "file".',
                        dataPath: 'Folder:entries.(1:sequence).Entry:File.type',
                        value: 'folder',
                        constraints: {},
                    }] : []), {
                        code: 'InvalidDefinition',
                        message:  cnt === 0 ?
                            '"Folder" of "Entry" type definition is invalid.' :
                            '"entries" of "Folder" type definition is invalid.',
                        dataPath:  cnt === 0 ?
                            'Folder:entries.(1:sequence).Entry:Folder' :
                            'Folder:entries.(0:sequence).Entry',
                        constraints: {}
                    }]);
                    expect(validate<any>(v, ty, {schema})).toEqual({value: v});
                }
                cnt++;
            }
        }
    });
});
