// Copyright (c) 2020 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { Stereotype }         from '../types';
import { DatePattern,
         DateTimePattern,
         DateTimeNoTzPattern } from '../lib/util';



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
            this.setTime(Date.UTC(super.getFullYear(), super.getMonth(), super.getDate(),
                super.getHours(), super.getMinutes(), super.getSeconds(), super.getMilliseconds()));

            // this.setUTCFullYear(super.getFullYear());
            // this.setUTCMonth(super.getMonth());
            // this.setUTCDate(super.getDate());
            // this.setUTCHours(super.getHours());
            // this.setUTCMinutes(super.getMinutes());
            // this.setUTCSeconds(super.getSeconds());
            // this.setUTCMilliseconds(super.getMilliseconds());
            return;
        }
        if (typeof year === 'string') {
            if (DateTimePattern.test(year)) {
                this.setTime(Date.parse(year));
            } else if (DatePattern.test(year)) {
                const d = new Date(year);
                this.setTime(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
            } else if (DateTimeNoTzPattern.test(year)) {
                const d = new Date(year);
                this.setTime(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(),
                    d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds()));
            }
            return;
        }

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
        const today = new dateCtor(now.getFullYear(), now.getMonth(), now.getDate());
        d = now;
        for (const f of formula) {
            switch (f) {
            case 'current': case 'now':
                d = now;
                break;
            case 'today':
                d = today;
                break;
            case 'first-date-of-yr':
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
                {
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
                                n = d.getMonth() + n - 1;
                                break;
                            case '-':
                                n = d.getMonth() - n + 1;
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
        return (
            typeof value === 'string' && DatePattern.test(value)
                ? { value: (new Date(value)).getTime() }
                : null
        );
    },
    evaluateFormula: valueOrFormula => {
        const d = evaluateFormulaBase(Date, valueOrFormula);
        return (new Date(d.getFullYear(), d.getMonth(), d.getDate())).getTime();
    },
}


export const datetimeStereotype: Stereotype = {
    tryParse: (value: unknown) => {
        return (
            typeof value === 'string' && (DateTimePattern.test(value) || DateTimeNoTzPattern.test(value))
                ? { value: (new UtcDate(value)).getTime() }
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
                ? { value: (new Date(value)).getTime() }
                : null
        );
    },
    evaluateFormula: valueOrFormula => evaluateFormulaBase(Date, valueOrFormula).getTime(),
}


export const stereotypes: Array<[string, Stereotype]> = [
    ['date', dateStereotype],
    ['lcdate', lcDateStereotype],
    ['datetime', datetimeStereotype],
    ['lcdatetime', lcDatetimeStereotype],
];
