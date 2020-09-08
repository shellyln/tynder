// Copyright (c) 2020 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln



// tslint:disable: no-shadowed-variable
// tslint:disable: function-constructor


export const dummyTargetObject = {};


// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const { g: globalObj, o: objConstructor, f: funConstructor } = (() => {
    let globalObj = null;
    try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-implied-eval
        globalObj = Function('return this')();
    } catch (e) {
        // Nothing to do.
    }
    if (! globalObj) {
        // Fall back (for CSP, etc...)
        if (typeof window === 'object' && window) {
            globalObj = window;
        } else if (typeof global === 'object' && global) {
            globalObj = global;
        } else if (typeof globalThis === 'object' && globalThis) {
            globalObj = globalThis;
        } else {
            globalObj = dummyTargetObject;
        }
    }

    // NOTE: ({}).constructor === Object
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    let objConstructor: ObjectConstructor = null as any;
    try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        objConstructor = (({}).constructor ?? Object) as any;
    } catch (e) {
        // Nothing to do.
    }
    if (! objConstructor) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        objConstructor = dummyTargetObject as any;
    }

    // NOTE: ({}).toString.constructor === Function
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    let funConstructor: FunctionConstructor = null as any;
    try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        funConstructor = (({}).toString.constructor ?? Function) as any;
    } catch (e) {
        // Nothing to do.
    }
    if (! funConstructor) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        funConstructor = dummyTargetObject as any;
    }

    return ({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        g: globalObj, o: objConstructor, f: funConstructor
    });
})();


// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
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
        if (Object.prototype.hasOwnProperty.call(objConstructor, varName)) {
            return true;
        }
    }
    if (target === null || target === void 0 || target === funConstructor) {
        // checking 'call', 'arguments', 'caller', ...
        let con: any = funConstructor;
        while (con) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
            if (Object.prototype.hasOwnProperty.call(con, varName)) {
                return true;
            }
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            con = con.__proto__;
        }
    }
    if (typeof target === 'function') {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        if (! Object.prototype.hasOwnProperty.call(target, varName)) {
            // function's prototypes' members
            return true;
        }
    }
    return false;
}
