// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { TypeAssertion,
         ObjectAssertion,
         SerializedSchemaInfo,
         TypeAssertionSetValue,
         TypeAssertionMap } from './types';
import { resolveSchema }    from './lib/resolver';



const TynderSchemaVersion = 'tynder/1.0';


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
    case 'never': case 'any': case 'unknown': case 'primitive-value': case 'symlink': case 'operator':
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
    return ret;
}


export function serialize(schema: TypeAssertionMap, asTs?: boolean): string {
    const ret: SerializedSchemaInfo = {
        version: TynderSchemaVersion,
        ns: {},
    };
    const current = {};

    for (const ty of schema.entries()) {
        current[ty[0]] = serializeInner(ty[1].ty, 0);
    }

    ret.ns['.'] = current;

    if (asTs) {
        return (
            `\n// tslint:disable: object-literal-key-quotes\n` +
            `const schema = ${JSON.stringify(ret, null, 2)};\nexport default schema;` +
            `\n// tslint:enable: object-literal-key-quotes\n`
        );
    } else {
        return JSON.stringify(ret, null, 2);
    }
}


function deserializeInner(ty: TypeAssertion) {
    const ret: TypeAssertion = {...ty};
    switch (ret.kind) {
    case 'never': case 'any': case 'unknown': case 'primitive-value':
    case 'enum': case 'symlink': case 'operator':
        // NOTE: 'symlink' and 'operator' will resolved by calling 'resolveSymbols()' in 'deserialize()'.
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


export function deserializeFromObject(obj: any) {
    if (obj.version !== TynderSchemaVersion) {
        throw new Error(`Unknown schema version: ${obj.version}`);
    }

    const schema: TypeAssertionMap = new Map<string, TypeAssertionSetValue>();
    const current = obj.ns['.'];

    for (const k in current) {
        if (! Object.prototype.hasOwnProperty.call(current, k)) {
            continue;
        }
        schema.set(k, {
            ty: deserializeInner(current[k]),
            exported: false,
            resolved: false,
        });
    }

    return resolveSchema(schema);
}


export function deserialize(text: string) {
    const parsed = JSON.parse(text);
    return deserializeFromObject(parsed);
}
