
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
