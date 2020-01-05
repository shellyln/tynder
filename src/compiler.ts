// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { parserInput,
         ParserFnWithCtx }       from 'fruitsconfits/modules/lib/types';
import { getStringParsers }      from 'fruitsconfits/modules/lib/string-parser';
import { getObjectParsers }      from 'fruitsconfits/modules/lib/object-parser';
import { SxTokenChild,
         SxToken,
         SxSymbol }              from 'liyad/modules/s-exp/types';
import { lisp }                  from 'liyad/modules/s-exp/interpreters/presets/lisp';
import { TypeAssertion,
         PrimitiveTypeAssertion,
         ErrorMessages,
         TypeAssertionSetValue,
         TypeAssertionMap }      from './types';
import * as operators            from './operators';
import { resolveSymbols }        from './lib/resolver';



interface SxOp {
    'op': string;
}

type AstChild = SxTokenChild | SxOp | undefined;

interface Ctx {
    docComment?: string;
}
type Ast = SxToken | AstChild | SxOp | undefined;

const $s = getStringParsers<Ctx, Ast>({
    rawToToken: rawToken => rawToken,
    concatTokens: tokens => (tokens.length ?
        [tokens.reduce((a, b) => String(a) + b)] : []),
});

const $o = getObjectParsers<Ast[], Ctx, Ast>({
    rawToToken: rawToken => rawToken,
    concatTokens: tokens => (tokens.length ?
        [tokens.reduce((a, b) => String(a) + b)] : []),
    comparator: (a, b) => a === b,
});

const {seq, cls, notCls, clsFn, classes, numbers, cat,
       once, repeat, qty, zeroWidth, err, beginning, end,
       first, or, combine, erase, trans, ahead, rules} = $s;


const directiveLineComment =
    trans(tokens => [[{symbol: 'directive'}, ...tokens]])(
        erase(qty(2)(cls('/'))),
        erase(repeat(classes.space)),
        cat(seq('@tynder-'), repeat(classes.alnum)), // [0]
        erase(repeat(classes.space)),
        cat(repeat(notCls('\r\n', '\n', '\r'))),     // [1]
        erase(classes.newline), );

const lineComment =
    combine(
        erase(qty(2)(cls('/'))),
        ahead(repeat(classes.space),
              notCls('@tynder-'), ),
        repeat(notCls('\r\n', '\n', '\r')),
        classes.newline, );

const hashLineComment =
    combine(
        seq('#'),
        repeat(notCls('\r\n', '\n', '\r')),
        classes.newline, );

const docComment =
    combine(
        seq('/**'),
        repeat(classes.space),
        input => {
            const ret = cat(repeat(notCls('*/')))(input);
            if (ret.succeeded) {
                // define a reducer
                const ctx2 = {...ret.next.context}; // NOTE: context is immutable
                ctx2.docComment = (ret.tokens[0] as string).trim();
                ret.next.context = ctx2;
            }
            return ret;
        },
        seq('*/'), );

const blockComment =
    combine(
        seq('/*'),
        repeat(notCls('*/')),
        seq('*/'), );

const commentOrSpace =
    first(classes.space, lineComment, hashLineComment, docComment, blockComment);


const trueValue =
    trans(tokens => [true])
    (seq('true'));

const falseValue =
    trans(tokens => [false])
    (seq('false'));

const nullValue =
    trans(tokens => [null])
    (seq('null'));

const undefinedValue =
    trans(tokens => [void 0])
    (seq('undefined'));

const positiveInfinityValue =
    trans(tokens => [Number.POSITIVE_INFINITY])
    (qty(0, 1)(seq('+')), seq('Infinity'));

const negativeInfinityValue =
    trans(tokens => [Number.NEGATIVE_INFINITY])
    (seq('-Infinity'));

const nanValue =
    trans(tokens => [Number.NaN])
    (seq('NaN'));


const binaryIntegerValue =
    trans(tokens => [Number.parseInt((tokens as string[])[0].replace(/_/g, ''), 2)])
    (numbers.bin(seq('0b')));

const octalIntegerValue =
    trans(tokens => [Number.parseInt((tokens as string[])[0].replace(/_/g, ''), 8)])
    (numbers.oct(seq('0o'), seq('0')));

const hexIntegerValue =
    trans(tokens => [Number.parseInt((tokens as string[])[0].replace(/_/g, ''), 16)])
    (numbers.hex(seq('0x'), seq('0X')));

const decimalIntegerValue =
    trans(tokens => [Number.parseInt((tokens as string[])[0].replace(/_/g, ''), 10)])
    (numbers.int);

