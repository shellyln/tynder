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
         TypeAssertionMap,
         Stereotype,
         CustomConstraintInfo } from './types';
import { ValidationError }      from './lib/errors';
import { NumberPattern,
         isUnsafeVarNames }     from './lib/util';
import { reportError,
         reportErrorWithPush }  from './lib/reporter';
import { resolveSymbols }       from './lib/resolver';
import { noopStereotype }       from './stereotypes/noop';



function checkStereotypes(
    data: any, ty: TypeAssertion, ctx: ValidationContext):
        {value: any, stereotype: Stereotype} | null | false {

    if (ty.stereotype && ctx.stereotypes) {
        if (ctx.stereotypes.has(ty.stereotype)) {
            const stereotype = ctx.stereotypes.get(ty.stereotype) as Stereotype;
            const parsed = stereotype.tryParse(data);
            if (parsed) {
                return ({
                    value: parsed.value,
                    stereotype,
                });
            } else {
                return null;
            }
        } else {
            throw new Error(`Undefined stereotype is specified: ${ty.stereotype}`);
        }
    }
    return false;
}


function forceCast(
    targetType:
        'number' | 'integer' | 'bigint' | 'string' | 'boolean' | 'undefined' | 'null' |
        'symbol' | 'object' | 'function',
    value: any) {

    switch (targetType) {
    case 'number':
        if (typeof value === 'number') {
            return value;
        } else {
            const a = Number.parseFloat(String(value));
            if (Number.isNaN(a)) {
                return Number(value ?? 0);
            } else {
                return a;
            }
        }
    case 'integer':
        if (typeof value === 'number' && Math.trunc(value) === value) {
            return value;
        } else {
            let a = Number.parseFloat(String(value));
            if (Number.isNaN(a)) {
                a = Number(value ?? 0);
            }
            return Math.trunc(a);
        }
    case 'bigint':
        try {
            return BigInt(value ?? 0);
        } catch {
            return NaN;
        }
    case 'string':
        return String(value);
    case 'boolean':
        return Boolean(value);
    case 'undefined':
        return void 0;
    case 'null':
        return null;
    default:
        return value;
    }
}


function checkCustomConstraints(
    data: any, ty: TypeAssertion, ctx: ValidationContext): boolean | null {

    if (ty.customConstraints && ctx.customConstraints) {
        for (const ccName of ty.customConstraints) {
            if (ctx.customConstraints.has(ccName)) {
                const cc = ctx.customConstraints.get(ccName) as CustomConstraintInfo;
                if (cc.kinds && !cc.kinds.includes(ty.kind)) {
                    return null;
                }
                if (! cc.check(data, ty.customConstraintsArgs && ty.customConstraintsArgs[ccName])) {
                    return null;
                }
            } else {
                throw new Error(`Undefined constraint is specified: ${ccName}`);
            }
        }
        return true;
    }
    return false;
}


function validateNeverTypeAssertion<T>(
    data: any, ty: NeverTypeAssertion, ctx: ValidationContext): null {

    reportError(ErrorTypes.TypeUnmatched, data, ty, {ctx});
    return null;
}


function validateAnyTypeAssertion<T>(
    data: any, ty: AnyTypeAssertion, ctx: ValidationContext): {value: T} | null {

    let chkSt = checkStereotypes(data, ty, ctx);
    if (chkSt === null) {
        reportError(ErrorTypes.TypeUnmatched, data, ty, {ctx});
        return null;
    } else if (chkSt === false) {
        chkSt = {
            value: data,
            stereotype: noopStereotype,
        };
    }
    const styp = chkSt.stereotype;

    if (checkCustomConstraints(data, ty, ctx) === null) {
        reportError(ErrorTypes.ValueUnmatched, data, ty, {ctx});
        return null;
    }

    // always matched
    return ({value: ctx.mapper
        ? ctx.mapper(styp.doCast ? chkSt.value : data, ty)
        :            styp.doCast ? chkSt.value : data});
}


function validateUnknownTypeAssertion<T>(
    data: any, ty: UnknownTypeAssertion, ctx: ValidationContext): {value: T} | null {

    let chkSt = checkStereotypes(data, ty, ctx);
    if (chkSt === null) {
        reportError(ErrorTypes.TypeUnmatched, data, ty, {ctx});
        return null;
    } else if (chkSt === false) {
        chkSt = {
            value: data,
            stereotype: noopStereotype,
        };
    }
    const styp = chkSt.stereotype;

    if (checkCustomConstraints(data, ty, ctx) === null) {
        reportError(ErrorTypes.ValueUnmatched, data, ty, {ctx});
        return null;
    }

    // always matched
    return ({value: ctx.mapper
        ? ctx.mapper(styp.doCast ? chkSt.value : data, ty)
        :            styp.doCast ? chkSt.value : data});
}


