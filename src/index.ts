// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { Stereotype,
         CustomConstraintInfo }             from './types';
import { stereotypes as dateStereotypes }   from './stereotypes/date';
import { constraints as uniqueConstraints } from './constraints/unique';

export * from './types';
export * from './compiler';
export * from './operators';
export * from './codegen';
export * from './serializer';
export * from './validator';
export * from './picker';

export const stereotypes: Array<[string, Stereotype]> = [
    ...dateStereotypes,
];

export const customConstraints: Array<[string, CustomConstraintInfo]> = [
    ...uniqueConstraints,
];
