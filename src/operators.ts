// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { NeverTypeAssertion,
         AnyTypeAssertion,
         UnknownTypeAssertion,
         PrimitiveValueTypes,
         PrimitiveValueTypeNames,
         OptionalPrimitiveValueTypeNames,
         PlaceholderTypeNames,
         OptionalPlaceholderTypeNames,
         ErrorMessages,
         PrimitiveTypeAssertion,
         PrimitiveValueTypeAssertion,
         RepeatedAssertion,
         SpreadAssertion,
         SequenceAssertion,
         OneOfAssertion,
         OptionalAssertion,
         ObjectAssertion,
         TypeAssertion } from './types';



// emulate Pick<T>
export function picked(ty: TypeAssertion, ...names: string[]): ObjectAssertion {
    switch (ty.kind) {
    case 'object':
        {
            const members: Array<[string, TypeAssertion]> = [];
            for (const name of names) {
                const member = ty.members.find(x => x[0] === name);
                if (member) {
                    members.push(member);
                }
            }
            return ({
                kind: 'object',
                members,
            });
        }
    default:
        return ({
            kind: 'object',
            members: [],
        });
    }
}


// emulate Partial<T>
export function partial(ty: TypeAssertion): TypeAssertion {
    switch (ty.kind) {
    case 'object':
        {
            return ({
                kind: 'object',
                members: ty.members.map(
                    x => x[1].kind === 'optional' ?
                    x :
                    [x[0], optional(x[1])]),
            });
        }
    default:
        return ty;
    }
}


// intersection (a & b)
export function intersect(...types: TypeAssertion[]): TypeAssertion {
    if (types.length === 0) {
        throw new Error(`Empty intersection type is not allowed.`);
    }
    const ret: ObjectAssertion = {
        kind: 'object',
        members: [],
    };
    let lastTy: TypeAssertion | null = null;
    const members = new Map<string, TypeAssertion>();

    for (const ty of types) {
        if (ty && typeof ty === 'object') {
            if (lastTy && lastTy.kind !== ty.kind) {
                return ({
                    kind: 'never',
                });
            }
            lastTy = ty;
            if (ty.kind === 'object') {
                for (const m of ty.members) {
                    members.set(m[0], m[1]); // Overwrite if exists
                }
            }
        } else {
            return ({
                kind: 'never',
            });
        }
    }
    if (lastTy && lastTy.kind !== 'object') {
        return lastTy;
    } else {
        return ret;
    }
}


// union (a | b)
export function oneOf(...types: Array<PrimitiveValueTypes | TypeAssertion>): TypeAssertion {
    if (types.length === 0) {
        throw new Error(`Empty union type is not allowed.`);
    }
    if (types.length === 1) {
        const ty = types[0];
        if (ty && typeof ty === 'object') {
            return ty;
        } else {
            return primitiveValue(ty);
        }
    }
    const ret: OneOfAssertion = {
        kind: 'one-of',
        oneOf: [],
    };
    for (const ty of types) {
        // TODO: remove same type
        if (ty && typeof ty === 'object') {
            if (ty.kind === 'one-of') {
                ret.oneOf = ret.oneOf.concat(ty.oneOf);
            } else {
                ret.oneOf.push(ty);
            }
        } else {
            ret.oneOf.push(primitiveValue(ty));
        }
    }
    return ret;
}


// subtraction (a - b)
export function subtract(...types: TypeAssertion[]): ObjectAssertion {
    if (types.length === 0) {
        throw new Error(`Empty subtraction type is not allowed.`);
    }
    // TODO: not impl
    const ret: ObjectAssertion = {
        kind: 'object',
        members: [],
    };
    return ret;
}


export function primitive(typeName: PrimitiveValueTypeNames |
                                    OptionalPrimitiveValueTypeNames |
                                    PlaceholderTypeNames |
                                    OptionalPlaceholderTypeNames):
        PrimitiveTypeAssertion | OptionalAssertion | NeverTypeAssertion | AnyTypeAssertion | UnknownTypeAssertion {
    switch (typeName) {
    case 'never':
        return ({
            kind: 'never',
        });
    case 'any':
        return ({
            kind: 'any',
        });
    case 'unknown':
        return ({
            kind: 'unknown',
        });
    case 'number':
        // FALL_THRU
    case 'bigint':
        // FALL_THRU
    case 'string':
        // FALL_THRU
    case 'boolean':
        // FALL_THRU
    case 'null':
        // FALL_THRU
    case 'undefined':
        return ({
            kind: 'primitive',
            primitiveName: typeName,
        });
    case 'never?':
        return (optional({
            kind: 'never',
        }));
    case 'any?':
        return (optional({
            kind: 'any',
        }));
    case 'unknown?':
        return (optional({
            kind: 'unknown',
        }));
    case 'number?':
        // FALL_THRU
    case 'bigint?':
        // FALL_THRU
    case 'string?':
        // FALL_THRU
    case 'boolean?':
        // FALL_THRU
    case 'null?':
        // FALL_THRU
    case 'undefined?':
        return (optional({
            kind: 'primitive',
            primitiveName: typeName.substring(0, typeName.length - 1) as any,
        }));
    default:
        throw new Error(`Unknown primitive type assertion: ${typeName}`);
    }
}


