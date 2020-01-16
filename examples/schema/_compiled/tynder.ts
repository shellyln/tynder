
// tslint:disable: object-literal-key-quotes
const schema = {
  "version": "tynder/1.0",
  "ns": {
    ".": {
      "RegExp": {
        "kind": "any",
        "typeName": "RegExp",
        "name": "RegExp",
        "noOutput": true
      },
      "Map": {
        "kind": "any",
        "typeName": "Map",
        "name": "Map",
        "noOutput": true
      },
      "PrimitiveValueTypes": {
        "kind": "one-of",
        "oneOf": [
          {
            "kind": "primitive",
            "primitiveName": "number"
          },
          {
            "kind": "primitive",
            "primitiveName": "bigint"
          },
          {
            "kind": "primitive",
            "primitiveName": "string"
          },
          {
            "kind": "primitive",
            "primitiveName": "boolean"
          },
          {
            "kind": "primitive",
            "primitiveName": "null"
          },
          {
            "kind": "primitive",
            "primitiveName": "undefined"
          }
        ],
        "typeName": "PrimitiveValueTypes",
        "name": "PrimitiveValueTypes"
      },
      "PrimitiveValueTypeNames": {
        "kind": "one-of",
        "oneOf": [
          {
            "kind": "primitive-value",
            "value": "number"
          },
          {
            "kind": "primitive-value",
            "value": "bigint"
          },
          {
            "kind": "primitive-value",
            "value": "string"
          },
          {
            "kind": "primitive-value",
            "value": "boolean"
          },
          {
            "kind": "primitive-value",
            "value": "null"
          },
          {
            "kind": "primitive-value",
            "value": "undefined"
          }
        ],
        "typeName": "PrimitiveValueTypeNames",
        "name": "PrimitiveValueTypeNames"
      },
      "OptionalPrimitiveValueTypeNames": {
        "kind": "one-of",
        "oneOf": [
          {
            "kind": "primitive-value",
            "value": "number?"
          },
          {
            "kind": "primitive-value",
            "value": "bigint?"
          },
          {
            "kind": "primitive-value",
            "value": "string?"
          },
          {
            "kind": "primitive-value",
            "value": "boolean?"
          },
          {
            "kind": "primitive-value",
            "value": "null?"
          },
          {
            "kind": "primitive-value",
            "value": "undefined?"
          }
        ],
        "typeName": "OptionalPrimitiveValueTypeNames",
        "name": "OptionalPrimitiveValueTypeNames"
      },
      "PlaceholderTypeNames": {
        "kind": "one-of",
        "oneOf": [
          {
            "kind": "primitive-value",
            "value": "never"
          },
          {
            "kind": "primitive-value",
            "value": "any"
          },
          {
            "kind": "primitive-value",
            "value": "unknown"
          }
        ],
        "typeName": "PlaceholderTypeNames",
        "name": "PlaceholderTypeNames"
      },
      "OptionalPlaceholderTypeNames": {
        "kind": "one-of",
        "oneOf": [
          {
            "kind": "primitive-value",
            "value": "never?"
          },
          {
            "kind": "primitive-value",
            "value": "any?"
          },
          {
            "kind": "primitive-value",
            "value": "unknown?"
          }
        ],
        "typeName": "OptionalPlaceholderTypeNames",
        "name": "OptionalPlaceholderTypeNames"
      },
      "ErrorTypes": {
        "kind": "enum",
        "values": [
          [
            "InvalidDefinition",
            1
          ],
          [
            "Required",
            2
          ],
          [
            "TypeUnmatched",
            3
          ],
          [
            "RepeatQtyUnmatched",
            4
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
      "ErrorMessages": {
        "kind": "object",
        "members": [
          [
            "invalidDefinition",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string",
                "name": "invalidDefinition"
              }
            }
          ],
          [
            "required",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string",
                "name": "required"
              }
            }
          ],
          [
            "typeUnmatched",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string",
                "name": "typeUnmatched"
              }
            }
          ],
          [
            "repeatQtyUnmatched",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string",
                "name": "repeatQtyUnmatched"
              }
            }
          ],
          [
            "sequenceUnmatched",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string",
                "name": "sequenceUnmatched"
              }
            }
          ],
          [
            "valueRangeUnmatched",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string",
                "name": "valueRangeUnmatched"
              }
            }
          ],
          [
            "valuePatternUnmatched",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string",
                "name": "valuePatternUnmatched"
              }
            }
          ],
          [
            "valueLengthUnmatched",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string",
                "name": "valueLengthUnmatched"
              }
            }
          ],
          [
            "valueUnmatched",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string",
                "name": "valueUnmatched"
              }
            }
          ]
        ],
        "typeName": "ErrorMessages",
        "name": "ErrorMessages"
      },
      "TypeAssertionErrorMessageConstraints": {
        "kind": "object",
        "typeName": "TypeAssertionErrorMessageConstraints",
        "name": "TypeAssertionErrorMessageConstraints",
        "members": [
          [
            "minValue",
            {
              "kind": "optional",
              "optional": {
                "kind": "one-of",
                "oneOf": [
                  {
                    "kind": "primitive",
                    "primitiveName": "number"
                  },
                  {
                    "kind": "primitive",
                    "primitiveName": "string"
                  },
                  {
                    "kind": "primitive",
                    "primitiveName": "null"
                  }
                ]
              },
              "name": "minValue"
            }
          ],
          [
            "maxValue",
            {
              "kind": "optional",
              "optional": {
                "kind": "one-of",
                "oneOf": [
                  {
                    "kind": "primitive",
                    "primitiveName": "number"
                  },
                  {
                    "kind": "primitive",
                    "primitiveName": "string"
                  },
                  {
                    "kind": "primitive",
                    "primitiveName": "null"
                  }
                ]
              },
              "name": "maxValue"
            }
          ],
          [
            "greaterThanValue",
            {
              "kind": "optional",
              "optional": {
                "kind": "one-of",
                "oneOf": [
                  {
                    "kind": "primitive",
                    "primitiveName": "number"
                  },
                  {
                    "kind": "primitive",
                    "primitiveName": "string"
                  },
                  {
                    "kind": "primitive",
                    "primitiveName": "null"
                  }
                ]
              },
              "name": "greaterThanValue"
            }
          ],
          [
            "lessThanValue",
            {
              "kind": "optional",
              "optional": {
                "kind": "one-of",
                "oneOf": [
                  {
                    "kind": "primitive",
                    "primitiveName": "number"
                  },
                  {
                    "kind": "primitive",
                    "primitiveName": "string"
                  },
                  {
                    "kind": "primitive",
                    "primitiveName": "null"
                  }
                ]
              },
              "name": "lessThanValue"
            }
          ],
          [
            "minLength",
            {
              "kind": "optional",
              "optional": {
                "kind": "one-of",
                "oneOf": [
                  {
                    "kind": "primitive",
                    "primitiveName": "number"
                  },
                  {
                    "kind": "primitive",
                    "primitiveName": "null"
                  }
                ]
              },
              "name": "minLength"
            }
          ],
          [
            "maxLength",
            {
              "kind": "optional",
              "optional": {
                "kind": "one-of",
                "oneOf": [
                  {
                    "kind": "primitive",
                    "primitiveName": "number"
                  },
                  {
                    "kind": "primitive",
                    "primitiveName": "null"
                  }
                ]
              },
              "name": "maxLength"
            }
          ],
          [
            "min",
            {
              "kind": "optional",
              "optional": {
                "kind": "one-of",
                "oneOf": [
                  {
                    "kind": "primitive",
                    "primitiveName": "number"
                  },
                  {
                    "kind": "primitive",
                    "primitiveName": "null"
                  }
                ],
                "name": "min"
              }
            }
          ],
          [
            "max",
            {
              "kind": "optional",
              "optional": {
                "kind": "one-of",
                "oneOf": [
                  {
                    "kind": "primitive",
                    "primitiveName": "number"
                  },
                  {
                    "kind": "primitive",
                    "primitiveName": "null"
                  }
                ],
                "name": "max"
              }
            }
          ],
          [
            "pattern",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string",
                "name": "pattern"
              }
            }
          ]
        ]
      },
      "TypeAssertionErrorMessage": {
        "kind": "object",
        "members": [
          [
            "code",
            {
              "kind": "primitive",
              "primitiveName": "string",
              "name": "code"
            }
          ],
          [
            "message",
            {
              "kind": "primitive",
              "primitiveName": "string",
              "name": "message"
            }
          ],
          [
            "dataPath",
            {
              "kind": "primitive",
              "primitiveName": "string",
              "name": "dataPath"
            }
          ],
          [
            "constraints",
            {
              "kind": "symlink",
              "symlinkTargetName": "TypeAssertionErrorMessageConstraints"
            }
          ],
          [
            "value",
            {
              "kind": "optional",
              "optional": {
                "kind": "any"
              },
              "name": "value"
            }
          ]
        ],
        "typeName": "TypeAssertionErrorMessage",
        "name": "TypeAssertionErrorMessage"
      },
      "TypeAssertionBase": {
        "kind": "object",
        "members": [
          [
            "messageId",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "messageId"
            }
          ],
          [
            "message",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "message"
            }
          ],
          [
            "messages",
            {
              "kind": "symlink",
              "symlinkTargetName": "ErrorMessages"
            }
          ],
          [
            "name",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "name"
            }
          ],
          [
            "typeName",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "typeName"
            }
          ],
          [
            "docComment",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "docComment"
            }
          ],
          [
            "passThruCodeBlock",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "passThruCodeBlock"
            }
          ],
          [
            "noOutput",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "boolean"
              },
              "name": "noOutput"
            }
          ]
        ],
        "typeName": "TypeAssertionBase",
        "name": "TypeAssertionBase"
      },
      "NeverTypeAssertion": {
        "kind": "object",
        "members": [
          [
            "kind",
            {
              "kind": "primitive-value",
              "value": "never",
              "name": "kind"
            }
          ],
          [
            "messageId",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "messageId"
            },
            true
          ],
          [
            "message",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "message"
            },
            true
          ],
          [
            "messages",
            {
              "kind": "symlink",
              "symlinkTargetName": "ErrorMessages"
            },
            true
          ],
          [
            "name",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "name"
            },
            true
          ],
          [
            "typeName",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "typeName"
            },
            true
          ],
          [
            "docComment",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "docComment"
            },
            true
          ],
          [
            "passThruCodeBlock",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "passThruCodeBlock"
            },
            true
          ],
          [
            "noOutput",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "boolean"
              },
              "name": "noOutput"
            },
            true
          ]
        ],
        "baseTypes": [
          {
            "kind": "symlink",
            "symlinkTargetName": "TypeAssertionBase"
          }
        ],
        "typeName": "NeverTypeAssertion",
        "name": "NeverTypeAssertion"
      },
      "AnyTypeAssertion": {
        "kind": "object",
        "members": [
          [
            "kind",
            {
              "kind": "primitive-value",
              "value": "any",
              "name": "kind"
            }
          ],
          [
            "messageId",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "messageId"
            },
            true
          ],
          [
            "message",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "message"
            },
            true
          ],
          [
            "messages",
            {
              "kind": "symlink",
              "symlinkTargetName": "ErrorMessages"
            },
            true
          ],
          [
            "name",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "name"
            },
            true
          ],
          [
            "typeName",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "typeName"
            },
            true
          ],
          [
            "docComment",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "docComment"
            },
            true
          ],
          [
            "passThruCodeBlock",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "passThruCodeBlock"
            },
            true
          ],
          [
            "noOutput",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "boolean"
              },
              "name": "noOutput"
            },
            true
          ]
        ],
        "baseTypes": [
          {
            "kind": "symlink",
            "symlinkTargetName": "TypeAssertionBase"
          }
        ],
        "typeName": "AnyTypeAssertion",
        "name": "AnyTypeAssertion"
      },
      "UnknownTypeAssertion": {
        "kind": "object",
        "members": [
          [
            "kind",
            {
              "kind": "primitive-value",
              "value": "unknown",
              "name": "kind"
            }
          ],
          [
            "messageId",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "messageId"
            },
            true
          ],
          [
            "message",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "message"
            },
            true
          ],
          [
            "messages",
            {
              "kind": "symlink",
              "symlinkTargetName": "ErrorMessages"
            },
            true
          ],
          [
            "name",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "name"
            },
            true
          ],
          [
            "typeName",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "typeName"
            },
            true
          ],
          [
            "docComment",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "docComment"
            },
            true
          ],
          [
            "passThruCodeBlock",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "passThruCodeBlock"
            },
            true
          ],
          [
            "noOutput",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "boolean"
              },
              "name": "noOutput"
            },
            true
          ]
        ],
        "baseTypes": [
          {
            "kind": "symlink",
            "symlinkTargetName": "TypeAssertionBase"
          }
        ],
        "typeName": "UnknownTypeAssertion",
        "name": "UnknownTypeAssertion"
      },
      "PrimitiveTypeAssertionConstraints": {
        "kind": "object",
        "members": [
          [
            "minValue",
            {
              "kind": "optional",
              "optional": {
                "kind": "one-of",
                "oneOf": [
                  {
                    "kind": "primitive",
                    "primitiveName": "number"
                  },
                  {
                    "kind": "primitive",
                    "primitiveName": "string"
                  },
                  {
                    "kind": "primitive",
                    "primitiveName": "null"
                  }
                ]
              },
              "name": "minValue"
            }
          ],
          [
            "maxValue",
            {
              "kind": "optional",
              "optional": {
                "kind": "one-of",
                "oneOf": [
                  {
                    "kind": "primitive",
                    "primitiveName": "number"
                  },
                  {
                    "kind": "primitive",
                    "primitiveName": "string"
                  },
                  {
                    "kind": "primitive",
                    "primitiveName": "null"
                  }
                ]
              },
              "name": "maxValue"
            }
          ],
          [
            "greaterThanValue",
            {
              "kind": "optional",
              "optional": {
                "kind": "one-of",
                "oneOf": [
                  {
                    "kind": "primitive",
                    "primitiveName": "number"
                  },
                  {
                    "kind": "primitive",
                    "primitiveName": "string"
                  },
                  {
                    "kind": "primitive",
                    "primitiveName": "null"
                  }
                ]
              },
              "name": "greaterThanValue"
            }
          ],
          [
            "lessThanValue",
            {
              "kind": "optional",
              "optional": {
                "kind": "one-of",
                "oneOf": [
                  {
                    "kind": "primitive",
                    "primitiveName": "number"
                  },
                  {
                    "kind": "primitive",
                    "primitiveName": "string"
                  },
                  {
                    "kind": "primitive",
                    "primitiveName": "null"
                  }
                ]
              },
              "name": "lessThanValue"
            }
          ],
          [
            "minLength",
            {
              "kind": "optional",
              "optional": {
                "kind": "one-of",
                "oneOf": [
                  {
                    "kind": "primitive",
                    "primitiveName": "number"
                  },
                  {
                    "kind": "primitive",
                    "primitiveName": "null"
                  }
                ]
              },
              "name": "minLength"
            }
          ],
          [
            "maxLength",
            {
              "kind": "optional",
              "optional": {
                "kind": "one-of",
                "oneOf": [
                  {
                    "kind": "primitive",
                    "primitiveName": "number"
                  },
                  {
                    "kind": "primitive",
                    "primitiveName": "null"
                  }
                ]
              },
              "name": "maxLength"
            }
          ],
          [
            "pattern",
            {
              "kind": "optional",
              "optional": {
                "kind": "one-of",
                "oneOf": [
                  {
                    "kind": "symlink",
                    "symlinkTargetName": "RegExp"
                  },
                  {
                    "kind": "primitive",
                    "primitiveName": "null"
                  }
                ]
              },
              "name": "pattern"
            }
          ]
        ],
        "typeName": "PrimitiveTypeAssertionConstraints",
        "name": "PrimitiveTypeAssertionConstraints"
      },
      "PrimitiveTypeAssertion": {
        "kind": "object",
        "members": [
          [
            "kind",
            {
              "kind": "primitive-value",
              "value": "primitive",
              "name": "kind"
            }
          ],
          [
            "primitiveName",
            {
              "kind": "symlink",
              "symlinkTargetName": "PrimitiveValueTypeNames"
            }
          ],
          [
            "messageId",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "messageId"
            },
            true
          ],
          [
            "message",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "message"
            },
            true
          ],
          [
            "messages",
            {
              "kind": "symlink",
              "symlinkTargetName": "ErrorMessages"
            },
            true
          ],
          [
            "name",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "name"
            },
            true
          ],
          [
            "typeName",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "typeName"
            },
            true
          ],
          [
            "docComment",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "docComment"
            },
            true
          ],
          [
            "passThruCodeBlock",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "passThruCodeBlock"
            },
            true
          ],
          [
            "noOutput",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "boolean"
              },
              "name": "noOutput"
            },
            true
          ],
          [
            "minValue",
            {
              "kind": "optional",
              "optional": {
                "kind": "one-of",
                "oneOf": [
                  {
                    "kind": "primitive",
                    "primitiveName": "number"
                  },
                  {
                    "kind": "primitive",
                    "primitiveName": "string"
                  },
                  {
                    "kind": "primitive",
                    "primitiveName": "null"
                  }
                ]
              },
              "name": "minValue"
            },
            true
          ],
          [
            "maxValue",
            {
              "kind": "optional",
              "optional": {
                "kind": "one-of",
                "oneOf": [
                  {
                    "kind": "primitive",
                    "primitiveName": "number"
                  },
                  {
                    "kind": "primitive",
                    "primitiveName": "string"
                  },
                  {
                    "kind": "primitive",
                    "primitiveName": "null"
                  }
                ]
              },
              "name": "maxValue"
            },
            true
          ],
          [
            "greaterThanValue",
            {
              "kind": "optional",
              "optional": {
                "kind": "one-of",
                "oneOf": [
                  {
                    "kind": "primitive",
                    "primitiveName": "number"
                  },
                  {
                    "kind": "primitive",
                    "primitiveName": "string"
                  },
                  {
                    "kind": "primitive",
                    "primitiveName": "null"
                  }
                ]
              },
              "name": "greaterThanValue"
            },
            true
          ],
          [
            "lessThanValue",
            {
              "kind": "optional",
              "optional": {
                "kind": "one-of",
                "oneOf": [
                  {
                    "kind": "primitive",
                    "primitiveName": "number"
                  },
                  {
                    "kind": "primitive",
                    "primitiveName": "string"
                  },
                  {
                    "kind": "primitive",
                    "primitiveName": "null"
                  }
                ]
              },
              "name": "lessThanValue"
            },
            true
          ],
          [
            "minLength",
            {
              "kind": "optional",
              "optional": {
                "kind": "one-of",
                "oneOf": [
                  {
                    "kind": "primitive",
                    "primitiveName": "number"
                  },
                  {
                    "kind": "primitive",
                    "primitiveName": "null"
                  }
                ]
              },
              "name": "minLength"
            },
            true
          ],
          [
            "maxLength",
            {
              "kind": "optional",
              "optional": {
                "kind": "one-of",
                "oneOf": [
                  {
                    "kind": "primitive",
                    "primitiveName": "number"
                  },
                  {
                    "kind": "primitive",
                    "primitiveName": "null"
                  }
                ]
              },
              "name": "maxLength"
            },
            true
          ],
          [
            "pattern",
            {
              "kind": "optional",
              "optional": {
                "kind": "one-of",
                "oneOf": [
                  {
                    "kind": "symlink",
                    "symlinkTargetName": "RegExp"
                  },
                  {
                    "kind": "primitive",
                    "primitiveName": "null"
                  }
                ]
              },
              "name": "pattern"
            },
            true
          ]
        ],
        "baseTypes": [
          {
            "kind": "symlink",
            "symlinkTargetName": "TypeAssertionBase"
          },
          {
            "kind": "symlink",
            "symlinkTargetName": "PrimitiveTypeAssertionConstraints"
          }
        ],
        "typeName": "PrimitiveTypeAssertion",
        "name": "PrimitiveTypeAssertion"
      },
      "PrimitiveValueTypeAssertion": {
        "kind": "object",
        "members": [
          [
            "kind",
            {
              "kind": "primitive-value",
              "value": "primitive-value",
              "name": "kind"
            }
          ],
          [
            "value",
            {
              "kind": "symlink",
              "symlinkTargetName": "PrimitiveValueTypes"
            }
          ],
          [
            "messageId",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "messageId"
            },
            true
          ],
          [
            "message",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "message"
            },
            true
          ],
          [
            "messages",
            {
              "kind": "symlink",
              "symlinkTargetName": "ErrorMessages"
            },
            true
          ],
          [
            "name",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "name"
            },
            true
          ],
          [
            "typeName",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "typeName"
            },
            true
          ],
          [
            "docComment",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "docComment"
            },
            true
          ],
          [
            "passThruCodeBlock",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "passThruCodeBlock"
            },
            true
          ],
          [
            "noOutput",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "boolean"
              },
              "name": "noOutput"
            },
            true
          ]
        ],
        "baseTypes": [
          {
            "kind": "symlink",
            "symlinkTargetName": "TypeAssertionBase"
          }
        ],
        "typeName": "PrimitiveValueTypeAssertion",
        "name": "PrimitiveValueTypeAssertion"
      },
      "RepeatedAssertionConstraints": {
        "kind": "object",
        "members": [
          [
            "min",
            {
              "kind": "one-of",
              "oneOf": [
                {
                  "kind": "primitive",
                  "primitiveName": "number"
                },
                {
                  "kind": "primitive",
                  "primitiveName": "null"
                }
              ],
              "name": "min"
            }
          ],
          [
            "max",
            {
              "kind": "one-of",
              "oneOf": [
                {
                  "kind": "primitive",
                  "primitiveName": "number"
                },
                {
                  "kind": "primitive",
                  "primitiveName": "null"
                }
              ],
              "name": "max"
            }
          ]
        ],
        "typeName": "RepeatedAssertionConstraints",
        "name": "RepeatedAssertionConstraints"
      },
      "RepeatedAssertion": {
        "kind": "object",
        "members": [
          [
            "kind",
            {
              "kind": "primitive-value",
              "value": "repeated",
              "name": "kind"
            }
          ],
          [
            "repeated",
            {
              "kind": "symlink",
              "symlinkTargetName": "TypeAssertion"
            }
          ],
          [
            "messageId",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "messageId"
            },
            true
          ],
          [
            "message",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "message"
            },
            true
          ],
          [
            "messages",
            {
              "kind": "symlink",
              "symlinkTargetName": "ErrorMessages"
            },
            true
          ],
          [
            "name",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "name"
            },
            true
          ],
          [
            "typeName",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "typeName"
            },
            true
          ],
          [
            "docComment",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "docComment"
            },
            true
          ],
          [
            "passThruCodeBlock",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "passThruCodeBlock"
            },
            true
          ],
          [
            "noOutput",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "boolean"
              },
              "name": "noOutput"
            },
            true
          ],
          [
            "min",
            {
              "kind": "one-of",
              "oneOf": [
                {
                  "kind": "primitive",
                  "primitiveName": "number"
                },
                {
                  "kind": "primitive",
                  "primitiveName": "null"
                }
              ],
              "name": "min"
            },
            true
          ],
          [
            "max",
            {
              "kind": "one-of",
              "oneOf": [
                {
                  "kind": "primitive",
                  "primitiveName": "number"
                },
                {
                  "kind": "primitive",
                  "primitiveName": "null"
                }
              ],
              "name": "max"
            },
            true
          ]
        ],
        "baseTypes": [
          {
            "kind": "symlink",
            "symlinkTargetName": "TypeAssertionBase"
          },
          {
            "kind": "symlink",
            "symlinkTargetName": "RepeatedAssertionConstraints"
          }
        ],
        "typeName": "RepeatedAssertion",
        "name": "RepeatedAssertion"
      },
      "SpreadAssertion": {
        "kind": "object",
        "members": [
          [
            "kind",
            {
              "kind": "primitive-value",
              "value": "spread",
              "name": "kind"
            }
          ],
          [
            "spread",
            {
              "kind": "symlink",
              "symlinkTargetName": "TypeAssertion"
            }
          ],
          [
            "messageId",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "messageId"
            },
            true
          ],
          [
            "message",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "message"
            },
            true
          ],
          [
            "messages",
            {
              "kind": "symlink",
              "symlinkTargetName": "ErrorMessages"
            },
            true
          ],
          [
            "name",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "name"
            },
            true
          ],
          [
            "typeName",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "typeName"
            },
            true
          ],
          [
            "docComment",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "docComment"
            },
            true
          ],
          [
            "passThruCodeBlock",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "passThruCodeBlock"
            },
            true
          ],
          [
            "noOutput",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "boolean"
              },
              "name": "noOutput"
            },
            true
          ],
          [
            "min",
            {
              "kind": "one-of",
              "oneOf": [
                {
                  "kind": "primitive",
                  "primitiveName": "number"
                },
                {
                  "kind": "primitive",
                  "primitiveName": "null"
                }
              ],
              "name": "min"
            },
            true
          ],
          [
            "max",
            {
              "kind": "one-of",
              "oneOf": [
                {
                  "kind": "primitive",
                  "primitiveName": "number"
                },
                {
                  "kind": "primitive",
                  "primitiveName": "null"
                }
              ],
              "name": "max"
            },
            true
          ]
        ],
        "baseTypes": [
          {
            "kind": "symlink",
            "symlinkTargetName": "TypeAssertionBase"
          },
          {
            "kind": "symlink",
            "symlinkTargetName": "RepeatedAssertionConstraints"
          }
        ],
        "typeName": "SpreadAssertion",
        "name": "SpreadAssertion"
      },
      "SequenceAssertion": {
        "kind": "object",
        "members": [
          [
            "kind",
            {
              "kind": "primitive-value",
              "value": "sequence",
              "name": "kind"
            }
          ],
          [
            "sequence",
            {
              "kind": "repeated",
              "min": null,
              "max": null,
              "repeated": {
                "kind": "symlink",
                "symlinkTargetName": "TypeAssertion"
              },
              "name": "sequence"
            }
          ],
          [
            "messageId",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "messageId"
            },
            true
          ],
          [
            "message",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "message"
            },
            true
          ],
          [
            "messages",
            {
              "kind": "symlink",
              "symlinkTargetName": "ErrorMessages"
            },
            true
          ],
          [
            "name",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "name"
            },
            true
          ],
          [
            "typeName",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "typeName"
            },
            true
          ],
          [
            "docComment",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "docComment"
            },
            true
          ],
          [
            "passThruCodeBlock",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "passThruCodeBlock"
            },
            true
          ],
          [
            "noOutput",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "boolean"
              },
              "name": "noOutput"
            },
            true
          ]
        ],
        "baseTypes": [
          {
            "kind": "symlink",
            "symlinkTargetName": "TypeAssertionBase"
          }
        ],
        "typeName": "SequenceAssertion",
        "name": "SequenceAssertion"
      },
      "OneOfAssertion": {
        "kind": "object",
        "members": [
          [
            "kind",
            {
              "kind": "primitive-value",
              "value": "one-of",
              "name": "kind"
            }
          ],
          [
            "oneOf",
            {
              "kind": "repeated",
              "min": null,
              "max": null,
              "repeated": {
                "kind": "symlink",
                "symlinkTargetName": "TypeAssertion"
              },
              "name": "oneOf"
            }
          ],
          [
            "messageId",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "messageId"
            },
            true
          ],
          [
            "message",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "message"
            },
            true
          ],
          [
            "messages",
            {
              "kind": "symlink",
              "symlinkTargetName": "ErrorMessages"
            },
            true
          ],
          [
            "name",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "name"
            },
            true
          ],
          [
            "typeName",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "typeName"
            },
            true
          ],
          [
            "docComment",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "docComment"
            },
            true
          ],
          [
            "passThruCodeBlock",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "passThruCodeBlock"
            },
            true
          ],
          [
            "noOutput",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "boolean"
              },
              "name": "noOutput"
            },
            true
          ]
        ],
        "baseTypes": [
          {
            "kind": "symlink",
            "symlinkTargetName": "TypeAssertionBase"
          }
        ],
        "typeName": "OneOfAssertion",
        "name": "OneOfAssertion"
      },
      "OptionalAssertion": {
        "kind": "object",
        "members": [
          [
            "kind",
            {
              "kind": "primitive-value",
              "value": "optional",
              "name": "kind"
            }
          ],
          [
            "optional",
            {
              "kind": "symlink",
              "symlinkTargetName": "TypeAssertion"
            }
          ],
          [
            "messageId",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "messageId"
            },
            true
          ],
          [
            "message",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "message"
            },
            true
          ],
          [
            "messages",
            {
              "kind": "symlink",
              "symlinkTargetName": "ErrorMessages"
            },
            true
          ],
          [
            "name",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "name"
            },
            true
          ],
          [
            "typeName",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "typeName"
            },
            true
          ],
          [
            "docComment",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "docComment"
            },
            true
          ],
          [
            "passThruCodeBlock",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "passThruCodeBlock"
            },
            true
          ],
          [
            "noOutput",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "boolean"
              },
              "name": "noOutput"
            },
            true
          ]
        ],
        "baseTypes": [
          {
            "kind": "symlink",
            "symlinkTargetName": "TypeAssertionBase"
          }
        ],
        "typeName": "OptionalAssertion",
        "name": "OptionalAssertion"
      },
      "EnumAssertion": {
        "kind": "object",
        "members": [
          [
            "kind",
            {
              "kind": "primitive-value",
              "value": "enum",
              "name": "kind"
            }
          ],
          [
            "values",
            {
              "kind": "repeated",
              "min": null,
              "max": null,
              "repeated": {
                "kind": "sequence",
                "sequence": [
                  {
                    "kind": "primitive",
                    "primitiveName": "string"
                  },
                  {
                    "kind": "one-of",
                    "oneOf": [
                      {
                        "kind": "primitive",
                        "primitiveName": "number"
                      },
                      {
                        "kind": "primitive",
                        "primitiveName": "string"
                      }
                    ]
                  },
                  {
                    "kind": "optional",
                    "optional": {
                      "kind": "primitive",
                      "primitiveName": "string"
                    }
                  }
                ]
              },
              "name": "values"
            }
          ],
          [
            "messageId",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "messageId"
            },
            true
          ],
          [
            "message",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "message"
            },
            true
          ],
          [
            "messages",
            {
              "kind": "symlink",
              "symlinkTargetName": "ErrorMessages"
            },
            true
          ],
          [
            "name",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "name"
            },
            true
          ],
          [
            "typeName",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "typeName"
            },
            true
          ],
          [
            "docComment",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "docComment"
            },
            true
          ],
          [
            "passThruCodeBlock",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "passThruCodeBlock"
            },
            true
          ],
          [
            "noOutput",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "boolean"
              },
              "name": "noOutput"
            },
            true
          ]
        ],
        "baseTypes": [
          {
            "kind": "symlink",
            "symlinkTargetName": "TypeAssertionBase"
          }
        ],
        "typeName": "EnumAssertion",
        "name": "EnumAssertion"
      },
      "ObjectAssertionMember": {
        "kind": "one-of",
        "oneOf": [
          {
            "kind": "sequence",
            "sequence": [
              {
                "kind": "primitive",
                "primitiveName": "string"
              },
              {
                "kind": "symlink",
                "symlinkTargetName": "TypeAssertion"
              }
            ]
          },
          {
            "kind": "sequence",
            "sequence": [
              {
                "kind": "primitive",
                "primitiveName": "string"
              },
              {
                "kind": "symlink",
                "symlinkTargetName": "TypeAssertion"
              },
              {
                "kind": "primitive",
                "primitiveName": "boolean"
              }
            ]
          },
          {
            "kind": "sequence",
            "sequence": [
              {
                "kind": "primitive",
                "primitiveName": "string"
              },
              {
                "kind": "symlink",
                "symlinkTargetName": "TypeAssertion"
              },
              {
                "kind": "primitive",
                "primitiveName": "boolean"
              },
              {
                "kind": "primitive",
                "primitiveName": "string"
              }
            ]
          }
        ],
        "typeName": "ObjectAssertionMember",
        "name": "ObjectAssertionMember"
      },
      "AdditionalPropsKey": {
        "kind": "repeated",
        "min": null,
        "max": null,
        "repeated": {
          "kind": "one-of",
          "oneOf": [
            {
              "kind": "primitive-value",
              "value": "string"
            },
            {
              "kind": "primitive-value",
              "value": "number"
            },
            {
              "kind": "symlink",
              "symlinkTargetName": "RegExp"
            }
          ]
        },
        "typeName": "AdditionalPropsKey",
        "name": "AdditionalPropsKey"
      },
      "AdditionalPropsMember": {
        "kind": "one-of",
        "oneOf": [
          {
            "kind": "sequence",
            "sequence": [
              {
                "kind": "symlink",
                "symlinkTargetName": "AdditionalPropsKey"
              },
              {
                "kind": "symlink",
                "symlinkTargetName": "TypeAssertion"
              }
            ]
          },
          {
            "kind": "sequence",
            "sequence": [
              {
                "kind": "symlink",
                "symlinkTargetName": "AdditionalPropsKey"
              },
              {
                "kind": "symlink",
                "symlinkTargetName": "TypeAssertion"
              },
              {
                "kind": "primitive",
                "primitiveName": "boolean"
              }
            ]
          },
          {
            "kind": "sequence",
            "sequence": [
              {
                "kind": "symlink",
                "symlinkTargetName": "AdditionalPropsKey"
              },
              {
                "kind": "symlink",
                "symlinkTargetName": "TypeAssertion"
              },
              {
                "kind": "primitive",
                "primitiveName": "boolean"
              },
              {
                "kind": "primitive",
                "primitiveName": "string"
              }
            ]
          }
        ],
        "typeName": "AdditionalPropsMember",
        "name": "AdditionalPropsMember"
      },
      "ObjectAssertion": {
        "kind": "object",
        "members": [
          [
            "kind",
            {
              "kind": "primitive-value",
              "value": "object",
              "name": "kind"
            }
          ],
          [
            "members",
            {
              "kind": "repeated",
              "min": null,
              "max": null,
              "repeated": {
                "kind": "symlink",
                "symlinkTargetName": "ObjectAssertionMember"
              },
              "name": "members"
            }
          ],
          [
            "additionalProps",
            {
              "kind": "optional",
              "optional": {
                "kind": "repeated",
                "min": null,
                "max": null,
                "repeated": {
                  "kind": "symlink",
                  "symlinkTargetName": "AdditionalPropsMember"
                }
              },
              "name": "additionalProps"
            }
          ],
          [
            "baseTypes",
            {
              "kind": "optional",
              "optional": {
                "kind": "repeated",
                "min": null,
                "max": null,
                "repeated": {
                  "kind": "one-of",
                  "oneOf": [
                    {
                      "kind": "symlink",
                      "symlinkTargetName": "ObjectAssertion"
                    },
                    {
                      "kind": "symlink",
                      "symlinkTargetName": "AssertionSymlink"
                    }
                  ]
                }
              },
              "name": "baseTypes"
            }
          ],
          [
            "messageId",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "messageId"
            },
            true
          ],
          [
            "message",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "message"
            },
            true
          ],
          [
            "messages",
            {
              "kind": "symlink",
              "symlinkTargetName": "ErrorMessages"
            },
            true
          ],
          [
            "name",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "name"
            },
            true
          ],
          [
            "typeName",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "typeName"
            },
            true
          ],
          [
            "docComment",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "docComment"
            },
            true
          ],
          [
            "passThruCodeBlock",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "passThruCodeBlock"
            },
            true
          ],
          [
            "noOutput",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "boolean"
              },
              "name": "noOutput"
            },
            true
          ]
        ],
        "baseTypes": [
          {
            "kind": "symlink",
            "symlinkTargetName": "TypeAssertionBase"
          }
        ],
        "typeName": "ObjectAssertion",
        "name": "ObjectAssertion"
      },
      "AssertionSymlink": {
        "kind": "object",
        "members": [
          [
            "kind",
            {
              "kind": "primitive-value",
              "value": "symlink",
              "name": "kind"
            }
          ],
          [
            "symlinkTargetName",
            {
              "kind": "primitive",
              "primitiveName": "string",
              "name": "symlinkTargetName"
            }
          ],
          [
            "messageId",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "messageId"
            },
            true
          ],
          [
            "message",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "message"
            },
            true
          ],
          [
            "messages",
            {
              "kind": "symlink",
              "symlinkTargetName": "ErrorMessages"
            },
            true
          ],
          [
            "name",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "name"
            },
            true
          ],
          [
            "typeName",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "typeName"
            },
            true
          ],
          [
            "docComment",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "docComment"
            },
            true
          ],
          [
            "passThruCodeBlock",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "passThruCodeBlock"
            },
            true
          ],
          [
            "noOutput",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "boolean"
              },
              "name": "noOutput"
            },
            true
          ]
        ],
        "baseTypes": [
          {
            "kind": "symlink",
            "symlinkTargetName": "TypeAssertionBase"
          }
        ],
        "typeName": "AssertionSymlink",
        "name": "AssertionSymlink"
      },
      "TypeAssertion": {
        "kind": "one-of",
        "oneOf": [
          {
            "kind": "symlink",
            "symlinkTargetName": "NeverTypeAssertion"
          },
          {
            "kind": "symlink",
            "symlinkTargetName": "AnyTypeAssertion"
          },
          {
            "kind": "symlink",
            "symlinkTargetName": "UnknownTypeAssertion"
          },
          {
            "kind": "symlink",
            "symlinkTargetName": "PrimitiveTypeAssertion"
          },
          {
            "kind": "symlink",
            "symlinkTargetName": "PrimitiveValueTypeAssertion"
          },
          {
            "kind": "symlink",
            "symlinkTargetName": "RepeatedAssertion"
          },
          {
            "kind": "symlink",
            "symlinkTargetName": "SpreadAssertion"
          },
          {
            "kind": "symlink",
            "symlinkTargetName": "SequenceAssertion"
          },
          {
            "kind": "symlink",
            "symlinkTargetName": "OneOfAssertion"
          },
          {
            "kind": "symlink",
            "symlinkTargetName": "OptionalAssertion"
          },
          {
            "kind": "symlink",
            "symlinkTargetName": "EnumAssertion"
          },
          {
            "kind": "symlink",
            "symlinkTargetName": "ObjectAssertion"
          },
          {
            "kind": "symlink",
            "symlinkTargetName": "AssertionSymlink"
          }
        ],
        "typeName": "TypeAssertion",
        "name": "TypeAssertion"
      },
      "ValidationContext": {
        "kind": "object",
        "members": [
          [
            "checkAll",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "boolean"
              },
              "name": "checkAll"
            }
          ],
          [
            "noAdditionalProps",
            {
              "kind": "optional",
              "optional": {
                "kind": "primitive",
                "primitiveName": "boolean"
              },
              "name": "noAdditionalProps"
            }
          ],
          [
            "errorMessages",
            {
              "kind": "symlink",
              "symlinkTargetName": "ErrorMessages"
            }
          ],
          [
            "errors",
            {
              "kind": "repeated",
              "min": null,
              "max": null,
              "repeated": {
                "kind": "symlink",
                "symlinkTargetName": "TypeAssertionErrorMessage"
              },
              "name": "errors"
            }
          ],
          [
            "typeStack",
            {
              "kind": "repeated",
              "min": null,
              "max": null,
              "repeated": {
                "kind": "one-of",
                "oneOf": [
                  {
                    "kind": "symlink",
                    "symlinkTargetName": "NeverTypeAssertion"
                  },
                  {
                    "kind": "symlink",
                    "symlinkTargetName": "AnyTypeAssertion"
                  },
                  {
                    "kind": "symlink",
                    "symlinkTargetName": "UnknownTypeAssertion"
                  },
                  {
                    "kind": "symlink",
                    "symlinkTargetName": "PrimitiveTypeAssertion"
                  },
                  {
                    "kind": "symlink",
                    "symlinkTargetName": "PrimitiveValueTypeAssertion"
                  },
                  {
                    "kind": "symlink",
                    "symlinkTargetName": "RepeatedAssertion"
                  },
                  {
                    "kind": "symlink",
                    "symlinkTargetName": "SpreadAssertion"
                  },
                  {
                    "kind": "symlink",
                    "symlinkTargetName": "SequenceAssertion"
                  },
                  {
                    "kind": "symlink",
                    "symlinkTargetName": "OneOfAssertion"
                  },
                  {
                    "kind": "symlink",
                    "symlinkTargetName": "OptionalAssertion"
                  },
                  {
                    "kind": "symlink",
                    "symlinkTargetName": "EnumAssertion"
                  },
                  {
                    "kind": "symlink",
                    "symlinkTargetName": "ObjectAssertion"
                  },
                  {
                    "kind": "symlink",
                    "symlinkTargetName": "AssertionSymlink"
                  },
                  {
                    "kind": "sequence",
                    "sequence": [
                      {
                        "kind": "symlink",
                        "symlinkTargetName": "TypeAssertion"
                      },
                      {
                        "kind": "one-of",
                        "oneOf": [
                          {
                            "kind": "primitive",
                            "primitiveName": "number"
                          },
                          {
                            "kind": "primitive",
                            "primitiveName": "string"
                          },
                          {
                            "kind": "primitive",
                            "primitiveName": "undefined"
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              "name": "typeStack"
            }
          ],
          [
            "schema",
            {
              "kind": "symlink",
              "symlinkTargetName": "TypeAssertionMap"
            }
          ]
        ],
        "typeName": "ValidationContext",
        "name": "ValidationContext"
      },
      "TypeAssertionSetValue": {
        "kind": "object",
        "members": [
          [
            "ty",
            {
              "kind": "symlink",
              "symlinkTargetName": "TypeAssertion"
            }
          ],
          [
            "exported",
            {
              "kind": "primitive",
              "primitiveName": "boolean",
              "name": "exported"
            }
          ],
          [
            "resolved",
            {
              "kind": "primitive",
              "primitiveName": "boolean",
              "name": "resolved"
            }
          ]
        ],
        "typeName": "TypeAssertionSetValue",
        "name": "TypeAssertionSetValue"
      },
      "TypeAssertionMap": {
        "kind": "any",
        "typeName": "TypeAssertionMap",
        "name": "TypeAssertionMap"
      },
      "SymbolResolverContext": {
        "kind": "object",
        "members": [
          [
            "nestLevel",
            {
              "kind": "primitive",
              "primitiveName": "number",
              "name": "nestLevel"
            }
          ],
          [
            "symlinkStack",
            {
              "kind": "repeated",
              "min": null,
              "max": null,
              "repeated": {
                "kind": "primitive",
                "primitiveName": "string"
              },
              "name": "symlinkStack"
            }
          ]
        ],
        "typeName": "SymbolResolverContext",
        "name": "SymbolResolverContext"
      },
      "CodegenContext": {
        "kind": "object",
        "members": [
          [
            "nestLevel",
            {
              "kind": "primitive",
              "primitiveName": "number",
              "name": "nestLevel"
            }
          ],
          [
            "schema",
            {
              "kind": "symlink",
              "symlinkTargetName": "TypeAssertionMap"
            }
          ]
        ],
        "typeName": "CodegenContext",
        "name": "CodegenContext"
      }
    }
  }
};
export default schema;
// tslint:enable: object-literal-key-quotes
