// Copyright (c) 2020 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { Stereotype }         from '../types';
import { DatePattern,
         DateTimePattern,
         DateTimeNoTzPattern } from '../lib/util';



const FyPattern = /^first-date-of-fy\(([0-9]+)\)$/;
const FormulaPattern = /^([-+@])([0-9]+)(yr|mo|day|days|hr|min|sec|ms)$/;


class UtcDate extends Date {
    public constructor();
    // tslint:disable-next-line: unified-signatures
    public constructor(str: string);
    public constructor(
        year: number, month: number, date?: number,
        hours?: number, minutes?: number, seconds?: number, ms?: number)
    public constructor(
        year?: number | string, month?: number, date?: number,
        hours?: number, minutes?: number, seconds?: number, ms?: number) {

        super();
        if (year === void 0) {
            return;
        }
        if (typeof year === 'string') {
            if (DateTimePattern.test(year)) {
                // string parameter is expected to be treated as specified TZ
                this.setTime(Date.parse(year)); // returns date in specified TZ
            } else if (DatePattern.test(year)) {
                // string parameter is expected to be treated as UTC
                const d = new Date(year);       // returns date in UTC TZ (getUTC??? returns string parameter's date & time digits)
                this.setTime(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
            } else if (DateTimeNoTzPattern.test(year)) {
                // string parameter is expected to be treated as UTC
                const d = new Date(year);       // returns date in local TZ (get??? returns string parameter's date & time digits)
                this.setTime(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(),
                    d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds()));
            } else {
                this.setTime(NaN);
            }
            return;
        }

        this.setUTCDate(1);

        this.setUTCFullYear(year);
        this.setUTCMonth(typeof month === 'number' ? month : 0);
        this.setUTCDate(typeof date === 'number' ? date : 1);
        this.setUTCHours(typeof hours === 'number' ? hours : 0);
        this.setUTCMinutes(typeof minutes === 'number' ? minutes : 0);
        this.setUTCSeconds(typeof seconds === 'number' ? seconds : 0);
        this.setUTCMilliseconds(typeof ms === 'number' ? ms : 0);
    }

    public getFullYear(): number {
        return this.getUTCFullYear();
    }

    public getMonth(): number {
        return this.getUTCMonth();
    }

    public getDate(): number {
        return this.getUTCDate();
    }

    public getHours(): number {
        return this.getUTCHours();
    }

    public getMinutes(): number {
        return this.getUTCMinutes();
    }

    public getSeconds(): number {
        return this.getUTCSeconds();
    }

    public getMilliseconds(): number {
        return this.getUTCMilliseconds();
    }

    // NOTE: set???() are not overridden!
}


class LcDate extends Date {
    public constructor();
    // tslint:disable-next-line: unified-signatures
    public constructor(str: string);
    public constructor(
        year: number, month: number, date?: number,
        hours?: number, minutes?: number, seconds?: number, ms?: number)
    public constructor(
        year?: number | string, month?: number, date?: number,
        hours?: number, minutes?: number, seconds?: number, ms?: number) {

        super();
        if (year === void 0) {
            return;
        }
        if (typeof year === 'string') {
            if (DateTimePattern.test(year)) {
                // string parameter is expected to be treated as specified TZ
                this.setTime(Date.parse(year)); // returns date in specified TZ
            } else if (DatePattern.test(year)) {
                // string parameter is expected to be treated as local TZ
                const d = new Date(year);       // returns date in UTC TZ (getUTC??? returns string parameter's date & time digits)
                const l = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
                this.setTime(l.getTime());
            } else if (DateTimeNoTzPattern.test(year)) {
                // string parameter is expected to be treated as local TZ
                const d = new Date(year);       // returns date in local TZ (get??? returns string parameter's date & time digits)
                this.setTime(d.getTime());
            } else {
                this.setTime(NaN);
            }
            return;
        }

        this.setDate(1);

        this.setFullYear(year);
        this.setMonth(typeof month === 'number' ? month : 0);
        this.setDate(typeof date === 'number' ? date : 1);
        this.setHours(typeof hours === 'number' ? hours : 0);
        this.setMinutes(typeof minutes === 'number' ? minutes : 0);
        this.setSeconds(typeof seconds === 'number' ? seconds : 0);
        this.setMilliseconds(typeof ms === 'number' ? ms : 0);
    }
}


