// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import { ParserInputWithCtx,
         ParserFnWithCtx }       from 'fruitsconfits/modules/lib/types';
import { getStringParsers }      from 'fruitsconfits/modules/lib/string-parser';
import { getObjectParsers }      from 'fruitsconfits/modules/lib/object-parser';
import { SxTokenChild,
         SxToken }               from 'liyad/modules/s-exp/types';
import { dummyTargetObject,
         isUnsafeVarNames }      from './util';



export interface SxOp {
    'op': string;
}

export type AstChild = SxTokenChild | SxOp | undefined;
export type Ast = SxToken | AstChild | SxOp | undefined;


interface Ctx {
    docComment?: string;
}

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
       first, or, combine, erase, trans, ahead, rules,
       makeProgram} = $s;


const directiveLineComment =
    trans(tokens => [[{symbol: 'directive'}, ...tokens]])(
        erase(qty(2)(cls('/'))),
        erase(repeat(classes.space)),
        cat(seq('@tynder-'), repeat(first(classes.alnum, cls('-')))), // [0]
        erase(repeat(classes.space)),
        cat(repeat(notCls('\r\n', '\n', '\r'))),                      // [1]
        erase(first(classes.newline, ahead(end()))), );

const directiveBlockComment =
    trans(tokens => [[{symbol: 'directive'}, ...tokens]])(
        erase(seq('/*')),
        erase(repeat(classes.space)),
        cat(seq('@tynder-'), repeat(first(classes.alnum, cls('-')))), // [0]
        erase(repeat(classes.space)),
        cat(repeat(notCls('*/'))),                                    // [1]
        erase(seq('*/')), );


const lineComment =
    combine(
        erase(qty(2)(cls('/'))),
        first(
            combine(
                ahead(repeat(classes.space),
                      notCls('@tynder-'), ),
                repeat(notCls('\r\n', '\n', '\r')),
                first(classes.newline, ahead(end())), ),
            first(classes.newline, ahead(end())), ));

const hashLineComment =
    combine(
        seq('#'),
        repeat(notCls('\r\n', '\n', '\r')),
        first(classes.newline, ahead(end())), );

const docComment =
    combine(
        seq('/**'),
        repeat(classes.space),
        input => {
            const ret = cat(repeat(notCls('*/')))(input);
            if (ret.succeeded) {
                // define a reducer
                const ctx2 = {...ret.next.context}; // NOTE: context is immutable
                ctx2.docComment = (ret.tokens[0] as string || '').trim();
                ret.next.context = ctx2;
            }
            return ret;
        },
        seq('*/'), );

