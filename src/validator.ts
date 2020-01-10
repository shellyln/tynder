// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { ErrorTypes,
         NeverTypeAssertion,
         AnyTypeAssertion,
         UnknownTypeAssertion,
         PrimitiveTypeAssertion,
         PrimitiveValueTypeAssertion,
         RepeatedAssertion,
         SequenceAssertion,
         SpreadAssertion,
         OptionalAssertion,
         OneOfAssertion,
         EnumAssertion,
         ObjectAssertion,
         TypeAssertion,
         ValidationContext,
         TypeAssertionMap } from './types';
import { reportError }      from './reporter';
import { resolveSymbols }   from './lib/resolver';



function validateNeverTypeAssertion<T>(
    data: any, ty: NeverTypeAssertion, ctx: ValidationContext): null {

    reportError(ErrorTypes.TypeUnmatched, data, ty, ctx);
    return null;
}


function validateAnyTypeAssertion<T>(
    data: any, ty: AnyTypeAssertion, ctx: ValidationContext): {value: T} {

    // always matched
    return ({value: ctx.mapper ? ctx.mapper(data, ty) : data});
}


function validateUnknownTypeAssertion<T>(
    data: any, ty: UnknownTypeAssertion, ctx: ValidationContext): {value: T} | null {

    if (data === null || data === void 0) {
        reportError(ErrorTypes.TypeUnmatched, data, ty, ctx);
        return null;
    }
    // always matched
    return ({value: ctx.mapper ? ctx.mapper(data, ty) : data});
}


function validatePrimitiveTypeAssertion<T>(
    data: any, ty: PrimitiveTypeAssertion, ctx: ValidationContext): {value: T} | null {

    let err = false;
    if (typeof data !== ty.primitiveName) {
        reportError(ErrorTypes.TypeUnmatched, data, ty, ctx);
        err = true;
    }

    let valueRangeErr = false;
    switch (typeof ty.minValue) {
    case 'number': case 'string':
        if (data < ty.minValue) {
            if (! valueRangeErr) {
                reportError(ErrorTypes.ValueRangeUnmatched, data, ty, ctx);
            }
            valueRangeErr = true;
            err = true;
        }
    }
    switch (typeof ty.maxValue) {
    case 'number': case 'string':
        if (data > ty.maxValue) {
            if (! valueRangeErr) {
                reportError(ErrorTypes.ValueRangeUnmatched, data, ty, ctx);
            }
            valueRangeErr = true;
            err = true;
        }
    }
    switch (typeof ty.greaterThanValue) {
    case 'number': case 'string':
        if (data <= ty.greaterThanValue) {
            if (! valueRangeErr) {
                reportError(ErrorTypes.ValueRangeUnmatched, data, ty, ctx);
            }
            valueRangeErr = true;
            err = true;
        }
    }
    switch (typeof ty.lessThanValue) {
    case 'number': case 'string':
        if (data >= ty.lessThanValue) {
            if (! valueRangeErr) {
                reportError(ErrorTypes.ValueRangeUnmatched, data, ty, ctx);
            }
            valueRangeErr = true;
            err = true;
        }
    }

    let valueLengthErr = false;
    switch (typeof ty.minLength) {
    case 'number':
        if (typeof data !== 'string' || data.length < ty.minLength) {
            if (! valueLengthErr) {
                reportError(ErrorTypes.ValueLengthUnmatched, data, ty, ctx);
            }
            valueLengthErr = true;
            err = true;
        }
    }
    switch (typeof ty.maxLength) {
    case 'number':
        if (typeof data !== 'string' || data.length > ty.maxLength) {
            if (! valueLengthErr) {
                reportError(ErrorTypes.ValueLengthUnmatched, data, ty, ctx);
            }
            valueLengthErr = true;
            err = true;
        }
    }

    if (ty.pattern) {
        if (! ty.pattern.test(data)) {
            reportError(ErrorTypes.ValuePatternUnmatched, data, ty, ctx);
            err = true;
        }
    }
    const ret = !err ?
        {value: ctx.mapper ? ctx.mapper(data, ty) : data} :
        null;
    return ret;
}


