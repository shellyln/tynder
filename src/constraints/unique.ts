// Copyright (c) 2020 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { CustomConstraintInfo } from '../types';
import { dummyTargetObject,
         isUnsafeVarNames }     from '../lib/util';



type MapperFn = (data: any, fields: string[]) => any[];
const mapperErrMsg = 'Unsafe symbol name is appeared in unique constraint assertion:';


const normalMapper: MapperFn = (data: any, fields: string[]) => {
    const ret: any[] = [];
    if (0 < fields.length) {
        for (const field of fields) {
            if (isUnsafeVarNames(dummyTargetObject, field)) {
                throw new Error(`${mapperErrMsg} ${field}`);
            }
            ret.push(data[field]);
        }
    } else {
        ret.push(data);
    }
    return ret;
};


const nonNullMapper: MapperFn = (data: any, fields: string[]) => {
    const ret: any[] = [];
    if (0 < fields.length) {
        for (const field of fields) {
            if (isUnsafeVarNames(dummyTargetObject, field)) {
                throw new Error(`${mapperErrMsg} ${field}`);
            }
            ret.push(data[field] ?? NaN);
        }
    } else {
        ret.push(data);
    }
    return ret;
};


const checkerGen = (mapper: MapperFn) => {
    return ((data: any, args: any) => {
        const errMsg = `evaluateFormula: invalid parameter ${args}`;
        if (! Array.isArray(data)) {
            throw new Error(errMsg);
        }

        const fields: string[] = [];
        if (typeof args === 'string') {
            fields.push(args);
        } else if (Array.isArray(args)) {
            for (const z of args) {
                if (typeof z !== 'string') {
                    throw new Error(errMsg);
                }
            }
            fields.push(...args);
        }

        const mapped = data.map(x => mapper(x, fields));
        for (let i = 0; i < mapped.length; i++) {
            CMP: for (let j = 0; j < mapped.length; j++) {
                if (i === j) {
                    continue;
                }
                const a = mapped[i];
                const b = mapped[j];
                for (let k = 0; k < a.length; k++) {
                    if (a[k] !== b[k]) {
                        continue CMP;
                    }
                }
                return false;
            }
        }

        return true;
    });
};


export const constraints: Array<[string, CustomConstraintInfo]> = [
    ['unique', {
        kinds: ['repeated', 'sequence'],
        check: checkerGen(normalMapper),
    }],
    ['unique-non-null', {
        kinds: ['repeated', 'sequence'],
        check: checkerGen(nonNullMapper),
    }],
];
