
// tslint:disable: object-literal-key-quotes
const schema = {
  "$schema": "http://json-schema.org/draft-06/schema#",
  "definitions": {
    "NumberType": {
      "type": "number"
    },
    "A": {
      "type": "object",
      "properties": {
        "numberTypeField": {
          "$ref": "#/definitions/NumberType"
        },
        "integerTypeField": {
          "type": "integer"
        },
        "bigIntTypeField": {
          "type": [
            "integer",
            "string"
          ]
        },
        "stringTypeField": {
          "type": "string"
        },
        "booleanTypeField": {
          "type": "boolean"
        },
        "nullTypeField": {
          "type": "null"
        },
        "undefinedTypeField": {
          "type": "null"
        },
        "anyTypeField": {
          "type": [
            "null",
            "integer",
            "number",
            "string",
            "boolean",
            "array",
            "object"
          ]
        },
        "unknownTypeField": {
          "type": [
            "null",
            "integer",
            "number",
            "string",
            "boolean",
            "array",
            "object"
          ]
        },
        "neverTypeField": {
          "type": "null"
        },
        "numberValueTypeField": {
          "type": "number",
          "enum": [
            3
          ]
        },
        "integerValueTypeField": {
          "type": "integer"
        },
        "bigIntValueTypeField": {
          "type": [
            "integer",
            "string"
          ],
          "enum": [
            "7",
            7
          ]
        },
        "stringValueTypeField": {
          "type": "string",
          "enum": [
            "XB"
          ]
        },
        "booleanValueTypeField": {
          "type": "boolean",
          "enum": [
            true
          ]
        }
      },
      "required": [
        "numberTypeField",
        "integerTypeField",
        "bigIntTypeField",
        "stringTypeField",
        "booleanTypeField",
        "nullTypeField",
        "undefinedTypeField",
        "anyTypeField",
        "unknownTypeField",
        "neverTypeField",
        "numberValueTypeField",
        "integerValueTypeField",
        "bigIntValueTypeField",
        "stringValueTypeField",
        "booleanValueTypeField"
      ],
      "additionalProperties": false
    },
    "B": {
      "type": "object",
      "properties": {
        "numberTypeField": {
          "$ref": "#/definitions/NumberType"
        },
        "integerTypeField": {
          "type": "integer"
        },
        "bigIntTypeField": {
          "type": [
            "integer",
            "string"
          ]
        },
        "stringTypeField": {
          "type": "string"
        },
        "booleanTypeField": {
          "type": "boolean"
        },
        "nullTypeField": {
          "type": "null"
        },
        "undefinedTypeField": {
          "type": "null"
        },
        "anyTypeField": {
          "type": [
            "null",
            "integer",
            "number",
            "string",
            "boolean",
            "array",
            "object"
          ]
        },
        "unknownTypeField": {
          "type": [
            "null",
            "integer",
            "number",
            "string",
            "boolean",
            "array",
            "object"
          ]
        },
        "neverTypeField": {
          "type": "null"
        },
        "numberValueTypeField": {
          "type": "number",
          "enum": [
            3
          ]
        },
        "integerValueTypeField": {
          "type": "integer"
        },
        "bigIntValueTypeField": {
          "type": [
            "integer",
            "string"
          ],
          "enum": [
            "7",
            7
          ]
        },
        "stringValueTypeField": {
          "type": "string",
          "enum": [
            "XB"
          ]
        },
        "booleanValueTypeField": {
          "type": "boolean",
          "enum": [
            true
          ]
        }
      },
      "additionalProperties": false
    },
    "C": {
      "type": "object",
      "properties": {
        "numberTypeField": {
          "$ref": "#/definitions/NumberType"
        },
        "integerTypeField": {
          "type": "integer"
        },
        "bigIntTypeField": {
          "type": [
            "integer",
            "string"
          ]
        },
        "stringTypeField": {
          "type": "string"
        },
        "booleanTypeField": {
          "type": "boolean"
        },
        "nullTypeField": {
          "type": "null"
        },
        "undefinedTypeField": {
          "type": "null"
        },
        "anyTypeField": {
          "type": [
            "null",
            "integer",
            "number",
            "string",
            "boolean",
            "array",
            "object"
          ]
        },
        "unknownTypeField": {
          "type": [
            "null",
            "integer",
            "number",
            "string",
            "boolean",
            "array",
            "object"
          ]
        },
        "neverTypeField": {
          "type": "null"
        },
        "numberValueTypeField": {
          "type": "number",
          "enum": [
            3
          ]
        },
        "integerValueTypeField": {
          "type": "integer"
        },
        "bigIntValueTypeField": {
          "type": [
            "integer",
            "string"
          ],
          "enum": [
            "7",
            7
          ]
        },
        "stringValueTypeField": {
          "type": "string",
          "enum": [
            "XB"
          ]
        },
        "booleanValueTypeField": {
          "type": "boolean",
          "enum": [
            true
          ]
        }
      },
      "required": [
        "numberTypeField",
        "integerTypeField",
        "bigIntTypeField",
        "stringTypeField",
        "booleanTypeField",
        "nullTypeField",
        "undefinedTypeField",
        "anyTypeField",
        "unknownTypeField",
        "neverTypeField",
        "numberValueTypeField",
        "integerValueTypeField",
        "bigIntValueTypeField",
        "stringValueTypeField",
        "booleanValueTypeField"
      ],
      "additionalProperties": false
    },
    "D": {
      "type": "object",
      "properties": {
        "numberTypeField": {
          "$ref": "#/definitions/NumberType"
        },
        "integerTypeField": {
          "type": "integer"
        },
        "bigIntTypeField": {
          "type": [
            "integer",
            "string"
          ]
        },
        "stringTypeField": {
          "type": "string"
        },
        "booleanTypeField": {
          "type": "boolean"
        },
        "nullTypeField": {
          "type": "null"
        },
        "undefinedTypeField": {
          "type": "null"
        },
        "anyTypeField": {
          "type": [
            "null",
            "integer",
            "number",
            "string",
            "boolean",
            "array",
            "object"
          ]
        },
        "unknownTypeField": {
          "type": [
            "null",
            "integer",
            "number",
            "string",
            "boolean",
            "array",
            "object"
          ]
        },
        "neverTypeField": {
          "type": "null"
        },
        "numberValueTypeField": {
          "type": "number",
          "enum": [
            3
          ]
        },
        "integerValueTypeField": {
          "type": "integer"
        },
        "bigIntValueTypeField": {
          "type": [
            "integer",
            "string"
          ],
          "enum": [
            "7",
            7
          ]
        },
        "stringValueTypeField": {
          "type": "string",
          "enum": [
            "XB"
          ]
        },
        "booleanValueTypeField": {
          "type": "boolean",
          "enum": [
            true
          ]
        }
      },
      "additionalProperties": false
    },
    "E": {
      "type": "object",
      "properties": {},
      "patternProperties": {
        "^.*$": {
          "type": [
            "null",
            "integer",
            "number",
            "string",
            "boolean",
            "array",
            "object"
          ],
          "description": "additional props"
        }
      },
      "additionalProperties": false
    },
    "Z1": {
      "type": "object",
      "properties": {
        "foo": {
          "$ref": "#/definitions/ACL/properties/target"
        },
        "bar": {
          "type": "string",
          "minLength": 0
        },
        "baz": {
          "$ref": "#/definitions/ACL/properties/target"
        }
      },
      "required": [
        "foo",
        "bar",
        "baz"
      ],
      "additionalProperties": false
    },
    "ACL": {
      "type": "object",
      "properties": {
        "target": {
          "type": "string"
        },
        "value": {
          "type": "string",
          "minLength": 0
        }
      },
      "required": [
        "target",
        "value"
      ],
      "additionalProperties": false
    },
    "Z2": {
      "type": "object",
      "properties": {
        "foo": {
          "$ref": "#/definitions/ACL/properties/target"
        },
        "bar": {
          "type": "string",
          "minLength": 0
        },
        "baz": {
          "type": "string",
          "maxLength": 10
        }
      },
      "required": [
        "foo",
        "bar",
        "baz"
      ],
      "additionalProperties": false
    },
    "Foo": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "pattern": "^[A-Za-z]+$"
        },
        "email": {
          "type": "string",
          "pattern": "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$"
        }
      },
      "required": [
        "name",
        "email"
      ],
      "additionalProperties": false
    },
    "Bar": {
      "type": "object",
      "properties": {
        "foo": {
          "$ref": "#/definitions/Foo"
        }
      },
      "required": [
        "foo"
      ],
      "additionalProperties": false
    },
    "Baz": {
      "type": "object",
      "properties": {
        "aaa1": {
          "type": "string"
        },
        "aaa2": {
          "type": "string"
        },
        "aaa3": {
          "type": "string"
        },
        "aaa4": {
          "type": "string"
        },
        "bbb1": {
          "type": "integer",
          "minimum": -3,
          "maximum": 5
        },
        "bbb2": {
          "type": "integer",
          "minimum": -3,
          "maximum": 5
        },
        "bbb3": {
          "type": "integer",
          "maximum": -3
        },
        "bbb4": {
          "type": "integer",
          "minimum": 5
        },
        "ccc1": {
          "type": "number",
          "minimum": -3,
          "maximum": 5,
          "description": "comment"
        },
        "ccc2": {
          "type": "number",
          "minimum": -3,
          "maximum": 5,
          "description": "comment"
        },
        "ccc3": {
          "type": "number",
          "maximum": -3,
          "description": "comment"
        },
        "ccc4": {
          "type": "number",
          "minimum": 5,
          "description": "comment"
        }
      },
      "required": [
        "aaa1",
        "aaa2",
        "aaa3",
        "aaa4",
        "bbb1",
        "bbb2",
        "bbb3",
        "bbb4",
        "ccc1",
        "ccc2",
        "ccc3",
        "ccc4"
      ],
      "additionalProperties": false
    },
    "User": {
      "type": "object",
      "properties": {
        "userName": {
          "type": "string",
          "pattern": "^[A-Za-z]+$"
        },
        "primaryEmail": {
          "type": "string",
          "pattern": "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$"
        },
        "primaryAliasName": {
          "type": "string",
          "pattern": "^[A-Za-z]+$"
        },
        "aliasNames": {
          "type": "array",
          "items": {
            "type": "string",
            "pattern": "^[A-Za-z]+$"
          }
        }
      },
      "required": [
        "userName",
        "primaryEmail",
        "primaryAliasName",
        "aliasNames"
      ],
      "additionalProperties": false
    }
  }
};
export default schema;
// tslint:enable: object-literal-key-quotes
