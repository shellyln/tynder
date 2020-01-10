// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { TypeAssertion,
         TypeAssertionMap,
         TypeAssertionSetValue,
         AssertionSymlink,
         SymbolResolverContext } from '../types';
import * as operators            from '../operators';



function mergeTypeAndSymlink(ty: TypeAssertion, link: AssertionSymlink): TypeAssertion {
    const link2 = {...link};
    delete link2.kind;
    delete link2.symlinkTargetName;
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
            return (
                resolveSymbols(
                    schema,
                    mergeTypeAndSymlink(x.ty, ty),
                    {...ctx2, symlinkStack: [...ctx2.symlinkStack, ty.symlinkTargetName]},
                )
            );
        }
    case 'repeated':
        return ({
            ...ty,
            repeated: resolveSymbols(schema, ty.repeated, ctx2),
        });
    case 'spread':
        return ({
            ...ty,
            spread: resolveSymbols(schema, ty.spread, ctx2),
        });
    case 'sequence':
        return ({
            ...ty,
            sequence: ty.sequence.map(x => resolveSymbols(schema, x, ctx2)),
        });
    case 'one-of':
        return ({
            ...ty,
            oneOf: ty.oneOf.map(x => resolveSymbols(schema, x, ctx2)),
        });
    case 'optional':
        return ({
            ...ty,
            optional: resolveSymbols(schema, ty.optional, ctx2),
        });
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
            if (baseSymlinks && baseSymlinks.length > 0) {
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
                }, ty.typeName);
            }
        }
    default:
        return ty;
    }
}
