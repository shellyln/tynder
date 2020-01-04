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
         EnumAssertion,
         ObjectAssertionMember,
         ObjectAssertion,
         AssertionSymlink,
         TypeAssertion } from './types';



// emulate Pick<T> // ex. Pick<Foo, 'a' | 'b'>
export function picked(ty: TypeAssertion, ...names: string[]): ObjectAssertion {
    switch (ty.kind) {
    case 'object':
        {
            const members: ObjectAssertionMember[] = [];
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


// emulate Omit<T> // ex. Omit<Foo, 'a' | 'b'>
export function omit(ty: TypeAssertion, ...names: string[]): ObjectAssertion {
    switch (ty.kind) {
    case 'object':
        {
            const members: ObjectAssertionMember[] = [];
            for (const member of ty.members) {
                if (! names.find(name => member[0] === name)) {
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
    let ret = types[0];
    if (!ret || typeof ret !== 'object' || ret.kind !== 'object') {
        throw new Error(`First parameter of subtraction type should be 'object'.`);
    }
    for (const ty of types.slice(1)) {
        if (ty && typeof ty === 'object' && ty.kind === 'object') {
            ret = omit(ret, ...ty.members.map(m => m[0]));
        }
    }
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
                ...(ty.typeName ? {typeName: ty.typeName} : {}),
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


function checkRecursiveMembers(ty: ObjectAssertion, target: TypeAssertion): boolean {
    if (ty === target) {
        return false;
    }
    switch (target.kind) {
    case 'object':
        return (
            target.members
                .map(x => checkRecursiveMembers(ty, x[1]))
                .reduce((a, b) => a && b)
        );
    case 'repeated':
        return checkRecursiveMembers(ty, target.repeated);
    case 'spread':
        return checkRecursiveMembers(ty, target.spread);
    case 'sequence':
        return (
            target.sequence
                .map(x => checkRecursiveMembers(ty, x))
                .reduce((a, b) => a && b)
        );
    case 'one-of':
        return (
            target.oneOf
                .map(x => checkRecursiveMembers(ty, x))
                .reduce((a, b) => a && b)
        );
    case 'optional':
        return checkRecursiveMembers(ty, target.optional);
    default:
        return true;
    }
}


export function enumType(...values: Array<[string, number | string | null, string?]>): EnumAssertion {
    const ar = values.slice();
    let value = 0;
    for (let i = 0; i < ar.length; i++) {
        if (ar[i][1] === null || ar[i][1] === void 0) {
            ar[i][1] = value++;
        } else if (typeof ar[i][1] === 'number') {
            value = (ar[i][1] as number) + 1;
        }
    }
    return ({
        kind: 'enum',
        values: ar as Array<[string, number | string, string?]>,
    });
}


export function objectType(
        ...members: Array<[string, PrimitiveValueTypes | TypeAssertion]>): ObjectAssertion {
    // TODO: Check for recursive type.
    const revMembers = members.slice().reverse();
    for (const x of members) {
        if (members.find(m => m[0] === x[0]) !== revMembers.find(m => m[0] === x[0])) {
            throw new Error(`Duplicated member is found: ${x[0]}`);
        }
    }
    return ({
        kind: 'object',
        members: members.map(
            x => x[1] && typeof x[1] === 'object' && x[1].kind ?
                [x[0], withName(x[1], x[0])] :
                [x[0], withName(primitiveValue(x[1]), x[0])]),
    });
}


function checkRecursiveExtends(ty: ObjectAssertion, base: ObjectAssertion): boolean {
    if (ty === base) {
        return false;
    }
    if (base.baseTypes) {
        for (const z of base.baseTypes) {
            if (! checkRecursiveExtends(ty, z)) {
                return false;
            }
        }
    }
    return true;
}


export function derived(ty: ObjectAssertion, ...exts: TypeAssertion[]): ObjectAssertion {
    const ret: ObjectAssertion = {
        kind: 'object',
        members: [],
        baseTypes: [],
    };

    for (const ext of exts.slice()) {
        if (ext.kind === 'object') {
            if (! checkRecursiveExtends(ty, ext)) {
                throw new Error(`Recursive extend is found: ${ty.name || '(unnamed)'}`);
            }
            for (const m of ext.members) {
                if (! ret.members.find(x => x[0] === m[0])) {
                    // TODO: Check for recursive type.
                    if (! checkRecursiveMembers(ty, m[1])) {
                        throw new Error(`Recursive member type is found: ${
                            m[1].name || '(unnamed)'} of ${ty.name || '(unnamed)'}`);
                    }
                    ret.members.push([m[0], m[1], true]);
                }
                // TODO: Check for different types with the same name.
            }
            (ret.baseTypes as ObjectAssertion[]).push(ext);
        }
    }
    ret.members = ret.members.concat(ty.members.slice());
    if ((ret.baseTypes as ObjectAssertion[]).length === 0) {
        delete ret.baseTypes;
    }

    const revMembers = ret.members.slice().reverse();
    for (const x of ret.members) {
        if (ret.members.find(m => m[0] === x[0]) !== revMembers.find(m => m[0] === x[0])) {
            throw new Error(`Duplicated member is found: ${x[0]} in ${ty.name || '(unnamed)'}`);
        }
    }

    return ret;
}


export function symlinkType(name: string): AssertionSymlink {
    return ({
        kind: 'symlink',
        symlinkTargetName: name,
    });
}


export function withName(ty: TypeAssertion, name: string) {
    if (! name) {
        return ty;
    }
    return ({...ty, name});
}


export function withTypeName(ty: TypeAssertion, typeName: string) {
    if (! typeName) {
        return ty;
    }
    return ({...ty, typeName});
}


export function withDocComment(ty: TypeAssertion, docComment: string) {
    if (! docComment) {
        return ty;
    }
    return ({...ty, docComment});
}


export function withRange(minValue: number | string, maxValue: number | string) {
    return (ty: PrimitiveTypeAssertion) => {
        if (typeof minValue !== 'number' && typeof minValue !== 'string') {
            throw new Error(`Decorator '@range' parameter 'minValue' should be number or string.`);
        }
        if (typeof maxValue !== 'number' && typeof maxValue !== 'string') {
            throw new Error(`Decorator '@range' parameter 'maxValue' should be number or string.`);
        }
        if (!ty || ty.kind !== 'primitive') {
            throw new Error(`Decorator '@range' cannot be applied to anything other than 'primitive'.`);
        }
        return ({...ty, minValue, maxValue});
    };
}


export function withMinValue(minValue: number | string) {
    return (ty: PrimitiveTypeAssertion) => {
        if (typeof minValue !== 'number' && typeof minValue !== 'string') {
            throw new Error(`Decorator '@minValue' parameter 'minValue' should be number or string.`);
        }
        if (!ty || ty.kind !== 'primitive') {
            throw new Error(`Decorator '@minValue' cannot be applied to anything other than 'primitive'.`);
        }
        return ({...ty, minValue});
    };
}


export function withMaxValue(maxValue: number | string) {
    return (ty: PrimitiveTypeAssertion) => {
        if (typeof maxValue !== 'number' && typeof maxValue !== 'string') {
            throw new Error(`Decorator '@maxValue' parameter 'maxValue' should be number or string.`);
        }
        if (!ty || ty.kind !== 'primitive') {
            throw new Error(`Decorator '@maxValue' cannot be applied to anything other than 'primitive'.`);
        }
        return ({...ty, maxValue});
    };
}


export function withGreaterThan(greaterThan: number | string) {
    return (ty: PrimitiveTypeAssertion) => {
        if (typeof greaterThan !== 'number' && typeof greaterThan !== 'string') {
            throw new Error(`Decorator '@greaterThan' parameter 'greaterThan' should be number or string.`);
        }
        if (!ty || ty.kind !== 'primitive') {
            throw new Error(`Decorator '@greaterThan' cannot be applied to anything other than 'primitive'.`);
        }
        return ({...ty, greaterThan});
    };
}


export function withLessThan(lessThan: number | string) {
    return (ty: PrimitiveTypeAssertion) => {
        if (typeof lessThan !== 'number' && typeof lessThan !== 'string') {
            throw new Error(`Decorator '@lessThan' parameter 'lessThan' should be number or string.`);
        }
        if (!ty || ty.kind !== 'primitive') {
            throw new Error(`Decorator '@lessThan' cannot be applied to anything other than 'primitive'.`);
        }
        return ({...ty, lessThan});
    };
}


export function withMinLength(minLength: number) {
    return (ty: PrimitiveTypeAssertion) => {
        if (typeof minLength !== 'number') {
            throw new Error(`Decorator '@minLength' parameter 'minLength' should be number.`);
        }
        if (!ty || ty.kind !== 'primitive') {
            throw new Error(`Decorator '@minLength' cannot be applied to anything other than 'primitive'.`);
        }
        return ({...ty, minLength});
    };
}


export function withMaxLength(maxLength: number) {
    return (ty: PrimitiveTypeAssertion) => {
        if (typeof maxLength !== 'number') {
            throw new Error(`Decorator '@maxLength' parameter 'maxLength' should be number.`);
        }
        if (!ty || ty.kind !== 'primitive') {
            throw new Error(`Decorator '@maxLength' cannot be applied to anything other than 'primitive'.`);
        }
        return ({...ty, maxLength});
    };
}


export function withMatch(pattern: RegExp) {
    return (ty: PrimitiveTypeAssertion) => {
        if (typeof pattern !== 'object') {
            throw new Error(`Decorator '@match' parameter 'pattern' should be RegExp.`);
        }
        if (!ty || ty.kind !== 'primitive' || ty.primitiveName !== 'string') {
            throw new Error(`Decorator '@match' cannot be applied to anything other than 'primitive'.`);
        }
        return ({...ty, pattern});
    };
}


export function withMsg<T extends TypeAssertion>(messages: string | ErrorMessages) {
    return (ty: T) => {
        if (typeof messages === 'string') {
            return Object.assign({}, ty, { message: messages });
        } else {
            return Object.assign({}, ty, { messages });
        }
    };
}


export function withMsgId<T extends TypeAssertion>(messageId: string) {
    return (ty: T) => {
        return Object.assign({}, ty, { messageId });
    };
}
