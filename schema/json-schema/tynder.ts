
const schema = {
  "$schema": "http://json-schema.org/draft-06/schema#",
  "definitions": {
    "PrimitiveValueTypes": {
      "anyOf": [
        {
          "type": "number"
        },
        {
          "type": "number"
        },
        {
          "type": "string"
        },
        {
          "type": "boolean"
        },
        {
          "type": "null"
        },
        {
          "type": "null"
        }
      ]
    },
    "PrimitiveValueTypeNames": {
      "anyOf": [
        {
          "type": "string",
          "enum": [
            "number"
          ]
        },
        {
          "type": "string",
          "enum": [
            "bigint"
          ]
        },
        {
          "type": "string",
          "enum": [
            "string"
          ]
        },
        {
          "type": "string",
          "enum": [
            "boolean"
          ]
        },
        {
          "type": "string",
          "enum": [
            "null"
          ]
        },
        {
          "type": "string",
          "enum": [
            "undefined"
          ]
        }
      ]
    },
    "OptionalPrimitiveValueTypeNames": {
      "anyOf": [
        {
          "type": "string",
          "enum": [
            "number?"
          ]
        },
        {
          "type": "string",
          "enum": [
            "bigint?"
          ]
        },
        {
          "type": "string",
          "enum": [
            "string?"
          ]
        },
        {
          "type": "string",
          "enum": [
            "boolean?"
          ]
        },
        {
          "type": "string",
          "enum": [
            "null?"
          ]
        },
        {
          "type": "string",
          "enum": [
            "undefined?"
          ]
        }
      ]
    },
    "PlaceholderTypeNames": {
      "anyOf": [
        {
          "type": "string",
          "enum": [
            "never"
          ]
        },
        {
          "type": "string",
          "enum": [
            "any"
          ]
        },
        {
          "type": "string",
          "enum": [
            "unknown"
          ]
        }
      ]
    },
    "OptionalPlaceholderTypeNames": {
      "anyOf": [
        {
          "type": "string",
          "enum": [
            "never?"
          ]
        },
        {
          "type": "string",
          "enum": [
            "any?"
          ]
        },
        {
          "type": "string",
          "enum": [
            "unknown?"
          ]
        }
      ]
    },
    "ErrorTypes": {
      "type": [
        "string",
        "number"
      ],
      "enum": [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9
      ]
    },
    "ErrorMessages": {
      "type": "object",
      "properties": {
        "invalidDefinition": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "required": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "typeUnmatched": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "repeatQtyUnmatched": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "sequenceUnmatched": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "valueRangeUnmatched": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "valuePatternUnmatched": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "valueLengthUnmatched": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "valueUnmatched": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        }
      }
    },
    "TypeAssertionErrorMessageConstraints": {
      "type": "object",
      "properties": {}
    },
    "TypeAssertionErrorMessage": {
      "type": "object",
      "properties": {
        "code": {
          "type": "string"
        },
        "message": {
          "type": "string"
        },
        "dataPath": {
          "type": "string"
        },
        "constraints": {
          "$ref": "#/definitions/TypeAssertionErrorMessageConstraints"
        },
        "value": {
          "oneOf": [
            {
              "type": [
                "null",
                "number",
                "string",
                "boolean",
                "array",
                "object"
              ]
            },
            {
              "type": "null"
            }
          ]
        }
      }
    },
    "TypeAssertionBase": {
      "type": "object",
      "properties": {
        "messageId": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "message": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "messages": {
          "$ref": "#/definitions/ErrorMessages"
        },
        "name": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "typeName": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "docComment": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "passThruCodeBlock": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "noOutput": {
          "oneOf": [
            {
              "type": "boolean"
            },
            {
              "type": "null"
            }
          ]
        }
      }
    },
    "NeverTypeAssertion": {
      "type": "object",
      "properties": {
        "kind": {
          "type": "string",
          "enum": [
            "never"
          ]
        },
        "messageId": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "message": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "messages": {
          "$ref": "#/definitions/ErrorMessages"
        },
        "name": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "typeName": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "docComment": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "passThruCodeBlock": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "noOutput": {
          "oneOf": [
            {
              "type": "boolean"
            },
            {
              "type": "null"
            }
          ]
        }
      }
    },
    "AnyTypeAssertion": {
      "type": "object",
      "properties": {
        "kind": {
          "type": "string",
          "enum": [
            "any"
          ]
        },
        "messageId": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "message": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "messages": {
          "$ref": "#/definitions/ErrorMessages"
        },
        "name": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "typeName": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "docComment": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "passThruCodeBlock": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "noOutput": {
          "oneOf": [
            {
              "type": "boolean"
            },
            {
              "type": "null"
            }
          ]
        }
      }
    },
    "UnknownTypeAssertion": {
      "type": "object",
      "properties": {
        "kind": {
          "type": "string",
          "enum": [
            "unknown"
          ]
        },
        "messageId": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "message": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "messages": {
          "$ref": "#/definitions/ErrorMessages"
        },
        "name": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "typeName": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "docComment": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "passThruCodeBlock": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "noOutput": {
          "oneOf": [
            {
              "type": "boolean"
            },
            {
              "type": "null"
            }
          ]
        }
      }
    },
    "PrimitiveTypeAssertionConstraints": {
      "type": "object",
      "properties": {
        "minValue": {
          "oneOf": [
            {
              "anyOf": [
                {
                  "type": "number"
                },
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ]
            },
            {
              "type": "null"
            }
          ]
        },
        "maxValue": {
          "oneOf": [
            {
              "anyOf": [
                {
                  "type": "number"
                },
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ]
            },
            {
              "type": "null"
            }
          ]
        },
        "greaterThanValue": {
          "oneOf": [
            {
              "anyOf": [
                {
                  "type": "number"
                },
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ]
            },
            {
              "type": "null"
            }
          ]
        },
        "lessThanValue": {
          "oneOf": [
            {
              "anyOf": [
                {
                  "type": "number"
                },
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ]
            },
            {
              "type": "null"
            }
          ]
        },
        "minLength": {
          "oneOf": [
            {
              "anyOf": [
                {
                  "type": "number"
                },
                {
                  "type": "null"
                }
              ]
            },
            {
              "type": "null"
            }
          ]
        },
        "maxLength": {
          "oneOf": [
            {
              "anyOf": [
                {
                  "type": "number"
                },
                {
                  "type": "null"
                }
              ]
            },
            {
              "type": "null"
            }
          ]
        },
        "pattern": {
          "oneOf": [
            {
              "anyOf": [
                {
                  "$ref": "#/definitions/RegExp"
                },
                {
                  "type": "null"
                }
              ]
            },
            {
              "type": "null"
            }
          ]
        }
      }
    },
    "PrimitiveTypeAssertion": {
      "type": "object",
      "properties": {
        "kind": {
          "type": "string",
          "enum": [
            "primitive"
          ]
        },
        "primitiveName": {
          "$ref": "#/definitions/PrimitiveValueTypeNames"
        },
        "messageId": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "message": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "messages": {
          "$ref": "#/definitions/ErrorMessages"
        },
        "name": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "typeName": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "docComment": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "passThruCodeBlock": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "noOutput": {
          "oneOf": [
            {
              "type": "boolean"
            },
            {
              "type": "null"
            }
          ]
        },
        "minValue": {
          "oneOf": [
            {
              "anyOf": [
                {
                  "type": "number"
                },
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ]
            },
            {
              "type": "null"
            }
          ]
        },
        "maxValue": {
          "oneOf": [
            {
              "anyOf": [
                {
                  "type": "number"
                },
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ]
            },
            {
              "type": "null"
            }
          ]
        },
        "greaterThanValue": {
          "oneOf": [
            {
              "anyOf": [
                {
                  "type": "number"
                },
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ]
            },
            {
              "type": "null"
            }
          ]
        },
        "lessThanValue": {
          "oneOf": [
            {
              "anyOf": [
                {
                  "type": "number"
                },
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ]
            },
            {
              "type": "null"
            }
          ]
        },
        "minLength": {
          "oneOf": [
            {
              "anyOf": [
                {
                  "type": "number"
                },
                {
                  "type": "null"
                }
              ]
            },
            {
              "type": "null"
            }
          ]
        },
        "maxLength": {
          "oneOf": [
            {
              "anyOf": [
                {
                  "type": "number"
                },
                {
                  "type": "null"
                }
              ]
            },
            {
              "type": "null"
            }
          ]
        },
        "pattern": {
          "oneOf": [
            {
              "anyOf": [
                {
                  "$ref": "#/definitions/RegExp"
                },
                {
                  "type": "null"
                }
              ]
            },
            {
              "type": "null"
            }
          ]
        }
      }
    },
    "PrimitiveValueTypeAssertion": {
      "type": "object",
      "properties": {
        "kind": {
          "type": "string",
          "enum": [
            "primitive-value"
          ]
        },
        "value": {
          "$ref": "#/definitions/PrimitiveValueTypes"
        },
        "messageId": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "message": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "messages": {
          "$ref": "#/definitions/ErrorMessages"
        },
        "name": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "typeName": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "docComment": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "passThruCodeBlock": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "noOutput": {
          "oneOf": [
            {
              "type": "boolean"
            },
            {
              "type": "null"
            }
          ]
        }
      }
    },
    "RepeatedAssertionConstraints": {
      "type": "object",
      "properties": {
        "min": {
          "anyOf": [
            {
              "type": "number"
            },
            {
              "type": "null"
            }
          ]
        },
        "max": {
          "anyOf": [
            {
              "type": "number"
            },
            {
              "type": "null"
            }
          ]
        }
      }
    },
    "RepeatedAssertion": {
      "type": "object",
      "properties": {
        "kind": {
          "type": "string",
          "enum": [
            "repeated"
          ]
        },
        "repeated": {
          "$ref": "#/definitions/TypeAssertion"
        },
        "messageId": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "message": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "messages": {
          "$ref": "#/definitions/ErrorMessages"
        },
        "name": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "typeName": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "docComment": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "passThruCodeBlock": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "noOutput": {
          "oneOf": [
            {
              "type": "boolean"
            },
            {
              "type": "null"
            }
          ]
        },
        "min": {
          "anyOf": [
            {
              "type": "number"
            },
            {
              "type": "null"
            }
          ]
        },
        "max": {
          "anyOf": [
            {
              "type": "number"
            },
            {
              "type": "null"
            }
          ]
        }
      }
    },
    "SpreadAssertion": {
      "type": "object",
      "properties": {
        "kind": {
          "type": "string",
          "enum": [
            "spread"
          ]
        },
        "spread": {
          "$ref": "#/definitions/TypeAssertion"
        },
        "messageId": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "message": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "messages": {
          "$ref": "#/definitions/ErrorMessages"
        },
        "name": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "typeName": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "docComment": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "passThruCodeBlock": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "noOutput": {
          "oneOf": [
            {
              "type": "boolean"
            },
            {
              "type": "null"
            }
          ]
        },
        "min": {
          "anyOf": [
            {
              "type": "number"
            },
            {
              "type": "null"
            }
          ]
        },
        "max": {
          "anyOf": [
            {
              "type": "number"
            },
            {
              "type": "null"
            }
          ]
        }
      }
    },
    "SequenceAssertion": {
      "type": "object",
      "properties": {
        "kind": {
          "type": "string",
          "enum": [
            "sequence"
          ]
        },
        "sequence": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/TypeAssertion"
          }
        },
        "messageId": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "message": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "messages": {
          "$ref": "#/definitions/ErrorMessages"
        },
        "name": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "typeName": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "docComment": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "passThruCodeBlock": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "noOutput": {
          "oneOf": [
            {
              "type": "boolean"
            },
            {
              "type": "null"
            }
          ]
        }
      }
    },
    "OneOfAssertion": {
      "type": "object",
      "properties": {
        "kind": {
          "type": "string",
          "enum": [
            "one-of"
          ]
        },
        "oneOf": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/TypeAssertion"
          }
        },
        "messageId": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "message": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "messages": {
          "$ref": "#/definitions/ErrorMessages"
        },
        "name": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "typeName": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "docComment": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "passThruCodeBlock": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "noOutput": {
          "oneOf": [
            {
              "type": "boolean"
            },
            {
              "type": "null"
            }
          ]
        }
      }
    },
    "OptionalAssertion": {
      "type": "object",
      "properties": {
        "kind": {
          "type": "string",
          "enum": [
            "optional"
          ]
        },
        "optional": {
          "$ref": "#/definitions/TypeAssertion"
        },
        "messageId": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "message": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "messages": {
          "$ref": "#/definitions/ErrorMessages"
        },
        "name": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "typeName": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "docComment": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "passThruCodeBlock": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "noOutput": {
          "oneOf": [
            {
              "type": "boolean"
            },
            {
              "type": "null"
            }
          ]
        }
      }
    },
    "EnumAssertion": {
      "type": "object",
      "properties": {
        "kind": {
          "type": "string",
          "enum": [
            "enum"
          ]
        },
        "values": {
          "type": "array",
          "items": {
            "type": "array",
            "items": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "anyOf": [
                    {
                      "type": "number"
                    },
                    {
                      "type": "string"
                    }
                  ]
                },
                {
                  "oneOf": [
                    {
                      "type": "string"
                    },
                    {
                      "type": "null"
                    }
                  ]
                }
              ]
            }
          }
        },
        "messageId": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "message": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "messages": {
          "$ref": "#/definitions/ErrorMessages"
        },
        "name": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "typeName": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "docComment": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "passThruCodeBlock": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "noOutput": {
          "oneOf": [
            {
              "type": "boolean"
            },
            {
              "type": "null"
            }
          ]
        }
      }
    },
    "ObjectAssertionMember": {
      "anyOf": [
        {
          "type": "array",
          "items": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "$ref": "#/definitions/TypeAssertion"
              }
            ]
          }
        },
        {
          "type": "array",
          "items": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "$ref": "#/definitions/TypeAssertion"
              },
              {
                "type": "boolean"
              }
            ]
          }
        },
        {
          "type": "array",
          "items": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "$ref": "#/definitions/TypeAssertion"
              },
              {
                "type": "boolean"
              },
              {
                "type": "string"
              }
            ]
          }
        }
      ]
    },
    "AdditionalPropsKey": {
      "type": "array",
      "items": {
        "anyOf": [
          {
            "type": "string",
            "enum": [
              "string"
            ]
          },
          {
            "type": "string",
            "enum": [
              "number"
            ]
          },
          {
            "$ref": "#/definitions/RegExp"
          }
        ]
      }
    },
    "AdditionalPropsMember": {
      "anyOf": [
        {
          "type": "array",
          "items": {
            "anyOf": [
              {
                "$ref": "#/definitions/AdditionalPropsKey"
              },
              {
                "$ref": "#/definitions/TypeAssertion"
              }
            ]
          }
        },
        {
          "type": "array",
          "items": {
            "anyOf": [
              {
                "$ref": "#/definitions/AdditionalPropsKey"
              },
              {
                "$ref": "#/definitions/TypeAssertion"
              },
              {
                "type": "boolean"
              }
            ]
          }
        },
        {
          "type": "array",
          "items": {
            "anyOf": [
              {
                "$ref": "#/definitions/AdditionalPropsKey"
              },
              {
                "$ref": "#/definitions/TypeAssertion"
              },
              {
                "type": "boolean"
              },
              {
                "type": "string"
              }
            ]
          }
        }
      ]
    },
    "ObjectAssertion": {
      "type": "object",
      "properties": {
        "kind": {
          "type": "string",
          "enum": [
            "object"
          ]
        },
        "members": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/ObjectAssertionMember"
          }
        },
        "additionalProps": {
          "oneOf": [
            {
              "type": "array",
              "items": {
                "$ref": "#/definitions/AdditionalPropsMember"
              }
            },
            {
              "type": "null"
            }
          ]
        },
        "baseTypes": {
          "oneOf": [
            {
              "type": "array",
              "items": {
                "anyOf": [
                  {
                    "$ref": "#/definitions/ObjectAssertion"
                  },
                  {
                    "$ref": "#/definitions/AssertionSymlink"
                  }
                ]
              }
            },
            {
              "type": "null"
            }
          ]
        },
        "messageId": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "message": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "messages": {
          "$ref": "#/definitions/ErrorMessages"
        },
        "name": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "typeName": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "docComment": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "passThruCodeBlock": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "noOutput": {
          "oneOf": [
            {
              "type": "boolean"
            },
            {
              "type": "null"
            }
          ]
        }
      }
    },
    "AssertionSymlink": {
      "type": "object",
      "properties": {
        "kind": {
          "type": "string",
          "enum": [
            "symlink"
          ]
        },
        "symlinkTargetName": {
          "type": "string"
        },
        "messageId": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "message": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "messages": {
          "$ref": "#/definitions/ErrorMessages"
        },
        "name": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "typeName": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "docComment": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "passThruCodeBlock": {
          "oneOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "noOutput": {
          "oneOf": [
            {
              "type": "boolean"
            },
            {
              "type": "null"
            }
          ]
        }
      }
    },
    "TypeAssertion": {
      "anyOf": [
        {
          "$ref": "#/definitions/NeverTypeAssertion"
        },
        {
          "$ref": "#/definitions/AnyTypeAssertion"
        },
        {
          "$ref": "#/definitions/UnknownTypeAssertion"
        },
        {
          "$ref": "#/definitions/PrimitiveTypeAssertion"
        },
        {
          "$ref": "#/definitions/PrimitiveValueTypeAssertion"
        },
        {
          "$ref": "#/definitions/RepeatedAssertion"
        },
        {
          "$ref": "#/definitions/SpreadAssertion"
        },
        {
          "$ref": "#/definitions/SequenceAssertion"
        },
        {
          "$ref": "#/definitions/OneOfAssertion"
        },
        {
          "$ref": "#/definitions/OptionalAssertion"
        },
        {
          "$ref": "#/definitions/EnumAssertion"
        },
        {
          "$ref": "#/definitions/ObjectAssertion"
        },
        {
          "$ref": "#/definitions/AssertionSymlink"
        }
      ]
    },
    "ValidationContext": {
      "type": "object",
      "properties": {
        "checkAll": {
          "oneOf": [
            {
              "type": "boolean"
            },
            {
              "type": "null"
            }
          ]
        },
        "noAdditionalProps": {
          "oneOf": [
            {
              "type": "boolean"
            },
            {
              "type": "null"
            }
          ]
        },
        "errorMessages": {
          "$ref": "#/definitions/ErrorMessages"
        },
        "errors": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/TypeAssertionErrorMessage"
          }
        },
        "typeStack": {
          "type": "array",
          "items": {
            "anyOf": [
              {
                "$ref": "#/definitions/NeverTypeAssertion"
              },
              {
                "$ref": "#/definitions/AnyTypeAssertion"
              },
              {
                "$ref": "#/definitions/UnknownTypeAssertion"
              },
              {
                "$ref": "#/definitions/PrimitiveTypeAssertion"
              },
              {
                "$ref": "#/definitions/PrimitiveValueTypeAssertion"
              },
              {
                "$ref": "#/definitions/RepeatedAssertion"
              },
              {
                "$ref": "#/definitions/SpreadAssertion"
              },
              {
                "$ref": "#/definitions/SequenceAssertion"
              },
              {
                "$ref": "#/definitions/OneOfAssertion"
              },
              {
                "$ref": "#/definitions/OptionalAssertion"
              },
              {
                "$ref": "#/definitions/EnumAssertion"
              },
              {
                "$ref": "#/definitions/ObjectAssertion"
              },
              {
                "$ref": "#/definitions/AssertionSymlink"
              },
              {
                "type": "array",
                "items": {
                  "anyOf": [
                    {
                      "$ref": "#/definitions/TypeAssertion"
                    },
                    {
                      "anyOf": [
                        {
                          "type": "number"
                        },
                        {
                          "type": "string"
                        },
                        {
                          "type": "null"
                        }
                      ]
                    }
                  ]
                }
              }
            ]
          }
        },
        "schema": {
          "$ref": "#/definitions/TypeAssertionMap"
        }
      }
    },
    "TypeAssertionSetValue": {
      "type": "object",
      "properties": {
        "ty": {
          "$ref": "#/definitions/TypeAssertion"
        },
        "exported": {
          "type": "boolean"
        },
        "resolved": {
          "type": "boolean"
        }
      }
    },
    "TypeAssertionMap": {
      "type": [
        "null",
        "number",
        "string",
        "boolean",
        "array",
        "object"
      ]
    },
    "SymbolResolverContext": {
      "type": "object",
      "properties": {
        "nestLevel": {
          "type": "number"
        },
        "symlinkStack": {
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      }
    },
    "CodegenContext": {
      "type": "object",
      "properties": {
        "nestLevel": {
          "type": "number"
        },
        "schema": {
          "$ref": "#/definitions/TypeAssertionMap"
        }
      }
    }
  }
};
export default schema;
