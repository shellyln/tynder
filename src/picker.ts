// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { TypeAssertion,
         ValidationContext } from './types';
import { ValidationError }   from './errors';
import { validate }          from './validator';



function pickMapper(value: any, ty: TypeAssertion) {
    switch (ty.kind) {
    case 'object':
        {
            const ret = {};
            for (const x of ty.members) {
                if (Object.hasOwnProperty.call(value, x[0])) {
                    ret[x[0]] = value[x[0]];
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
    case 'spread': case 'optional': case 'symlink':
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
