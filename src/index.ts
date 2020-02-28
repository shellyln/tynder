// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { dateStereotype,
         dateLcStereotype,
         datetimeStereotype,
         datetimeLcStereotype } from './stereotypes/date';

export * from './types';
export * from './compiler';
export * from './operators';
export * from './codegen';
export * from './serializer';
export * from './validator';
export * from './picker';

export const stereotypes = [
    ['date', dateStereotype],
    ['lcdate', dateLcStereotype],
    ['datetime', datetimeStereotype],
    ['lcdatetime', datetimeLcStereotype],
];
