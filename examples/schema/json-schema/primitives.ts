
// tslint:disable: object-literal-key-quotes
const schema = {
  "$schema": "http://json-schema.org/draft-06/schema#",
  "definitions": {
    "NumberType": {
      "type": "number"
    },
    "IntegerType": {
      "type": "integer"
    },
    "BigIntType": {
      "type": [
        "integer",
        "string"
      ]
    },
    "StringType": {
      "type": "string"
    },
    "BooleanType": {
      "type": "boolean"
    },
    "NullType": {
      "type": "null"
    },
    "UndefinedType": {
      "type": "null"
    },
    "AnyType": {
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
    "UnknownType": {
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
    "NeverType": {
      "type": "null"
    },
    "NumberValueType": {
      "type": "number",
      "enum": [
        3
      ]
    },
    "IntegerValueType": {
      "type": "integer"
    },
    "BigIntValueType": {
      "type": [
        "integer",
        "string"
      ],
      "enum": [
        "7",
        7
      ]
    },
    "StringValueType": {
      "type": "string",
      "enum": [
        "XB"
      ]
    },
    "BooleanValueType": {
      "type": "boolean",
      "enum": [
        true
      ]
    }
  }
};
export default schema;
// tslint:enable: object-literal-key-quotes