const blockComment =
    combine(
        seq('/*'),
            ahead(repeat(classes.space),
                  notCls('@tynder-'), ),
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

const bigDecimalIntegerValue =
    trans(tokens => [BigInt((tokens as string[])[0].replace(/_/g, '')) as any])
    (numbers.bigint);

const floatingPointNumberValue =
    trans(tokens => [Number.parseFloat((tokens as string[])[0].replace(/_/g, ''))])
    (numbers.float);

const numberValue =
    first(octalIntegerValue,
          hexIntegerValue,
          binaryIntegerValue,
          bigDecimalIntegerValue,
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
    trans(tokens => [tokens[0] ?? ''])(
        erase(seq("'")),
            cat(repeat(first(
                stringEscapeSeq,
                combine(cls('\r', '\n'), err('Line breaks within strings are not allowed.')),
                notCls("'"),
            ))),
        erase(seq("'")), );

const doubleQuotStringValue =
    trans(tokens => [tokens[0] ?? ''])(
        erase(seq('"')),
            cat(repeat(first(
                stringEscapeSeq,
                combine(cls('\r', '\n'), err('Line breaks within strings are not allowed.')),
                notCls('"'),
            ))),
        erase(seq('"')), );

const backQuotStringValue =
    trans(tokens => [tokens[0] ?? ''])(
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
    trans(tokens => [{value: tokens[1] ?
            new RegExp((tokens[0] ?? '') as string, tokens[1] as string) :
            new RegExp((tokens[0] ?? '') as string)}])(
        erase(seq('/')),
            cat(repeat(first(
                stringEscapeSeq,
                notCls('/'),
            ))),
        erase(seq('/')),
        cat(qty(0)(cls('g', 'i', 'm', 's', 'u', 'y'))), );


const symbolName =
    trans(tokens => tokens)
    (cat(combine(
        first(classes.alpha, cls('$', '_')),
        repeat(first(classes.alnum, cls('$', '_'))), )));

const decoratorSymbolName =
    trans(tokens => [{symbol: (tokens as string[])[0]}])
    (cat(combine(
        seq('@'),
        first(classes.alpha, cls('$', '_')),
        repeat(first(classes.alnum, cls('$', '_'))), )));


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
            if (isUnsafeVarNames(dummyTargetObject, tokens[i] as string)) {
                throw new Error(`Unsafe symbol name is appeared in object literal: ${tokens[i]}`);
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
        first(seq('number?'), seq('integer?'), seq('bigint?'), seq('string?'), seq('boolean?'), // TODO: '?' is allowed in the sequence assertion
              seq('number'), seq('integer'), seq('bigint'), seq('string'), seq('boolean'), ));  // TODO: function

const additionalPropPrimitiveTypeName =
    first(seq('number'), seq('string'));

const nullUndefinedTypeName =
    trans(tokens => [[{symbol: 'primitive'}, tokens[0]]])(
        first(seq('null'), seq('undefined'), seq('any'), seq('unknown'), seq('never')), );

const simpleOrDottedTypeName =
    first(primitiveTypeName,
          nullUndefinedTypeName,
          trans(tokens =>
                [[{symbol: 'ref'}, ...tokens]])(
            ahead(notCls('Array', 'Partial', 'Pick', 'Omit')),
            combine(
                symbolName,
                repeat(combine(
                    erase(repeat(commentOrSpace), seq('.'), repeat(commentOrSpace)),
                    symbolName, )))));


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
        trans(tokens => [[{symbol: '#'}, ['min', tokens[0]], ['max', tokens[0]]]])(
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
                first(arraySizeFactorInner,                         // [1]
                      err('complexArrayType: Unexpected token has appeared. Expect array size.'), ),
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
        simpleOrDottedTypeName,                       // [0]
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
                first(arraySizeFactorInner,
                      err('spreadType: Unexpected token has appeared. Expect array size.'), ),
                erase(repeat(commentOrSpace)), )),
            first(ahead(seq('>')), err('spreadType: Unexpected token has appeared.')),
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
                    first(
                        combine(
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
                            first(ahead(seq(')')), err('decorator: Unexpected token has appeared. Expect ")".')), ),
                        err('decorator: Unexpected token has appeared.'), ),
                erase(seq(')')),
            ), )));

const decoratorsClause =
    trans(tokens => tokens)(
        repeat(combine(
            decorator,
            erase(repeat(commentOrSpace)), )));


