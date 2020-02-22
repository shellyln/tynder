
// tslint:disable: object-literal-key-quotes
const schema = {
  "version": "tynder/1.0",
  "ns": {
    ".": {
      "ACL": {
        "kind": "object",
        "members": [
          [
            "target",
            {
              "kind": "primitive",
              "primitiveName": "string",
              "name": "target"
            }
          ],
          [
            "value",
            {
              "kind": "primitive",
              "primitiveName": "string",
              "name": "value"
            }
          ]
        ],
        "typeName": "ACL",
        "name": "ACL"
      },
      "EntryBase": {
        "kind": "object",
        "members": [
          [
            "name",
            {
              "kind": "primitive",
              "primitiveName": "string",
              "name": "name"
            },
            false,
            "Entry name"
          ],
          [
            "acl",
            {
              "kind": "repeated",
              "min": null,
              "max": null,
              "repeated": {
                "kind": "symlink",
                "symlinkTargetName": "ACL",
                "typeName": "ACL",
                "name": "ACL"
              },
              "name": "acl"
            },
            false,
            "ACL infos"
          ]
        ],
        "docComment": "Entry base",
        "typeName": "EntryBase",
        "name": "EntryBase"
      },
      "File": {
        "kind": "object",
        "members": [
          [
            "type",
            {
              "kind": "primitive-value",
              "value": "file",
              "name": "type"
            },
            false,
            "Entry type"
          ],
          [
            "name",
            {
              "kind": "primitive",
              "primitiveName": "string",
              "name": "name"
            },
            true,
            "Entry name"
          ],
          [
            "acl",
            {
              "kind": "repeated",
              "min": null,
              "max": null,
              "repeated": {
                "kind": "symlink",
                "symlinkTargetName": "ACL",
                "typeName": "ACL",
                "name": "ACL"
              },
              "name": "acl"
            },
            true,
            "ACL infos"
          ]
        ],
        "baseTypes": [
          {
            "kind": "symlink",
            "symlinkTargetName": "EntryBase",
            "typeName": "EntryBase",
            "name": "EntryBase",
            "docComment": "Entry base"
          }
        ],
        "docComment": "File entry",
        "typeName": "File",
        "name": "File"
      },
      "Folder": {
        "kind": "object",
        "members": [
          [
            "type",
            {
              "kind": "primitive-value",
              "value": "folder",
              "name": "type"
            },
            false,
            "Entry type"
          ],
          [
            "entries",
            {
              "kind": "repeated",
              "min": null,
              "max": null,
              "repeated": {
                "kind": "symlink",
                "symlinkTargetName": "Entry",
                "typeName": "Entry",
                "name": "Entry"
              },
              "name": "entries"
            },
            false,
            "Child entries"
          ],
          [
            "name",
            {
              "kind": "primitive",
              "primitiveName": "string",
              "name": "name"
            },
            true,
            "Entry name"
          ],
          [
            "acl",
            {
              "kind": "repeated",
              "min": null,
              "max": null,
              "repeated": {
                "kind": "symlink",
                "symlinkTargetName": "ACL",
                "typeName": "ACL",
                "name": "ACL"
              },
              "name": "acl"
            },
            true,
            "ACL infos"
          ]
        ],
        "baseTypes": [
          {
            "kind": "symlink",
            "symlinkTargetName": "EntryBase",
            "typeName": "EntryBase",
            "name": "EntryBase",
            "docComment": "Entry base"
          }
        ],
        "docComment": "Folder entry",
        "typeName": "Folder",
        "name": "Folder"
      },
      "Entry": {
        "kind": "one-of",
        "oneOf": [
          {
            "kind": "symlink",
            "symlinkTargetName": "File",
            "typeName": "File",
            "name": "File",
            "docComment": "File entry"
          },
          {
            "kind": "symlink",
            "symlinkTargetName": "Folder",
            "typeName": "Folder",
            "name": "Folder",
            "docComment": "Folder entry"
          }
        ],
        "docComment": "Entry (union type)",
        "typeName": "Entry",
        "name": "Entry"
      }
    }
  }
};
export default schema;
// tslint:enable: object-literal-key-quotes