function validatePrimitiveTypeAssertion<T>(
    data: any, ty: PrimitiveTypeAssertion, ctx: ValidationContext): {value: T} | null {

    const chkTarget = ty.forceCast ? forceCast(ty.primitiveName, data) : data;

    if (ty.primitiveName === 'null') {
        if (chkTarget !== null) {
            reportError(ErrorTypes.TypeUnmatched, data, ty, {ctx});
            return null;
        }
    } else if (ty.primitiveName === 'integer') {
        if (typeof chkTarget !== 'number') {
            reportError(ErrorTypes.TypeUnmatched, data, ty, {ctx});
            return null;
        }
        if (Math.trunc(chkTarget) !== chkTarget) {
            reportError(ErrorTypes.TypeUnmatched, data, ty, {ctx});
            return null;
        }
    } else if (typeof chkTarget !== ty.primitiveName) {
        reportError(ErrorTypes.TypeUnmatched, data, ty, {ctx});
        return null;
    }
    // TODO: Function, DateStr, DateTimeStr

    let chkSt = checkStereotypes(chkTarget, ty, ctx);
    if (chkSt === null) {
        reportError(ErrorTypes.TypeUnmatched, data, ty, {ctx});
        return null;
    } else if (chkSt === false) {
        chkSt = {
            value: chkTarget,
            stereotype: ty.forceCast ? noopStereotype : noopStereotype,
        };
    }

    const styVal = chkSt.value;
    const styp = chkSt.stereotype;
    let err = false;

    let valueRangeErr = false;
    switch (typeof ty.minValue) {
    case 'number': case 'string': // TODO: bigint
        if (styp.compare(styVal, styp.evaluateFormula(ty.minValue)) < 0) {
            if (! valueRangeErr) {
                reportError(ErrorTypes.ValueRangeUnmatched, data, ty, {ctx});
            }
            valueRangeErr = true;
            err = true;
        }
    }
    switch (typeof ty.maxValue) {
    case 'number': case 'string': // TODO: bigint
        if (styp.compare(styVal, styp.evaluateFormula(ty.maxValue)) > 0) {
            if (! valueRangeErr) {
                reportError(ErrorTypes.ValueRangeUnmatched, data, ty, {ctx});
            }
            valueRangeErr = true;
            err = true;
        }
    }
    switch (typeof ty.greaterThanValue) {
    case 'number': case 'string': // TODO: bigint
        if (styp.compare(styVal, styp.evaluateFormula(ty.greaterThanValue)) <= 0) {
            if (! valueRangeErr) {
                reportError(ErrorTypes.ValueRangeUnmatched, data, ty, {ctx});
            }
            valueRangeErr = true;
            err = true;
        }
    }
    switch (typeof ty.lessThanValue) {
    case 'number': case 'string': // TODO: bigint
        if (styp.compare(styVal, styp.evaluateFormula(ty.lessThanValue)) >= 0) {
            if (! valueRangeErr) {
                reportError(ErrorTypes.ValueRangeUnmatched, data, ty, {ctx});
            }
            valueRangeErr = true;
            err = true;
        }
    }

    let valueLengthErr = false;
    switch (typeof ty.minLength) {
    case 'number':
        if (typeof styVal !== 'string' || styVal.length < ty.minLength) {
            if (! valueLengthErr) {
                reportError(ErrorTypes.ValueLengthUnmatched, data, ty, {ctx});
            }
            valueLengthErr = true;
            err = true;
        }
    }
    switch (typeof ty.maxLength) {
    case 'number':
        if (typeof styVal !== 'string' || styVal.length > ty.maxLength) {
            if (! valueLengthErr) {
                reportError(ErrorTypes.ValueLengthUnmatched, data, ty, {ctx});
            }
            valueLengthErr = true;
            err = true;
        }
    }

    if (ty.pattern) {
        if (typeof styVal !== 'string' || !ty.pattern.test(styVal)) {
            reportError(ErrorTypes.ValuePatternUnmatched, data, ty, {ctx});
            err = true;
        }
    }

    if (checkCustomConstraints(data, ty, ctx) === null) {
        reportError(ErrorTypes.ValueUnmatched, data, ty, {ctx});
        err = true;
    }

    const ret = !err
        ? {value: ctx.mapper
            ? ctx.mapper(styp.doCast ? chkSt.value : chkTarget, ty)
            :            styp.doCast ? chkSt.value : chkTarget}
        : null;
    return ret;
}


