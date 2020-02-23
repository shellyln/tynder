# Changelog

## v0.2.2

* `[FIX]` Fix serializer bugs.
  * Object member meta info format is wrong.
  * Optional info is lost in named type case.
  * Extended interface has unexpected duplicated member properties.
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
