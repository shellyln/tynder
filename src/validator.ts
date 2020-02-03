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
         TypeAssertionMap }    from './types';
import { ValidationError }     from './lib/errors';
import { isUnsafeVarNames }    from './lib/util';
import { reportError,
         reportErrorWithPush } from './lib/reporter';
import { resolveSymbols }      from './lib/resolver';



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

    if (ty.primitiveName === 'null') {
        if (data !== null) {
            reportError(ErrorTypes.TypeUnmatched, data, ty, ctx);
            return null;
        }
    } else if (ty.primitiveName === 'integer') {
        if (typeof data !== 'number') {
            reportError(ErrorTypes.TypeUnmatched, data, ty, ctx);
            return null;
        }
        if (Math.trunc(data) !== data) {
            reportError(ErrorTypes.TypeUnmatched, data, ty, ctx);
            return null;
        }
    } else if (typeof data !== ty.primitiveName) {
        reportError(ErrorTypes.TypeUnmatched, data, ty, ctx);
        return null;
    }
    // TODO: Function, DateStr, DateTimeStr

    let err = false;
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
        reportError(ErrorTypes.TypeUnmatched, data, ty, ctx);
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
    for (let i = 0; i < data.length; i++) {
        const x = data[i];
        const r = validateRoot<T>(x, ty.repeated, ctx, i);
        if (! r) {
            return null;
        }
        retVals.push(r.value);
    }
    return {value: retVals as any};
}


