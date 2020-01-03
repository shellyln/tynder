// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


export function escapeString(s: string) {
    return (s
        .replace(/\x08/g, '\\b')
        .replace(/\f/g, '\\f')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t')
        .replace(/\v/g, '\\v')
        .replace(/\\/g, '\\\\')
        .replace(/\'/g, '\\\'')
        .replace(/\"/g, '\\\"')
        .replace(/\`/g, '\\\`')
    );
}
