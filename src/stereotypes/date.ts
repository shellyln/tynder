// Copyright (c) 2020 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { Stereotype }         from '../types';
import { DatePattern,
         DateTimePattern,
         DateTimeNoTzPattern} from '../lib/util';



const FormulaPattern = /^([-+@])([0-9]+)(yr|mo|day|days|hr|min|sec)$/;


function evaluateFormula(valueOrFormula: string){
    const errMsg = `evaluateFormula: invalid parameter ${valueOrFormula}`;
    if (typeof valueOrFormula !== 'string') {
        throw new Error(errMsg);
    }
    if (valueOrFormula.startsWith('=')) {
        const formula = valueOrFormula.slice(1).split(' ');
        let d = new Date();
        const now = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes());
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
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
                d = new Date(d.getFullYear(), 0, 1);
                break;
            case 'last-date-of-yr':
                d = new Date(d.getFullYear(), 11, 31);
                break;
            case 'first-date-of-mo':
                d = new Date(d.getFullYear(), d.getMonth(), 1);
                break;
            case 'last-date-of-mo':
                d = new Date(d.getFullYear(), d.getMonth() + 1, 0);
                break;
            default:
                {
                    const m = FormulaPattern.exec(f);
                    if (m) {
                        let n = Number.parseInt(m[2], 10);
                        switch (m[2]) {
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
                            d = new Date(n, d.getMonth(), d.getDate(),
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
                            d = new Date(d.getFullYear(), n, d.getDate(),
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
                            d = new Date(d.getFullYear(), d.getMonth(), d.getDate(),
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
                            d = new Date(d.getFullYear(), d.getMonth(), d.getDate(),
                                d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
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
                            d = new Date(d.getFullYear(), d.getMonth(), d.getDate(),
                                d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
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
                            d = new Date(d.getFullYear(), d.getMonth(), d.getDate(),
                                d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
                            break;
                        default:
                            if (!(DatePattern.test(m[1]) || DateTimePattern.test(m[1]) || DateTimeNoTzPattern.test(m[1]))) {
                                throw new Error(errMsg);
                            }
                            d = new Date(m[1]);
                        }
                    } else {
                        throw new Error(errMsg);
                    }
                }
            }
        }
        return d.getTime();
    } else {
        if (! DatePattern.test(valueOrFormula)) {
            throw new Error(errMsg);
        }
        return (new Date(valueOrFormula)).getTime();
    }
}


const dateStereotype: Stereotype = {
    tryParse: (value: unknown) => {
        return (
            typeof value === 'string' && DatePattern.test(value)
                ? { value: (new Date(value)).getTime() }
                : null
        );
    },
    evaluateFormula,
    compare: (a: number, b: number) => {
        return a - b;
    },
    forceCast: false,
};

export default dateStereotype;
