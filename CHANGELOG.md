# Changelog

## v0.2.0
### Breaking changes
* Change the `dataPath` format for validation errors.
  * Path separator after `type` is changed from `.` to `:`.
    * before changed: `File.acl.(0:repeated).ACL.target`
    * after changed: `File:acl.(0:repeated).ACL:target`

### Changes
* `[FIX]` Fix validation reporting. (incorrect parent name)

---
