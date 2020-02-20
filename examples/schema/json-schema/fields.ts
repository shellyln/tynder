
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
    }
  }
};
export default schema;
// tslint:enable: object-literal-key-quotes