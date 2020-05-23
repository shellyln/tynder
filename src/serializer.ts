// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { TypeAssertion,
         ObjectAssertion,
         SerializedSchemaInfo,
         TypeAssertionSetValue,
         TypeAssertionMap } from './types';
import { escapeString }     from './lib/escape';
import { resolveSchema }    from './lib/resolver';



export const TynderSchemaVersion = 'tynder/1.0';


function hasMetaInfo(ty: TypeAssertion) {
    let hasInfo = false;

    if (ty.messages) {
        hasInfo = true;
    }
    if (ty.message) {
        hasInfo = true;
    }
    if (ty.messageId) {
        hasInfo = true;
    }

    switch (ty.kind) {
    case 'repeated':
        if (typeof ty.min === 'number') {
            hasInfo = true;
        }
        if (typeof ty.max === 'number') {
            hasInfo = true;
        }
        break;
    case 'primitive':
        if (typeof ty.minValue === 'number') {
            hasInfo = true;
        }
        if (typeof ty.maxValue === 'number') {
            hasInfo = true;
        }
        if (typeof ty.greaterThanValue === 'number') {
            hasInfo = true;
        }
        if (typeof ty.lessThanValue === 'number') {
            hasInfo = true;
        }
        if (typeof ty.minLength === 'number') {
            hasInfo = true;
        }
        if (typeof ty.maxLength === 'number') {
            hasInfo = true;
        }
        if (ty.pattern) {
            hasInfo = true;
        }
        break;
    }

    return hasInfo;
}


function serializeInner(ty: TypeAssertion, nestLevel: number): TypeAssertion {
    if (0 < nestLevel && ty.typeName && !hasMetaInfo(ty)) {
        switch (ty.kind) {
        case 'optional':
            // nothing to do.
            break;
        default:
            return ({
                ...{
                    kind: 'symlink',
                    symlinkTargetName: ty.typeName as string, // NOTE: type inference failed if the switch statement is exists.
                    typeName: ty.typeName,
                },
                ...(ty.name ? {name: ty.name} : {}),
                ...(ty.docComment ? {docComment: ty.docComment} : {}),
            });
        }
    }

    const ret: TypeAssertion = {...ty};
    switch (ret.kind) {
    case 'never': case 'any': case 'unknown': case 'symlink': case 'operator':
        break;
    case 'primitive-value':
        if (typeof ret.value === 'bigint') {
            ret.value = String(ret.value);
            ret.primitiveName = 'bigint';
        }
        break;
    case 'primitive':
        if (ret.pattern) {
            ret.pattern = `/${ret.pattern.source}/${ret.pattern.flags}` as any;
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
        ret.members = ret.members
            .map(x => [x[0], serializeInner(x[1], nestLevel + 1), ...x.slice(2)]) as any;
        if (ret.additionalProps) {
            ret.additionalProps = ret.additionalProps
                .map(x => [x[0].map(
                    p => typeof p === 'string' ?
                        p : `/${p.source}/${p.flags}`),
                    serializeInner(x[1], nestLevel + 1), ...x.slice(2)]) as any;
        }
        if (ret.baseTypes) {
            // NOTE: convert 'baseTypes' to 'symlink'.
            ret.baseTypes = ret.baseTypes.map(x => serializeInner(x, nestLevel + 1)) as ObjectAssertion[];
        }
        break;
    default:
        throw new Error(`Unknown type assertion: ${(ret as any).kind}`);
    }

    return ret;
}


export function serializeToObject(schema: TypeAssertionMap): SerializedSchemaInfo {
    const ret: SerializedSchemaInfo = {
        version: TynderSchemaVersion,
        ns: {},
    };
    const current = {};

    for (const ty of schema.entries()) {
        current[ty[0]] = serializeInner(ty[1].ty, 0);
    }

    ret.ns['.'] = current;

    return ret;
}


export function serialize(schema: TypeAssertionMap, asTs?: boolean): string {
    const ret = serializeToObject(schema);

    if (asTs) {
        return (
            `\n// tslint:disable: object-literal-key-quotes\n` +
            `const schema = ${JSON.stringify(ret, null, 2)};\nexport default schema;\n\n` +
            `export const enum Schema {\n${Object.keys(ret.ns['.']).filter(x => {
                return (!
                    (/^[0-9]/.test(x) ||
                     /[\u0000-\u001f\u007f]/.test(x) ||
                     /\s/.test(x) ||
                     /[@#$%^&+-=:;.,?!'"`/|{}()<>[\]\*\\]/.test(x))
                );
            }).map(x => `    ${x} = '${x}',\n`).join('')}` +
            `}\n// tslint:enable: object-literal-key-quotes\n`
        );
    } else {
        return JSON.stringify(ret, null, 2);
    }
}


function deserializeRegExp(pat: string, errMsg: string) {
    const m = (/^\/(.*)\/([gimsuy]*)$/s).exec(pat);
    if (m) {
        return new RegExp(m[1], m[2]);
    } else {
        throw new Error(errMsg);
    }
}


function deserializeInner(ty: TypeAssertion) {
    const ret: TypeAssertion = {...ty};
    switch (ret.kind) {
    case 'never': case 'any': case 'unknown':
    case 'enum': case 'symlink': case 'operator':
        // NOTE: 'symlink' and 'operator' will resolved by calling 'resolveSymbols()' in 'deserialize()'.
        break;
    case 'primitive-value':
        if (ret.primitiveName === 'bigint') {
            delete ret.primitiveName;
            ret.value = BigInt(ret.value);
        }
        break;
    case 'primitive':
        if (ret.pattern) {
            ret.pattern = deserializeRegExp(
                ret.pattern as any,
                `Unknown pattern match assertion: ${ret.pattern as any}`);
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
        ret.members = ret.members
            .map(x => [x[0], deserializeInner(x[1]), ...x.slice(2)]) as any;
        if (ret.additionalProps) {
            ret.additionalProps = ret.additionalProps
                .map(x => [x[0].map(
                    p => String(p).startsWith('/') ?
                        deserializeRegExp(p as any, `Unknown additional props: ${p}`) : p),
                    deserializeInner(x[1]), ...x.slice(2)]) as any;
        }
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
            isDeclare: false,
            resolved: false,
        });
    }

    return resolveSchema(schema, {isDeserialization: true});
}


export function deserialize(text: string) {
    const parsed = JSON.parse(text);
    return deserializeFromObject(parsed);
}