function validatePrimitiveValueTypeAssertion<T>(
    data: any, ty: PrimitiveValueTypeAssertion, ctx: ValidationContext): {value: T} | null {

    const chkTarget = ty.forceCast ? forceCast(typeof ty.value, data) : data;

    let chkSt = checkStereotypes(chkTarget, ty, ctx);
    if (chkSt === null) {
        reportError(ErrorTypes.ValueUnmatched, data, ty, {ctx});
        return null;
    } else if (chkSt === false) {
        chkSt = {
            value: chkTarget,
            stereotype: ty.forceCast ? noopStereotype : noopStereotype,
        };
    }
    const styp = chkSt.stereotype;

    let ret = styp.compare(chkSt.value, styp.evaluateFormula(ty.value)) === 0
        ? {value: ctx.mapper
            ? ctx.mapper(styp.doCast ? chkSt.value : chkTarget, ty)
            :            styp.doCast ? chkSt.value : chkTarget}
        : null;
    if (! ret) {
        reportError(ErrorTypes.ValueUnmatched, data, ty, {ctx});
    }

    if (ret && checkCustomConstraints(data, ty, ctx) === null) {
        reportError(ErrorTypes.ValueUnmatched, data, ty, {ctx});
        ret = null;
    }

    return ret;
}


function validateRepeatedAssertion<T>(
    data: any, ty: RepeatedAssertion, ctx: ValidationContext): {value: T} | null {

    if (! Array.isArray(data)) {
        reportError(ErrorTypes.TypeUnmatched, data, ty, {ctx});
        return null;
    }
    if (typeof ty.min === 'number' && data.length < ty.min) {
        reportError(ErrorTypes.RepeatQtyUnmatched, data, ty, {ctx});
        return null;
    }
    if (typeof ty.max === 'number' && data.length > ty.max) {
        reportError(ErrorTypes.RepeatQtyUnmatched, data, ty, {ctx});
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

    if (checkCustomConstraints(data, ty, ctx) === null) {
        reportError(ErrorTypes.ValueUnmatched, data, ty, {ctx});
        return null;
    }

    return {value: retVals as any};
}


function validateSequenceAssertion<T>(
    data: any, ty: SequenceAssertion, ctx: ValidationContext): {value: T} | null {

    if (! Array.isArray(data)) {
        reportError(ErrorTypes.TypeUnmatched, data, ty, {ctx});
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
                    ErrorTypes.RepeatQtyUnmatched, data, [ts, index], {ctx});
            return null;
        }
        if (typeof ts.max === 'number' && spreadLen > ts.max) {
            reportErrorWithPush(ErrorTypes.RepeatQtyUnmatched, data, [ts, index], {ctx});
            return null;
        }
        return ts;
    };

    const checkOptionalQuantity = (ts: OptionalAssertion, index: number) => {
        if (spreadLen === 0) {
            // All subsequent 'optional' assertions should be 'spreadLen === 0'.
            optionalOmitted = true;
        } else if (optionalOmitted) {
            reportErrorWithPush(ErrorTypes.RepeatQtyUnmatched, data, [ts, index], {ctx});
            return null;
        } else if (spreadLen > 1) {
            reportErrorWithPush(ErrorTypes.RepeatQtyUnmatched, data, [ts, index], {ctx});
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
            reportErrorWithPush(ErrorTypes.RepeatQtyUnmatched, data, [ts, dIdx], {ctx});
            return null;
        }
    }

    const ret = data.length === dIdx ? {value: retVals as any} : null;
    if (! ret) {
        reportError(ErrorTypes.SequenceUnmatched, data, ty, {ctx});
    }

    if (ret && checkCustomConstraints(data, ty, ctx) === null) {
        reportError(ErrorTypes.ValueUnmatched, data, ty, {ctx});
        return null;
    }

    return ret;
}


function validateOneOfAssertion<T>(
    data: any, ty: OneOfAssertion, ctx: ValidationContext): {value: T} | null {

    let choosed = false;
    const savedCtxRecordTypeFieldValidated = ctx.recordTypeFieldValidated;
    ctx.recordTypeFieldValidated = false;

    const savedErrLen = ctx.errors.length;
    let count = 0;
    let firstErrLen = savedErrLen;

    for (const tyOne of ty.oneOf) {
        const r = validateRoot<T>(data, tyOne, ctx);
        if (r) {
            // rollback reported errors
            ctx.errors.length = savedErrLen;
            ctx.recordTypeFieldValidated = savedCtxRecordTypeFieldValidated;
            return r;
        }

        if (ctx.recordTypeFieldValidated) {
            if (count !== 0) {
                const e2 = ctx.errors.slice(firstErrLen);
                ctx.errors.length = savedErrLen;
                ctx.errors.push(...e2);
            }
            choosed = true;
            break;
        }

        if (count === 0) {
            firstErrLen = ctx.errors.length;
        } else {
            ctx.errors.length = firstErrLen;
        }
        count++;
    }

    if (! choosed) {
        if (! ctx.checkAll) {
            // rollback reported errors
            ctx.errors.length = savedErrLen;
        }
        reportError(ErrorTypes.TypeUnmatched, data, ty, {ctx});
    }

    ctx.recordTypeFieldValidated = savedCtxRecordTypeFieldValidated;
    return null;
}


