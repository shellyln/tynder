// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { TypeAssertion,
         ObjectAssertion,
         TypeAssertionSetValue,
         TypeAssertionMap } from './types';
import { resolveSymbols }   from './lib/resolver';



function serializeInner(ty: TypeAssertion, nestLevel: number): TypeAssertion {
    if (0 < nestLevel && ty.typeName) {
        return ({
            kind: 'symlink',
            symlinkTargetName: ty.typeName,
            // TODO: preserve informations (doc comments, name, typeName, ...)
        });
    }

    const ret: TypeAssertion = {...ty};
    switch (ret.kind) {
    case 'never': case 'any': case 'unknown': case 'primitive-value': case 'symlink':
        break;
    case 'primitive':
        if (ret.pattern) {
            ret.pattern = (ret.pattern.source as any);
        }
        break;
    case 'repeated':
        ret.repeated = serializeInner(ret.repeated, nestLevel + 1);
        break;
    case 'spread':
        ret.spread = serializeInner(ret.spread, nestLevel + 1);
        break;
    case 'sequence':
        ret.sequence = ret.sequence.map(x => serializeInner(x, nestLevel + 1));
        break;
    case 'one-of':
        ret.oneOf = ret.oneOf.map(x => serializeInner(x, nestLevel + 1));
        break;
    case 'optional':
        ret.optional = serializeInner(ret.optional, nestLevel + 1);
        break;
    case 'enum':
        ret.values = ret.values.slice().map(x => x[2] === null || x[2] === void 0 ? x.slice(0, 2) : x) as any;
        break;
    case 'object':
        ret.members = ret.members.map(x => [x[0], serializeInner(x[1], nestLevel + 1), ...x.slice(2)]) as any;
        if (ret.baseTypes) {
            // NOTE: convert 'baseTypes' to 'symlink'.
            ret.baseTypes = ret.baseTypes.map(x => serializeInner(x, nestLevel + 1)) as ObjectAssertion[];
        }
        break;
    default:
        throw new Error(`Unknown type assertion: ${(ret as any).kind}`);
    }

    delete ret.passThruCodeBlock;
    delete ret.noOutput;
    return ret;
}


export function serialize(types: TypeAssertionMap, asTs?: boolean): string {
    const ret = {};
    for (const ty of types.entries()) {
        if (ty[1].ty.noOutput) {
            continue;
        }
        ret[ty[0]] = serializeInner(ty[1].ty, 0);
    }

    if (asTs) {
        return `\nconst schema = ${JSON.stringify(ret, null, 2)};\nexport default schema;\n`;
    } else {
        return JSON.stringify(ret, null, 2);
    }
}


function deserializeInner(ty: TypeAssertion) {
    const ret: TypeAssertion = {...ty};
    switch (ret.kind) {
    case 'never': case 'any': case 'unknown': case 'primitive-value': case 'enum': case 'symlink':
        // NOTE: 'symlink' will resolved by calling 'resolveSymbols()' in 'deserialize()'.
        break;
    case 'primitive':
        if (ret.pattern) {
            ret.pattern = new RegExp(ret.pattern as any);
        }
        break;
    case 'repeated':
        ret.repeated = deserializeInner(ret.repeated);
        break;
    case 'spread':
        ret.spread = deserializeInner(ret.spread);
        break;
    case 'sequence':
        ret.sequence = ret.sequence.map(x => deserializeInner(x));
        break;
    case 'one-of':
        ret.oneOf = ret.oneOf.map(x => deserializeInner(x));
        break;
    case 'optional':
        ret.optional = deserializeInner(ret.optional);
        break;
    case 'object':
        ret.members = ret.members.map(x => [x[0], deserializeInner(x[1]), x.slice(2)]) as any;
        // NOTE: keep 'baseTypes' as 'symlink'.
        break;
    default:
        throw new Error(`Unknown type assertion: ${(ret as any).kind}`);
    }
    return ret;
}


export function deserialize(text: string) {
    const types: TypeAssertionMap = new Map<string, TypeAssertionSetValue>();
    const parsed = JSON.parse(text);
    for (const k in parsed) {
        if (! Object.prototype.hasOwnProperty.call(parsed, k)) {
            continue;
        }
        types.set(k, {
            ty: deserializeInner(parsed[k]),
            exported: false,
            resolved: false,
        });
    }

    for (const ent of types.entries()) {
        const ty = resolveSymbols(types, ent[1].ty, {nestLevel: 0, symlinkStack: [ent[0]]});
        ent[1].ty = ty;
    }
    return types;
}