function validatePrimitiveValueTypeAssertion<T>(
    data: any, ty: PrimitiveValueTypeAssertion, ctx: ValidationContext): {value: T} | null {

    const ret = data === ty.value ?
        {value: ctx.mapper ? ctx.mapper(data, ty) : data} :
        null;
    if (! ret) {
        reportError(ErrorTypes.ValueUnmatched, data, ty, ctx);
    }
    return ret;
}


function validateRepeatedAssertion<T>(
    data: any, ty: RepeatedAssertion, ctx: ValidationContext): {value: T} | null {

    if (! Array.isArray(data)) {
        reportError(ErrorTypes.RepeatQtyUnmatched, data, ty, ctx);
        return null;
    }
    if (typeof ty.min === 'number' && data.length < ty.min) {
        reportError(ErrorTypes.RepeatQtyUnmatched, data, ty, ctx);
        return null;
    }
    if (typeof ty.max === 'number' && data.length > ty.max) {
        reportError(ErrorTypes.RepeatQtyUnmatched, data, ty, ctx);
        return null;
    }

    const retVals: any[] = [];
    for (const x of data) {
        const r = validateRoot<T>(x, ty.repeated, ctx);
        if (! r) {
            // TODO: Child is unmatched. reportError?
            return null;
        }
        retVals.push(r.value);
    }
    return {value: retVals as any};
}


function validateSequenceAssertion<T>(
    data: any, ty: SequenceAssertion, ctx: ValidationContext): {value: T} | null {

    if (! Array.isArray(data)) {
        reportError(ErrorTypes.TypeUnmatched, data, ty, ctx); // TODO: TypeUnmatched is for 'primitive' type.
        return null;
    }
    let dIdx = 0, // index of data
        sIdx = 0; // index of types
    let spreadLen = 0;
    let optionalOmitted = false;

    const checkSpreadQuantity = (ts: SpreadAssertion) => {
        if (typeof ts.min === 'number' && spreadLen < ts.min) {
            reportError(ErrorTypes.RepeatQtyUnmatched, data, ty, ctx); // TODO: RepeatQtyUnmatched is for 'repeated' type.
            return null;
        }
        if (typeof ts.max === 'number' && spreadLen > ts.max) {
            reportError(ErrorTypes.RepeatQtyUnmatched, data, ty, ctx); // TODO: RepeatQtyUnmatched is for 'repeated' type.
            return null;
        }
        return ts;
    };

    const checkOptionalQuantity = (ts: OptionalAssertion) => {
        if (spreadLen === 0) {
            // All subsequent 'optional' assertions should be 'spreadLen === 0'.
            optionalOmitted = true;
        } else if (optionalOmitted) {
            reportError(ErrorTypes.RepeatQtyUnmatched, data, ty, ctx); // TODO: RepeatQtyUnmatched is for 'repeated' type.
            return null;
        } else if (spreadLen > 1) {
            reportError(ErrorTypes.RepeatQtyUnmatched, data, ty, ctx); // TODO: RepeatQtyUnmatched is for 'repeated' type.
            return null;
        }
        return ts;
    };

    const retVals: any[] = [];
    while (dIdx < data.length && sIdx < ty.sequence.length) {
        const ts = ty.sequence[sIdx];
        if (ts.kind === 'spread') {
            const savedErrLen = ctx.errors.length;
            const r = validateRoot<T>(data[dIdx], ts.spread, ctx);
            if (r) {
                retVals.push(r.value);
                dIdx++;
                spreadLen++;
            } else {
                // End of spreading
                // rollback reported errors
                ctx.errors.length = savedErrLen;
                if (! checkSpreadQuantity(ts)) {
                    return null;
                }
                spreadLen = 0;
                sIdx++;
            }
        } else if (ts.kind === 'optional') {
            const savedErrLen = ctx.errors.length;
            const r = validateRoot<T>(data[dIdx], ts.optional, ctx);
            if (r) {
                retVals.push(r.value);
                dIdx++;
                spreadLen++;
            } else {
                // End of spreading
                // rollback reported errors
                ctx.errors.length = savedErrLen;
                if (! checkOptionalQuantity(ts)) {
                    return null;
                }
                spreadLen = 0;
                sIdx++;
            }
        } else {
            const r = validateRoot<T>(data[dIdx], ts, ctx);
            if (r) {
                retVals.push(r.value);
                dIdx++;
                sIdx++;
            } else {
                // TODO: Child is unmatched. reportError?
                return null;
            }
        }
    }
    while (sIdx < ty.sequence.length) {
        const ts = ty.sequence[sIdx];
        if (ts.kind === 'spread') {
            if (! checkSpreadQuantity(ts)) {
                return null;
            }
            spreadLen = 0;
            sIdx++;
        } else if (ts.kind === 'optional') {
            if (! checkOptionalQuantity(ts)) {
                return null;
            }
            spreadLen = 0;
            sIdx++;
        } else {
            reportError(ErrorTypes.RepeatQtyUnmatched, data, ty, ctx); // TODO: RepeatQtyUnmatched is for 'repeated' type.
            return null;
        }
    }

    const ret = data.length === dIdx ? {value: retVals as any} : null;
    if (! ret) {
        reportError(ErrorTypes.SequenceUnmatched, data, ty, ctx);
    }
    return ret;
}