const complexTypeInnerWOSinpleArrayType = (edge: ParserFnWithCtx<string, Ctx, Ast>) =>
    first(primitiveValueNoNullUndefined,
          genericOrSimpleType,
          partialType,
          pickOrOmitType,
          complexArrayType,
          sequenceType,
          input => interfaceDefInner(first(seq(';'), seq(',')))(input), );

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
        })(
        trans(tokens => [tokens])(qty(0, 1)(decoratorsClause)),          // [0]
        first(                                                           // [1]
            input => complexTypeInnerWOSinpleArrayType(edge)(input),
            combine(
                erase(seq('(')),
                    erase(repeat(commentOrSpace)),
                    input => complexType(edge)(input),
                    erase(repeat(commentOrSpace)),
                erase(seq(')')), )),
        combine(
            trans(tokens => tokens[0] !== null ? [tokens] : [null])(     // [2]
                first(
                    qty(1)(combine(
                        erase(repeat(commentOrSpace)),
                        arraySizeFactor, )),
                    zeroWidth(() => null), )),
            combine(first(                                               // [3]...
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


const setDocComment = (input: ParserInputWithCtx<string, Ctx>) => {
    const ret = zeroWidth(() => [])(input);
    if (ret.succeeded) {
        const text = ret.next.context.docComment;
        ret.next.context = {...ret.next.context};
        delete ret.next.context.docComment;
        ret.tokens.length = 0;
        ret.tokens.push(text ? text : null);
    }
    return ret;
};


const typeDef =
    trans(tokens => [[{symbol: 'def'}, tokens[1], [{symbol: 'docComment'}, tokens[2], tokens[0] ] ]])(
        erase(seq('type')),
            setDocComment,                                           // [0]
            erase(qty(1)(commentOrSpace)),
            first(symbolName,                                        // [1]
                  err('typeDef: Unexpected token has appeared. Expect symbol name.'), ),
            erase(repeat(commentOrSpace)),
        first(ahead(seq('=')), err('typeDef: Unexpected token has appeared. Expect "=".')),
        erase(seq('=')),
            first(
                combine(erase(repeat(commentOrSpace)),
                        input => complexType(first(seq(','), seq(';')))(input),  // [2]
                        erase(repeat(commentOrSpace)), ),
                err('typeDef: Unexpected token has appeared.'), ),
        first(ahead(seq(';')), err('typeDef: Unexpected token has appeared. Expect ";".')),
        erase(seq(';')), );


const interfaceExtendsClause =
    trans(tokens => [
            [{symbol: '$list'},
                ...tokens.map(x => [{symbol: 'ref'}, x])], ])(
        erase(first(
            seq('extends'),
            combine(symbolName,
                    err('interfaceExtendsClause: Unexpected token has appeared. Expect "extends" keyword.'), ))),
        erase(qty(1)(commentOrSpace)),
        first(symbolName,
              err('interfaceExtendsClause: Unexpected token has appeared. Expect symbol name.'), ),
        repeat(combine(
            erase(repeat(commentOrSpace)),
            erase(seq(',')),
            erase(repeat(commentOrSpace)),
            first(symbolName,
                  err('interfaceExtendsClause: Unexpected token has appeared. Expect symbol name.'), ))));

const interfaceKey =
    first(
        trans(tokens => [[{symbol: '$list'}, ...tokens]])(
            erase(seq('[')),
                erase(repeat(commentOrSpace),
                      objKey,
                      repeat(commentOrSpace),
                      first(seq(':'), err('":" is needed.')),
                      repeat(commentOrSpace), ),
                repeat(combine(
                    first(regexpStringValue,
                          additionalPropPrimitiveTypeName, ),
                    erase(repeat(commentOrSpace),
                          seq('|'),
                          repeat(commentOrSpace), ))),
                first(regexpStringValue,
                      additionalPropPrimitiveTypeName, ),
                erase(repeat(commentOrSpace)),
                first(ahead(seq(']')), err('interfaceKey: Unexpected token has appeared. Expect "]".')),
            erase(seq(']')), ),
        objKey, );

const interfaceKeyTypePair = (separator: ParserFnWithCtx<string, Ctx, Ast>) =>
    trans(tokens => [
            [{symbol: '$list'},
                tokens[2],
                [{symbol: '$pipe'},
                    tokens[3] === '?' ?
                        [{symbol: 'optional'}, tokens[4]] :
                        tokens[4], ...(tokens[0] as Ast[]), ],
                tokens[1], ]])(
        trans(tokens => [tokens])(first(
            decoratorsClause,
            zeroWidth(() => []), )),                // [0] decorators
        setDocComment,                              // [1]
        interfaceKey,                               // [2] key
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
                    first(ahead(seq('}')), err('interfaceDefInner: Unexpected token has appeared. Expect "}".')),
                erase(seq('}')), )));

const interfaceDef =
    trans(tokens => [
        [{symbol: 'def'},
            tokens[1],
            [{symbol: 'docComment'},
                [{symbol: 'derived'}, tokens[3], [{symbol: '$spread'}, tokens[2]]],
                tokens[0], ]]])(
    erase(seq('interface')),
        setDocComment,                           // [0] base types
        erase(qty(1)(commentOrSpace)),
        first(symbolName,                        // [1] symbol
              err('interfaceDef: Unexpected token has appeared. Expect symbol name.'), ),
        erase(repeat(commentOrSpace)),
        first(interfaceExtendsClause,            // [2]
              zeroWidth(() => []), ),
        erase(repeat(commentOrSpace)),
    first(
        input => interfaceDefInner(
            first(seq(';'), seq(',')), )(input), // [3]
        err('interfaceDef: Unexpected token has appeared.'), ),
);


const enumKeyValue =
    trans(tokens => [[{symbol: '$list'}, tokens[1], tokens[2], tokens[0]]])(
        setDocComment,                           // [0]
        symbolName,
        erase(repeat(commentOrSpace)),
        first(
            combine(
                erase(seq('=')),
                first(
                    combine(erase(repeat(commentOrSpace)),
                            first(decimalIntegerValue,
                                  stringValue, ),
                            erase(repeat(commentOrSpace)), ),
                    err('enumKeyValue: Unexpected token has appeared.'), )),
            zeroWidth(() => null), ));

const enumDef =
    trans(tokens => [
        [{symbol: 'def'}, tokens[1],
            [{symbol: 'docComment'},
                [{symbol: 'enumType'}, ...tokens.slice(2)],
                tokens[0], ]]])(
    erase(seq('enum')),
        setDocComment,                           // [0]
        erase(qty(1)(commentOrSpace)),
        first(symbolName,
              err('enumDef: Unexpected token has appeared. Expect symbol name.'), ),
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
                first(ahead(seq('}')), err('enumDef: Unexpected token has appeared. Expect "}".')),
            erase(seq('}')), ),
        err('enumDef: Unexpected token has appeared.'), ));


