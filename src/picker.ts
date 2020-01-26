// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { TypeAssertion,
         ValidationContext } from './types';
import { ValidationError }   from './lib/errors';
import { validate }          from './validator';



function pickMapper(value: any, ty: TypeAssertion) {
    switch (ty.kind) {
    case 'object':
        {
            const ret = Array.isArray(value) ? [] : {};

            const dataMembers = new Set<string>();
            if (! Array.isArray(value)) {
                for (const m in value) {
                    if (Object.prototype.hasOwnProperty.call(value, m)) {
                        dataMembers.add(m);
                    }
                }
            }

            for (const x of ty.members) {
                if (Object.hasOwnProperty.call(value, x[0])) {
                    dataMembers.delete(x[0]);
                    ret[x[0]] = value[x[0]];
                }
            }
            if (ty.additionalProps && 0 < ty.additionalProps.length) {
                function* getAdditionalMembers() {
                    for (const m of dataMembers.values()) {
                        yield m;
                    }
                    if (Array.isArray(value)) {
                        for (let i = 0; i < value.length; i++) {
                            yield String(i);
                        }
                    }
                }
                for (const m of getAdditionalMembers()) {
                    ret[m] = value[m];
                }
            }
            return ret;
        }
    default:
        return value;
    }
}


export function pickRoot<T>(data: T, ty: TypeAssertion, ctx: ValidationContext): T {
    switch (ty.kind) {
    case 'never':
        throw new ValidationError(`Type unmatched: ${(ty as any).kind}`, ty, ctx);
    case 'any':
        // FALL_THRU
    case 'unknown':
        // FALL_THRU
    case 'primitive':
        // FALL_THRU
    case 'primitive-value':
        // FALL_THRU
    case 'repeated':
        // FALL_THRU
    case 'sequence':
        // FALL_THRU
    case 'one-of':
        // FALL_THRU
    case 'enum':
        // FALL_THRU
    case 'object':
        {
            const r = validate<T>(data, ty, ctx);
            if (r) {
                return r.value;
            } else {
                throw new ValidationError('Validation failed.', ty, ctx);
            }
        }
    case 'spread': case 'optional': case 'symlink': case 'operator':
        throw new ValidationError(`Unexpected type assertion: ${(ty as any).kind}`, ty, ctx);
    default:
        throw new ValidationError(`Unknown type assertion: ${(ty as any).kind}`, ty, ctx);
    }
}


export function pick<T>(data: T, ty: TypeAssertion, ctx?: Partial<ValidationContext>): T {
    const ctx2: ValidationContext = {
        ...{errors: [], typeStack: []},
        ...(ctx || {}),
        mapper: pickMapper,
    };
    try {
        return pickRoot<T>(data, ty, ctx2);
    } finally {
        if (ctx) {
            ctx.errors = ctx2.errors;
        }
    }
}


function merge(data: any, needle: any) {
    if (data === null || data === void 0) {
        return needle;
    }
    switch (typeof data) {
    case 'object':
        if (Array.isArray(data)) {
            return [...needle];
        } else {
            const r: any = {};
            for (const k in needle) {
                if (Object.prototype.hasOwnProperty.call(needle, k)) {
                    // TODO: check prototype pollution
                    r[k] = merge(r[k], needle[k]);
                }
            }
            return ({...data, ...r});
        }
    default:
        return needle;
    }
}


export function patch<T>(data: T, needle: any, ty: TypeAssertion, ctx?: Partial<ValidationContext>): T {
    const ctx2: ValidationContext = {
        ...{errors: [], typeStack: []},
        ...(ctx || {}),
    };
    const validated = pick<T>(needle, ty, ctx2);
    return merge(data, validated);
}