// TODO: range, minValue, maxValue, greaterThan, lessThan, minLength, maxLength, match, msg, msgId


export function regexpPatternStringType(pattern: RegExp): PrimitiveTypeAssertion {
    return ({
        kind: 'primitive',
        primitiveName: 'string',
        pattern,
    });
}


export function primitiveValue(value: PrimitiveValueTypes): PrimitiveValueTypeAssertion {
    if (value === null || value === void 0) {
        return ({
            kind: 'primitive-value',
            value,
        });
    } else switch (typeof value) {
    case 'number':
        // FALL_THRU
    case 'bigint':
        // FALL_THRU
    case 'string':
        // FALL_THRU
    case 'boolean':
        return ({
            kind: 'primitive-value',
            value,
        });
    default:
        throw new Error(`Unknown primitive value assertion: ${value}`);
    }
}


export function optional(ty: PrimitiveValueTypes | TypeAssertion): OptionalAssertion {
    if (ty && typeof ty === 'object' && ty.kind) {
        if (ty.kind === 'optional') {
            return ty;
        } else {
            return ({
                kind: 'optional',
                optional: ty,
            });
        }
    } else {
        return ({
            kind: 'optional',
            optional: primitiveValue(ty),
        });
    }
}


export function repeated(
        ty: PrimitiveValueTypeNames | TypeAssertion, option?:
        Partial<Pick<RepeatedAssertion, 'max'> & Pick<RepeatedAssertion, 'min'>>): RepeatedAssertion {
    if (ty && typeof ty === 'object' && ty.kind) {
        return ({
            kind: 'repeated',
            min: option && typeof option.min === 'number' ? option.min : null,
            max: option && typeof option.max === 'number' ? option.max : null,
            repeated: ty,
        });
    } else {
        return ({
            kind: 'repeated',
            min: option && typeof option.min === 'number' ? option.min : null,
            max: option && typeof option.max === 'number' ? option.max : null,
            repeated: primitive(ty),
        });
    }
}


export function sequenceOf(...seq: Array<PrimitiveValueTypes | TypeAssertion>): SequenceAssertion {
    return ({
        kind: 'sequence',
        sequence: seq.map(ty => ty && typeof ty === 'object' && ty.kind ? ty : primitiveValue(ty)),
    });
}


export function spread(
        ty: PrimitiveValueTypes | TypeAssertion,
        option?: Partial<Pick<SpreadAssertion, 'max'> & Pick<SpreadAssertion, 'min'>>): SpreadAssertion {
    if (ty && typeof ty === 'object' && ty.kind) {
        return ({
            kind: 'spread',
            min: option && typeof option.min === 'number' ? option.min : null,
            max: option && typeof option.max === 'number' ? option.max : null,
            spread: ty,
        });
    } else {
        return ({
            kind: 'spread',
            min: option && typeof option.min === 'number' ? option.min : null,
            max: option && typeof option.max === 'number' ? option.max : null,
            spread: primitiveValue(ty),
        });
    }
}


export function objectType(
        ...members: Array<[string, PrimitiveValueTypes | TypeAssertion]>): ObjectAssertion {
    return ({
        kind: 'object',
        members: members.map(
            x => x[1] && typeof x[1] === 'object' && x[1].kind ?
                [x[0], x[1]] :
                [x[0], primitiveValue(x[1])]),
    });
}


export function derived(ty: ObjectAssertion, ...exts: TypeAssertion[]): ObjectAssertion {
    const ret: ObjectAssertion = {
        kind: 'object',
        members: [],
    };
    for (const ext of exts.slice()) {
        if (ext.kind === 'object') {
            for (const m of ext.members) {
                if (! ret.members.find(x => x[0] === m[0])) {
                    ret.members.push(m);
                }
            }
        }
    }
    ret.members = ret.members.concat(ty.members.slice());
    return ret;
}


export function msg<T extends TypeAssertion>(messages: string | ErrorMessages, ty: T): T {
    if (typeof messages === 'string') {
        return Object.assign({}, ty, { message: messages });
    } else {
        return Object.assign({}, ty, { messages });
    }
}


export function msgId<T extends TypeAssertion>(messageId: string, ty: T): T {
    return Object.assign({}, ty, { messageId });
}
