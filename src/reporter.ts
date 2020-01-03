// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { ErrorTypes,
         ErrorMessages,
         TypeAssertion,
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
    typeUnmatched: '"%{name}" of "%{parentType}" should be "%{expectedType}".',
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
    ctx.typeStack.slice().reverse().find(x => x.kind === 'object');
    for (let i = ctx.typeStack.length - 1; 0 <= i; i--) {
        switch (ctx.typeStack[i].kind) {
        // TODO: not impl
        case 'object':
        default:
            return ctx.typeStack[i];
        }
    }
    return null;
}

function findTopObjectAssertion(ctx: ValidationContext): ObjectAssertion | null {
    ctx.typeStack.slice().reverse().find(x => x.kind === 'object');
    for (let i = ctx.typeStack.length - 1; 0 <= i; i--) {
        if (ctx.typeStack[i].kind === 'object') {
            return ctx.typeStack[i] as ObjectAssertion;
        }
    }
    return null;
}


export function formatErrorMessage(msg: string, data: any, ty: TypeAssertion, ctx: ValidationContext) {
    let ret = msg;
    // TODO: complex type object members' custom error messages are not displayed?
    // TODO: escapeString() is needed?
    ret = ret.replace(/%{expectedType}/g, escapeString(
        ty.kind === 'primitive' ?
            ty.primitiveName :
            (ty.typeName ? ty.typeName : '?')
        ));
    ret = ret.replace(/%{type}/g, escapeString(
        typeof data));
    ret = ret.replace(/%{expectedValue}/g, escapeString(
        ty.kind === 'primitive-value' ?
            String(ty.value) :
            (ty.kind === 'enum' ? (ty.typeName ? `enum member of ${ty.typeName}` : '?') : '?')));
    ret = ret.replace(/%{value}/g, escapeString(
        String(data)));
    ret = ret.replace(/%{repeatQty}/g, escapeString(
        ty.kind === 'repeated' ? `${
            nvl(ty.min, '')}${
            (ty.min !== null && ty.min !== void 0) ||
            (ty.max !== null && ty.max !== void 0) ? '..' : ''}${
            nvl(ty.max, '')}` : '?'));
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
    ret = ret.replace(/%{name}/g, escapeString(          // TODO: use findTopNamedAssertion()
        ty.name || '?'));
    ret = ret.replace(/%{parentType}/g, escapeString(
        findTopObjectAssertion(ctx)?.typeName || '?'));
    return ret;
}


export function reportError(errType: ErrorTypes, data: any, ty: TypeAssertion, ctx: ValidationContext) {
    const messages: ErrorMessages[] = [];
    if (ty.messages) {
        messages.push(ty.messages);
    }
    messages.push(defaultMessages);

    if (ty.messageId) {
        ctx.errors.push({
            code: `${ty.messageId}-${errorTypeNames[errType]}`,
            message: formatErrorMessage(ty.message ?
                ty.message :
                getErrorMessage(errType, ...messages), data, ty, ctx),
        });
    } else if (ty.message) {
        ctx.errors.push({
            code: `${errorTypeNames[errType]}`,
            message: formatErrorMessage(ty.message, data, ty, ctx),
        });
    } else {
        ctx.errors.push({
            code: `${errorTypeNames[errType]}`,
            message: formatErrorMessage(getErrorMessage(errType, ...messages), data, ty, ctx),
        });
    }
}
