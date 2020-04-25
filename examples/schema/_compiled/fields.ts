
// tslint:disable: object-literal-key-quotes
const schema = {
  "version": "tynder/1.0",
  "ns": {
    ".": {
      "NumberType": {
        "kind": "primitive",
        "primitiveName": "number",
        "typeName": "NumberType",
        "name": "NumberType"
      },
      "A": {
        "kind": "object",
        "members": [
          [
            "numberTypeField",
            {
              "kind": "symlink",
              "symlinkTargetName": "NumberType",
              "typeName": "NumberType",
              "name": "numberTypeField"
            }
          ],
          [
            "integerTypeField",
            {
              "kind": "primitive",
              "primitiveName": "integer",
              "name": "integerTypeField"
            }
          ],
          [
            "bigIntTypeField",
            {
              "kind": "primitive",
              "primitiveName": "bigint",
              "name": "bigIntTypeField"
            }
          ],
          [
            "stringTypeField",
            {
              "kind": "primitive",
              "primitiveName": "string",
              "name": "stringTypeField"
            }
          ],
          [
            "booleanTypeField",
            {
              "kind": "primitive",
              "primitiveName": "boolean",
              "name": "booleanTypeField"
            }
          ],
          [
            "nullTypeField",
            {
              "kind": "primitive",
              "primitiveName": "null",
              "name": "nullTypeField"
            }
          ],
          [
            "undefinedTypeField",
            {
              "kind": "primitive",
              "primitiveName": "undefined",
              "name": "undefinedTypeField"
            }
          ],
          [
            "anyTypeField",
            {
              "kind": "any",
              "name": "anyTypeField"
            }
          ],
          [
            "unknownTypeField",
            {
              "kind": "unknown",
              "name": "unknownTypeField"
            }
          ],
          [
            "neverTypeField",
            {
              "kind": "never",
              "name": "neverTypeField"
            }
          ],
          [
            "numberValueTypeField",
            {
              "kind": "primitive-value",
              "value": 3,
              "name": "numberValueTypeField"
            }
          ],
          [
            "integerValueTypeField",
            {
              "kind": "primitive",
              "primitiveName": "integer",
              "name": "integerValueTypeField"
            }
          ],
          [
            "bigIntValueTypeField",
            {
              "kind": "primitive-value",
              "value": "7",
              "name": "bigIntValueTypeField",
              "primitiveName": "bigint"
            }
          ],
          [
            "stringValueTypeField",
            {
              "kind": "primitive-value",
              "value": "XB",
              "name": "stringValueTypeField"
            }
          ],
          [
            "booleanValueTypeField",
            {
              "kind": "primitive-value",
              "value": true,
              "name": "booleanValueTypeField"
            }
          ]
        ],
        "typeName": "A",
        "name": "A"
      },
      "B": {
        "kind": "object",
        "members": [
          [
            "numberTypeField",
            {
              "kind": "optional",
              "optional": {
                "kind": "symlink",
                "symlinkTargetName": "NumberType",
                "typeName": "NumberType",
                "name": "NumberType"
              },
              "typeName": "NumberType",
              "name": "numberTypeField"
            }
          ],
          [
            "integerTypeField",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "integer"
              },
              "name": "integerTypeField"
            }
          ],
          [
            "bigIntTypeField",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "bigint"
              },
              "name": "bigIntTypeField"
            }
          ],
          [
            "stringTypeField",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "stringTypeField"
            }
          ],
          [
            "booleanTypeField",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "boolean"
              },
              "name": "booleanTypeField"
            }
          ],
          [
            "nullTypeField",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "null"
              },
              "name": "nullTypeField"
            }
          ],
          [
            "undefinedTypeField",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "undefined"
              },
              "name": "undefinedTypeField"
            }
          ],
          [
            "anyTypeField",
            {
              "kind": "optional",
              "optional": {
                "kind": "any"
              },
              "name": "anyTypeField"
            }
          ],
          [
            "unknownTypeField",
            {
              "kind": "optional",
              "optional": {
                "kind": "unknown"
              },
              "name": "unknownTypeField"
            }
          ],
          [
            "neverTypeField",
            {
              "kind": "optional",
              "optional": {
                "kind": "never"
              },
              "name": "neverTypeField"
            }
          ],
          [
            "numberValueTypeField",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive-value",
                "value": 3
              },
              "name": "numberValueTypeField"
            }
          ],
          [
            "integerValueTypeField",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "integer"
              },
              "name": "integerValueTypeField"
            }
          ],
          [
            "bigIntValueTypeField",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive-value",
                "value": "7",
                "primitiveName": "bigint"
              },
              "name": "bigIntValueTypeField"
            }
          ],
          [
            "stringValueTypeField",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive-value",
                "value": "XB"
              },
              "name": "stringValueTypeField"
            }
          ],
          [
            "booleanValueTypeField",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive-value",
                "value": true
              },
              "name": "booleanValueTypeField"
            }
          ]
        ],
        "typeName": "B",
        "name": "B"
      },
      "C": {
        "kind": "object",
        "members": [
          [
            "numberTypeField",
            {
              "kind": "symlink",
              "symlinkTargetName": "NumberType",
              "typeName": "NumberType",
              "name": "numberTypeField"
            },
            true
          ],
          [
            "integerTypeField",
            {
              "kind": "primitive",
              "primitiveName": "integer",
              "name": "integerTypeField"
            },
            true
          ],
          [
            "bigIntTypeField",
            {
              "kind": "primitive",
              "primitiveName": "bigint",
              "name": "bigIntTypeField"
            },
            true
          ],
          [
            "stringTypeField",
            {
              "kind": "primitive",
              "primitiveName": "string",
              "name": "stringTypeField"
            },
            true
          ],
          [
            "booleanTypeField",
            {
              "kind": "primitive",
              "primitiveName": "boolean",
              "name": "booleanTypeField"
            },
            true
          ],
          [
            "nullTypeField",
            {
              "kind": "primitive",
              "primitiveName": "null",
              "name": "nullTypeField"
            },
            true
          ],
          [
            "undefinedTypeField",
            {
              "kind": "primitive",
              "primitiveName": "undefined",
              "name": "undefinedTypeField"
            },
            true
          ],
          [
            "anyTypeField",
            {
              "kind": "any",
              "name": "anyTypeField"
            },
            true
          ],
          [
            "unknownTypeField",
            {
              "kind": "unknown",
              "name": "unknownTypeField"
            },
            true
          ],
          [
            "neverTypeField",
            {
              "kind": "never",
              "name": "neverTypeField"
            },
            true
          ],
          [
            "numberValueTypeField",
            {
              "kind": "primitive-value",
              "value": 3,
              "name": "numberValueTypeField"
            },
            true
          ],
          [
            "integerValueTypeField",
            {
              "kind": "primitive",
              "primitiveName": "integer",
              "name": "integerValueTypeField"
            },
            true
          ],
          [
            "bigIntValueTypeField",
            {
              "kind": "primitive-value",
              "value": "7",
              "name": "bigIntValueTypeField",
              "primitiveName": "bigint"
            },
            true
          ],
          [
            "stringValueTypeField",
            {
              "kind": "primitive-value",
              "value": "XB",
              "name": "stringValueTypeField"
            },
            true
          ],
          [
            "booleanValueTypeField",
            {
              "kind": "primitive-value",
              "value": true,
              "name": "booleanValueTypeField"
            },
            true
          ]
        ],
        "baseTypes": [
          {
            "kind": "symlink",
            "symlinkTargetName": "A",
            "typeName": "A",
            "name": "A"
          }
        ],
        "typeName": "C",
        "name": "C"
      },
      "D": {
        "kind": "object",
        "members": [
          [
            "numberTypeField",
            {
              "kind": "optional",
              "optional": {
                "kind": "symlink",
                "symlinkTargetName": "NumberType",
                "typeName": "NumberType",
                "name": "NumberType"
              },
              "typeName": "NumberType",
              "name": "numberTypeField"
            }
          ],
          [
            "integerTypeField",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "integer"
              },
              "name": "integerTypeField"
            }
          ],
          [
            "bigIntTypeField",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "bigint"
              },
              "name": "bigIntTypeField"
            }
          ],
          [
            "stringTypeField",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "stringTypeField"
            }
          ],
          [
            "booleanTypeField",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "boolean"
              },
              "name": "booleanTypeField"
            }
          ],
          [
            "nullTypeField",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "null"
              },
              "name": "nullTypeField"
            }
          ],
          [
            "undefinedTypeField",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "undefined"
              },
              "name": "undefinedTypeField"
            }
          ],
          [
            "anyTypeField",
            {
              "kind": "optional",
              "optional": {
                "kind": "any"
              },
              "name": "anyTypeField"
            }
          ],
          [
            "unknownTypeField",
            {
              "kind": "optional",
              "optional": {
                "kind": "unknown"
              },
              "name": "unknownTypeField"
            }
          ],
          [
            "neverTypeField",
            {
              "kind": "optional",
              "optional": {
                "kind": "never"
              },
              "name": "neverTypeField"
            }
          ],
          [
            "numberValueTypeField",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive-value",
                "value": 3
              },
              "name": "numberValueTypeField"
            }
          ],
          [
            "integerValueTypeField",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "integer"
              },
              "name": "integerValueTypeField"
            }
          ],
          [
            "bigIntValueTypeField",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive-value",
                "value": "7",
                "primitiveName": "bigint"
              },
              "name": "bigIntValueTypeField"
            }
          ],
          [
            "stringValueTypeField",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive-value",
                "value": "XB"
              },
              "name": "stringValueTypeField"
            }
          ],
          [
            "booleanValueTypeField",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive-value",
                "value": true
              },
              "name": "booleanValueTypeField"
            }
          ]
        ],
        "typeName": "D",
        "name": "D"
      },
      "E": {
        "kind": "object",
        "members": [],
        "additionalProps": [
          [
            [
              "string"
            ],
            {
              "kind": "any"
            },
            false,
            "additional props"
          ]
        ],
        "typeName": "E",
        "name": "E"
      },
      "Z1": {
        "kind": "object",
        "members": [
          [
            "foo",
            {
              "kind": "symlink",
              "symlinkTargetName": "ACL.target",
              "typeName": "ACL.target",
              "name": "foo"
            }
          ],
          [
            "bar",
            {
              "kind": "primitive",
              "primitiveName": "string",
              "minLength": 0,
              "name": "bar",
              "typeName": "ACL.value"
            }
          ],
          [
            "baz",
            {
              "kind": "symlink",
              "symlinkTargetName": "ACL.target",
              "typeName": "ACL.target",
              "name": "baz"
            }
          ]
        ],
        "typeName": "Z1",
        "name": "Z1"
      },
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
              "minLength": 0,
              "name": "value"
            }
          ]
        ],
        "typeName": "ACL",
        "name": "ACL"
      },
      "Z2": {
        "kind": "object",
        "members": [
          [
            "foo",
            {
              "kind": "symlink",
              "symlinkTargetName": "ACL.target",
              "typeName": "ACL.target",
              "name": "foo"
            }
          ],
          [
            "bar",
            {
              "kind": "primitive",
              "primitiveName": "string",
              "minLength": 0,
              "name": "bar",
              "typeName": "ACL.value"
            }
          ],
          [
            "baz",
            {
              "kind": "primitive",
              "primitiveName": "string",
              "name": "baz",
              "typeName": "ACL.target",
              "maxLength": 10
            }
          ]
        ],
        "typeName": "Z2",
        "name": "Z2"
      },
      "ErrorTypes": {
        "kind": "enum",
        "values": [
          [
            "InvalidDefinition",
            1,
            "comment"
          ],
          [
            "Required",
            2,
            "comment"
          ],
          [
            "TypeUnmatched",
            3,
            "comment"
          ],
          [
            "RepeatQtyUnmatched",
            4,
            "comment"
          ],
          [
            "SequenceUnmatched",
            5
          ],
          [
            "ValueRangeUnmatched",
            6
          ],
          [
            "ValuePatternUnmatched",
            7
          ],
          [
            "ValueLengthUnmatched",
            8
          ],
          [
            "ValueUnmatched",
            9
          ]
        ],
        "typeName": "ErrorTypes",
        "name": "ErrorTypes"
      },
      "Foo": {
        "kind": "object",
        "members": [
          [
            "name",
            {
              "kind": "primitive",
              "primitiveName": "string",
              "pattern": "/^[A-Za-z]+$/",
              "name": "name"
            }
          ],
          [
            "email",
            {
              "kind": "primitive",
              "primitiveName": "string",
              "pattern": "/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$/",
              "name": "email"
            }
          ]
        ],
        "typeName": "Foo",
        "name": "Foo"
      },
      "Bar": {
        "kind": "object",
        "members": [
          [
            "foo",
            {
              "kind": "symlink",
              "symlinkTargetName": "Foo",
              "typeName": "Foo",
              "name": "foo"
            }
          ]
        ],
        "typeName": "Bar",
        "name": "Bar"
      },
      "Baz": {
        "kind": "object",
        "members": [
          [
            "aaa1",
            {
              "kind": "primitive",
              "primitiveName": "string",
              "minValue": "a",
              "maxValue": "z",
              "name": "aaa1"
            }
          ],
          [
            "aaa2",
            {
              "kind": "primitive",
              "primitiveName": "string",
              "minValue": "a",
              "maxValue": "z",
              "name": "aaa2"
            }
          ],
          [
            "aaa3",
            {
              "kind": "primitive",
              "primitiveName": "string",
              "maxValue": "z",
              "name": "aaa3"
            }
          ],
          [
            "aaa4",
            {
              "kind": "primitive",
              "primitiveName": "string",
              "minValue": "a",
              "name": "aaa4"
            }
          ],
          [
            "bbb1",
            {
              "kind": "primitive",
              "primitiveName": "integer",
              "minValue": -3,
              "maxValue": 5,
              "name": "bbb1"
            }
          ],
          [
            "bbb2",
            {
              "kind": "primitive",
              "primitiveName": "integer",
              "minValue": -3,
              "maxValue": 5,
              "name": "bbb2"
            }
          ],
          [
            "bbb3",
            {
              "kind": "primitive",
              "primitiveName": "integer",
              "maxValue": -3,
              "name": "bbb3"
            }
          ],
          [
            "bbb4",
            {
              "kind": "primitive",
              "primitiveName": "integer",
              "minValue": 5,
              "name": "bbb4"
            }
          ],
          [
            "ccc1",
            {
              "kind": "primitive",
              "primitiveName": "number",
              "minValue": -3,
              "maxValue": 5,
              "name": "ccc1"
            },
            false,
            "comment"
          ],
          [
            "ccc2",
            {
              "kind": "primitive",
              "primitiveName": "number",
              "minValue": -3,
              "maxValue": 5,
              "name": "ccc2"
            },
            false,
            "comment"
          ],
          [
            "ccc3",
            {
              "kind": "primitive",
              "primitiveName": "number",
              "maxValue": -3,
              "name": "ccc3"
            },
            false,
            "comment"
          ],
          [
            "ccc4",
            {
              "kind": "primitive",
              "primitiveName": "number",
              "minValue": 5,
              "name": "ccc4"
            },
            false,
            "comment"
          ],
          [
            "ddd1",
            {
              "kind": "sequence",
              "sequence": [
                {
                  "kind": "primitive",
                  "primitiveName": "number"
                },
                {
                  "kind": "primitive",
                  "primitiveName": "string"
                }
              ],
              "name": "ddd1"
            }
          ],
          [
            "ddd2",
            {
              "kind": "sequence",
              "sequence": [
                {
                  "kind": "spread",
                  "min": null,
                  "max": null,
                  "spread": {
                    "kind": "primitive",
                    "primitiveName": "number"
                  }
                },
                {
                  "kind": "primitive",
                  "primitiveName": "string"
                }
              ],
              "name": "ddd2"
            }
          ],
          [
            "ddd3",
            {
              "kind": "sequence",
              "sequence": [
                {
                  "kind": "spread",
                  "min": 10,
                  "max": null,
                  "spread": {
                    "kind": "primitive",
                    "primitiveName": "number"
                  }
                },
                {
                  "kind": "primitive",
                  "primitiveName": "string"
                }
              ],
              "name": "ddd3"
            }
          ],
          [
            "ddd4",
            {
              "kind": "sequence",
              "sequence": [
                {
                  "kind": "spread",
                  "min": null,
                  "max": 20,
                  "spread": {
                    "kind": "primitive",
                    "primitiveName": "number"
                  }
                },
                {
                  "kind": "primitive",
                  "primitiveName": "string"
                }
              ],
              "name": "ddd4"
            }
          ],
          [
            "ddd5",
            {
              "kind": "sequence",
              "sequence": [
                {
                  "kind": "spread",
                  "min": 10,
                  "max": 20,
                  "spread": {
                    "kind": "primitive",
                    "primitiveName": "number"
                  }
                },
                {
                  "kind": "primitive",
                  "primitiveName": "string"
                }
              ],
              "name": "ddd5"
            }
          ],
          [
            "ddd6",
            {
              "kind": "sequence",
              "sequence": [
                {
                  "kind": "optional",
                  "optional": {
                    "kind": "primitive",
                    "primitiveName": "number"
                  }
                },
                {
                  "kind": "primitive",
                  "primitiveName": "string"
                }
              ],
              "name": "ddd6"
            }
          ],
          [
            "eee1",
            {
              "kind": "repeated",
              "min": null,
              "max": null,
              "repeated": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "eee1"
            }
          ],
          [
            "eee2",
            {
              "kind": "repeated",
              "min": 10,
              "max": null,
              "repeated": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "eee2"
            }
          ],
          [
            "eee3",
            {
              "kind": "repeated",
              "min": null,
              "max": 20,
              "repeated": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "eee3"
            }
          ],
          [
            "eee4",
            {
              "kind": "repeated",
              "min": 10,
              "max": 20,
              "repeated": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "eee4"
            }
          ],
          [
            "fff",
            {
              "kind": "symlink",
              "symlinkTargetName": "ErrorTypes",
              "typeName": "ErrorTypes",
              "name": "fff"
            }
          ]
        ],
        "typeName": "Baz",
        "name": "Baz"
      },
      "User": {
        "kind": "object",
        "members": [
          [
            "userName",
            {
              "kind": "primitive",
              "primitiveName": "string",
              "pattern": "/^[A-Za-z]+$/",
              "name": "userName",
              "typeName": "Foo.name"
            }
          ],
          [
            "primaryEmail",
            {
              "kind": "primitive",
              "primitiveName": "string",
              "pattern": "/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$/",
              "name": "primaryEmail",
              "typeName": "Foo.email"
            }
          ],
          [
            "primaryAliasName",
            {
              "kind": "primitive",
              "primitiveName": "string",
              "pattern": "/^[A-Za-z]+$/",
              "name": "primaryAliasName",
              "typeName": "Bar.foo.name"
            }
          ],
          [
            "aliasNames",
            {
              "kind": "repeated",
              "min": null,
              "max": null,
              "repeated": {
                "kind": "primitive",
                "primitiveName": "string",
                "pattern": "/^[A-Za-z]+$/",
                "name": "name",
                "typeName": "Bar.foo.name"
              },
              "name": "aliasNames"
            }
          ]
        ],
        "typeName": "User",
        "name": "User"
      }
    }
  }
};
export default schema;
// tslint:enable: object-literal-key-quotes
