# Changelog

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
