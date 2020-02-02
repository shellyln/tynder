// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { ErrorTypes,
         ErrorMessages,
         TypeAssertionErrorMessageConstraints,
         TypeAssertion,
         RepeatedAssertion,
         SpreadAssertion,
         OptionalAssertion,
         ObjectAssertion,
         ValidationContext } from '../types';
import { escapeString }      from './escape';


export const errorTypeNames = [
    '',
    'InvalidDefinition',
    'Required',
    'TypeUnmatched',
    'RepeatQtyUnmatched',
    'SequenceUnmatched',
    'ValueRangeUnmatched',
    'ValuePatternUnmatched',
    'ValueLengthUnmatched',
    'ValueUnmatched',
];


export const defaultMessages: ErrorMessages = {
    invalidDefinition:     '"%{name}" of "%{parentType}" type definition is invalid.',
    required:              '"%{name}" of "%{parentType}" is required.',
    typeUnmatched:         '"%{name}" of "%{parentType}" should be type "%{expectedType}".',
    repeatQtyUnmatched:    '"%{name}" of "%{parentType}" should repeat %{repeatQty} times.',
    sequenceUnmatched:     '"%{name}" of "%{parentType}" sequence is not matched',
    valueRangeUnmatched:   '"%{name}" of "%{parentType}" value should be in the range %{minValue} to %{maxValue}.',
    valuePatternUnmatched: '"%{name}" of "%{parentType}" value should be matched to pattern "%{pattern}"',
    valueLengthUnmatched:  '"%{name}" of "%{parentType}" length should be in the range %{minLength} to %{maxLength}.',
    valueUnmatched:        '"%{name}" of "%{parentType}" value should be "%{expectedValue}".',
};


function getErrorMessage(errType: ErrorTypes, ...messages: ErrorMessages[]) {
    for (const m of messages) {
        switch (errType) {
        case ErrorTypes.InvalidDefinition:
            if (m.invalidDefinition) {
                return m.invalidDefinition;
            }
            break;
        case ErrorTypes.Required:
            if (m.required) {
                return m.required;
            }
            break;
        case ErrorTypes.TypeUnmatched:
            if (m.typeUnmatched) {
                return m.typeUnmatched;
            }
            break;
        case ErrorTypes.RepeatQtyUnmatched:
            if (m.repeatQtyUnmatched) {
                return m.repeatQtyUnmatched;
            }
            break;
        case ErrorTypes.SequenceUnmatched:
            if (m.sequenceUnmatched) {
                return m.sequenceUnmatched;
            }
            break;
        case ErrorTypes.ValueRangeUnmatched:
            if (m.valueRangeUnmatched) {
                return m.valueRangeUnmatched;
            }
            break;
        case ErrorTypes.ValuePatternUnmatched:
            if (m.valuePatternUnmatched) {
                return m.valuePatternUnmatched;
            }
            break;
        case ErrorTypes.ValueLengthUnmatched:
            if (m.valueLengthUnmatched) {
                return m.valueLengthUnmatched;
            }
            break;
        case ErrorTypes.ValueUnmatched:
            if (m.valueUnmatched) {
                return m.valueUnmatched;
            }
            break;
        }
    }
    return '';
}


function nvl(v: any, alt: any) {
    return (
        v !== null && v !== void 0 ? v : alt
    );
}

function findTopNamedAssertion(ctx: ValidationContext): TypeAssertion | null {
    const ret = ctx.typeStack
        .slice()
        .reverse()
        .map(x => Array.isArray(x) ? x[0] : x)
        .find(x => x.name && x.name !== x.typeName) || null;
    return ret;
}

function findTopObjectAssertion(ctx: ValidationContext): ObjectAssertion | null {
    const ret = ctx.typeStack
        .slice()
        .reverse()
        .map(x => Array.isArray(x) ? x[0] : x)
        .find(x => x.kind === 'object') as ObjectAssertion || null;
    return ret;
}

type TopRepeatable = RepeatedAssertion | SpreadAssertion | OptionalAssertion | null;

function findTopRepeatableAssertion(ctx: ValidationContext): TopRepeatable {

    const ret = ctx.typeStack
        .slice()
        .reverse()
        .map(x => Array.isArray(x) ? x[0] : x)
        .find(x => x.kind === 'repeated' || x.kind === 'spread' || x.kind === 'optional'
                ) as RepeatedAssertion | SpreadAssertion | OptionalAssertion || null;
    return ret;
}

