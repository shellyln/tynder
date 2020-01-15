// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { TypeAssertion,
         ValidationContext } from './types';
import { pick }              from './picker';



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
