// Copyright (c) 2019 Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln


import * as fs                    from 'fs';
import * as path                  from 'path';
import { TypeAssertionMap }       from '../types';
import { compile }                from '../compiler';
import { serialize }              from '../serializer';
import { generateTypeScriptCode,
         generateJsonSchema,
         generateProto3Code,
         generateGraphQlCode,
         generateCSharpCode }     from '../codegen';



interface CliOptions {
    srcExt: string;
    destExt: string;
}


function compileTo(fn: (types: TypeAssertionMap) => string, srcDir: string, destDir: string, options: CliOptions) {
    if (! fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }

    if (fs.lstatSync(srcDir).isDirectory()) {
        const files = fs.readdirSync(srcDir);
        for (const entry of files) {
            const srcEntryPath = path.join(srcDir, entry);
            if (fs.lstatSync(srcEntryPath).isDirectory()) {
                compileTo(fn, srcEntryPath, path.join(destDir, entry), options);
            } else {
                if (entry.toLowerCase().endsWith(options.srcExt)) {
                    const code = fs.readFileSync(srcEntryPath, {encoding: 'utf8'});
                    let trans = '';
                    try {
                        const typeMap = compile(code);
                        trans = fn(typeMap);
                    } catch (error) {
                        throw SyntaxError(`${srcEntryPath} - ${error.message}`);
                    }
                    fs.writeFileSync(
                        path.join(destDir, entry.slice(0, -(options.srcExt.length)) + options.destExt),
                        trans,
                        {encoding: 'utf8'},
                    );
                }
            }
        }
    }
}


function compileToTynderCompiled(srcDir: string, destDir: string, options: Partial<CliOptions>) {
    const opts: CliOptions = Object.assign({}, {
        srcExt: '.tss',
        destExt: '.json',
    }, options || {});

    return compileTo(serialize, srcDir, destDir, opts);
}


function compileToTynderCompiledAsTs(srcDir: string, destDir: string, options: Partial<CliOptions>) {
    const opts: CliOptions = Object.assign({}, {
        srcExt: '.tss',
        destExt: '.ts',
    }, options || {});

    return compileTo((types: TypeAssertionMap) => serialize(types, true), srcDir, destDir, opts);
}


function compileToTypeScript(srcDir: string, destDir: string, options: Partial<CliOptions>) {
    const opts: CliOptions = Object.assign({}, {
        srcExt: '.tss',
        destExt: '.d.ts',
    }, options || {});

    return compileTo(generateTypeScriptCode, srcDir, destDir, opts);
}


function compileToJsonSchema(srcDir: string, destDir: string, options: Partial<CliOptions>) {
    const opts: CliOptions = Object.assign({}, {
        srcExt: '.tss',
        destExt: '.json',
    }, options || {});

    return compileTo(generateJsonSchema, srcDir, destDir, opts);
}


function compileToJsonSchemaAsTs(srcDir: string, destDir: string, options: Partial<CliOptions>) {
    const opts: CliOptions = Object.assign({}, {
        srcExt: '.tss',
        destExt: '.ts',
    }, options || {});

    return compileTo((types: TypeAssertionMap) => generateJsonSchema(types, true), srcDir, destDir, opts);
}


function compileToProto3(srcDir: string, destDir: string, options: Partial<CliOptions>) {
    const opts: CliOptions = Object.assign({}, {
        srcExt: '.tss',
        destExt: '.proto',
    }, options || {});

    return compileTo(generateProto3Code, srcDir, destDir, opts);
}


function compileToGraphQl(srcDir: string, destDir: string, options: Partial<CliOptions>) {
    const opts: CliOptions = Object.assign({}, {
        srcExt: '.tss',
        destExt: '.graphql',
    }, options || {});

    return compileTo(generateGraphQlCode, srcDir, destDir, opts);
}


function compileToCSharp(srcDir: string, destDir: string, options: Partial<CliOptions>) {
    const opts: CliOptions = Object.assign({}, {
        srcExt: '.tss',
        destExt: '.cs',
    }, options || {});

    return compileTo(generateCSharpCode, srcDir, destDir, opts);
}