const floatingPointNumberValue =
    trans(tokens => [Number.parseFloat((tokens as string[])[0].replace(/_/g, ''))])
    (numbers.float);

const numberValue =
    first(octalIntegerValue,
          hexIntegerValue,
          binaryIntegerValue,
          floatingPointNumberValue,
          decimalIntegerValue,
          positiveInfinityValue,
          negativeInfinityValue,
          nanValue, );


const stringEscapeSeq = first(
    trans(t => ['\''])(seq('\\\'')),
    trans(t => ['\"'])(seq('\\"')),
    trans(t => ['\`'])(seq('\\`')),
    trans(t => ['/'])(seq('\\/')),
    trans(t => ['\\'])(seq('\\\\')),
    trans(t => [''])(seq('\\\r\n')),
    trans(t => [''])(seq('\\\r')),
    trans(t => [''])(seq('\\\n')),
    trans(t => ['\n'])(seq('\\n')),
    trans(t => ['\r'])(seq('\\r')),
    trans(t => ['\v'])(seq('\\v')),
    trans(t => ['\t'])(seq('\\t')),
    trans(t => ['\b'])(seq('\\b')),
    trans(t => ['\f'])(seq('\\f')),
    trans(t => [String.fromCodePoint(Number.parseInt((t as string[])[0], 16))])(
        cat(erase(seq('\\u')),
                qty(4, 4)(classes.hex), )),
    trans(t => [String.fromCodePoint(Number.parseInt((t as string[])[0], 16))])(
        cat(erase(seq('\\u{')),
                qty(1, 6)(classes.hex),
                erase(seq('}')), )),
    trans(t => [String.fromCodePoint(Number.parseInt((t as string[])[0], 16))])(
        cat(erase(seq('\\x')),
                qty(2, 2)(classes.hex), )),
    trans(t => [String.fromCodePoint(Number.parseInt((t as string[])[0], 8))])(
        cat(erase(seq('\\')),
                qty(3, 3)(classes.oct), )));

const signleQuotStringValue =
    trans(tokens => [tokens[0]])(
        erase(seq("'")),
            cat(repeat(first(
                stringEscapeSeq,
                combine(cls('\r', '\n'), err('Line breaks within strings are not allowed.')),
                notCls("'"),
            ))),
        erase(seq("'")), );

const doubleQuotStringValue =
    trans(tokens => [tokens[0]])(
        erase(seq('"')),
            cat(repeat(first(
                stringEscapeSeq,
                combine(cls('\r', '\n'), err('Line breaks within strings are not allowed.')),
                notCls('"'),
            ))),
        erase(seq('"')), );

const backQuotStringValue =
    trans(tokens => [tokens[0]])(
        erase(seq('`')),
            cat(repeat(first(
                stringEscapeSeq,
                notCls('`'),
            ))),
        erase(seq('`')), );

const stringValue =
    first(signleQuotStringValue, doubleQuotStringValue, backQuotStringValue);

const regexpStringValue =
    // TODO: '/' ']' '\\' in character class '[]' is not parsed correctly.
    trans(tokens => [{value: new RegExp(tokens[0] as string)}])(
        erase(seq('/')),
            cat(repeat(first(
                stringEscapeSeq,
                notCls('/'),
            ))),
        erase(seq('/')), );


const symbolName =
    trans(tokens => tokens)
    (cat(combine(classes.alpha, repeat(classes.alnum))));

const decoratorSymbolName =
    trans(tokens => [{symbol: (tokens as string[])[0]}])
    (cat(combine(seq('@'), classes.alpha, repeat(classes.alnum))));


const simpleConstExpr =
    first(trueValue, falseValue, nullValue, undefinedValue,
          numberValue, stringValue, );

const objKey =
    first(stringValue, symbolName);

const listValue = first(
    trans(tokens => [[]])(erase(
        seq('['),
            repeat(commentOrSpace),
        seq(']'), )),
    trans(tokens => {
        const ast: Ast = [{symbol: '$list'}];
        for (const token of tokens) {
            ast.push(token as any);
        }
        return [ast];
    })(
        erase(seq('[')),
            combine(
                erase(repeat(commentOrSpace)),
                first(input => listValue(input),   // NOTE: recursive definitions
                      input => objectValue(input), //       should place as lambda.
                      simpleConstExpr,
                      ),
                erase(repeat(commentOrSpace)), ),
            repeat(combine(
                erase(repeat(commentOrSpace),
                      seq(','),
                      repeat(commentOrSpace)),
                first(input => listValue(input),   // NOTE: recursive definitions
                      input => objectValue(input), //       should place as lambda.
                      simpleConstExpr,
                      ),
                erase(repeat(commentOrSpace)), )),
            qty(0, 1)(erase(
                seq(','),
                repeat(commentOrSpace), )),
            first(ahead(seq(']')), err('listValue: Unexpected token has appeared.')),
        erase(seq(']')),
    ), );