function getExpectedType(ty: TypeAssertion): string {
    switch (ty.kind) {
    case 'repeated':
        return `(repeated ${getExpectedType(ty.repeated)})`;
    case 'spread':
        return getExpectedType(ty.spread);
    case 'sequence':
        return '(sequence)';
    case 'primitive':
        return ty.primitiveName;
    case 'primitive-value':
        return `(value ${
            typeof ty.value === 'string' ?
                `'${String(ty.value)}'` :
                String(ty.value)})`;
    case 'optional':
        return getExpectedType(ty.optional);
    case 'one-of':
        return `(one of ${ty.oneOf.map(x => getExpectedType(x)).join(', ')}`;
    case 'never': case 'any': case 'unknown':
        return ty.kind;
    case 'symlink':
        return ty.symlinkTargetName;
    default:
        return ty.typeName ? ty.typeName : '?';
    }
}


export function formatErrorMessage(
        msg: string, data: any, ty: TypeAssertion,
        ctx: ValidationContext,
        values: {dataPath: string, topRepeatable: TopRepeatable}) {

    let ret = msg;
    // TODO: complex type object members' custom error messages are not displayed?
    // TODO: escapeString() is needed?

    const tr = values.topRepeatable;

    ret = ret.replace(/%{expectedType}/g, escapeString(getExpectedType(ty)));

    ret = ret.replace(/%{type}/g, escapeString(
        typeof data));

    ret = ret.replace(/%{expectedValue}/g, escapeString(
        ty.kind === 'primitive-value' ?
            String(ty.value) :
            ty.kind === 'enum' ?
                ty.typeName ?
                    `enum member of ${ty.typeName}` :
                    '?' :
                '?'));

    ret = ret.replace(/%{value}/g, escapeString(
        String(data)));

    ret = ret.replace(/%{repeatQty}/g, escapeString(
        tr ?
        tr.kind !== 'optional' ? `${
            nvl(tr.min, '')}${
                (tr.min !== null && tr.min !== void 0) ||
                (tr.max !== null && tr.max !== void 0) ? '..' : ''}${
                nvl(tr.max, '')}` :
            '0..1' :
        '?'));

    ret = ret.replace(/%{minValue}/g, escapeString(
        ty.kind === 'primitive' ?
            `${nvl(ty.minValue, nvl(ty.greaterThanValue, '(smallest)'))}` : '?'));

    ret = ret.replace(/%{maxValue}/g, escapeString(
        ty.kind === 'primitive' ?
            `${nvl(ty.maxValue, nvl(ty.lessThanValue, '(biggest)'))}` : '?'));

    ret = ret.replace(/%{pattern}/g, escapeString(
        ty.kind === 'primitive' ?
            `${ty.pattern ? `/${ty.pattern.source}/${ty.pattern.flags}` : '(pattern)'}` : '?'));

    ret = ret.replace(/%{minLength}/g, escapeString(
        ty.kind === 'primitive' ?
            `${nvl(ty.minLength, '0')}` : '?'));

    ret = ret.replace(/%{maxLength}/g, escapeString(
        ty.kind === 'primitive' ?
            `${nvl(ty.maxLength, '(biggest)')}` : '?'));

    ret = ret.replace(/%{name}/g, escapeString(
        `${ty.kind !== 'repeated' && values.dataPath.endsWith('repeated)') ?
            'repeated item of ' :
            ty.kind !== 'sequence' && values.dataPath.endsWith('sequence)') ?
                'sequence item of ' : ''}${
        (ty.name && ty.name !== ty.typeName ? ty.name : null) ||
            findTopNamedAssertion(ctx)?.name || '?'}`));

    ret = ret.replace(/%{parentType}/g, escapeString(
        findTopObjectAssertion(ctx)?.typeName || ty.typeName || '?'));

    ret = ret.replace(/%{dataPath}/g, values.dataPath);

    return ret;
}