function validateSequenceAssertion<T>(
    data: any, ty: SequenceAssertion, ctx: ValidationContext): {value: T} | null {

    if (! Array.isArray(data)) {
        reportError(ErrorTypes.TypeUnmatched, data, ty, ctx);
        return null;
    }
    let dIdx = 0, // index of data
        sIdx = 0; // index of types
    let spreadLen = 0;
    let optionalOmitted = false;

    const checkSpreadQuantity = (ts: SpreadAssertion, index: number) => {
        if (typeof ts.min === 'number' && spreadLen < ts.min) {
            reportErrorWithPush(
                spreadLen === 0 ?
                    ErrorTypes.TypeUnmatched :
                    ErrorTypes.RepeatQtyUnmatched, data, [ts, index], ctx);
            return null;
        }
        if (typeof ts.max === 'number' && spreadLen > ts.max) {
            reportErrorWithPush(ErrorTypes.RepeatQtyUnmatched, data, [ts, index], ctx);
            return null;
        }
        return ts;
    };

    const checkOptionalQuantity = (ts: OptionalAssertion, index: number) => {
        if (spreadLen === 0) {
            // All subsequent 'optional' assertions should be 'spreadLen === 0'.
            optionalOmitted = true;
        } else if (optionalOmitted) {
            reportErrorWithPush(ErrorTypes.RepeatQtyUnmatched, data, [ts, index], ctx);
            return null;
        } else if (spreadLen > 1) {
            reportErrorWithPush(ErrorTypes.RepeatQtyUnmatched, data, [ts, index], ctx);
            return null;
        }
        return ts;
    };

    const retVals: any[] = [];
    while (dIdx < data.length && sIdx < ty.sequence.length) {
        const ts = ty.sequence[sIdx];
        if (ts.kind === 'spread') {
            const savedErrLen = ctx.errors.length;
            const r = validateRoot<T>(data[dIdx], ts.spread, ctx, dIdx);
            if (r) {
                retVals.push(r.value);
                dIdx++;
                spreadLen++;
            } else {
                // End of spreading
                // rollback reported errors
                ctx.errors.length = savedErrLen;
                if (! checkSpreadQuantity(ts, dIdx)) {
                    return null;
                }
                spreadLen = 0;
                sIdx++;
            }
        } else if (ts.kind === 'optional') {
            const savedErrLen = ctx.errors.length;
            const r = validateRoot<T>(data[dIdx], ts.optional, ctx, dIdx);
            if (r) {
                retVals.push(r.value);
                dIdx++;
                spreadLen++;
            } else {
                // End of spreading
                // rollback reported errors
                ctx.errors.length = savedErrLen;
                if (! checkOptionalQuantity(ts, dIdx)) {
                    return null;
                }
                spreadLen = 0;
                sIdx++;
            }
        } else {
            const r = validateRoot<T>(data[dIdx], ts, ctx, dIdx);
            if (r) {
                retVals.push(r.value);
                dIdx++;
                sIdx++;
            } else {
                return null;
            }
        }
    }
    while (sIdx < ty.sequence.length) {
        const ts = ty.sequence[sIdx];
        if (ts.kind === 'spread') {
            if (! checkSpreadQuantity(ts, dIdx)) {
                return null;
            }
            spreadLen = 0;
            sIdx++;
        } else if (ts.kind === 'optional') {
            if (! checkOptionalQuantity(ts, dIdx)) {
                return null;
            }
            spreadLen = 0;
            sIdx++;
        } else {
            reportErrorWithPush(ErrorTypes.RepeatQtyUnmatched, data, [ts, dIdx], ctx);
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


const NumberPattern = /^([\+\-]?\d*\.?\d+(?:[Ee][\+\-]?\d+)?)$/;


function validateObjectAssertion<T>(
    data: any, ty: ObjectAssertion, ctx: ValidationContext): {value: T} | null {

    let retVal = Array.isArray(data) ? [...data] : {...data};
    const revMembers = ty.members.slice().reverse();
    for (const x of ty.members) {
        if (ty.members.find(m => m[0] === x[0]) !== revMembers.find(m => m[0] === x[0])) {
            reportError(ErrorTypes.InvalidDefinition, data, ty, ctx);
            throw new ValidationError(
                `Duplicated member is found: ${x[0]} in ${ty.name || '(unnamed)'}`, ty, ctx);
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
        if (ctx.noAdditionalProps && Array.isArray(data) && 0 < data.length) {
            const aps = ty.additionalProps || [];
            if (aps.filter(x => x[0].includes('number')).length === 0) {
                reportError(ErrorTypes.AdditionalPropUnmatched, data, ty, ctx);
                if (ctx && ctx.checkAll) {
                    retVal = null;
                } else {
                    return null;
                }
            }
        }

        for (const x of ty.members) {
            dataMembers.delete(x[0]);
            if (Object.prototype.hasOwnProperty.call(data, x[0])) {
                const ret = validateRoot<T>(
                    data[x[0]],
                    x[1].kind === 'optional' ?  // TODO: set name at compile time
                        {
                            ...x[1].optional,
                            name: x[0],
                            message: x[1].message,
                            messages: x[1].messages,
                            messageId: x[1].messageId,
                        } : x[1],
                    ctx);

                if (ret) {
                    if (retVal) {
                        if (isUnsafeVarNames(retVal, x[0])) {
                            continue;
                        }
                        retVal[x[0]] = ret.value;
                    }
                } else {
                    if (ctx && ctx.checkAll) {
                        retVal = null;
                    } else {
                        return null;
                    }
                }
            } else {
                if (x[1].kind !== 'optional') {
                    reportErrorWithPush(ErrorTypes.Required, data, [x[1], void 0], ctx);
                    if (ctx && ctx.checkAll) {
                        retVal = null;
                    } else {
                        return null;
                    }
                }
            }
        }

        if (ty.additionalProps && 0 < ty.additionalProps.length) {
            function* getAdditionalMembers() {
                for (const m of dataMembers.values()) {
                    yield m;
                }
                if (Array.isArray(data)) {
                    for (let i = 0; i < data.length; i++) {
                        yield String(i);
                    }
                }
            }
            for (const m of getAdditionalMembers()) {
                let allowImplicit = false;
                const matchedAssertions: TypeAssertion[] = [];

                for (const ap of ty.additionalProps) {
                    for (const pt of ap[0]) {
                        const at = ap[1];
                        if (pt === 'number') {
                            if (NumberPattern.test(m)) {
                                matchedAssertions.push(at);
                            }
                        } else if (pt === 'string') {
                            matchedAssertions.push(at);
                        } else {
                            if (pt.test(m)) {
                                matchedAssertions.push(at);
                            }
                        }
                        if (at.kind === 'optional') {
                            allowImplicit = true;
                        }
                    }
                }
                if (matchedAssertions.length === 0) {
                    if (allowImplicit) {
                        continue;
                    }
                    reportError(ErrorTypes.AdditionalPropUnmatched, data, ty, ctx);
                    if (ctx && ctx.checkAll) {
                        retVal = null;
                        continue;
                    } else {
                        return null;
                    }
                }

                dataMembers.delete(m);
                let hasError = false;
                const savedErrLen = ctx.errors.length;

                for (const at of matchedAssertions) {
                    const ret = validateRoot<T>(data[m], at.kind === 'optional' ?
                        {
                            ...at.optional,
                            message: at.message,
                            messages: at.messages,
                            messageId: at.messageId,
                        } : at, ctx);
                    if (ret) {
                        if (retVal) {
                            hasError = false;
                            ctx.errors.length = savedErrLen;
                            if (isUnsafeVarNames(retVal, m)) {
                                continue;
                            }
                            retVal[m] = ret.value;
                        }
                        break;
                    } else {
                        hasError = true;
                    }
                }
                if (hasError) {
                    if (ctx && ctx.checkAll) {
                        retVal = null;
                    } else {
                        return null;
                    }
                }
            }
        }

        if (ctx.noAdditionalProps && 0 < dataMembers.size) {
            reportError(ErrorTypes.AdditionalPropUnmatched, data, ty, ctx);
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
    data: any, ty: TypeAssertion, ctx: ValidationContext, dataIndex?: number | string): {value: T} | null {

    try {
        ctx.typeStack.push(
            typeof dataIndex === 'number' || typeof dataIndex === 'string' ?
            [ty, dataIndex] : ty);

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
            throw new ValidationError(`Unresolved symbol '${ty.symlinkTargetName}' is appeared.`, ty, ctx);
        case 'operator':
            if (ctx.schema) {
                return validateRoot<T>(data, resolveSymbols(ctx.schema, ty, {nestLevel: 0, symlinkStack: []}), ctx);
            }
            reportError(ErrorTypes.InvalidDefinition, data, ty, ctx);
            throw new ValidationError(`Unresolved type operator is found: ${ty.operator}`, ty, ctx);
        case 'spread': case 'optional':
            reportError(ErrorTypes.InvalidDefinition, data, ty, ctx);
            throw new ValidationError(`Unexpected type assertion: ${(ty as any).kind}`, ty, ctx);
        default:
            reportError(ErrorTypes.InvalidDefinition, data, ty, ctx);
            throw new ValidationError(`Unknown type assertion: ${(ty as any).kind}`, ty, ctx);
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


export function getType(schema: TypeAssertionMap, name: string): TypeAssertion {
    if (schema.has(name)) {
        return schema.get(name)?.ty as TypeAssertion;
    }
    throw new Error(`Undefined type name is referred: ${name}`);
}
