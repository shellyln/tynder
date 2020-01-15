// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { TypeAssertion,
         ValidationContext } from './types';



export class ValidationError extends Error {
    public ty?: TypeAssertion;
    public ctx?: ValidationContext;
    public constructor(message: string, ty?: TypeAssertion, ctx?: ValidationContext) {
        super(message);
        this.ty = ty;
        this.ctx = ctx;
    }
}
