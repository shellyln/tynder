// Copyright (c) 2020 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln



export const SymbolPattern = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
export const NumberPattern = /^([\+\-]?\d*\.?\d+(?:[Ee][\+\-]?\d+)?)$/;
export const DatePattern = /^(\d{4}-[01]\d-[0-3]\d)$/;
export const DateTimePattern =
    /^((?:(?:\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(?:\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(?:\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d))(?:[+-][0-2]\d:[0-5]\d|Z))$/;
export const DateTimeNoTzPattern =
    /^((?:\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(?:\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(?:\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d))$/;


export function nvl(v: any, alt: any) {
    return (
        v !== null && v !== void 0 ? v : alt
    );
}


export function nvl2(v: any, f: (x: any) => any, alt: any) {
    return (
        v !== null && v !== void 0 ? f(v) : alt
    );
}