export function reportError(errType: ErrorTypes, data: any, ty: TypeAssertion, ctx: ValidationContext) {
    const messages: ErrorMessages[] = [];
    if (ty.messages) {
        messages.push(ty.messages);
    }
    if (ctx.errorMessages) {
        messages.push(ctx.errorMessages);
    }
    messages.push(defaultMessages);

    const dataPathArray: string[] = [];
    for (let i = 0; i < ctx.typeStack.length; i++) {
        const p = ctx.typeStack[i];
        const next = ctx.typeStack[i + 1];
        const pt = Array.isArray(p) ? p[0] : p;
        const pi = Array.isArray(next) ? next[1] : void 0;

        let isSet = false;
        if (pt.kind === 'repeated') {
            if (i !== ctx.typeStack.length - 1) {
                if (pt.name) {
                    dataPathArray.push(`${pt.name}.(${pi !== void 0 ? `${pi}:` : ''}repeated)`);
                } else {
                    dataPathArray.push(`(repeated)`);
                }
                isSet = true;
            }
        } else if (pt.kind === 'sequence') {
            if (i !== ctx.typeStack.length - 1) {
                if (pt.name) {
                    dataPathArray.push(`${pt.name}.(${pi !== void 0 ? `${pi}:` : ''}sequence)`);
                } else {
                    dataPathArray.push(`(sequence)`);
                }
                isSet = true;
            }
        }
        if (! isSet) {
            if (pt.name) {
                dataPathArray.push(`${pt.name}`);
            } else if (pt.typeName) {
                dataPathArray.push(`${pt.typeName}`);
            }
        }
    }
    const dataPath = dataPathArray.join('.');

    const topRepeatable: TopRepeatable = findTopRepeatableAssertion(ctx);
    const values = {dataPath, topRepeatable};

    const constraints: TypeAssertionErrorMessageConstraints = {};
    const cSrces: TypeAssertionErrorMessageConstraints[] = [ty as any];
    if (errType === ErrorTypes.RepeatQtyUnmatched && topRepeatable) {
        cSrces.unshift(topRepeatable as any);
    }
    for (const cSrc of cSrces) {
        if (nvl(cSrc.minValue, false)) {
            constraints.minValue = cSrc.minValue;
        }
        if (nvl(cSrc.maxValue, false)) {
            constraints.maxValue = cSrc.maxValue;
        }
        if (nvl(cSrc.greaterThanValue, false)) {
            constraints.greaterThanValue = cSrc.greaterThanValue;
        }
        if (nvl(cSrc.lessThanValue, false)) {
            constraints.lessThanValue = cSrc.lessThanValue;
        }
        if (nvl(cSrc.minLength, false)) {
            constraints.minLength = cSrc.minLength;
        }
        if (nvl(cSrc.maxLength, false)) {
            constraints.maxLength = cSrc.maxLength;
        }
        if (nvl(cSrc.pattern, false)) {
            const pat = cSrc.pattern as any as RegExp;
            constraints.pattern = `/${pat.source}/${pat.flags}`;
        }
        if (nvl(cSrc.min, false)) {
            constraints.min = cSrc.min;
        }
        if (nvl(cSrc.max, false)) {
            constraints.max = cSrc.max;
        }
    }

    const val: {value?: any} = {};
    switch (typeof data) {
    case 'number': case 'bigint': case 'string': case 'boolean': case 'undefined':
        val.value = data;
        break;
    case 'object':
        if (data === null) {
            val.value = data;
        }
    }

    if (ty.messageId) {
        ctx.errors.push({
            code: `${ty.messageId}-${errorTypeNames[errType]}`,
            message: formatErrorMessage(ty.message ?
                ty.message :
                getErrorMessage(errType, ...messages), data, ty, ctx, values),
            dataPath,
            constraints,
            ...val,
        });
    } else if (ty.message) {
        ctx.errors.push({
            code: `${errorTypeNames[errType]}`,
            message: formatErrorMessage(ty.message, data, ty, ctx, values),
            dataPath,
            constraints,
            ...val,
        });
    } else {
        ctx.errors.push({
            code: `${errorTypeNames[errType]}`,
            message: formatErrorMessage(getErrorMessage(errType, ...messages), data, ty, ctx, values),
            dataPath,
            constraints,
            ...val,
        });
    }
}


export function reportErrorWithPush(
        errType: ErrorTypes, data: any,
        tyidx: [TypeAssertion, number | string | undefined], ctx: ValidationContext) {

    try {
        ctx.typeStack.push(tyidx);
        reportError(errType, data, tyidx[0], ctx);
    } finally {
        ctx.typeStack.pop();
    }
}