const objectKeyValuePair =
    combine(
        objKey,
        erase(repeat(commentOrSpace),
              first(seq(':'), err('":" is needed.')),
              repeat(commentOrSpace)),
        first(input => listValue(input),   // NOTE: recursive definitions
              input => objectValue(input), //       should place as lambda.
              simpleConstExpr,
              err('object value is needed.')), );

const objectValue = first(
    trans(tokens => [[{symbol: '#'}]])(erase(
        seq('{'),
            repeat(commentOrSpace),
        seq('}'),
    )),
    trans(tokens => {
        const ast: Ast = [{symbol: '#'}];
        for (let i = 0; i < tokens.length; i += 2) {
            if (tokens[i] === '__proto__') {
                continue; // NOTE: prevent prototype pollution attacks
            }
            ast.push([tokens[i], tokens[i + 1]]);
        }
        return [ast];
    })(
        erase(seq('{')),
            combine(
                erase(repeat(commentOrSpace)),
                objectKeyValuePair,
                erase(repeat(commentOrSpace)), ),
            repeat(combine(
                erase(seq(','),
                      repeat(commentOrSpace)),
                objectKeyValuePair,
                erase(repeat(commentOrSpace)), )),
            qty(0, 1)(erase(
                seq(','),
                repeat(commentOrSpace), )),
            first(ahead(seq('}')), err('objectValue: Unexpected token has appeared.')),
        erase(seq('}')),
    ), );

const constExpr =
    first(simpleConstExpr,
          listValue,
          objectValue, );


// const primitiveValue = trans(tokens => [[{symbol: 'primitiveValue'}, tokens[0]]])(
//     first(trueValue, falseValue, nullValue, undefinedValue,
//           numberValue, stringValue, ));

const primitiveValueNoNullUndefined =
    trans(tokens => [[{symbol: 'primitiveValue'}, tokens[0]]])(
        first(trueValue, falseValue,
              numberValue, stringValue, ));


const primitiveTypeName =
    trans(tokens => [[{symbol: 'primitive'}, tokens[0]]])(
        first(seq('number?'), seq('bigint?'), seq('string?'), seq('boolean?'), // TODO: '?' is allowed in the sequence assertion
              seq('number'), seq('bigint'), seq('string'), seq('boolean'), )); // TODO: function

const nullUndefinedTypeName =
    trans(tokens => [[{symbol: 'primitive'}, tokens[0]]])(
        first(seq('null'), seq('undefined'), seq('any'), seq('never')), );

const simpleTypeName =
    first(primitiveTypeName,
          nullUndefinedTypeName,
          trans(tokens =>
                [[{symbol: 'ref'}, tokens[0]]])(
            ahead(notCls('Array', 'Partial', 'Pick', 'Omit')),
            symbolName, ));


const sequenceType =
    trans(tokens => [[{symbol: 'sequenceOf'}, ...tokens]])(
        combine(
            erase(seq('[')),
                combine(
                    erase(repeat(commentOrSpace)),
                    input => spreadOrComplexType(first(seq(','), seq(']')))(input),
                    erase(repeat(commentOrSpace)), ),
                repeat(combine(
                    erase(seq(','),
                        repeat(commentOrSpace)),
                    input => spreadOrComplexType(first(seq(','), seq(']')))(input),
                    erase(repeat(commentOrSpace)), )),
                qty(0, 1)(erase(
                    seq(','),
                    repeat(commentOrSpace), )),
                first(ahead(seq(']')), err('sequenceType: Unexpected token has appeared.')),
            erase(seq(']')), ));


const arraySizeFactorInner =
    first(
        trans(tokens => [[{symbol: '#'}, ['max', tokens[0]]]])(
            erase(seq('..')),
            erase(repeat(commentOrSpace)),
            decimalIntegerValue, ),
        trans(tokens => [[{symbol: '#'}, ['min', tokens[0]], ['max', tokens[1]]]])(
            decimalIntegerValue,
            erase(repeat(commentOrSpace)),
            erase(seq('..')),
            erase(repeat(commentOrSpace)),
            decimalIntegerValue, ),
        trans(tokens => [[{symbol: '#'}, ['min', tokens[0]]]])(
            decimalIntegerValue,
            erase(repeat(commentOrSpace)),
            erase(seq('..')), ),
        trans(tokens => [[{symbol: '#'}, ['max', tokens[0]]]])(
            decimalIntegerValue, ));

