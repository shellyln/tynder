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
* End user friendly custom validation error message.
* Create subset of data by cherrypicking fields from data with defined schema.
* Generate TypeScript type definition code.
    * CLI / API



## Planned features
* Merge data recursively.
* Generate JSON Schema type definition document.
    * CLI / API
* Generate Protocol Buffers 3 type definition code.
    * CLI / API
* [X] ~~Recursive types~~
* [X] ~~Back reference of types~~



## Project ToDo
* Spec codes



## Install

```sh
npm install --save tynder
```



## Define schema with TypeScript-like DSL

### Schema:
```ts
/// @tynder-external RegExp, Date, Map, Set

/** doc comment */
export type Foo = string | number;

type Boo = @range(-1, 1) number;

/** doc comment */
interface Bar {
    /** doc comment */
    a?: string;                                                   // Optional field
    /** doc comment */
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

/** doc comment */
@msgId('M1111')                                                   // Custom error message id
export interface FooBar extends Bar, Baz {
    /** doc comment */
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
    s: number;                                                    // Custom error message id
    @msg({
        required: '"%{name}" of "%{parentType}" is required.',
        typeUnmatched: '"%{name}" of "%{parentType}" should be "%{expectedType}".',
    })
    t: number;                                                    // Custom error message
    @msg('"%{name}" of "%{parentType}" is not valid.')
    u: number;                                                    // Custom error message
}

// line comment
/* block comment */
```
Default file extension is `*.tss`.


### Compile using CLI commands:
```sh
# Compile schema and output as JSON files.
tynder compile       --indir path/to/schema/tynder --outdir path/to/schema/_compiled
# Compile schema and output as JavaScript|TypeScript files.
tynder compile-as-ts --indir path/to/schema/tynder --outdir path/to/schema/_compiled
# Compile schema and generate TypeScript type definition files.
tynder gen-ts        --indir path/to/schema/tynder --outdir path/to/typescript-src

## Planned features
# tynder gen-json-schema --indir path/to/schema/tynder --outdir path/to/schema/json-schema
# tynder gen-proto3      --indir path/to/schema/tynder --outdir path/to/schema/proto3
```


### Compile using API:
```js
import { compile } from 'tynder/modules/compiler';

export default const mySchema = compile(`
    type Foo = string;
    interface A {
        a: Foo;
    }
`);
```


### Validating:
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

const ctx3 = {               // To receive the error messages, define the context as a variable.
    checkAll: true,          // (optional) Set to true to continue validation after the first error.
    noAdditionalProps: true, // (optional) Do not allow implicit additional properties.
    schema: mySchema,        // (optional) Pass "schema" to check for recursive types.
};
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


### Cherrypicking:
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
// Edit the picked data and...
const changed = merge(original, picked1); // TODO: not impl. (planned feature)

const ctx2 = {        // To receive the error messages, define the context as a variable.
    checkAll: true,   // (optional) Set to true to continue validation after the first error.
    schema: mySchema, // (optional) Pass "schema" to check for recursive types.
};
const picked2 = pick({
    aa: 'x',
    b: 3,
}, getType(mySchema, 'A'), ctx2); // Throws an error
```



## Define schema with functional API

```js
import { picked,
         omit,
         partial,
         intersect,
         oneOf,
         subtract,
         primitive,
         regexpPatternStringType,
         primitiveValue,
         optional,
         repeated,
         sequenceOf,
         spread,
         enumType,
         objectType,
         derived,
         symlinkType,
         withName,
         withTypeName,
         withDocComment,
         withRange,
         withMinValue,
         withMaxValue,
         withGreaterThan,
         withLessThan,
         withMinLength,
         withMaxLength,
         withMatch,
         withMsg   as $$,
         withMsgId as $ } from 'tynder/modules/operators';

