// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { TypeAssertion,
         TypeAssertionErrorMessage,
         Context }  from './types';
import { validate } from './validator';



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


export function pick<T>(data: any, ty: TypeAssertion, ctx?: Partial<Context>): T {
    const ctx2: Context = {...{errors: [] as TypeAssertionErrorMessage[]}, ...(ctx || {}), mapper: pickMapper};
    switch (ty.kind) {
    case 'never':
        throw new Error('');
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
    case 'object':
        {
            const r = validate<T>(data, ty, ctx2);
            if (r) {
                return r.value;
            } else {
                throw new Error('');
            }
        }
    case 'spread': case 'optional':
        throw new Error('');
    default:
        throw new Error(`Unknown type assertion: ${(ty as any).kind}`);
    }
}


export function merge<T>(src: T, ...dataList: Array<Partial<T>>): T {
    // TODO: not impl
    throw new Error(`function 'merge()' is not implemented.`);
    // return src;
}