function validateOneOfAssertion<T>(
    data: any, ty: OneOfAssertion, ctx: ValidationContext): {value: T} | null {

    for (const tyOne of ty.oneOf) {
        const savedErrLen = ctx.errors.length;
        const r = validateRoot<T>(data, tyOne, ctx);
        if (! r) {
            // rollback reported errors
            ctx.errors.length = savedErrLen;
            continue;
        }
        return r;
    }
    // TODO: Child is unmatched. reportError? // <- it should be reporting. (children errors are rollbacked)
    reportError(ErrorTypes.TypeUnmatched, data, ty, ctx);
    return null;
}


function validateEnumAssertion<T>(
    data: any, ty: EnumAssertion, ctx: ValidationContext): {value: T} | null {

    for (const v of ty.values) {
        if (data === v[1]) {
            return ({value: ctx.mapper ? ctx.mapper(data, ty) : data});
        }
    }
    reportError(ErrorTypes.ValueUnmatched, data, ty, ctx);
    return null;
}


function validateObjectAssertion<T>(
    data: any, ty: ObjectAssertion, ctx: ValidationContext): {value: T} | null {

    let retVal = {...data};
    const revMembers = ty.members.slice().reverse();
    for (const x of ty.members) {
        if (ty.members.find(m => m[0] === x[0]) !== revMembers.find(m => m[0] === x[0])) {
            reportError(ErrorTypes.InvalidDefinition, data, ty, ctx);
            throw new Error(`Duplicated member is found: ${x[0]} in ${ty.name || '(unnamed)'}`);
        }
    }

    if (data === null || typeof data !== 'object') {
        reportError(ErrorTypes.TypeUnmatched, data, ty, ctx);
        if (ctx && ctx.checkAll) {
            retVal = null;
        } else {
            return null;
        }
    } else {
        const dataMembers = new Set<string>();
        if (ctx.noAdditionalProps || ty.additionalProps && 0 < ty.additionalProps.length) {
            if (! Array.isArray(data)) {
                for (const m in data) {
                    if (Object.prototype.hasOwnProperty.call(data, m)) {
                        dataMembers.add(m);
                    }
                }
            }
        }

        for (const x of ty.members) {
            dataMembers.delete(x[0]);
            if (Object.prototype.hasOwnProperty.call(data, x[0])) {
                const ret = validateRoot<T>(data[x[0]], x[1].kind === 'optional' ? x[1].optional : x[1], ctx);
                if (ret) {
                    if (retVal) {
                        retVal[x[0]] = ret.value;
                    }
                } else {
                    // TODO: report member's custom error message
                    if (ctx && ctx.checkAll) {
                        retVal = null;
                    } else {
                        return null;
                    }
                }
            } else {
                if (x[1].kind !== 'optional') {
                    reportError(ErrorTypes.Required, data, x[1], ctx);
                    if (ctx && ctx.checkAll) {
                        retVal = null;
                    } else {
                        return null;
                    }
                }
            }
        }

        if (ty.additionalProps && 0 < ty.additionalProps.length) {
            for (const m of dataMembers.values()) {
                let matched = false;
                let allowImplicit = false;
                let at: TypeAssertion = null as any;

                ENTRY: for (const ap of ty.additionalProps) {
                    for (const pt of ap[0]) {
                        at = ap[1];
                        if (pt === 'number') {
                            if (/^([\+\-]?\d*\.?\d+(?:[Ee][\+\-]?\d+)?)$/.test(m)) {
                                matched = true;
                                break ENTRY;
                            }
                        } else if (pt === 'string') {
                            matched = true;
                            break ENTRY;
                        } else {
                            if (pt.test(m)) {
                                matched = true;
                                break ENTRY;
                            }
                        }
                        if (at.kind === 'optional') {
                            allowImplicit = true;
                        }
                    }
                }
                if (! matched) {
                    if (allowImplicit) {
                        continue;
                    }
                    reportError(ErrorTypes.TypeUnmatched, data, ty, ctx); // TODO: new error type AdditionalPropUnmatched
                    if (ctx && ctx.checkAll) {
                        retVal = null;
                        continue;
                    } else {
                        return null;
                    }
                }

                dataMembers.delete(m);
                const ret = validateRoot<T>(data[m], at.kind === 'optional' ? at.optional : at, ctx);
                if (ret) {
                    if (retVal) {
                        retVal[m] = ret.value;
                    }
                } else {
                    // TODO: report member's custom error message
                    if (ctx && ctx.checkAll) {
                        retVal = null;
                    } else {
                        return null;
                    }
                }
            }
        }

        if (ctx.noAdditionalProps && 0 < dataMembers.size) {
            reportError(ErrorTypes.TypeUnmatched, data, ty, ctx); // TODO: new error type AdditionalPropUnmatched
            if (ctx && ctx.checkAll) {
                retVal = null;
            } else {
                return null;
            }
        }
    }
    if (! retVal) {
        // TODO: Child is unmatched. reportError?
        // TODO: report object's custom error message
    }
    return retVal ? {value: (ctx && ctx.mapper) ? ctx.mapper(retVal, ty) : retVal} : null;
}