const arraySizeFactor =
    trans(tokens =>
        tokens.length > 0 ?
            tokens :
            [[{symbol: '#'}]])(
        erase(seq('[')),
            erase(repeat(commentOrSpace)),
            qty(0, 1)(arraySizeFactorInner),
            erase(repeat(commentOrSpace)),
        erase(seq(']')), );

const complexArrayType =
    trans(tokens => [[{symbol: 'repeated'}, tokens[0], tokens[1]]])(
        erase(seq('Array')),
        erase(repeat(commentOrSpace)),
        erase(seq('<')),
            erase(repeat(commentOrSpace)),
            first(input => complexType(first(seq(','), seq('>')))(input),
                  err('type is expected in Array type.'), ),        // [0]
            erase(repeat(commentOrSpace)),
            qty(0, 1)(combine(
                erase(seq(',')),
                erase(repeat(commentOrSpace)),
                arraySizeFactorInner,                               // [1]
                erase(repeat(commentOrSpace)), )),
        first(ahead(seq('>')),
              err('\'>\' is expected in Array type.'), ),
        erase(seq('>')), );

const partialType =
    trans(tokens => [[{symbol: 'partial'}, tokens[0], tokens[1]]])(
        erase(seq('Partial')),
        erase(repeat(commentOrSpace)),
        erase(seq('<')),
            erase(repeat(commentOrSpace)),
            first(input => complexType(first(seq(','), seq('>')))(input),
                  err('type is expected in Partial type.'), ),      // [0]
            erase(repeat(commentOrSpace)),
        first(ahead(seq('>')),
              err('\'>\' is expected in Partial type.'), ),
        erase(seq('>')), );

const pickOrOmitType =
    trans(tokens => [[{symbol: tokens[0] === 'Pick' ? 'picked' : 'omit'}, tokens[1], ...tokens.slice(2)]])(
        first(seq('Pick'),
              seq('Omit'), ),                                       // [0]
        erase(repeat(commentOrSpace)),
        erase(seq('<')),
            erase(repeat(commentOrSpace)),
            first(input => complexType(first(seq(','), seq('>')))(input),
                  err('type is expected in Partial type.'), ),      // [1]
            erase(repeat(commentOrSpace)),
            combine(
                erase(seq(',')),
                erase(repeat(commentOrSpace)),
                    stringValue,                                    // [2]
                    qty(0)(combine(
                        erase(repeat(commentOrSpace)),
                        erase(seq('|')),
                        erase(repeat(commentOrSpace)),
                        stringValue, )),                            // [3],...
                erase(repeat(commentOrSpace)), ),
        first(ahead(seq('>')),
              err('\'>\' is expected in Pick|Omit type.'), ),
        erase(seq('>')), );

const genericOrSimpleType =
    trans(tokens => [tokens[0]])(                     // remove generics parameters
        simpleTypeName,                               // [0]
        erase(repeat(commentOrSpace)),
        qty(0, 1)(combine(
            erase(seq('<')),
                combine(                              // [1]
                    erase(repeat(commentOrSpace)),
                    first(input => complexType(first(seq(','), seq('>')))(input),
                          err('type is expected in generic type.'), ),
                    erase(repeat(commentOrSpace)), ),
                repeat(combine(                       // [2]...
                    erase(seq(','),
                          repeat(commentOrSpace)),
                    first(input => complexType(first(seq(','), seq('>')))(input),
                          err('type is expected in generic type.'), ),
                    erase(repeat(commentOrSpace)), )),
                qty(0, 1)(erase(
                    seq(','),
                    repeat(commentOrSpace), )),
                first(ahead(seq('>')), err('genericType: Unexpected token has appeared.')),
            erase(seq('>')), )));

const spreadType =
    trans(tokens => [[{symbol: 'spread'}, tokens[0], tokens[1]]])(
        erase(seq('...')),
        erase(repeat(commentOrSpace)),
        erase(seq('<')),
            erase(repeat(commentOrSpace)),
            input => complexType(first(seq(','), seq('>')))(input),
            erase(repeat(commentOrSpace)),
            qty(0, 1)(combine(
                erase(seq(',')),
                erase(repeat(commentOrSpace)),
                arraySizeFactorInner,
                erase(repeat(commentOrSpace)), )),
        erase(seq('>')), );


