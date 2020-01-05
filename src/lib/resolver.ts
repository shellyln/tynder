// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { TypeAssertion,
         ObjectAssertion,
         TypeAssertionMap,
         AssertionSymlink,
         SymbolResolverContext } from '../types';
import * as operators            from '../operators';



function mergeTypeAndSymlink(ty: TypeAssertion, link: AssertionSymlink): TypeAssertion {
    const link2 = {...link};
    delete link2.kind;
    delete link2.symlinkTargetName;
    return ({...ty, ...link2} as any as TypeAssertion);
}

// TODO: Back reference and recursive types
//    If undefined symbol is come, return a reference assertion.
//    Dereference them after evaluation.
//        Assign to new blank object. assign properties of original and reference.
//    If they are recursive, keep them as references.
export function resolveSymbols(schema: TypeAssertionMap, ty: TypeAssertion, ctx: SymbolResolverContext): TypeAssertion {
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
                    {...ctx, symlinkStack: [...ctx.symlinkStack, ty.symlinkTargetName]},
                )
            );
        }
    case 'repeated':
        return ({
            ...ty,
            repeated: resolveSymbols(schema, ty.repeated, ctx),
        });
    case 'spread':
        return ({
            ...ty,
            spread: resolveSymbols(schema, ty.spread, ctx),
        });
    case 'sequence':
        return ({
            ...ty,
            sequence: ty.sequence.map(x => resolveSymbols(schema, x, ctx)),
        });
    case 'one-of':
        return ({
            ...ty,
            oneOf: ty.oneOf.map(x => resolveSymbols(schema, x, ctx)),
        });
    case 'optional':
        return ({
            ...ty,
            optional: resolveSymbols(schema, ty.optional, ctx),
        });
    case 'object':
        {
            const baseSymlinks = ty.baseTypes?.filter(x => x.kind === 'symlink');
            if (baseSymlinks && baseSymlinks.length > 0) {
                // TODO: backref
                const exts = baseSymlinks
                    .map(x => resolveSymbols(schema, x, ctx))
                    .filter(x => x.kind === 'object');
                // TODO: if x.kind !== 'object' items exist
                const d2 = resolveSymbols(
                    schema,
                    operators.derived(ty, ...exts),
                    ctx,
                );
                return ({
                    ...ty,
                    ...d2,
                });
            } else {
                return ({
                    ...ty,
                    members: ty.members.map(x => [x[0], resolveSymbols(schema, x[1], ctx), ...x.slice(2)] as any),
                });
            }
        }
    default:
        return ty;
    }
}
