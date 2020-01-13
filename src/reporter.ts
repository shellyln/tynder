// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { ErrorTypes,
         ErrorMessages,
         TypeAssertion,
         RepeatedAssertion,
         SpreadAssertion,
         OptionalAssertion,
         ObjectAssertion,
         ValidationContext } from './types';
import { escapeString }      from './lib/escape';


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
    invalidDefinition: '"%{name}" of "%{parentType}" type definition is invalid.',
    required: '"%{name}" of "%{parentType}" is required.',
    typeUnmatched: '"%{name}" of "%{parentType}" should be type "%{expectedType}".',
    repeatQtyUnmatched: '"%{name}" of "%{parentType}" should repeat %{repeatQty} times.',
    sequenceUnmatched: '"%{name}" of "%{parentType}" sequence is not matched',
    valueRangeUnmatched: '"%{name}" of "%{parentType}" value should be in the range %{minValue} to %{maxValue}.',
    valuePatternUnmatched: '%{name}" of "%{parentType}" value should be matched to pattern "%{pattern}"',
    valueLengthUnmatched: '"%{name}" of "%{parentType}" length should be in the range %{minLength} to %{maxLength}.',
    valueUnmatched: '"%{name}" of "%{parentType}" value should be "%{expectedValue}".',
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

function findTopRepeatableAssertion(ctx: ValidationContext):
        RepeatedAssertion | SpreadAssertion | OptionalAssertion | null {

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
        return getExpectedType(ty.repeated);
    case 'spread':
        return getExpectedType(ty.spread);
    case 'sequence':
        return '(sequence)';
    case 'primitive':
        return ty.primitiveName;
    default:
        return ty.typeName ? ty.typeName : '?';
    }
}


export function formatErrorMessage(msg: string, data: any, ty: TypeAssertion, ctx: ValidationContext, dataPath: string) {
    let ret = msg;
    // TODO: complex type object members' custom error messages are not displayed?
    // TODO: escapeString() is needed?

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

    const topRep = findTopRepeatableAssertion(ctx);
    ret = ret.replace(/%{repeatQty}/g, escapeString(
        topRep ?
        topRep.kind !== 'optional' ? `${
            nvl(topRep.min, '')}${
                (topRep.min !== null && topRep.min !== void 0) ||
                (topRep.max !== null && topRep.max !== void 0) ? '..' : ''}${
                nvl(topRep.max, '')}` :
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
            `${ty.pattern ? String(ty.pattern) : '(pattern)'}` : '?'));

    ret = ret.replace(/%{minLength}/g, escapeString(
        ty.kind === 'primitive' ?
            `${nvl(ty.minLength, '0')}` : '?'));

    ret = ret.replace(/%{maxLength}/g, escapeString(
        ty.kind === 'primitive' ?
            `${nvl(ty.maxLength, '(biggest)')}` : '?'));

    ret = ret.replace(/%{name}/g, escapeString(
        `${dataPath.endsWith('repeated)') ?
            'repeated item of ' :
            dataPath.endsWith('sequence)') ?
                'sequence item of ' : ''}${
        (ty.name && ty.name !== ty.typeName ? ty.name : null) ||
            findTopNamedAssertion(ctx)?.name || '?'}`));

    ret = ret.replace(/%{parentType}/g, escapeString(
        findTopObjectAssertion(ctx)?.typeName || '?'));

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

        if (pt.kind === 'repeated') {
            if (pt.name) {
                dataPathArray.push(`${pt.name}.(${pi !== void 0 ? `${pi}:` : ''}repeated)`);
            } else {
                dataPathArray.push(`(repeated)`);
            }
        } else if (pt.kind === 'sequence') {
            if (pt.name) {
                dataPathArray.push(`${pt.name}.(${pi !== void 0 ? `${pi}:` : ''}sequence)`);
            } else {
                dataPathArray.push(`(sequence)`);
            }
        } else {
            if (pt.name) {
                dataPathArray.push(`${pt.name}`);
            } else if (pt.typeName) {
                dataPathArray.push(`${pt.typeName}`);
            }
        }
    }
    const dataPath = dataPathArray.join('.');

    if (ty.messageId) {
        ctx.errors.push({
            code: `${ty.messageId}-${errorTypeNames[errType]}`,
            message: formatErrorMessage(ty.message ?
                ty.message :
                getErrorMessage(errType, ...messages), data, ty, ctx, dataPath),
            dataPath,
        });
    } else if (ty.message) {
        ctx.errors.push({
            code: `${errorTypeNames[errType]}`,
            message: formatErrorMessage(ty.message, data, ty, ctx, dataPath),
            dataPath,
        });
    } else {
        ctx.errors.push({
            code: `${errorTypeNames[errType]}`,
            message: formatErrorMessage(getErrorMessage(errType, ...messages), data, ty, ctx, dataPath),
            dataPath,
        });
    }
}