const decorator =
    trans(tokens => [tokens])(
        decoratorSymbolName,
        qty(0, 1)(first(
            combine(erase(
                seq('('),
                    repeat(commentOrSpace),
                seq(')'), )),
            combine(
                erase(seq('(')),
                    combine(
                        erase(repeat(commentOrSpace)),
                        first(regexpStringValue, constExpr),
                        erase(repeat(commentOrSpace)), ),
                    repeat(combine(
                        erase(repeat(commentOrSpace)),
                        erase(seq(',')),
                        erase(repeat(commentOrSpace)),
                        first(regexpStringValue, constExpr),
                        erase(repeat(commentOrSpace)), )),
                    qty(0, 1)(erase(
                        seq(','),
                        repeat(commentOrSpace), )),
                erase(seq(')')),
            ), )));

const decoratorsClause =
    trans(tokens => tokens)(
        repeat(combine(
            decorator,
            erase(repeat(commentOrSpace)), )));


const complexTypeInnerWOSinpleArrayType = (edge: ParserFnWithCtx<string, Ctx, Ast>) =>
    first(genericOrSimpleType,
          primitiveValueNoNullUndefined,
          partialType,
          pickOrOmitType,
          complexArrayType,
          sequenceType,
          input => interfaceDefInner(seq(','))(input), );

const complexTypeInnerRoot: (separator: ParserFnWithCtx<string, Ctx, Ast>) => ParserFnWithCtx<string, Ctx, Ast> =
    (edge: ParserFnWithCtx<string, Ctx, Ast>) =>
    trans(tokens => {
            let ty = [{symbol: '$pipe'}, tokens[1], ...(tokens[0] as Ast[])];
            if (tokens[2] !== null) {
                for (const z of tokens[2] as Ast[]) {
                    ty = [{symbol: 'repeated'}, ty, z];
                }
            }
            return ([[
                ty,
                ...(tokens[3] ? [tokens[3]] : []),
                ...tokens.slice(4),
            ]]);
        })(                                                              // [0]
        trans(tokens => [tokens])(qty(0, 1)(decoratorsClause)),          // [1]
        first(                                                           // [2]
            input => complexTypeInnerWOSinpleArrayType(edge)(input),
            combine(
                erase(seq('(')),
                    erase(repeat(commentOrSpace)),
                    input => complexType(edge)(input),
                    erase(repeat(commentOrSpace)),
                erase(seq(')')), )),
            combine(
                trans(tokens => tokens[0] !== null ? [tokens] : [null])(
                    first(
                        qty(1)(combine(
                            erase(repeat(commentOrSpace)),
                            arraySizeFactor,
                        )),
                        zeroWidth(() => null), )),
            combine(first(
                trans(tokens => [tokens[0], ...(tokens[1] as Ast[])])(
                    qty(1)(combine(
                        erase(repeat(commentOrSpace)),
                        trans(tokens => [{op: tokens[0]} as any])(or(seq('&'), seq('|'), seq('-'))),
                        erase(repeat(commentOrSpace)),
                        input => complexTypeInnerRoot(edge)(input), ))),
                trans(tokens => [])(), ))));


const binaryOp = (op: string, op1: any, op2: any) => {
    return [{symbol: op}, op1, op2];
};

const isOperator = (v: any, op: string) => {
    if (typeof v === 'object' && v.op === op) {
        return true;
    }
    return false;
};

const isValue = (v: any) => {
    // TODO: check type
    return true;
};


// production rules:
//   S -> S "&" S
const complexTypeExprRule3 = $o.trans(tokens => [binaryOp('intersect', tokens[0], tokens[2])])(
    $o.clsFn(t => isValue(t)),
    $o.clsFn(t => isOperator(t, '&')),
    $o.clsFn(t => isValue(t)),
);

// production rules:
//   S -> S "|" S
const complexTypeExprRule2 = $o.trans(tokens => [binaryOp('oneOf', tokens[0], tokens[2])])(
    $o.clsFn(t => isValue(t)),
    $o.clsFn(t => isOperator(t, '|')),
    $o.clsFn(t => isValue(t)),
);

// production rules:
//   S -> S "-" S
const complexTypeExprRule1 = $o.trans(tokens => [binaryOp('subtract', tokens[0], tokens[2])])(
    $o.clsFn(t => isValue(t)),
    $o.clsFn(t => isOperator(t, '-')),
    $o.clsFn(t => isValue(t)),
);

const complexType = (edge: ParserFnWithCtx<string, Ctx, Ast>) => rules({
    rules: [
        complexTypeExprRule3,
        complexTypeExprRule2,
        complexTypeExprRule1,
    ],
    check: $o.combine($o.classes.any, $o.end()),
})(trans(tokens => tokens[0] as Ast[])(complexTypeInnerRoot(edge)));


