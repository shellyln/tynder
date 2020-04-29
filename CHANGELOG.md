# Changelog

## v0.5.1

* `[FIX]` Fix and improve codegen output (CSharp, Protobuf3).
* Update CI configurations.


## v0.5.0

* Add `C#` type definition code generation.
* Improve code generation (TypeScript, Protobuf, GraphQL).


----


## v0.4.1

* `[FIX]` Fix TypeScript code generation: object member non-ascii symbol name should be enclose with quotation.


## v0.4.0

* Add type guard functions `isType`.
* `[FIX]` Fix `date`, `lcdate`, `datetime`, `lcdatetime` stereotypes.
  * Constructor returns wrong month if passed month's day of month is shorted than current month.

### _Breaking changes_
* Type of `ValidationError::ctx` is changed to `Partial<ValidationContext>`.


----


## v0.3.11

* `[FIX]` Fix d.ts code generation: empty objects generate invalid code.


## v0.3.10

* `[FIX]` Fix d.ts code generation: additional-props entry is not output when other member entries are not exist.


## v0.3.9

* Add `unique-non-null` constraint.
* `[FIX]` Fix `unique` and `unique-non-null` constraint bug.


## v0.3.8

* Add `@constraint` decorator and `unique` constraint implementation.
* Add spec codes.


## v0.3.7

* Add `@meta` decorator.
  * User defined custom properties (meta informations).
    * Output to the compiled schema.
* Add spec codes.
* Update dev dependencies.
* Add eslint configurations.
* Edit github actions CI configuration.


## v0.3.6

* Add `first-date-of-fy(mo)` operator to `data` and `datetime` stereotype formula.
  * fiscal year operator.
* Add spec codes.


## v0.3.5

* `[FIX]` Fix stereotype, forceCast, and recordType decorators:
  when optional type, it should be decorated with ty.optional.
  * `v0.3.4` fix is broken.


## v0.3.4

* `[FIX]` Fix stereotype, forceCast, and recordType decorators:
  when optional type, it should be decorated with ty.optional.


## v0.3.3

* `[FIX]` Fix compiler: Fix character class that can be used in symbols.


## v0.3.2

* Improve one-of assertion validation error message.
* Add `@recordType` decorator.
  * If the decorated member field of object is validated, the union type is determined.


## v0.3.1

* `[FIX]` Fix error handling and reporting of stereotype.
* Improve playground.


## v0.3.0

* Add `@stereotype` decorator.
  * Perform custom validation.
* Add standard stereotypes.
  * `date`
    * date (UTC timezone)
  * `lcdate`
    * date (local timezone)
  * `datetime`
    * datetime (UTC timezone)
  * `lcdatetime`
    * datetime (local timezone)
* Add `@forceCast` decorator.
  * Validate after forcibly casting to the assertion's type.
* Add spec codes.


----


## v0.2.3

* `[FIX]` Fix serializer & deserializer bugs.
  * RegExp pattern additonal props are not serialize/deserialize correctly.
* Add spec codes.


## v0.2.2

* `[FIX]` Fix serializer & deserializer bugs.
  * Object member meta info format is wrong. (serializer)
  * Optional info is lost in named type case. (serializer)
  * Extended interface has unexpected duplicated member properties. (deserializer)
* Add spec codes.


## v0.2.1

* A grammar for referencing other interface members has been added.
* `[FIX]` Fix meta info lost during serialization.
  * Occurs when serializing named non-primitive types.
* Update dependencies.


## v0.2.0

* `[FIX]` Fix validation reporting. (incorrect parent name)

### _Breaking changes_
* Change the `dataPath` format for validation errors.
  * Path separator after `type` is changed from `.` to `:`.
    * before changed: `File.acl.(0:repeated).ACL.target`
    * after changed: `File:acl.(0:repeated).ACL:target`
