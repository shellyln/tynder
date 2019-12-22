// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { NeverTypeAssertion,
         AnyTypeAssertion,
         UnknownTypeAssertion,
         PrimitiveTypeAssertion,
         PrimitiveValueTypeAssertion,
         RepeatedAssertion,
         SequenceAssertion,
         OneOfAssertion,
         ObjectAssertion,
         TypeAssertion,
         TypeAssertionErrorMessage,
         Context,
         TypeAssertionMap } from './types';
import { reportError }      from './reporter';



function validateNeverTypeAssertion<T>(data: any, ty: NeverTypeAssertion, ctx: Context): null {
    // reportError
    return null;
}


function validateAnyTypeAssertion<T>(data: any, ty: AnyTypeAssertion, ctx: Context): {value: T} {
    // always matched
    return ({value: ctx.mapper ? ctx.mapper(data, ty) : data});
}


function validateUnknownTypeAssertion<T>(data: any, ty: UnknownTypeAssertion, ctx: Context): {value: T} | null {
    if (data === null || data === void 0) {
        // reportError
        return null;
    }
    // always matched
    return ({value: ctx.mapper ? ctx.mapper(data, ty) : data});
}


function validatePrimitiveTypeAssertion<T>(data: any, ty: PrimitiveTypeAssertion, ctx: Context): {value: T} | null {
    let err = false;
    if (typeof data !== ty.primitiveName) {
        // reportError
        err = true;
    }
    switch (typeof ty.minValue) {
    case 'number': case 'string':
        if (data < ty.minValue) {
            // reportError
            err = true;
        }
    }
    switch (typeof ty.maxValue) {
    case 'number': case 'string':
        if (data > ty.maxValue) {
            // reportError
            err = true;
        }
    }
    switch (typeof ty.greaterThanValue) {
    case 'number': case 'string':
        if (data < ty.greaterThanValue) {
            // reportError
            err = true;
        }
    }
    switch (typeof ty.lessThanValue) {
    case 'number': case 'string':
        if (data > ty.lessThanValue) {
            // reportError
            err = true;
        }
    }
    switch (typeof ty.minLength) {
    case 'number':
        if (typeof data !== 'string' || data.length < ty.minLength) {
            // reportError
            err = true;
        }
    }
    switch (typeof ty.maxLength) {
    case 'number':
        if (typeof data !== 'string' || data.length > ty.maxLength) {
            // reportError
            err = true;
        }
    }
    if (ty.pattern) {
        if (! ty.pattern.test(data)) {
            // reportError
            err = true;
        }
    }
    const ret = !err ?
        {value: ctx.mapper ? ctx.mapper(data, ty) : data} :
        null;
    return ret;
}


function validatePrimitiveValueTypeAssertion<T>(data: any, ty: PrimitiveValueTypeAssertion, ctx: Context): {value: T} | null {
    const ret = data === ty.value ?
        {value: ctx.mapper ? ctx.mapper(data, ty) : data} :
        null;
    if (! ret) {
        // reportError
    }
    return ret;
}


function validateRepeatedAssertion<T>(data: any, ty: RepeatedAssertion, ctx: Context): {value: T} | null {
    if (! Array.isArray(data)) {
        // reportError
        return null;
    }
    if (typeof ty.min === 'number' && data.length < ty.min) {
        // reportError
        return null;
    }
    if (typeof ty.max === 'number' && data.length > ty.max) {
        // reportError
        return null;
    }

    const retVals: any[] = [];
    for (const x of data) {
        const r = validate(x, ty.repeated, ctx);
        if (! r) {
            // reportError
            return null;
        }
        retVals.push(r.value);
    }
    return {value: retVals as any};
}


function validateSequenceAssertion<T>(data: any, ty: SequenceAssertion, ctx: Context): {value: T} | null {
    if (! Array.isArray(data)) {
        return null;
    }
    let dIdx = 0,
        sIdx = 0;

    const retVals: any[] = [];
    while (dIdx < data.length && sIdx < ty.sequence.length) {
        const ts = ty.sequence[sIdx];
        if (ts.kind === 'spread') {
            // TODO: check spread length
            const r = validate(data[dIdx], ts.spread, ctx);
            if (r) {
                retVals.push(r.value);
                dIdx++;
            } else {
                // TODO: rollback reported errors
                sIdx++;
            }
        } else {
            const r = validate(data[dIdx], ts, ctx);
            if (r) {
                retVals.push(r.value);
                dIdx++;
                sIdx++;
            } else {
                // reportError
                return null;
            }
        }
    }
    const ret = data.length === dIdx ? {value: retVals as any} : null;
    if (! ret) {
        // reportError
    }
    return ret;
}


function validateOneOfAssertion<T>(data: any, ty: OneOfAssertion, ctx: Context): {value: T} | null {
    for (const tyOne of ty.oneOf) {
        const r = validate<T>(data, tyOne, ctx);
        if (! r) {
            // TODO: rollback reported errors
            continue;
        }
        return r;
    }
    // reportError
    return null;
}


function validateObjectAssertion<T>(data: any, ty: ObjectAssertion, ctx: Context): {value: T} | null {
    let retVal = data;
    const revMembers = ty.members.slice().reverse();
    for (const x of ty.members) {
        if (ty.members.find(m => m[0] === x[0]) !== revMembers.find(m => m[0] === x[0])) {
            // reportError (duplicated member)
            if (ctx && ctx.checkAll) {
                retVal = null;
            } else {
                return null;
            }
        }
    }
    for (const x of ty.members) {
        if (Object.prototype.hasOwnProperty.call(data, x[0])) {
            if (! validate(data[x[0]], x[1].kind === 'optional' ? x[1].optional : x[1], ctx)) {
                if (ctx && ctx.checkAll) {
                    retVal = null;
                } else {
                    return null;
                }
            }
        } else {
            if (x[1].kind !== 'optional') {
                // reportError (member is not exist)
                if (ctx && ctx.checkAll) {
                    retVal = null;
                } else {
                    return null;
                }
            }
        }
    }
    if (! retVal) {
        // reportError
    }
    return retVal ? {value: (ctx && ctx.mapper) ? ctx.mapper(retVal, ty) : retVal} : null;
}


export function validate<T>(data: any, ty: TypeAssertion, ctx?: Partial<Context>): {value: T} | null {
    const ctx2: Context = {...{errors: [] as TypeAssertionErrorMessage[]}, ...(ctx || {})};
    switch (ty.kind) {
    case 'never':
        return validateNeverTypeAssertion(data, ty, ctx2);
    case 'any':
        return validateAnyTypeAssertion(data, ty, ctx2);
    case 'unknown':
        return validateUnknownTypeAssertion(data, ty, ctx2);
    case 'primitive':
        return validatePrimitiveTypeAssertion(data, ty, ctx2);
    case 'primitive-value':
        return validatePrimitiveValueTypeAssertion(data, ty, ctx2);
    case 'repeated':
        return validateRepeatedAssertion(data, ty, ctx2);
    case 'sequence':
        return validateSequenceAssertion(data, ty, ctx2);
    case 'one-of':
        return validateOneOfAssertion(data, ty, ctx2);
    case 'object':
        return validateObjectAssertion(data, ty, ctx2);
    case 'spread': case 'optional':
        return null;
    default:
        throw new Error(`Unknown type assertion: ${(ty as any).kind}`);
    }
}


export function getType(types: TypeAssertionMap, name: string): TypeAssertion {
    if (types.has(name)) {
        return types.get(name)?.ty as TypeAssertion;
    }
    throw new Error(`Undefined type name is referred: ${name}`);
}