interface DateConstructor {
    new (): Date;
    // tslint:disable-next-line: unified-signatures
    new (str: string): Date;
    new (year: number, month: number, date?: number,
         hours?: number, minutes?: number, seconds?: number, ms?: number): Date;
}


function evaluateFormulaBase(dateCtor: DateConstructor, valueOrFormula: string): Date {
    const errMsg = `evaluateFormula: invalid parameter ${valueOrFormula}`;
    if (typeof valueOrFormula !== 'string') {
        throw new Error(errMsg);
    }
    if (valueOrFormula.startsWith('=')) {
        const formula = valueOrFormula.slice(1).split(' ');
        let d = new dateCtor();
        const now = new dateCtor(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes());
        const today = new dateCtor(d.getFullYear(), d.getMonth(), d.getDate());
        d = now;
        for (const f of formula) {
            switch (f) {
            case 'current': case 'now':
                d = now;
                break;
            case 'today':
                d = today;
                break;
            case 'first-date-of-yr': case 'first-date-of-fy(1)':
                d = new dateCtor(d.getFullYear(), 0, 1);
                break;
            case 'last-date-of-yr':
                d = new dateCtor(d.getFullYear(), 11, 31);
                break;
            case 'first-date-of-mo':
                d = new dateCtor(d.getFullYear(), d.getMonth(), 1);
                break;
            case 'last-date-of-mo':
                d = new dateCtor(d.getFullYear(), d.getMonth() + 1, 0);
                break;
            default:
                if (f.startsWith('first-date-of-fy(')) {
                    const m = FyPattern.exec(f);
                    if (m) {
                        const n = Number.parseInt(m[1], 10);
                        if (0 < n && n <= 12) {
                            const mo = d.getMonth() + 1;
                            let yr = d.getFullYear();
                            if (mo < n) {
                                yr--;
                            }
                            d = new dateCtor(yr, n - 1, 1);
                        } else {
                            throw new Error(errMsg);
                        }
                    } else {
                        throw new Error(errMsg);
                    }
                } else {
                    const m = FormulaPattern.exec(f);
                    if (m) {
                        let n = Number.parseInt(m[2], 10);
                        switch (m[3]) {
                        case 'yr':
                            switch (m[1]) {
                            case '@':
                                break;
                            case '+':
                                n = d.getFullYear() + n;
                                break;
                            case '-':
                                n = d.getFullYear() - n;
                                break;
                            }
                            d = new dateCtor(n, d.getMonth(), d.getDate(),
                                d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
                            break;
                        case 'mo':
                            switch (m[1]) {
                            case '@':
                                n -= 1;
                                break;
                            case '+':
                                n = d.getMonth() + n;
                                break;
                            case '-':
                                n = d.getMonth() - n;
                                break;
                            }
                            d = new dateCtor(d.getFullYear(), n, d.getDate(),
                                d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
                            break;
                        case 'day': case 'days':
                            switch (m[1]) {
                            case '@':
                                break;
                            case '+':
                                n = d.getDate() + n;
                                break;
                            case '-':
                                n = d.getDate() - n;
                                break;
                            }
                            d = new dateCtor(d.getFullYear(), d.getMonth(), n,
                                d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
                            break;
                        case 'hr':
                            switch (m[1]) {
                            case '@':
                                break;
                            case '+':
                                n = d.getHours() + n;
                                break;
                            case '-':
                                n = d.getHours() - n;
                                break;
                            }
                            d = new dateCtor(d.getFullYear(), d.getMonth(), d.getDate(),
                                n, d.getMinutes(), d.getSeconds(), d.getMilliseconds());
                            break;
                        case 'min':
                            switch (m[1]) {
                            case '@':
                                break;
                            case '+':
                                n = d.getMinutes() + n;
                                break;
                            case '-':
                                n = d.getMinutes() - n;
                                break;
                            }
                            d = new dateCtor(d.getFullYear(), d.getMonth(), d.getDate(),
                                d.getHours(), n, d.getSeconds(), d.getMilliseconds());
                            break;
                        case 'sec':
                            switch (m[1]) {
                            case '@':
                                break;
                            case '+':
                                n = d.getSeconds() + n;
                                break;
                            case '-':
                                n = d.getSeconds() - n;
                                break;
                            }
                            d = new dateCtor(d.getFullYear(), d.getMonth(), d.getDate(),
                                d.getHours(), d.getMinutes(), n, d.getMilliseconds());
                            break;
                        case 'ms':
                            switch (m[1]) {
                            case '@':
                                break;
                            case '+':
                                n = d.getMilliseconds() + n;
                                break;
                            case '-':
                                n = d.getMilliseconds() - n;
                                break;
                            }
                            d = new dateCtor(d.getFullYear(), d.getMonth(), d.getDate(),
                                d.getHours(), d.getMinutes(), d.getSeconds(), n);
                            break;
                        default:
                            throw new Error(errMsg);
                        }
                    } else {
                        if (!(DatePattern.test(f) || DateTimePattern.test(f) || DateTimeNoTzPattern.test(f))) {
                            throw new Error(errMsg);
                        }
                        d = new dateCtor(f);
                    }
                }
            }
        }
        return d;
    } else {
        if (! DatePattern.test(valueOrFormula)) {
            throw new Error(errMsg);
        }
        return new dateCtor(valueOrFormula);
    }
}


export const dateStereotype: Stereotype = {
    tryParse: (value: unknown) => {
        return (
            typeof value === 'string' && DatePattern.test(value)
                ? { value: (new UtcDate(value)).getTime() }
                : null
        );
    },
    evaluateFormula: valueOrFormula => {
        const d = evaluateFormulaBase(UtcDate, valueOrFormula);
        return (new UtcDate(d.getFullYear(), d.getMonth(), d.getDate())).getTime();
    },
    compare: (a: number, b: number) => a - b,
    doCast: false,
};


export const lcDateStereotype: Stereotype = {
    ...dateStereotype,
    tryParse: (value: unknown) => {
        if (typeof value === 'string' && DatePattern.test(value)) {
            return ({ value: (new LcDate(value)).getTime() });
        } else {
            return null;
        }
    },
    evaluateFormula: valueOrFormula => {
        const d = evaluateFormulaBase(LcDate, valueOrFormula);
        return (new LcDate(d.getFullYear(), d.getMonth(), d.getDate())).getTime();
    },
}


export const datetimeStereotype: Stereotype = {
    tryParse: (value: unknown) => {
        return (
            typeof value === 'string' && (DateTimePattern.test(value) || DateTimeNoTzPattern.test(value))
                ? { value: (new UtcDate(value)).getTime() } // If timezone is not specified, it is local time
                : null
        );
    },
    evaluateFormula: valueOrFormula => evaluateFormulaBase(UtcDate, valueOrFormula).getTime(),
    compare: (a: number, b: number) => a - b,
    doCast: false,
};


export const lcDatetimeStereotype: Stereotype = {
    ...datetimeStereotype,
    tryParse: (value: unknown) => {
        return (
            typeof value === 'string' && (DateTimePattern.test(value) || DateTimeNoTzPattern.test(value))
                ? { value: (new LcDate(value)).getTime() }
                : null
        );
    },
    evaluateFormula: valueOrFormula => evaluateFormulaBase(LcDate, valueOrFormula).getTime(),
}


export const stereotypes: Array<[string, Stereotype]> = [
    ['date', dateStereotype],
    ['lcdate', lcDateStereotype],
    ['datetime', datetimeStereotype],
    ['lcdatetime', lcDatetimeStereotype],
];