const internalDef =
    first(typeDef,
          interfaceDef,
          enumDef, );


const constDef =
    trans(tokens => [[{symbol: 'asConst'}, tokens[0]]])(
        erase(seq('const'),
              qty(1)(commentOrSpace), ),
        first(enumDef,
              err('constDef: Unexpected token has appeared.'), ));

const constDefNoErr =
    trans(tokens => [[{symbol: 'asConst'}, tokens[0]]])(
        erase(seq('const'),
              qty(1)(commentOrSpace), ),
        first(enumDef), );


const exportedDef =
    trans(tokens => [[{symbol: 'export'}, tokens[0]]])(
        erase(seq('export'),
              qty(1)(commentOrSpace), ),
        first(constDef,
              internalDef,
              input => declareTypeAndEnumStatement(input),
              input => declareVarStatement(input),
              err('exportedDef: Unexpected token has appeared.'), ));


const defStatement =
    trans(tokens => [
        [{symbol: '$local'}, [
                [{symbol: '_ty'}, tokens[1]],
            ],
            [{symbol: 'redef'},
                {symbol: '_ty'},
                [{symbol: '$pipe'}, {symbol: '_ty'}, ...(tokens[0] as Ast[])], ]]])(
        trans(tokens => [tokens])(first(
            decoratorsClause,
            zeroWidth(() => []), )),      // [0] decorators
        first(exportedDef,                // [1] body
              input => declareTypeAndEnumStatement(input),
              constDef,
              internalDef, ));


const externalSymbolAndType =
    trans(tokens => [[{symbol: '$list'}, ...tokens]])(
        symbolName,
        erase(repeat(commentOrSpace)),
        qty(0, 1)(
            combine(erase(seq(':')),
                    erase(repeat(commentOrSpace)),
                    input => complexType(first(seq(';'), seq(',')))(input), )));


export const externalTypeDef =
    trans(tokens => [[{symbol: 'external'}, ...tokens]])(
        erase(seq('external')),
            erase(qty(1)(commentOrSpace)),
            externalSymbolAndType,
            repeat(combine(
                erase(repeat(commentOrSpace)),
                erase(cls(',')),
                erase(repeat(commentOrSpace)),
                first(externalSymbolAndType,
                      err('externalTypeDef: Unexpected token has appeared. Expect symbol name.'), ),
                erase(repeat(commentOrSpace)),
            )),
            erase(repeat(commentOrSpace)),
        first(ahead(cls(';')), err('externalTypeDef: Unexpected token has appeared. Expect ";".')),
        erase(cls(';')), );


const declareTypeAndEnumStatement =
    trans(tokens => [[{symbol: 'asDeclare'}, ...tokens]])(
        erase(seq('declare')),
        erase(qty(1)(commentOrSpace)),
        first(constDefNoErr,  // NOTE: There is still the possibility of "const varName". -> `declareVarStatement` will be called.
              internalDef), );


const declareVarStatement =
    trans(tokens => [[{symbol: 'passthru'}, tokens[0], tokens[1]]])(
        cat(seq('declare'),
            qty(1)(commentOrSpace),
            first(seq('var'),
                  seq('let'),
                  seq('const'),
                  err('declareVarStatement: Unexpected token has appeared. Expect "var|let|const".') ),
            qty(1)(commentOrSpace),
            cat(repeat(notCls(';'))),
            first(ahead(seq(';')), err('declareVarStatement: Unexpected token has appeared. Expect ";".')),
            cls(';'), ),
        setDocComment, );       // [1]


const importStatement =
    trans(tokens => [[{symbol: 'passthru'}, tokens[0]]])(
        cat(seq('import'),
            qty(1)(commentOrSpace),
            cat(repeat(notCls(';'))),
            first(ahead(seq(';')), err('importStatement: Unexpected token has appeared. Expect ";".')),
            cls(';'), ));


const definition =
    first(directiveLineComment,
          directiveBlockComment,
          defStatement,
          externalTypeDef,
          declareVarStatement,
          importStatement, );

export const program =
    makeProgram(combine(
        erase(repeat(commentOrSpace)),
        repeat(combine(
            definition,
            erase(repeat(commentOrSpace)), )),
        erase(repeat(commentOrSpace)),
        first(ahead(end()), err('program: Unexpected token has appeared.')),
        end(), ));
