# Tynder

![Tynder](https://raw.githubusercontent.com/shellyln/tynder/master/docs/tynder.svg?sanitize=true)

TypeScript friendly Data validator for JavaScript.

Validate data in browsers, node.js back-end servers, and various language platforms by simply writing the schema once in TypeScript with extended syntax.


[![npm](https://img.shields.io/npm/v/tynder.svg)](https://www.npmjs.com/package/tynder)
[![GitHub release](https://img.shields.io/github/release/shellyln/tynder.svg)](https://github.com/shellyln/tynder/releases)
[![Travis](https://img.shields.io/travis/shellyln/tynder/master.svg)](https://travis-ci.org/shellyln/tynder)
[![GitHub forks](https://img.shields.io/github/forks/shellyln/tynder.svg?style=social&label=Fork)](https://github.com/shellyln/tynder/fork)
[![GitHub stars](https://img.shields.io/github/stars/shellyln/tynder.svg?style=social&label=Star)](https://github.com/shellyln/tynder)



## Features
* Define the **schema with TypeScript-like DSL**.
* **Validate** data against the defined schema.
* End user friendly **custom validation error message**.
* Create subset by **cherrypicking** fields from original data with the defined schema.
* Apply the **patch** data to the original data.
* Generate type definition or schema files using CLI / API.
    * TypeScript
    * JSON Schema
    * Protocol Buffers 3 (experimental)
    * GraphQL (experimental)

![write-once-use-anywhere](https://shellyln.github.io/tynder/assets/image/write-once-v2.svg)


## Get started

* [tynder-express-react-ts-esm-quickstart](https://github.com/shellyln/tynder-express-react-ts-esm-quickstart)
    * A boilerplate for React client + Express server project using Tynder data validation library.


## Playground
* [TypeScript (Tynder DSL) → JSON Schema | GraphQL | Protobuf Converter](https://shellyln.github.io/tynder/playground.html)
    * Convert schema from `Tynder DSL` to JSON Schema, GraphQL and Protobuf.
* [TypeScript (Tynder DSL) Schema Validator](https://shellyln.github.io/tynder/playground2.html)
    * Validate data against the schema.

## Install

```sh
npm install --save tynder
```

> NOTICE:  
> To use without webpack on Node.js, enabling ES Modules.
> * Add flags:
>     * ```bash
>       node --experimental-modules \
>            --es-module-specifier-resolution=node \
>            --experimental-json-modules \
>            app.mjs
>       ```
>
> * Use `import` statement:
>     * ```ts
>       import { ValidationContext }       from 'tynder/modules/types';
>       import { deserializeFromObject }   from 'tynder/modules/serializer';
>       import { validate,
>                getType }                 from 'tynder/modules/validator';
>       ```
> * Add package.json `{ "type": "module" }` or `{ "type": "commonjs" }` to your source directories.
>
> See [tynder-express-react-ts-esm-quickstart](https://github.com/shellyln/tynder-express-react-ts-esm-quickstart) and
> [Node.js Documentation - ECMAScript Modules](https://nodejs.org/api/esm.html).



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
    p: integer;                                                   // Integer value
    @range('AAA', 'FFF')
    q: string;                                                    // Ranged value (string)
    @match(/^.+$/)
    r: string;                                                    // Pattern matched value
    s: Foo;                                                       // Refer a defined type
    @msgId('M1234')
    t: number;                                                    // Custom error message id
    @msg({
        required: '"%{name}" of "%{parentType}" is required.',
        typeUnmatched: '"%{name}" of "%{parentType}" should be "%{expectedType}".',
    })
    u: number;                                                    // Custom error message
    @msg('"%{name}" of "%{parentType}" is not valid.')
    v: number;                                                    // Custom error message
}

// line comment
/* block comment */
```
Default file extension is `*.tss`.


### Compile using CLI commands:
```sh
# Compile schema and output as JSON files.
tynder compile               --indir path/to/schema/tynder --outdir path/to/schema/_compiled
# Compile schema and output as JavaScript|TypeScript files.
tynder compile-as-ts         --indir path/to/schema/tynder --outdir path/to/schema/_compiled
# Compile schema and generate TypeScript type definition files.
tynder gen-ts                --indir path/to/schema/tynder --outdir path/to/typescript-src
# Compile schema and generate JSON Schema files.
tynder gen-json-schema       --indir path/to/schema/tynder --outdir path/to/schema/json-schema
# Compile schema and generate JSON Schema as JavaScript|TypeScript files.
tynder gen-json-schema-as-ts --indir path/to/schema/tynder --outdir path/to/schema/json-schema
# Compile schema and generate Protocol Buffers 3 type definition files.
tynder gen-proto3            --indir path/to/schema/tynder --outdir path/to/schema/proto3
# Compile schema and generate GraphQL type definition files.
tynder gen-graphql           --indir path/to/schema/tynder --outdir path/to/schema/graphql
```


### Compile using API:
```ts
import { compile } from 'tynder/modules/compiler';

export default const mySchema = compile(`
    type Foo = string;
    interface A {
        @maxLength(4)
        a: Foo;
        z?: boolean;
    }
`);
```


### Validating:
```ts
import { validate,
         getType }           from 'tynder/modules/validator';
import { ValidationContext } from 'tynder/modules/types';
import default as mySchema   from './myschema';


const validated1 = validate({
    a: 'x',
    b: 3,
}, getType(mySchema, 'A')); // {value: {a: 'x', b: 3}}


const validated2 = validate({
    aa: 'x',
    b: 3,
}, getType(mySchema, 'A')); // null


const ctx3: Partial<ValidationContext> =
{                            // To receive the error messages, define the context as a variable.
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
        ctx3.errors, // error messages
        null, 2));
}
```


### Cherrypicking and patching:
```ts
import { getType }           from 'tynder/modules/validator';
import { pick,
         patch }             from 'tynder/modules/picker';
import { ValidationContext } from 'tynder/modules/types';
import * as op               from 'tynder/modules/operators';
import default as mySchema   from './myschema';


const original = {
    a: 'x',
    b: 3,
};
const needleType = op.picked(getType(mySchema, 'A'), 'a');


try {
    const needle1 = pick(original, needleType); // {a: 'x'}
    const unknownInput1: unknown = { // Edit the needle data
        ...needle1,
        a: 'y',
        q: 1234,
    };
    const changed1 = patch(original, unknownInput1, needleType); // {a: 'y', b: 3}
} catch (e) {
    console.log(e.message);
    console.log(e.ctx?.errors);
}


try {
    const needle2 = pick(original, needleType); // {a: 'x'}
    const unknownInput2: unknown = { // Edit the needle data
        ...needle2,
        a: 'yyyyy',
        q: 1234,
    };
    const changed1 = patch(original, unknownInput2, needleType); // Throws an error
} catch (e) {
    console.log(e.message);
    console.log(e.ctx?.errors);
}


try {
    const ctx3: Partial<ValidationContext> =
    {                     // To receive the error messages, define the context as a variable.
        checkAll: true,   // (optional) Set to true to continue validation after the first error.
        schema: mySchema, // (optional) Pass "schema" to check for recursive types.
    };

    const needle3 = pick({
        aa: 'x',
        b: 3,
    }, needleType, ctx3); // Throws an error
} catch (e) {
    console.log(e.message);
    console.log(e.ctx?.errors);
}
```


## Load pre-compiled schema and type definitions

### From object (import)
```ts
import { deserializeFromObject } from 'tynder/modules/lib/serializer';
import { Foo, A }                from './path/to/schema-types/my-schema';    // type definitions (.d.ts)
import mySchema_                 from './path/to/schema-compiled/my-schema'; // pre-compiled schema (.ts)

const mySchema = deserializeFromObject(mySchema_);

const unknownInput: unknown = {a: 'x'};
const validated = validate<A>(unknownInput, getType(mySchema, 'A'));

if (validated) {
    const validatedInput = validated.value; // validatedInput is type-safe
    ...
}
```


### From object (require JSON file)
```ts
import { deserializeFromObject } from 'tynder/modules/lib/serializer';
import { Foo, A }                from './path/to/schema-types/my-schema'; // type definitions (.d.ts)

// import { createRequireFromPath } from 'module';
// import { fileURLToPath }         from 'url';
// const require = createRequireFromPath(fileURLToPath(import.meta.url));

const mySchema = deserializeFromObject(
    require('./path/to/schema-compiled/my-schema.json')); // pre-compiled schema (.json)

const unknownInput: unknown = {a: 'x'};
const validated = validate<A>(unknownInput, getType(mySchema, 'A'));

if (validated) {
    const validatedInput = validated.value; // validatedInput is type-safe
    ...
}
```
or
```ts
import { deserializeFromObject } from 'tynder/modules/lib/serializer';
import { Foo, A }                from './path/to/schema-types/my-schema';         // type definitions (.d.ts)
import mySchemaJson              from './path/to/schema-compiled/my-schema.json'; // pre-compiled schema (.json)

const mySchema = deserializeFromObject(mySchemaJson);

const unknownInput: unknown = {a: 'x'};
const validated = validate<A>(unknownInput, getType(mySchema, 'A'));

if (validated) {
    const validatedInput = validated.value; // validatedInput is type-safe
    ...
}
```


### From text
```ts
import { deserialize } from 'tynder/modules/lib/serializer';
import { Foo, A }      from './path/to/schema-types/my-schema'; // type definitions (.d.ts)
import * as fs         from 'fs';

const mySchema = deserialize(
    fs.readFileSync('./path/to/compiled/my-schema.json', 'utf8')); // pre-compiled schema (.json)

const unknownInput: unknown = {a: 'x'};
const validated = validate<A>(unknownInput, getType(mySchema, 'A'));

if (validated) {
    const validatedInput = validated.value; // validatedInput is type-safe
    ...
}
```


### Type-safe Cherrypicking and patching:

```ts
// Load pre-compiled schema and type definitions
...

interface Store {
    baz: A;
}
const store: Store = {
    baz: {
        a: 'x',
        z: false,
    }
};

const needleType = op.picked(getType(mySchema, 'A'), 'a');

try {
    const needle = pick(store.baz, needleType); // {a: 'x'}
                                                // `needle` is RecursivePartial<A>
    const unknownInput: unknown = {             // Edit the needle data
        ...needle,
        a: 'y',
        q: 1234,
    };
    store.baz = patch(store.baz, unknownInput, needleType); // {a: 'y', z: false}
} catch (e) {
    console.log(e.message);
    console.log(e.ctx?.errors);
}
```


## Define schema with functional API

```ts
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

const validated1 = validate({...}, myType);
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
* `@stereotype(stereotype: string)`
    * Perform custom validation.
* `@forceCast`
    * Validate after forcibly casting to the assertion's type.
* `@msg(messages: string | ErrorMessages)`
    * Set custom error message.
* `@msgId(messageId: string)`
    * Set custom error message id.


##### Date / Datetime stereotypes

```ts
...
import { stereotypes as dateStereotypes } from 'tynder/stereotypes/date';

const schema = compile(`
    interface Foo {
        @stereotype('date')
        @range('=today first-date-of-mo', '=today last-date-of-mo')
        a: string;

        @stereotype('date')
        @range('2020-01-01', '2030-12-31')
        b: string;

        @stereotype('date')
        @range('2020-01-01', '=today +2yr @12mo @31day')
        c: string;
    }
`);

const ty = getType(schema, 'Foo');
const ctx: Partial<ValidationContext> = {
    checkAll: true,
    stereotypes: new Map([
        ...dateStereotypes,
    ]),
};

const d = (new Date()).toISOString().slice(0, 10);

const z = validate<any>({
    a: d,
    b: '2020-01-01',
    c: d,
}, ty, ctx);
```

###### Stereotypes

* `date`
  * data (UTC timezone)
* `lcdate`
  * data (local timezone)
* `datetime`
  * datetime (UTC timezone)
* `lcdatetime`
  * datetime (local timezone)


###### Formula syntax

```
Expression: ISODateAndDatetime | ("=" DateTimeFormula)

DateTimeFormula:
    (ISODateAndDatetime |
     ("current" | "now") |
     "today"
     ("@" | "+" | "-") digit ("yr" | "mo" | "days" | "day" | "hr" | "min" | "sec") |
     "first-date-of-yr" |
     "last-date-of-yr" |
     "first-date-of-mo" |
     "last-date-of-mo" |
    )
```


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
/** Primitive types */
type A = number | integer | bigint | string | boolean;

/** Null-like types */
type B = null | undefined;

/** Placeholder types */
type C = any | unknown | never;
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
type D = string[10];     // data.length === 10
```

#### Complex array type with quantity assertion
```ts
type A = Array<boolean, 10..20>; // 10 <= data.length <= 20
type B = Array<boolean, 10..>;   // 10 <= data.length
type C = Array<boolean, ..20>;   //       data.length <= 20
type D = Array<boolean, 10>;     // data.length === 10
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


### Referencing other interface members
```ts
interface Foo {
    @match(/^[A-Za-z]+$/)
    name: string;
    @match(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
    email: string;
}

interface Bar {
    foo: Foo
}

interface User {
    userName: Foo.name;
    primaryEmail: Foo.email;
    primaryAliasName: Bar.foo.name;
    aliasNames: Bar.foo.name[];
}
```

> NOTE:
> * This syntax is incompatible with TypeScript.
>   * Generated TypeScript type definition is `userName: Foo['name'];`.
>   * Tynder compiler does not allow `userName: Foo['name'];`.


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
         -10n | 0n | 123n |
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
    a: Map<string, number>;  // validator treats it as `any`.
    b: Set<string>;          // validator treats it as `any`.
}
```

#### TypeScript generated type definition:

```ts
interface Foo {
    a: Map;  // generics actual parameters are removed.
    b: Set;  // generics actual parameters are removed.
}
```

> NOTE: Generic interfaces and generic types cannot be defined.

* e.g.

    ```ts
    interface Foo<T> { // It is not possible.
        a: T;
    }
    ```



## Customize error messages

### Customize message of items

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


### Default error messages

```ts
export const defaultMessages: ErrorMessages = {
    invalidDefinition:       '"%{name}" of "%{parentType}" type definition is invalid.',
    required:                '"%{name}" of "%{parentType}" is required.',
    typeUnmatched:           '"%{name}" of "%{parentType}" should be type "%{expectedType}".',
    additionalPropUnmatched: '"%{addtionalProps}" of "%{parentType}" are not matched to additional property patterns.',
    repeatQtyUnmatched:      '"%{name}" of "%{parentType}" should repeat %{repeatQty} times.',
    sequenceUnmatched:       '"%{name}" of "%{parentType}" sequence is not matched',
    valueRangeUnmatched:     '"%{name}" of "%{parentType}" value should be in the range %{minValue} to %{maxValue}.',
    valuePatternUnmatched:   '"%{name}" of "%{parentType}" value should be matched to pattern "%{pattern}"',
    valueLengthUnmatched:    '"%{name}" of "%{parentType}" length should be in the range %{minLength} to %{maxLength}.',
    valueUnmatched:          '"%{name}" of "%{parentType}" value should be "%{expectedValue}".',
};
```

### Change default messages
```ts
import { compile }           from 'tynder/modules/compiler';
import { getType }           from 'tynder/modules/validator';
import { pick,
         merge }             from 'tynder/modules/picker';
import { ValidationContext } from 'tynder/modules/types';

export default const mySchema = compile(`
    interface A {
        @msg({
            required: 'Don\'t forget "%{name}"!.',
        })
        a: string;
    }
`);

const ctx: Partial<ValidationContext> = {
    checkAll: true,
    noAdditionalProps: true,
    schema: mySchema,
    errorMessages: {
        required: '%{name}" is requred!',
    },
};

const validated = validate({
    aa: 'x',
}, getType(mySchema, 'A'), ctx3);

if (validated3 === null) {
    console.log(JSON.stringify(
        ctx3.errors, // error messages
        null, 2));
}
```

Precedence is "`Default messages` < `ctx.errorMessages` < `@msg()`".


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
* `%{dataPath}`
* `%{addtionalProps}`



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
  gen-json-schema
      Compile schema and generate 'JSON Schema' files.
          * default input file extension is *.tss
          * default output file extension is *.json
  gen-json-schema-as-ts
      Compile schema and generate 'JSON Schema'
      as JavaScript|TypeScript files.
          * default input file extension is *.tss
          * default output file extension is *.ts
      Generated code is:
          const schema = {...};
          export default schema;
  gen-proto3
      Compile schema and generate 'Protocol Buffers 3' type definition files.
          * default input file extension is *.tss
          * default output file extension is *.proto
  gen-graphql
      Compile schema and generate 'GraphQL' type definition files.
          * default input file extension is *.tss
          * default output file extension is *.graphql

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



## License
[ISC](https://github.com/shellyln/tynder/blob/master/LICENSE.md)  
Copyright (c) 2019 Shellyl_N and Authors.
