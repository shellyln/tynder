// Copyright (c) 2020 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { Stereotype } from '../types';



const stereotypeDatetime: Stereotype = {
    tryParse: (value: any) => {
        return null;
    },
    evaluateFormula: (valueOrFormula: any) => {
        return null;
    },
    compare: (a: any, b: any) => {
        return 1;
    },
    forceCast: false,
};

export default stereotypeDatetime;
