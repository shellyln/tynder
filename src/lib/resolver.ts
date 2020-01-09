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
                /* BUG:
                 * interface HH extends H {}
                 * interface H {
                 *     a?: HH;                 // TODO: BUG: Maximum call stack size exceeded (resolveSymbols())
                 *                             //            It should be `symlink`?
                 *                             //              (compiler.ref() should return and
                 *                             //               resolveSymbols() should not resolve?)
                 *                             //            Or stop recursive call?
                 *     // a?: H;               // OK
                 *     b: H | number;
                 * }
                 */

            const baseSymlinks = ty.baseTypes?.filter(x => x.kind === 'symlink') as AssertionSymlink[];
            if (baseSymlinks && baseSymlinks.length > 0) {
                const exts = baseSymlinks
                    .map(x => resolveSymbols(schema, x, ctx))
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
                    ctx,
                );
                return ({
                    ...ty,
                    ...d2,
                });
            } else {
                return ({
                    ...{
                        ...ty,
                        members: ty.members
                            .map(x => [x[0], resolveSymbols(schema, x[1], ctx), ...x.slice(2)] as any),
                    },
                    ...(ty.additionalProps && 0 < ty.additionalProps.length ? {
                        additionalProps: ty.additionalProps
                            .map(x => [x[0], resolveSymbols(schema, x[1], ctx), ...x.slice(2)] as any),
                    } : {}),
                });
            }
        }
    default:
        return ty;
    }
}
