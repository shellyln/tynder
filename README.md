# Tynder

![Tynder](https://raw.githubusercontent.com/shellyln/tynder/master/docs/tynder.svg?sanitize=true)

TypeScript friendly Data validator for JavaScript.


[![npm](https://img.shields.io/npm/v/tynder.svg)](https://www.npmjs.com/package/tynder)
[![GitHub release](https://img.shields.io/github/release/shellyln/tynder.svg)](https://github.com/shellyln/tynder/releases)
[![Travis](https://img.shields.io/travis/shellyln/tynder/master.svg)](https://travis-ci.org/shellyln/tynder)
[![GitHub forks](https://img.shields.io/github/forks/shellyln/tynder.svg?style=social&label=Fork)](https://github.com/shellyln/tynder/fork)
[![GitHub stars](https://img.shields.io/github/stars/shellyln/tynder.svg?style=social&label=Star)](https://github.com/shellyln/tynder)


> NOTICE:  
> API and DSL syntax are unstable until `v0.1.0`.


## Features
* Define the schema with TypeScript-like DSL.
* Validate data with defined schema.
* Create subset of data by cherrypicking fields from data with defined schema.
* Generate TypeScript type definition code.
    * API

## Planned features
* End user friendly custom validation error message.
* Merge data recursively.
* Generate TypeScript type definition code.
    * CLI
* Generate JSON Schema type definition document.
    * CLI / API

## Project ToDo
* Report validation error messages.
* Well generation of TypeScript type definition code.
    * extended interfaces
    * formatting
* spec codes


## Install

```sh
npm install --save tynder
```


## Define schema with TypeScript-like DSL

Schema:
```ts
export type Foo = string | number;

type Boo = @range(-1, 1) number;

interface Bar {
    a?: string;                                                   // Optional field
    b: Foo[] | null;                                              // Union type
    c: string[3..5];                                              // Repeated type (with quantity)
    d: (number | string)[..10];                                   // Complex repeated type (with quantity)
    e: Array<number | string, 4..>;                               // Complex repeated type (with quantity)
    f: Array<Array<Foo | string>>;                                // Complex repeated type (nested)
    g: [string, number],                                          // Sequence type
    h: ['zzz', ...<string | 999, 3..5>, number],                  // Sequence type (with quantity)
}

interface Baz {
    i: {x: number, y: number, z: 'zzz'} | number;                 // Union type
    j: {x: number} & ({y: number} & {z: number});                 // Intersection type
    k: ({x: number, y: number, z: 'zzz'} - {z: 'zzz'}) | number;  // Subtraction type
}

export interface FooBar extends Bar, Baz {
    @range(-10, 10)
    l: number;                                                    // Ranged value (number)
    @minValue(-10) @maxValue(10)
    m: number;                                                    // Ranged value
    n: @range(-10, 10) number[];                                  // Array of ranged value
    @greaterThan(-10) @lessThan(10)
    o: number;                                                    // Ranged value
    @range('AAA', 'FFF')
    p: string;                                                    // Ranged value (string)
    @match(/^.+$/)
    q: string;                                                    // Pattern matched value
    r: Foo;                                                       // Refer a defined type
    @msgId('M1234')
    s: number;
    @msg({})
    t: number;
}
```

~~Compile using CLI commands~~ (Planned features):
```sh
tynder gen-schema --indir path/to/tynder-dsl --outdir path/to/tynder-schema
tynder gen-ts     --indir path/to/tynder-dsl --outdir path/to/ts-types
tynder gen-json   --indir path/to/tynder-dsl --outdir path/to/json-schema
```

Compile using API:
```js
import { compile } from 'tynder/modules/compiler';

export default const mySchema = compile(`
    type Foo = string;
    interface A {
        a: Foo;
    }
`);
```

Validating:
```js
import { validate,
         getType }         from 'tynder/modules/validator';
import default as mySchema from './myschema';

const validated1 = validate({
    a: 'x',
    b: 3,
}, getType(mySchema, 'A')); // {a: 'x', b: 3}

const validated2 = validate({
    aa: 'x',
    b: 3,
}, getType(mySchema, 'A')); // null

const ctx3 = {checkAll: true};
const validated3 = validate({
    aa: 'x',
    b: 3,
}, getType(mySchema, 'A'), ctx3);
if (validated3 === null) {
    console.log(JSON.stringify(
        ctx3.errors, // error messages (string[])
        null, 2));
}
```

Cherrypicking:
```js
import { getType }         from 'tynder/modules/validator';
import { pick,
         merge }           from 'tynder/modules/picker';
import default as mySchema from './myschema';

const original = {
    a: 'x',
    b: 3,
};
const picked1 = pick(original, getType(mySchema, 'A')); // {a: 'x'}
// Edit the picked data...
const changed = merge(original, picked1); // TODO: not impl. (planned feature)

const ctx2 = {checkAll: true};
const picked2 = pick({
    aa: 'x',
    b: 3,
}, getType(mySchema, 'A'), ctx2); // Throws an error
```

## Define schema with functional API

```js
import { picked,
         partial,
         intersect,
         oneOf,
         subtract,
         primitive,
         primitiveValue,
         optional,
         repeated,
         sequenceOf,
         spread,
         objectType,
         derived,
         msg   as $$,
         msgId as $ } from 'tynder/modules/operators';

const myType =
    oneOf(
        derived(
            objectType(
                ['a', 10],
                ['b', optional(20)],
                ['c', $('MyType-c',
                        optional('aaa'))],
                ['d', sequenceOf(
                        10, 20,
                        spread(primitive('string'), {min: 3, max: 10}),
                        50)], ),
            objectType(
                ['e', optional(primitive('string'))],
                ['f', primitive('string?')],
                ['g', repeated('string', {min: 3, max: 10})], ),
            intersect(
                objectType(
                    ['x', 10], ['y', 10], ['p', 10], ),
                objectType(
                    ['x', 10], ['y', 10], ['q', 10], )),
            subtract(
                objectType(
                    ['w', 10], ['z', 10], ),
                objectType(
                    ['w', 10], ))),
        10, 20, 30,
        primitive('string'),
        primitiveValue(50), );

/*
Same as following type definition:

interface P {
    e?: string;
    f?: string;
    g: string[3..10];
}
type Q = {
        x: 10, y: 10, p: 10,
    } & {
        x: 10, y: 10, q: 10,
    };
type R = {
        w: 10, z: 10,
    } - {
        w: 10,
    };
interface S extends P, Q, R {
    a: 10;
    b?: 20;
    @msgId('MyType-c')
    c: 'aaa';
    d: [10, 20, ...<string, 3..10>, 50];
}
type MyType = S | 10 | 20 | 30 | string | 50;
*/
```

## DSL syntax


## Limitations
* Generics (except `Array<>`) are not available.
* Recursive types are not available.
* Back reference of types are not available.


## License
[ISC](https://github.com/shellyln/fruitsconfits/blob/master/LICENSE.md)  
Copyright (c) 2019 Shellyl_N and Authors.
