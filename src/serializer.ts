// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { TypeAssertion,
         ObjectAssertion,
         TypeAssertionSetValue,
         TypeAssertionMap } from './types';



function serializeInner(ty: TypeAssertion) {
    // TODO: replace named type with reference
    const ret: TypeAssertion = {...ty};
    switch (ret.kind) {
    case 'never':
        break;
    case 'any':
        break;
    case 'unknown':
        break;
    case 'primitive':
        if (ret.pattern) {
            ret.pattern = (ret.pattern.source as any);
        }
        break;
    case 'primitive-value':
        break;
    case 'repeated':
        ret.repeated = serializeInner(ret.repeated);
        break;
    case 'spread':
        ret.spread = serializeInner(ret.spread);
        break;
    case 'sequence':
        ret.sequence = ret.sequence.map(x => serializeInner(x));
        break;
    case 'one-of':
        ret.oneOf = ret.oneOf.map(x => serializeInner(x));
        break;
    case 'optional':
        ret.optional = serializeInner(ret.optional);
        break;
    case 'enum':
        ret.values = ret.values.slice().map(x => x[2] === null || x[2] === void 0 ? x.slice(0, 2) : x) as any;
        break;
    case 'object':
        ret.members = ret.members.map(x => [x[0], serializeInner(x[1]), ...x.slice(2)]) as any;
        // TODO: keep baseTypes information by reference
        // if (ret.baseTypes) {
        //     ret.baseTypes = ret.baseTypes.map(x => serializeInner(x)) as ObjectAssertion[];
        // }
        delete ret.baseTypes;
        break;
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
        ret[ty[0]] = serializeInner(ty[1].ty);
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
    case 'never':
        break;
    case 'any':
        break;
    case 'unknown':
        break;
    case 'primitive':
        if (ret.pattern) {
            ret.pattern = new RegExp(ret.pattern as any);
        }
        break;
    case 'primitive-value':
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
    case 'enum':
        break;
    case 'object':
        ret.members = ret.members.map(x => [x[0], deserializeInner(x[1]), x.slice(2)]) as any;
        if (ret.baseTypes) {
            ret.baseTypes = ret.baseTypes.map(x => deserializeInner(x)) as ObjectAssertion[];
        }
        break;
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
        });
    }
    return types;
}