const spreadOrComplexType: (separator: ParserFnWithCtx<string, Ctx, Ast>) => ParserFnWithCtx<string, Ctx, Ast> =
    (edge: ParserFnWithCtx<string, Ctx, Ast>) =>
    first(spreadType, complexType(edge));


const typeDef =
    trans(tokens => [[{symbol: 'def'}, tokens[1], [{symbol: 'docComment'}, tokens[2], tokens[0] ] ]])(
        erase(seq('type')),
            input => {
                const ret = zeroWidth(() => [])(input);
                if (ret.succeeded) {
                    const text = ret.next.context.docComment;
                    ret.next.context = {...ret.next.context};
                    delete ret.next.context.docComment;
                    ret.tokens.length = 0;
                    ret.tokens.push(text ? text : null);
                }
                return ret;
            },                                                       // [0]
            erase(repeat(commentOrSpace)),
            symbolName,                                              // [1]
            erase(repeat(commentOrSpace)),
        erase(seq('=')),
            erase(repeat(commentOrSpace)),
            input => complexType(first(seq(','), seq(';')))(input),  // [2]
            erase(repeat(commentOrSpace)),
        erase(seq(';')), );


const interfaceExtendsClause =
    trans(tokens => [
            [{symbol: '$list'},
                ...tokens.map(x => [{symbol: 'ref'}, x])], ])(
        erase(seq('extends')),
        erase(repeat(commentOrSpace)),
        symbolName,
        repeat(combine(
            erase(repeat(commentOrSpace)),
            erase(seq(',')),
            erase(repeat(commentOrSpace)),
            symbolName, )));

const interfaceKeyTypePair = (separator: ParserFnWithCtx<string, Ctx, Ast>) =>
    trans(tokens => [
            [{symbol: '$list'},
                tokens[2],
                [{symbol: 'docComment'},
                    [{symbol: '$pipe'},
                        tokens[3] === '?' ?
                            [{symbol: 'optional'}, tokens[4]] :
                            tokens[4], ...(tokens[0] as Ast[]), ],
                    tokens[1], ]]])(
        trans(tokens => [tokens])(first(
            decoratorsClause,
            zeroWidth(() => []), )),                // [0] decorators
        input => {
            const ret = zeroWidth(() => [])(input);
            if (ret.succeeded) {
                const text = ret.next.context.docComment;
                ret.next.context = {...ret.next.context};
                delete ret.next.context.docComment;
                ret.tokens.length = 0;
                ret.tokens.push(text ? text : null);
            }
            return ret;
        },                                          // [1]
        objKey,                                     // [2] key
        first(                                      // [3] '?' | ''
            combine(
                erase(repeat(commentOrSpace)),
                seq('?'),
                erase(repeat(commentOrSpace)), ),
            zeroWidth(() => ['']), ),
        erase(repeat(commentOrSpace),
            first(seq(':'), err('":" is needed.')),
            repeat(commentOrSpace), ),
        first(                                      // [4] type
            input => complexType(first(separator, seq('}')))(input),
            err('interface member type is needed.'), ));

const interfaceDefInner: (separator: ParserFnWithCtx<string, Ctx, Ast>) => ParserFnWithCtx<string, Ctx, Ast> =
    (separator: ParserFnWithCtx<string, Ctx, Ast>) =>
    trans(tokens => [[{symbol: 'objectType'}, ...tokens]])(
        first(
            combine(erase(
                seq('{'),
                    repeat(commentOrSpace),
                seq('}'), )),
            combine(
                erase(seq('{')),
                    combine(
                        erase(repeat(commentOrSpace)),
                        interfaceKeyTypePair(separator),
                        erase(repeat(commentOrSpace)), ),
                    repeat(combine(
                        erase(separator,
                              repeat(commentOrSpace)),
                        interfaceKeyTypePair(separator),
                        erase(repeat(commentOrSpace)), )),
                    qty(0, 1)(erase(
                        separator,
                        repeat(commentOrSpace), )),
                    first(ahead(seq('}')), err('interfaceDefInner: Unexpected token has appeared.')),
                erase(seq('}')), )));