export function printHelp() {
    console.log(
`tynder - TypeScript friendly Data validator for JavaScript.

Usage:
  tynder subcommand options...

Subcommands:
  help
      Show this help.
  compile
      Compile schema and output as JSON files.
          * default input file extension is *.tss
          * default output file extension is *.json
  compile-as-ts
      Compile schema and output as JavaScript|TypeScript files.
          * default input file extension is *.tss
          * default output file extension is *.ts
      Generated code is:
          const schema = {...};
          export default schema;
  gen-ts
      Compile schema and generate TypeScript type definition files.
          * default input file extension is *.tss
          * default output file extension is *.d.ts
  gen-json-schema
      Compile schema and generate 'JSON Schema' files.
          * default input file extension is *.tss
          * default output file extension is *.json
  gen-json-schema-as-ts
      Compile schema and generate 'JSON Schema'
      as JavaScript|TypeScript files.
          * default input file extension is *.tss
          * default output file extension is *.ts
      Generated code is:
          const schema = {...};
          export default schema;
  gen-csharp
      Compile schema and generate 'C#' type definition files.
          * default input file extension is *.tss
          * default output file extension is *.cs
  gen-proto3
      Compile schema and generate 'Protocol Buffers 3' type definition files.
          * default input file extension is *.tss
          * default output file extension is *.proto
  gen-graphql
      Compile schema and generate 'GraphQL' type definition files.
          * default input file extension is *.tss
          * default output file extension is *.graphql

Options:
  --indir dirname
      Input directory
  --outdir dirname
      Output directory
  --inext fileExtensionName
      Input files' extension
  --outext fileExtensionName
      Output files' extension

`
    );
}


export function run(argv: string[]) {
    let inDir: string | null = null;
    let outDir: string | null = null;
    let inExt: string | null = null;
    let outExt: string | null = null;

    if (argv.length < 3) {
        printHelp();
        process.exit(0);
    }

    try {
        for (let i = 3; i < argv.length; i++) {
            switch (argv[i]) {
            case '--indir':
                i++;
                if (argv.length <= i) {
                    throw new Error(`Parameters are too short: ${argv[i]}.`);
                }
                inDir = argv[i];
                break;
            case '--outdir':
                i++;
                if (argv.length <= i) {
                    throw new Error(`Parameters are too short: ${argv[i]}.`);
                }
                outDir = argv[i];
                break;
            case '--inext':
                i++;
                if (argv.length <= i) {
                    throw new Error(`Parameters are too short: ${argv[i]}.`);
                }
                inExt = argv[i];
                break;
            case '--outext':
                i++;
                if (argv.length <= i) {
                    throw new Error(`Parameters are too short: ${argv[i]}.`);
                }
                outExt = argv[i];
                break;
            default:
                throw new Error(`Unknown option: ${argv[i]}.`);
            }
        }

        if (! inDir) {
            throw new Error(`"--indir" is not set.`);
        }
        if (! outDir) {
            throw new Error(`"--indir" is not set.`);
        }

        const options: Partial<CliOptions> = {};
        if (inExt) {
            options.srcExt = inExt;
        }
        if (outExt) {
            options.destExt = outExt;
        }

        switch (argv[2]) {
        case 'compile':
            compileToTynderCompiled(inDir, outDir, options);
            break;
        case 'compile-as-ts':
            compileToTynderCompiledAsTs(inDir, outDir, options);
            break;
        case 'gen-ts':
            compileToTypeScript(inDir, outDir, options);
            break;
        case 'gen-json-schema':
            compileToJsonSchema(inDir, outDir, options);
            break;
        case 'gen-json-schema-as-ts':
            compileToJsonSchemaAsTs(inDir, outDir, options);
            break;
        case 'gen-proto3':
            compileToProto3(inDir, outDir, options);
            break;
        case 'gen-graphql':
            compileToGraphQl(inDir, outDir, options);
            break;
        case 'gen-csharp':
            compileToCSharp(inDir, outDir, options);
            break;
        case 'help':
            printHelp();
            process.exit(0);
        default:
            throw new Error(`Unknown subcommand: ${argv[0]}.`);
        }
    } catch (e) {
        console.error(e.message);
        printHelp();
        process.exit(-1);
    }
}
