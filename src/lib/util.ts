// Copyright (c) 2020 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln



// tslint:disable-next-line:function-constructor
const globalObj = Function('return this')();
const objConstructor = ({}).constructor; // NOTE: objConstructor            === Object
const funConstructor = Function;         // NOTE: ({}).toString.constructor === Function


export const NumberPattern = /^([\+\-]?\d*\.?\d+(?:[Ee][\+\-]?\d+)?)$/;
export const DatePattern = /^(\d{4}-[01]\d-[0-3]\d)$/;
export const DateTimePattern =
/^((?:\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(?:\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(?:\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)(?:[+-][0-2]\d:[0-5]\d|Z))$/;
export const DateTimeNoTzPattern =
/^((?:\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(?:\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(?:\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d))$/;


export const dummyTargetObject = {};


export function isUnsafeVarNames(target: any, varName: string) {
    if (target === globalObj ||
        varName === '__proto__' ||
        varName === '__defineGetter__' || varName === '__defineSetter__' ||
        varName === '__lookupGetter__' || varName === '__lookupSetter__') {
        return true;
    }
    if (varName === 'prototype' || varName === 'constructor') {
        if (target === null || target === void 0 || typeof target === 'function') {
            return true;
        }
    }
    if (target === null || target === void 0 || target === objConstructor) {
        if (objConstructor.hasOwnProperty(varName)) {
            return true;
        }
    }
    if (target === null || target === void 0 || target === funConstructor) {
        // checking 'call', 'arguments', 'caller', ...
        let con: any = funConstructor;
        while (con) {
            if (con.hasOwnProperty(varName)) {
                return true;
            }
            con = con.__proto__;
        }
    }
    if (typeof target === 'function') {
        if (!target.hasOwnProperty(varName)) {
            // function's prototypes' members
            return true;
        }
    }
    return false;
}