export function validateRoot<T>(
    data: any, ty: TypeAssertion, ctx: ValidationContext): {value: T} | null {

    try {
        ctx.typeStack.push(ty);
        switch (ty.kind) {
        case 'never':
            return validateNeverTypeAssertion(data, ty, ctx);
        case 'any':
            return validateAnyTypeAssertion(data, ty, ctx);
        case 'unknown':
            return validateUnknownTypeAssertion(data, ty, ctx);
        case 'primitive':
            return validatePrimitiveTypeAssertion(data, ty, ctx);
        case 'primitive-value':
            return validatePrimitiveValueTypeAssertion(data, ty, ctx);
        case 'repeated':
            return validateRepeatedAssertion(data, ty, ctx);
        case 'sequence':
            return validateSequenceAssertion(data, ty, ctx);
        case 'one-of':
            return validateOneOfAssertion(data, ty, ctx);
        case 'enum':
            return validateEnumAssertion(data, ty, ctx);
        case 'object':
            return validateObjectAssertion(data, ty, ctx);
        case 'symlink':
            if (ctx.schema) {
                return validateRoot<T>(data, resolveSymbols(ctx.schema, ty, {nestLevel: 0, symlinkStack: []}), ctx);
            }
            reportError(ErrorTypes.InvalidDefinition, data, ty, ctx);
            throw new Error(`Unresolved symbol '${ty.symlinkTargetName}' is appeared.`);
        case 'spread': case 'optional':
            reportError(ErrorTypes.InvalidDefinition, data, ty, ctx);
            throw new Error(`Unexpected type assertion: ${(ty as any).kind}`);
        default:
            reportError(ErrorTypes.InvalidDefinition, data, ty, ctx);
            throw new Error(`Unknown type assertion: ${(ty as any).kind}`);
        }
    } finally {
        ctx.typeStack.pop();
    }
}


export function validate<T>(
    data: any, ty: TypeAssertion, ctx?: Partial<ValidationContext>): {value: T} | null {

    const ctx2: ValidationContext = {
        ...{errors: [], typeStack: []},
        ...(ctx || {}),
    };
    try {
        return validateRoot<T>(data, ty, ctx2);
    } finally {
        if (ctx) {
            ctx.errors = ctx2.errors;
        }
    }
}


export function getType(types: TypeAssertionMap, name: string): TypeAssertion {
    if (types.has(name)) {
        return types.get(name)?.ty as TypeAssertion;
    }
    throw new Error(`Undefined type name is referred: ${name}`);
}
