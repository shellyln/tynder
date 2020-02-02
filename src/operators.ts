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
         AdditionalPropsKey,
         AdditionalPropsMember,
         ObjectAssertion,
         AssertionSymlink,
         AssertionOperator,
         TypeAssertion }    from './types';
import { dummyTargetObject,
         isUnsafeVarNames } from './lib/util';



// emulate Pick<T> // ex. Pick<Foo, 'a' | 'b'>
export function picked(ty: TypeAssertion, ...names: string[]): ObjectAssertion | AssertionOperator {
    switch (ty.kind) {
    case 'object':
        {
            const members: ObjectAssertionMember[] = [];
            for (const name of names) {
                const member = ty.members.find(x => x[0] === name);
                if (member) {
                    if (member[2]) {
                        const m2: ObjectAssertionMember = [...member] as any;
                        if (3 < m2.length) {
                            m2[2] = false;
                        } else {
                            m2.length = 2;
                        }
                        members.push(m2);
                    } else {
                        members.push(member);
                    }
                }
            }
            return ({
                kind: 'object',
                members,
            });
        }
    case 'symlink': case 'operator':
        {
            return ({
                kind: 'operator',
                operator: 'picked',
                operands: [ty, ...names],
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
export function omit(ty: TypeAssertion, ...names: string[]): ObjectAssertion | AssertionOperator {
    switch (ty.kind) {
    case 'object':
        {
            const members: ObjectAssertionMember[] = [];
            for (const member of ty.members) {
                if (! names.find(name => member[0] === name)) {
                    if (member[2]) {
                        const m2: ObjectAssertionMember = [...member] as any;
                        if (3 < m2.length) {
                            m2[2] = false;
                        } else {
                            m2.length = 2;
                        }
                        members.push(m2);
                    } else {
                        members.push(member);
                    }
                }
            }
            return ({
                kind: 'object',
                members,
            });
        }
    case 'symlink': case 'operator':
        {
            return ({
                kind: 'operator',
                operator: 'omit',
                operands: [ty, ...names],
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
            const members: ObjectAssertionMember[] = [];
            for (const member of ty.members) {
                let m: ObjectAssertionMember = member[1].kind === 'optional' ?
                    member :
                    [member[0], optional(member[1]), ...member.slice(2)] as ObjectAssertionMember;
                if (m[2]) {
                    m = [...m] as any;
                    if (3 < m.length) {
                        m[2] = false;
                    } else {
                        m.length = 2;
                    }
                }
                m[1].name = m[0];
                const optTy = {...(m[1] as OptionalAssertion).optional};
                (m[1] as OptionalAssertion).optional = optTy;
                if (optTy.name && optTy.name !== optTy.typeName) {
                    delete optTy.name;
                }
                if (!optTy.name && optTy.typeName) {
                    optTy.name = optTy.typeName;
                }
                members.push(m);
            }
            return ({
                kind: 'object',
                members,
            });
        }
    case 'symlink': case 'operator':
        {
            return ({
                kind: 'operator',
                operator: 'partial',
                operands: [ty],
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
    if (0 < types.filter(x => x && typeof x === 'object' &&
            (x.kind === 'symlink' || x.kind === 'operator')).length) {
        return ({
            kind: 'operator',
            operator: 'intersect',
            operands: types.slice(),
        });
    }
    let lastTy: TypeAssertion | null = null;
    const members = new Map<string, ObjectAssertionMember>();

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
                    if (m[2]) {
                        const m2: ObjectAssertionMember = [...m] as any;
                        if (3 < m2.length) {
                            m2[2] = false;
                        } else {
                            m2.length = 2;
                        }
                        members.set(m[0], m2); // Overwrite if exists
                    } else {
                        members.set(m[0], m);  // Overwrite if exists
                    }
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
        return ({
            kind: 'object',
            members: Array.from(members.values()),
        });
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
export function subtract(...types: TypeAssertion[]): ObjectAssertion | AssertionOperator {
    if (types.length === 0) {
        throw new Error(`Empty subtraction type is not allowed.`);
    }
    if (0 < types.filter(x => x && typeof x === 'object' &&
            (x.kind === 'symlink' || x.kind === 'operator')).length) {
        return ({
            kind: 'operator',
            operator: 'subtract',
            operands: types.slice(),
        });
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
    case 'integer':
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
    case 'integer?':
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
    // TODO: Function, DateStr, DateTimeStr, Funtion?, DateStr?, DateTimeStr?
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


export function enumType(...values: Array<[string, number | string | null, string?]>): EnumAssertion {
    const ar = values.slice();
    let value = 0;
    for (let i = 0; i < ar.length; i++) {
        if (isUnsafeVarNames(dummyTargetObject, ar[i][0])) {
            throw new Error(`Unsafe symbol name is appeared in enum assertion: ${ar[i][0]}`);
        }

        if (ar[i][1] === null || ar[i][1] === void 0) {
            ar[i][1] = value++;
        } else if (typeof ar[i][1] === 'number') {
            value = (ar[i][1] as number) + 1;
        }
        if (! ar[i][2]) {
            ar[i].length = 2;
        }
    }
    return ({
        kind: 'enum',
        values: ar as Array<[string, number | string, string?]>,
    });
}


export function objectType(
        ...members: Array<[
            string | AdditionalPropsKey,
            PrimitiveValueTypes | TypeAssertion,
            string?
        ]>): ObjectAssertion {
    const revMembers = members.slice().reverse();
    for (const x of members) {
        if (typeof x[0] === 'string') {
            if (isUnsafeVarNames(dummyTargetObject, x[0])) {
                throw new Error(`Unsafe symbol name is appeared in object assertion: ${x[0]}`);
            }
            if (members.find(m => m[0] === x[0]) !== revMembers.find(m => m[0] === x[0])) {
                throw new Error(`Duplicated member is found: ${x[0]}`);
            }
        }
    }

    const membersProps: ObjectAssertionMember[] = (members
        .filter(
            x => typeof x[0] === 'string') as
                Array<[string, PrimitiveValueTypes | TypeAssertion, string?]>)
        .map(
            x => x[1] && typeof x[1] === 'object' && x[1].kind ?
                [x[0], withName(x[1], x[0]), x[2]] :
                [x[0], withName(primitiveValue(x[1]), x[0]), x[2]])
        .map(
            x => (x[2] ?
                [x[0], x[1], false, ...x.slice(2)] :
                [x[0], x[1]]) as ObjectAssertionMember);

    const additionalProps: AdditionalPropsMember[] = (members
        .filter(x => typeof x[0] !== 'string') as Array<[
            AdditionalPropsKey,
            PrimitiveValueTypes | TypeAssertion,
            string?
        ]>)
        .map(x => x[1] && typeof x[1] === 'object' && x[1].kind ?
            x :
            [x[0], primitiveValue(x[1]), x[2]])
        .map(
            x => (x[2] ?
                [x[0], x[1], false, ...x.slice(2)] :
                [x[0], x[1]]) as AdditionalPropsMember);

    return ({
        ...{
            kind: 'object',
            members: membersProps,
        },
        ...(0 < additionalProps.length ? {
            additionalProps,
        } : {}),
    });
}


function checkRecursiveExtends(ty: ObjectAssertion, base: ObjectAssertion | AssertionSymlink): boolean {
    if (ty === base) {
        return false;
    }
    if (ty.typeName &&
        (ty.typeName === base.typeName ||
         (base.kind === 'symlink' && ty.typeName === base.symlinkTargetName))) {
        return false;
    }
    if (base.kind === 'object' && base.baseTypes) {
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

    for (const ext of exts) {
        switch (ext.kind) {
        case 'object':
            if (! checkRecursiveExtends(ty, ext)) {
                throw new Error(`Recursive extend is found: ${ty.name || '(unnamed)'}`);
            }
            for (const m of ext.members) {
                if (! ret.members.find(x => x[0] === m[0])) {
                    ret.members.push([m[0], m[1], true, ...m.slice(3)] as ObjectAssertionMember);
                }
                // TODO: Check for different types with the same name.
            }
        // FALL_THRU
        case 'symlink':
            (ret.baseTypes as Array<ObjectAssertion | AssertionSymlink>).push(ext);
            break;
        case 'operator':
            {
                throw new Error(`Unresolved type operator is found: ${ext.operator}`);
            }
        }
        // NOTE: 'symlink' base types will resolved by calling `resolveSymbols()`.
        //       `resolveSymbols()` will call `derived()` after resolve symlink exts.
    }
    ret.members = ty.members.concat(ret.members);
    if (ty.baseTypes) {
        ret.baseTypes = ty.baseTypes
            .filter(x => x.kind !== 'symlink')
            .concat(ret.baseTypes as Array<ObjectAssertion | AssertionSymlink>);
    }
    if ((ret.baseTypes as Array<ObjectAssertion | AssertionSymlink>).length === 0) {
        delete ret.baseTypes;
    }

    const revMembers = ret.members.slice().reverse();
    for (const x of ret.members) {
        if (ret.members.find(m => m[0] === x[0]) !== revMembers.find(m => m[0] === x[0])) {
            throw new Error(`Duplicated member is found: ${x[0]} in ${ty.name || '(unnamed)'}`);
        }
    }

    let additionalProps: AdditionalPropsMember[] = [];
    if (ret.baseTypes) {
        for (const base of ret.baseTypes) {
            if (base.kind === 'object') {
                if (base.additionalProps && 0 < base.additionalProps.length) {
                    additionalProps = additionalProps.concat(
                        base.additionalProps.map(x =>
                            [x[0], x[1], true, ...x.slice(3)] as AdditionalPropsMember));
                }
            }
            // NOTE: 'symlink' base types will resolved by calling `resolveSymbols()`.
            //       `resolveSymbols()` will call `derived()` after resolve symlink exts.
        }
    }
    if (ty.additionalProps && 0 < ty.additionalProps.length) {
        additionalProps = additionalProps.concat(ty.additionalProps); // TODO: concat order
    }
    if (0 < additionalProps.length) {
        ret.additionalProps = additionalProps;
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


export function withOriginalTypeName(ty: TypeAssertion, originalTypeName: string) {
    if (! originalTypeName) {
        return ty;
    }
    return ({...ty, originalTypeName});
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
        if ((ty as TypeAssertion)?.kind === 'optional') {
            const opt = (ty as any as OptionalAssertion).optional;
            if (opt.kind !== 'primitive') {
                throw new Error(`Decorator '@range' cannot be applied to anything other than 'primitive'.`);
            }
            return ({...ty, optional: {...opt, minValue, maxValue}});
        } else {
            if (!ty || ty.kind !== 'primitive') {
                throw new Error(`Decorator '@range' cannot be applied to anything other than 'primitive'.`);
            }
            return ({...ty, minValue, maxValue});
        }
    };
}


export function withMinValue(minValue: number | string) {
    return (ty: PrimitiveTypeAssertion) => {
        if (typeof minValue !== 'number' && typeof minValue !== 'string') {
            throw new Error(`Decorator '@minValue' parameter 'minValue' should be number or string.`);
        }
        if ((ty as TypeAssertion)?.kind === 'optional') {
            const opt = (ty as any as OptionalAssertion).optional;
            if (opt.kind !== 'primitive') {
                throw new Error(`Decorator '@minValue' cannot be applied to anything other than 'primitive'.`);
            }
            return ({...ty, optional: {...opt, minValue}});
        } else {
            if (!ty || ty.kind !== 'primitive') {
                throw new Error(`Decorator '@minValue' cannot be applied to anything other than 'primitive'.`);
            }
            return ({...ty, minValue});
        }
    };
}


export function withMaxValue(maxValue: number | string) {
    return (ty: PrimitiveTypeAssertion) => {
        if (typeof maxValue !== 'number' && typeof maxValue !== 'string') {
            throw new Error(`Decorator '@maxValue' parameter 'maxValue' should be number or string.`);
        }
        if ((ty as TypeAssertion)?.kind === 'optional') {
            const opt = (ty as any as OptionalAssertion).optional;
            if (opt.kind !== 'primitive') {
                throw new Error(`Decorator '@maxValue' cannot be applied to anything other than 'primitive'.`);
            }
            return ({...ty, optional: {...opt, maxValue}});
        } else {
            if (!ty || ty.kind !== 'primitive') {
                throw new Error(`Decorator '@maxValue' cannot be applied to anything other than 'primitive'.`);
            }
            return ({...ty, maxValue});
        }
    };
}


export function withGreaterThan(greaterThanValue: number | string) {
    return (ty: PrimitiveTypeAssertion) => {
        if (typeof greaterThanValue !== 'number' && typeof greaterThanValue !== 'string') {
            throw new Error(`Decorator '@greaterThan' parameter 'greaterThan' should be number or string.`);
        }
        if ((ty as TypeAssertion)?.kind === 'optional') {
            const opt = (ty as any as OptionalAssertion).optional;
            if (opt.kind !== 'primitive') {
                throw new Error(`Decorator '@greaterThan' cannot be applied to anything other than 'primitive'.`);
            }
            return ({...ty, optional: {...opt, greaterThanValue}});
        } else {
            if (!ty || ty.kind !== 'primitive') {
                throw new Error(`Decorator '@greaterThan' cannot be applied to anything other than 'primitive'.`);
            }
            return ({...ty, greaterThanValue});
        }
    };
}


export function withLessThan(lessThanValue: number | string) {
    return (ty: PrimitiveTypeAssertion) => {
        if (typeof lessThanValue !== 'number' && typeof lessThanValue !== 'string') {
            throw new Error(`Decorator '@lessThan' parameter 'lessThan' should be number or string.`);
        }
        if ((ty as TypeAssertion)?.kind === 'optional') {
            const opt = (ty as any as OptionalAssertion).optional;
            if (opt.kind !== 'primitive') {
                throw new Error(`Decorator '@lessThan' cannot be applied to anything other than 'primitive'.`);
            }
            return ({...ty, optional: {...opt, lessThanValue}});
        } else {
            if (!ty || ty.kind !== 'primitive') {
                throw new Error(`Decorator '@lessThan' cannot be applied to anything other than 'primitive'.`);
            }
            return ({...ty, lessThanValue});
        }
    };
}


export function withMinLength(minLength: number) {
    return (ty: PrimitiveTypeAssertion) => {
        if (typeof minLength !== 'number') {
            throw new Error(`Decorator '@minLength' parameter 'minLength' should be number.`);
        }
        if ((ty as TypeAssertion)?.kind === 'optional') {
            const opt = (ty as any as OptionalAssertion).optional;
            if (opt.kind !== 'primitive') {
                throw new Error(`Decorator '@minLength' cannot be applied to anything other than 'primitive'.`);
            }
            return ({...ty, optional: {...opt, minLength}});
        } else {
            if (!ty || ty.kind !== 'primitive') {
                throw new Error(`Decorator '@minLength' cannot be applied to anything other than 'primitive'.`);
            }
            return ({...ty, minLength});
        }
    };
}


export function withMaxLength(maxLength: number) {
    return (ty: PrimitiveTypeAssertion) => {
        if (typeof maxLength !== 'number') {
            throw new Error(`Decorator '@maxLength' parameter 'maxLength' should be number.`);
        }
        if ((ty as TypeAssertion)?.kind === 'optional') {
            const opt = (ty as any as OptionalAssertion).optional;
            if (opt.kind !== 'primitive') {
                throw new Error(`Decorator '@maxLength' cannot be applied to anything other than 'primitive'.`);
            }
            return ({...ty, optional: {...opt, maxLength}});
        } else {
            if (!ty || ty.kind !== 'primitive') {
                throw new Error(`Decorator '@maxLength' cannot be applied to anything other than 'primitive'.`);
            }
            return ({...ty, maxLength});
        }
    };
}


export function withMatch(pattern: RegExp) {
    return (ty: PrimitiveTypeAssertion) => {
        if (typeof pattern !== 'object') {
            throw new Error(`Decorator '@match' parameter 'pattern' should be RegExp.`);
        }
        if ((ty as TypeAssertion)?.kind === 'optional') {
            const opt = (ty as any as OptionalAssertion).optional;
            if (opt.kind !== 'primitive') {
                throw new Error(`Decorator '@match' cannot be applied to anything other than 'primitive'.`);
            }
            return ({...ty, optional: {...opt, pattern}});
        } else {
            if (!ty || ty.kind !== 'primitive' || ty.primitiveName !== 'string') {
                throw new Error(`Decorator '@match' cannot be applied to anything other than 'primitive'.`);
            }
            return ({...ty, pattern});
        }
    };
}


export function withMsg<T extends TypeAssertion>(messages: string | ErrorMessages): (ty: T) => T {
    return (ty: T) => {
        if (ty.kind === 'optional') {
            if (typeof messages === 'string') {
                const ret = ({
                    ...ty,
                    message: messages,
                    optional: {...(ty as OptionalAssertion).optional, message: messages},
                });
                delete ret.messages;
                delete ret.optional.messages;
                return ret;
            } else {
                const ret = ({
                    ...ty,
                    messages,
                    optional: {...(ty as OptionalAssertion).optional, messages},
                });
                delete ret.message;
                delete ret.optional.message;
                return ret;
            }
        } else {
            if (typeof messages === 'string') {
                const ret = ({...ty, message: messages});
                delete ret.messages;
                return ret;
            } else {
                const ret = ({...ty, messages});
                delete ret.message;
                return ret;
            }
        }
    };
}


export function withMsgId<T extends TypeAssertion>(messageId: string): (ty: T) => T {
    return (ty: T) => {
        if (ty.kind === 'optional') {
            return ({
                ...ty,
                messageId,
                optional: {...(ty as OptionalAssertion).optional, messageId},
            });
        } else {
            return ({...ty, messageId});
        }
    };
}
