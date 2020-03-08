// Copyright (c) 2020 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { CustomConstraintInfo } from '../types';



export const constraints: Array<[string, CustomConstraintInfo]> = [
    ['unique', {
        kinds: ['repeated', 'sequence'],
        check: (data, args) => {
            return true;
        },
    }],
];