function validateEnumAssertion<T>(
    data: any, ty: EnumAssertion, ctx: ValidationContext): {value: T} | null {

    for (const v of ty.values) {
        if (data === v[1]) {
            return ({value: ctx.mapper ? ctx.mapper(data, ty) : data});
        }
    }
    reportError(ErrorTypes.ValueUnmatched, data, ty, {ctx});
    return null;
}


function validateObjectAssertion<T>(
    data: any, ty: ObjectAssertion, ctx: ValidationContext): {value: T} | null {

    let retVal = Array.isArray(data) ? [...data] : {...data};
    const revMembers = ty.members.slice().reverse();
    for (const x of ty.members) {
        if (ty.members.find(m => m[0] === x[0]) !== revMembers.find(m => m[0] === x[0])) {
            reportError(ErrorTypes.InvalidDefinition, data, ty, {ctx});
            throw new ValidationError(
                `Duplicated member is found: ${x[0]} in ${ty.name || '(unnamed)'}`, ty, ctx);
        }
    }

    if (data === null || typeof data !== 'object') {
        reportError(ErrorTypes.TypeUnmatched, data, ty, {ctx});
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
                reportError(ErrorTypes.AdditionalPropUnmatched, data, ty, {
                    ctx,
                    substitutions: [['addtionalProps', '[number]']],
                });
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
                const mt = x[1].kind === 'optional' ?  // TODO: set name at compile time
                    {
                        ...x[1].optional,
                        name: x[0],
                        message: x[1].message,
                        messages: x[1].messages,
                        messageId: x[1].messageId,
                    } : x[1];
                const ret = validateRoot<T>(data[x[0]], mt, ctx);

                if (ret) {
                    if (retVal) {
                        if (isUnsafeVarNames(retVal, x[0])) {
                            continue;
                        }
                        retVal[x[0]] = ret.value;
                        if (mt.isRecordTypeField) {
                            ctx.recordTypeFieldValidated = true;
                        }
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
                    reportErrorWithPush(ErrorTypes.Required, data, [x[1], void 0], {ctx});
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
                    reportError(ErrorTypes.AdditionalPropUnmatched, data, ty, {
                        ctx,
                        substitutions: [['addtionalProps', m]],
                    });
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
                            name: m,
                        } : {
                            ...at,
                            name: m,
                        }, ctx);
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
            reportError(ErrorTypes.AdditionalPropUnmatched, data, ty, {
                ctx,
                substitutions: [['addtionalProps', Array.from(dataMembers.values()).join(', ')]],
            });
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

    if (retVal && checkCustomConstraints(data, ty, ctx) === null) {
        reportError(ErrorTypes.ValueUnmatched, data, ty, {ctx});
        return null;
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
            reportError(ErrorTypes.InvalidDefinition, data, ty, {ctx});
            throw new ValidationError(`Unresolved symbol '${ty.symlinkTargetName}' is appeared.`, ty, ctx);
        case 'operator':
            if (ctx.schema) {
                return validateRoot<T>(data, resolveSymbols(ctx.schema, ty, {nestLevel: 0, symlinkStack: []}), ctx);
            }
            reportError(ErrorTypes.InvalidDefinition, data, ty, {ctx});
            throw new ValidationError(`Unresolved type operator is found: ${ty.operator}`, ty, ctx);
        case 'spread': case 'optional':
            reportError(ErrorTypes.InvalidDefinition, data, ty, {ctx});
            throw new ValidationError(`Unexpected type assertion: ${(ty as any).kind}`, ty, ctx);
        default:
            reportError(ErrorTypes.InvalidDefinition, data, ty, {ctx});
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


export function isType<T>(
    data: any, ty: TypeAssertion, ctx?: Partial<ValidationContext>): data is T {

    return (!! validate<T>(data, ty, ctx));
}


export function getType(schema: TypeAssertionMap, name: string): TypeAssertion {
    if (schema.has(name)) {
        return schema.get(name)?.ty as TypeAssertion;
    }
    throw new Error(`Undefined type name is referred: ${name}`);
}
