// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { Stereotype } from './types';
import { stereotypes as dateStereotypes } from './stereotypes/date';

export * from './types';
export * from './operators';
export * from './validator';
export * from './picker';

export const stereotypes: Array<[string, Stereotype]> = [
    ...dateStereotypes,
];