const interfaceDef =
    trans(tokens => [
        [{symbol: 'def'},
            tokens[1],
            [{symbol: 'docComment'},
                [{symbol: 'derived'}, tokens[3], [{symbol: '$spread'}, tokens[2]]],
                tokens[0], ]]])(
    erase(seq('interface')),
        input => {
            const ret = zeroWidth(() => [])(input);
            if (ret.succeeded) {
                const text = ret.next.context.docComment;
                ret.next.context = {...ret.next.context};
                delete ret.next.context.docComment;
                ret.tokens.length = 0;
                ret.tokens.push(text ? text : null);
            }
            return ret;
        },                                       // [0]
        erase(repeat(commentOrSpace)),
        symbolName,                              // [1]
        erase(repeat(commentOrSpace)),
        first(interfaceExtendsClause,            // [2]
              zeroWidth(() => []), ),
        erase(repeat(commentOrSpace)),
    input => interfaceDefInner(seq(';'))(input), // [3]
);


const enumKeyValue =
    trans(tokens => [[{symbol: '$list'}, tokens[1], tokens[2], tokens[0]]])(
        input => {
            const ret = zeroWidth(() => [])(input);
            if (ret.succeeded) {
                const text = ret.next.context.docComment;
                ret.next.context = {...ret.next.context};
                delete ret.next.context.docComment;
                ret.tokens.length = 0;
                ret.tokens.push(text ? text : null);
            }
            return ret;
        },                                       // [0]
        symbolName,
        erase(repeat(commentOrSpace)),
        first(
            combine(
                erase(seq('=')),
                erase(repeat(commentOrSpace)),
                first(decimalIntegerValue,
                      stringValue, ),
                erase(repeat(commentOrSpace)), ),
            zeroWidth(() => null), ));

const enumDef =
    trans(tokens => [
        [{symbol: 'def'}, tokens[1],
            [{symbol: 'docComment'},
                [{symbol: 'enumType'}, ...tokens.slice(2)],
                tokens[0], ]]])(
    erase(seq('enum')),
        input => {
            const ret = zeroWidth(() => [])(input);
            if (ret.succeeded) {
                const text = ret.next.context.docComment;
                ret.next.context = {...ret.next.context};
                delete ret.next.context.docComment;
                ret.tokens.length = 0;
                ret.tokens.push(text ? text : null);
            }
            return ret;
        },                                       // [0]
        erase(repeat(commentOrSpace)),
        symbolName,
        erase(repeat(commentOrSpace)),
    first(
        combine(erase(
            seq('{'),
                repeat(commentOrSpace),
            seq('}'), )),
        combine(
            erase(seq('{')),
                combine(
                    erase(repeat(commentOrSpace)),
                    enumKeyValue,
                    erase(repeat(commentOrSpace)), ),
                repeat(combine(
                    erase(seq(','),
                          repeat(commentOrSpace)),
                    enumKeyValue,
                    erase(repeat(commentOrSpace)), )),
                qty(0, 1)(erase(
                    seq(','),
                    repeat(commentOrSpace), )),
                first(ahead(seq('}')), err('enumDef: Unexpected token has appeared.')),
            erase(seq('}')), )));


const exportedDef =
    trans(tokens => [[{symbol: 'export'}, tokens[0]]])(
        erase(seq('export'),
              repeat(commentOrSpace), ),
        first(typeDef,
              interfaceDef,
              enumDef, ));


const externalTypeDef =
    trans(tokens => [[{symbol: 'external'}, ...tokens]])(
        erase(seq('external')),
            erase(repeat(commentOrSpace)),
            symbolName,
            repeat(combine(
                erase(repeat(commentOrSpace)),
                erase(cls(',')),
                erase(repeat(commentOrSpace)),
                symbolName,
                erase(repeat(commentOrSpace)),
            )),
            erase(repeat(commentOrSpace)),
        erase(cls(';')), );

const importStatement =
    trans(tokens => [[{symbol: 'passthru'}, tokens[0]]])(
        cat(seq('import'),
            repeat(commentOrSpace),
            cat(repeat(notCls(';'))),
            cls(';'), ));


// TODO: ~~output default externals? (RegExp, Map, Set, ...)~~
const definition =
    first(directiveLineComment,
          typeDef,
          interfaceDef,
          enumDef,
          exportedDef,
          externalTypeDef,
          importStatement, );

const program =
    combine(
        erase(repeat(commentOrSpace)),
        repeat(combine(
            definition,
            erase(repeat(commentOrSpace)), )),
        end(), );


export function parse(s: string) {
    const z = program(parserInput(s, {/* TODO: set initial state to the context */}));
    if (! z.succeeded) {
        throw new Error(z.message);
    }
    return z.tokens;
}


