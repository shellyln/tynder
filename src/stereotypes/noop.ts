// Copyright (c) 2020 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { Stereotype } from '../types';



export const noopStereotype: Stereotype = {
    tryParse: (value: any) => {
        return ({ value });
    },
    evaluateFormula: (valueOrFormula: any) => {
        return valueOrFormula;
    },
    compare: (a: any, b: any) => {
        // NOTE: You should pass assertion value (schema value) into 'a'.
        const tyA = typeof a;
        const tyB = typeof b;
        if (tyA !== tyB) {
            return NaN;
        }
        switch (tyA) {
        case 'number':
            if (Number.isNaN(a) && Number.isNaN(b)) {
                return 0;
            } else {
                return a - b;
            }
        default:
            if (a === b) {
                return 0;
            } else if (a > b) {
                return 1;
            } else if (a < b) {
                return -1;
            } else {
                return NaN;
            }
        }
    },
    doCast: false,
};
