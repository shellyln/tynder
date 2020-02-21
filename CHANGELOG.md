# Changelog

## v0.2.1

* Update dependencies.


## v0.2.0

* `[FIX]` Fix validation reporting. (incorrect parent name)

### _Breaking changes_
* Change the `dataPath` format for validation errors.
  * Path separator after `type` is changed from `.` to `:`.
    * before changed: `File.acl.(0:repeated).ACL.target`
    * after changed: `File:acl.(0:repeated).ACL:target`
