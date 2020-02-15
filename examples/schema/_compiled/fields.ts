
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
              "symlinkTargetName": "NumberType"
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
              "kind": "symlink",
              "symlinkTargetName": "NumberType"
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
              "symlinkTargetName": "NumberType"
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
            "symlinkTargetName": "A"
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
              "kind": "symlink",
              "symlinkTargetName": "NumberType"
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
      }
    }
  }
};
export default schema;
// tslint:enable: object-literal-key-quotes
