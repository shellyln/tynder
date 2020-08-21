// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { TypeAssertion,
         TypeAssertionMap,
         TypeAssertionSetValue,
         ObjectAssertion,
         AssertionSymlink,
         SymbolResolverOperators,
         ResolveSymbolOptions,
         SymbolResolverContext } from '../types';
import * as operators            from '../operators';
import { NumberPattern }         from '../lib/util';



function mergeTypeAndSymlink(ty: TypeAssertion, link: AssertionSymlink): TypeAssertion {
    const link2 = {...link};
    delete (link2 as any).kind;              // NOTE: (TS>=4.0) TS2790: The operand of a 'delete' operator must be optional.
    delete (link2 as any).symlinkTargetName; // NOTE: (TS>=4.0) TS2790: The operand of a 'delete' operator must be optional.
    delete (link2 as any).memberTree;        // NOTE: (TS>=4.0) TS2790: The operand of a 'delete' operator must be optional.
    return ({...ty, ...link2} as any as TypeAssertion);
}


function updateSchema(original: TypeAssertion, schema: TypeAssertionMap, ty: TypeAssertion, typeName: string | undefined) {
    if (typeName && schema.has(typeName)) {
        const z: TypeAssertionSetValue = schema.get(typeName) as TypeAssertionSetValue;
        if (z.ty === original) {
            schema.set(typeName, {...z, ty, resolved: true});
        }
    }
    return ty;
}


export function resolveMemberNames(
        ty: TypeAssertion, rootSym: string, memberTreeSymbols: string[], memberPos: number): TypeAssertion {

    const addTypeName = (mt: TypeAssertion, typeName: string | undefined, memberSym: string) => {
        if (typeName) {
            return ({
                ...mt,
                typeName: memberPos === 0 ?
                    `${rootSym}.${memberTreeSymbols.join('.')}` :
                    `${typeName}.${memberSym}`,
            });
        } else {
            return mt;
        }
    };

    for (let i = memberPos; i < memberTreeSymbols.length; i++) {
        const memberSym = memberTreeSymbols[i];

        switch (ty.kind) {
        case 'optional':
            return resolveMemberNames(ty.optional, rootSym, memberTreeSymbols, i + 1);
        case 'object':
            for (const m of ty.members) {
                if (memberSym === m[0]) {
                    return addTypeName(
                        resolveMemberNames(m[1], rootSym, memberTreeSymbols, i + 1),
                        ty.typeName,
                        memberSym,
                    );
                }
            }
            if (ty.additionalProps) {
                for (const m of ty.additionalProps) {
                    for (const k of m[0]) {
                        switch (k) {
                        case 'number':
                            if (NumberPattern.test(memberSym)) {
                                return resolveMemberNames(m[1], rootSym, memberTreeSymbols, i + 1);
                            }
                            break;
                        case 'string':
                            return resolveMemberNames(m[1], rootSym, memberTreeSymbols, i + 1);
                        default:
                            if (k.test(memberSym)) {
                                return resolveMemberNames(m[1], rootSym, memberTreeSymbols, i + 1);
                            }
                            break;
                        }
                    }
                }
            }
            throw new Error(`Undefined member name is appeared: ${memberSym}`);
        case 'symlink':
            if (! ty.typeName) {
                throw new Error(`Reference of anonymous type is appeared: ${memberSym}`);
            }
            return ({
                ...{
                    kind: 'symlink',
                    symlinkTargetName: rootSym,
                    name: memberSym,
                    typeName: rootSym,
                },
                ...(0 < memberTreeSymbols.length ? {
                    memberTree: memberTreeSymbols,
                } : {}),
            });
        default:
            // TODO: kind === 'operator'
            throw new Error(`Unsupported type kind is appeared: (kind:${ty.kind}).${memberSym}`);
        }
    }
    return ty;
}