// tslint:disable: object-literal-key-quotes
export function compile(s: string) {
    const mapTyToTySet = new Map<TypeAssertion, TypeAssertionSetValue>();
    const schema: TypeAssertionMap = new Map<string, TypeAssertionSetValue>();
    let gensymCount = 0;

    const def = (name: SxSymbol | string, ty: TypeAssertion): TypeAssertion => {
        let ret = ty;
        const sym = typeof name === 'string' ? name : name.symbol;
        if (! mapTyToTySet.has(ret)) {
            ret = operators.withName(operators.withTypeName(ret, sym), sym);
        }

        const tySet = mapTyToTySet.has(ret) ?
            mapTyToTySet.get(ret) as TypeAssertionSetValue :
            {ty: ret, exported: false};

        schema.set(sym, tySet);

        if (! mapTyToTySet.has(ret)) {
            // TODO: aliases are not exported correctly
            mapTyToTySet.set(ret, tySet);
        }
        return ret;
    };

    const ref = (name: SxSymbol | string): TypeAssertion => {
        const sym = typeof name === 'string' ? name : name.symbol;
        if (! schema.has(sym)) {
            return ({
                kind: 'symlink',
                symlinkTargetName: sym,
                name: sym,
                typeName: sym,
            });
        }
        let ty = (schema.get(sym) as TypeAssertionSetValue).ty;
        if (ty.noOutput) {
            ty = {...ty};
            delete ty.noOutput;
        }
        return ty;
    };

    const external = (...names: string[]) => {
        for (const name of names) {
            const ty = def(name, operators.primitive('any'));
            ty.noOutput = true;
        }
    };

    lisp.setGlobals({
        picked: operators.picked,
        omit: operators.omit,
        partial: operators.partial,
        intersect: operators.intersect,
        oneOf: operators.oneOf,
        subtract: operators.subtract,
        primitive: operators.primitive,
        primitiveValue: operators.primitiveValue,
        optional: operators.optional,
        repeated: operators.repeated,
        sequenceOf: operators.sequenceOf,
        spread: operators.spread,
        enumType: operators.enumType,
        objectType: operators.objectType,
        derived: operators.derived,
        def,
        ref,
        export: (ty: TypeAssertion) => {
            const tySet = mapTyToTySet.has(ty) ? mapTyToTySet.get(ty) as TypeAssertionSetValue : {ty, exported: false};
            tySet.exported = true;
            // NOTE: 'ty' should already be registered to 'mapTyToTySet' and 'schema'
            return ty;
        },
        external,
        passthru: (str: string) => {
            const ty: TypeAssertion = {
                kind: 'never',
                passThruCodeBlock: str,
            };
            schema.set(`__$$$gensym_${gensymCount++}$$$__`, {ty, exported: false});
            return ty;
        },
        directive: (name: string, body: string) => {
            switch (name) {
            case '@tynder-external':
                external(...body.split(',').map(x => x.trim()));
                break;
            default:
                throw new Error(`Unknown directive is appeared: ${name}`);
            }
            return [];
        },
        docComment: operators.withDocComment,
        '@range': (minValue: number | string, maxValue: number | string) => (ty: PrimitiveTypeAssertion) =>
            operators.withRange(minValue, maxValue)(ty),
        '@minValue': (minValue: number | string) => (ty: PrimitiveTypeAssertion) =>
            operators.withMinValue(minValue)(ty),
        '@maxValue': (maxValue: number | string) => (ty: PrimitiveTypeAssertion) =>
            operators.withMaxValue(maxValue)(ty),
        '@greaterThan': (greaterThan: number | string) => (ty: PrimitiveTypeAssertion) =>
            operators.withGreaterThan(greaterThan)(ty),
        '@lessThan': (lessThan: number | string) => (ty: PrimitiveTypeAssertion) =>
            operators.withLessThan(lessThan)(ty),
        '@minLength': (minLength: number) => (ty: PrimitiveTypeAssertion) =>
            operators.withMinLength(minLength)(ty),
        '@maxLength': (maxLength: number) => (ty: PrimitiveTypeAssertion) =>
            operators.withMaxLength(maxLength)(ty),
        '@match': (pattern: RegExp) => (ty: PrimitiveTypeAssertion) =>
            operators.withMatch(pattern)(ty),
        '@msg': (messages: string | ErrorMessages) => (ty: TypeAssertion) =>
            operators.withMsg(messages)(ty),
        '@msgId': (messageId: string) => (ty: TypeAssertion) =>
            operators.withMsgId(messageId)(ty),
    });

    const z = parse(s);
    lisp.evaluateAST(z as SxToken[]);

    for (const ent of schema.entries()) {
        const ty = resolveSymbols(schema, ent[1].ty, {symlinkStack: [ent[0]]});
        ent[1].ty = ty;
    }

    return schema;
}
// tslint:enable: object-literal-key-quotes