const myType =
    oneOf(
        derived(
            objectType(
                ['a', 10],
                ['b', optional(20)],
                ['c', $('MyType-c')(
                        optional('aaa'))],
                ['d', sequenceOf(
                        10, 20,
                        spread(primitive('string'), {min: 3, max: 10}),
                        50)], ),
            objectType(
                ['e', optional(primitive('string'))],
                ['f', primitive('string?')],
                ['g', repeated('string', {min: 3, max: 10})],
                [[/^[a-z][0-9]$/], optional(primitive('string'))], ),
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
Equivalent to following type definition:

interface P {
    e?: string;
    f?: string;
    g: string[3..10];
    [propName: /^[a-z][0-9]$/]?: string;
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

### Type

```ts
type Foo = string;
type Bar = string[] | 10 | {a: boolean} | [number, string];
```


### Interface

#### Named interface
```ts
interface Foo {
    a: string;
    b?: number;
}

interface Bar {
    c: boolean;
}

interface Baz extends Foo, Bar {
    d: string[];
}
```

#### Unnamed literal interface
```ts
type A = {
    a: string,
    b?: number,
};
```

#### Optional member
```ts
interface A {
    b?: number; // optional member
};
```

#### Additional properties
```ts
type X = {a: string, b: number};

interface A {
    // Additional properties (Error if `propName` is unmatched)
    [propName: string | number | /^[a-z][0-9]+$/]: number;
};

interface B {
    // Optional additional properties (Check type if propName matches)
    //   -> Implicit additional properties are allowed
    //      even if `ctx.noAdditionalProps` is true.
    [propName: string | number | /^[a-z][0-9]+$/]?: number; 
};

interface C {
    // `propName` can be any name
    [p: string]: X; 
};

interface D {
    // Error if app `propName`s are unmatched
    [propName1: /^[a-z][0-9]+$/]: number;
    [propName2: number]: number;
};

interface E {
    // If optional additional properties definition(s) exist,
    // implicit additional properties are allowed
    // even if `ctx.noAdditionalProps` is true.
    [propName1: /^[a-z][0-9]+$/]: number;
    [propName2: number]: number;
    [propName3: /^[A-F]+$/]?: number;
};
```
Only `string`, `number`, and `RegExp` are allowed for the `propName` type.


### Type decoration

#### Decorate to interface member
```ts
interface A {
    @range(-10, 10) @msgId('M1234')
    a: number;
}
```

#### Decorate to type component
```ts
type A = @range(-10, -1) number | @range(1, 10) number;

interface B {
    b: @range(-10, -1) number | @range(1, 10) number;
}
```

* `@range(minValue: number | string, maxValue: number | string)`
    * Check value range.
    * minValue <= data <= maxValue
* `@minValue(minValue: number | string)`
    * Check value range.
    * minValue <= data
* `@maxValue(maxValue: number | string)`
    * Check value range.
    * data <= maxValue
* `@greaterThan(minValue: number | string)`
    * Check value range.
    * minValue < data
* `@lessThan(maxValue: number | string)`
    * Check value range.
    * data < maxValue
* `@minLength(minLength: number)`
    * Check value range.
    * minLength <= data.length
* `@maxLength(maxLength: number)`
    * Check value range.
    * data.length <= maxLength
* `@match(pattern: RegExp)`
    * Check value text pattern.
    * pattern.test(data)
* `@msg(messages: string | ErrorMessages)`
    * Set custom error message.
* `@msgId(messageId: string)`
    * Set custom error message id.


### Enum

```ts
enum Foo {
    A,  // 0
    B,  // 1
    C,  // 2
}

enum Bar {
    A = 1,    //   1
    B,        //   2
    C = 100,  // 100
}

enum Baz {
    A = 'AAA',
    B = 'BBB',
    C = 'CCC',
}
```


### Primitive types

```ts
type A = number | bigint | string | boolean;
```


### Value types

See `Literals > Type literals` section.


### Array type component (Repeated type component)

#### Simple array type
```ts
type A = string[];
```

#### Complex array type
```ts
type A = Array<boolean|number|boolean[]|{a: string}|'a'>;
```

#### Simple array type with quantity assertion
```ts
type A = string[10..20]; // 10 <= data.length <= 20
type B = string[10..];   // 10 <= data.length
type C = string[..20];   //       data.length <= 20
```

#### Complex array type with quantity assertion
```ts
type A = Array<boolean, 10..20>; // 10 <= data.length <= 20
type B = Array<boolean, 10..>;   // 10 <= data.length
type C = Array<boolean, ..20>;   //       data.length <= 20
```


### Sequence type component

#### Fixed length
```ts
type A = [string, number, 10, 20, 'a'];
```

#### Flex length
```ts
type A = [string, number?, boolean?, string?];              // Zero or once
type B = [string, ...<number>, ...<boolean>, ...<string>];  // Zero or more
type C = [string, ...<number, 10..20>,
                  ...<boolean, 10..>,
                  ...<string, ..20>];                       // With quantity assertion
```


### Type operators

* `P & Q`
    * Intersection type
    * Result type has all the members of P and Q.
* `P | Q`
    * Union type
    * Match to P or Q type.
* `P - Q`
    * Subtraction type
    * Result type has the members of P that is NOT exist in Q.
* `Pick<T,K>`
    * e.g. `Pick<Foo, 'a' | 'b' | 'c'>`
    * Picked type
    * Result type has the members of T that is exist in K.
* `Omit<T,K>`
    * e.g. `Omit<Foo, 'a' | 'b' | 'c'>`
    * Picked type
    * Result type has the members of T that is NOT exist in K.
* `Partial<T>`
    * All the member of result type are optioonal.
    * `Partial<{a: string}>` is equivalent to `{a?: string}`.


### Export

```ts
export type Foo = string;

export interface Bar {
    a: string;
}

export enum Baz {
    A,
}
```


### Import

This statement is passed through to the generated codes.

```ts
import from 'foo';
import * as foo from 'foo';
import {a, b as bb} from 'foo';
```


### External

Define the external symbols as `any` type.  
This statement is removed from the generated code.

```ts
external P, Q, R;
```
or
```ts
/// @tynder-external P, Q, R
```


### Comments

```ts
//  ↓↓↓ directive line comment ↓↓↓
// @tynder-external P, Q, R
/// @tynder-external S, T

/** doc comment */
type Foo = string | number;

/** doc comment */
interface Bar {
    /** doc comment */
    a?: string;
}

/** doc comment */
enum Baz {
    /** doc comment */
    A,
}

// line comment
/* block comment */
/*
   block comment
 */
```
Doc comments are preserved.


### Literals

#### Type literals
```ts
type A = 'a' | "b" | `c` |
         20 | -10 | -0.12 | -9.3+8e |
         0xff | 0o77 | 0b11 | +Infinity | -Infinity |
         true | false | null | undefined |
         {a: string, b: 'aaa'} | [10, string];
```

#### Value literals
```ts
type A = @match(/^.+$/) string;     // RegExp
type B = @range(10, 20) number;     // number
type C = @range('a', 'b') string;   // string
type D = @msg({
    required: '...',
    typeUnmatched: '...' }) number; // object
```


### Directives

```ts
/// @tynder-external P, Q, R
```

* `@tynder-external` _type_ [, ...]
    * Declare external types as `any`.


### Generics
Generics actual parameters are removed.

#### DSL:
```ts
/// @tynder-external Map, Set

interface Foo {
    a: Map<string, number>;
    b: Set<string>;
}
```

#### TypeScript generated type definition:

```ts
interface Foo {
    a: any;
    b: any;
}
```



## Customize error messages

### Customize

```ts
@msgId('M1111')                                                   // Custom error message id
export interface Foo {
    @msgId('M1234')
    s: number;                                                    // Custom error message id

    @msg({
        required: '"%{name}" of "%{parentType}" is required.',
        typeUnmatched: '"%{name}" of "%{parentType}" should be "%{expectedType}".',
    })
    t: number;                                                    // Custom error message

    @msg('"%{name}" of "%{parentType}" is not valid.')
    u: number;                                                    // Custom error message
}
```


### Error messages

```ts
export const defaultMessages: ErrorMessages = {
    invalidDefinition: '"%{name}" of "%{parentType}" type definition is invalid.',
    required: '"%{name}" of "%{parentType}" is required.',
    typeUnmatched: '"%{name}" of "%{parentType}" should be "%{expectedType}".',
    repeatQtyUnmatched: '"%{name}" of "%{parentType}" should repeat %{repeatQty} times.',
    sequenceUnmatched: '"%{name}" of "%{parentType}" sequence is not matched',
    valueRangeUnmatched: '"%{name}" of "%{parentType}" value should be in the range %{minValue} to %{maxValue}.',
    valuePatternUnmatched: '%{name}" of "%{parentType}" value should be matched to pattern "%{pattern}"',
    valueLengthUnmatched: '"%{name}" of "%{parentType}" length should be in the range %{minLength} to %{maxLength}.',
    valueUnmatched: '"%{name}" of "%{parentType}" value should be "%{expectedValue}".',
};
```

### Keyword substitutions

* `%{expectedType}`
* `%{type}`
* `%{expectedValue}`
* `%{value}`
* `%{repeatQty}`
* `%{minValue}`
* `%{maxValue}`
* `%{pattern}`
* `%{minLength}`
* `%{maxLength}`
* `%{name}`
* `%{parentType}`



## CLI subcommands and options

```
Usage:
  tynder subcommand options...

Subcommands:
  help
      Show this help.
  compile
      Compile schema and output as JSON files.
          * default input file extension is *.tss
          * default output file extension is *.json
  compile-as-ts
      Compile schema and output as JavaScript|TypeScript files.
          * default input file extension is *.tss
          * default output file extension is *.ts
      Generated code is:
          const schema = {...};
          export default schema;
  gen-ts
      Compile schema and generate TypeScript type definition files.
          * default input file extension is *.tss
          * default output file extension is *.d.ts

Options:
  --indir dirname
      Input directory
  --outdir dirname
      Output directory
  --inext fileExtensionName
      Input files' extension
  --outext fileExtensionName
      Output files' extension
```

Example:
```sh
tynder compile --indir path/to/schema/tynder --outdir path/to/schema/_compiled
```


## Limitations
* Generics actual parameters are removed.
    * Except
      `Array<T,quantity?>`,
      [`Pick<T,K>`](https://www.typescriptlang.org/docs/handbook/utility-types.html#picktk),
      [`Omit<T,K>`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittk) and
      [`Partial<T>`](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialt).
* ~~Recursive types are not available.~~
* ~~Back reference of types are not available.~~



## Bugs
* [X] ~~Quantity assertion of the sequence type's last item is not checked.~~
* Error reporter cannot resolve some keyword substitutions in complex type.
* If validation fails on a nested component type of a complex type, the customized error message is lost.


## License
[ISC](https://github.com/shellyln/tynder/blob/master/LICENSE.md)  
Copyright (c) 2019 Shellyl_N and Authors.