export function resolveSymbols(schema: TypeAssertionMap, ty: TypeAssertion, ctx: SymbolResolverContext): TypeAssertion {
    const ctx2 = {...ctx, nestLevel: ctx.nestLevel + 1};
    switch (ty.kind) {
    case 'symlink':
        {
            const x = schema.get(ty.symlinkTargetName);
            if (! x) {
                throw new Error(`Undefined symbol '${ty.symlinkTargetName}' is referred.`);
            }
            if (0 <= ctx.symlinkStack.findIndex(s => s === ty.symlinkTargetName)) {
                return ty;
            }

            const ty2 = {...ty};
            let xTy = x.ty;
            if (ty.memberTree && 0 < ty.memberTree.length) {
                xTy = {
                    ...resolveMemberNames(xTy, ty.symlinkTargetName, ty.memberTree, 0),
                };
                ty2.typeName = xTy.typeName;
            }

            return (
                resolveSymbols(
                    schema,
                    mergeTypeAndSymlink(xTy, ty2),
                    {...ctx2, symlinkStack: [...ctx2.symlinkStack, ty2.symlinkTargetName]},
                )
            );
        }
    case 'repeated':
        return updateSchema(ty, schema, {
            ...ty,
            repeated: resolveSymbols(schema, ty.repeated, ctx2),
        }, ty.typeName);
    case 'spread':
        return updateSchema(ty, schema, {
            ...ty,
            spread: resolveSymbols(schema, ty.spread, ctx2),
        }, ty.typeName);
    case 'sequence':
        return updateSchema(ty, schema, {
            ...ty,
            sequence: ty.sequence.map(x => resolveSymbols(schema, x, ctx2)),
        }, ty.typeName);
    case 'one-of':
        return updateSchema(ty, schema, {
            ...ty,
            oneOf: ty.oneOf.map(x => resolveSymbols(schema, x, ctx2)),
        }, ty.typeName);
    case 'optional':
        return updateSchema(ty, schema, {
            ...ty,
            optional: resolveSymbols(schema, ty.optional, ctx2),
        }, ty.typeName);
    case 'object':
        {
            if (0 < ctx.nestLevel && ty.typeName && 0 <= ctx.symlinkStack.findIndex(s => s === ty.typeName)) {
                if (schema.has(ty.typeName)) {
                    const z = schema.get(ty.typeName) as TypeAssertionSetValue;
                    if (z.resolved) {
                        return z.ty;
                    }
                }
            }

            const baseSymlinks = ty.baseTypes?.filter(x => x.kind === 'symlink') as AssertionSymlink[];
            if (baseSymlinks && baseSymlinks.length > 0 && !ctx.isDeserialization) {
                const exts = baseSymlinks
                    .map(x => resolveSymbols(schema, x, ctx2))
                    .filter(x => x.kind === 'object');
                // TODO: if x.kind !== 'object' items exist -> error?
                const d2 = resolveSymbols(
                    schema,
                    operators.derived({
                        ...ty,
                        ...(ty.baseTypes ? {
                            baseTypes: ty.baseTypes.filter(x => x.kind !== 'symlink'),
                        } : {}),
                    }, ...exts),
                    ty.typeName ?
                        {...ctx2, symlinkStack: [...ctx2.symlinkStack, ty.typeName]} : ctx2,
                );
                return updateSchema(ty, schema, {
                    ...ty,
                    ...d2,
                }, ty.typeName);
            } else {
                return updateSchema(ty, schema, {
                    ...{
                        ...ty,
                        members: ty.members
                            .map(x => [
                                x[0],
                                resolveSymbols(schema, x[1], ty.typeName ?
                                    {...ctx2, symlinkStack: [...ctx2.symlinkStack, ty.typeName]} : ctx2),
                                ...x.slice(2),
                            ] as any),
                    },
                    ...(ty.additionalProps && 0 < ty.additionalProps.length ? {
                        additionalProps: ty.additionalProps
                            .map(x => [
                                x[0],
                                resolveSymbols(schema, x[1], ty.typeName ?
                                    {...ctx2, symlinkStack: [...ctx2.symlinkStack, ty.typeName]} : ctx2),
                                ...x.slice(2),
                            ] as any),
                    } : {}),
                    ...(ty.baseTypes && 0 < ty.baseTypes.length ? {
                        baseTypes: ctx.isDeserialization ?
                            ty.baseTypes
                                .map(x => x.kind === 'symlink' ? resolveSymbols(schema, x, ctx2) : x)
                                .filter(x => x.kind === 'object') as ObjectAssertion[] :
                            ty.baseTypes,
                    } : {}),
                }, ty.typeName);
            }
        }
    case 'operator':
        if (ctx2.operators) {
            const ctx3 = ty.typeName ?
                {...ctx2, symlinkStack: [...ctx2.symlinkStack, ty.typeName]} : ctx2;
            const operands = ty.operands.map(x => {
                if (typeof x === 'object' && x.kind) {
                    return resolveSymbols(schema, x, ctx3);
                }
                return x;
            });
            if (0 < operands.filter(x => x && typeof x === 'object' &&
                    (x.kind === 'symlink' || x.kind === 'operator')).length) {
                throw new Error(`Unresolved type operator is found: ${ty.operator}`);
            }
            if (! ctx2.operators[ty.operator]) {
                throw new Error(`Undefined type operator is found: ${ty.operator}`);
            }
            const ty2 = {...ty};
            delete (ty2 as any).operator; // NOTE: (TS>=4.0) TS2790: The operand of a 'delete' operator must be optional.
            delete (ty2 as any).operands; // NOTE: (TS>=4.0) TS2790: The operand of a 'delete' operator must be optional.
            return updateSchema(
                ty, schema,
                {
                    ...ty2,
                    ...resolveSymbols(schema, ctx2.operators[ty.operator](...operands), ctx3),
                },
                ty.typeName,
            );
        } else {
            return ty;
        }
    default:
        return ty;
    }
}


const resolverOps: SymbolResolverOperators = {
    picked: operators.picked,
    omit: operators.omit,
    partial: operators.partial,
    intersect: operators.intersect,
    subtract: operators.subtract,
};


export function resolveSchema(schema: TypeAssertionMap, opts?: ResolveSymbolOptions): TypeAssertionMap {
    for (const ent of schema.entries()) {
        const ty = resolveSymbols(schema, ent[1].ty, {...opts, nestLevel: 0, symlinkStack: [ent[0]], operators: resolverOps});
        ent[1].ty = ty;
    }

    return schema;
}
