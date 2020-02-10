// Copyright (c) 2020, Shellyl_N and Authors
// license: ISC
// https://github.com/shellyln

{

var AppState = {};



const exampleCodes = [

//// [0] ////
{name: "Example1: Directory structure",
 code:
`interface ACL {
    target: string;
    value: string;
}

/** Entry base */
interface EntryBase {
    /** Entry name */
    name: string;
    /** ACL infos */
    acl: ACL[];
}

/** File entry */
interface File extends EntryBase {
    /** Entry type */
    type: 'file';
}

/** Folder entry */
interface Folder extends EntryBase {
    /** Entry type */
    type: 'folder';
    /** Child entries */
    entries: Entry[];
}

/** Entry (union type) */
type Entry = File | Folder;`},


//// [1] ////
{name: "Example2: Primitives",
 code:
`type NumberType = number;
type IntegerType = integer;
type BigIntType = bigint;
type StringType = string;
type BooleanType = boolean;
type NullType = null;
type UndefinedType = undefined;
type AnyType = any;
type UnknownType = unknown;
type NeverType = never;
type NumberValueType = 3;
type IntegerValueType = integer;
type BigIntValueType = 7n;
type StringValueType = 'XB';
type BooleanValueType = true;`},


//// [2] ////
{name: "Example2: Fields",
 code:
 `type NumberType = number;

interface A {
    numberTypeField: NumberType;
    integerTypeField: integer;
    bigIntTypeField: bigint;
    stringTypeField: string;
    booleanTypeField: boolean;
    nullTypeField: null;
    undefinedTypeField: undefined;
    anyTypeField: any;
    unknownTypeField: unknown;
    neverTypeField: never;
    numberValueTypeField: 3;
    integerValueTypeField: integer;
    bigIntValueTypeField: 7n;
    stringValueTypeField: 'XB';
    booleanValueTypeField: true;
}

interface B {
    numberTypeField?: NumberType;
    integerTypeField?: integer;
    bigIntTypeField?: bigint;
    stringTypeField?: string;
    booleanTypeField?: boolean;
    nullTypeField?: null;
    undefinedTypeField?: undefined;
    anyTypeField?: any;
    unknownTypeField?: unknown;
    neverTypeField?: never;
    numberValueTypeField?: 3;
    integerValueTypeField?: integer;
    bigIntValueTypeField?: 7n;
    stringValueTypeField?: 'XB';
    booleanValueTypeField?: true;
}

interface C extends A {}

type D = Partial<A>;`},


];



class AceEditor extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {};
        this.editor = null;
    }

    componentDidMount() {
        this.editor = ace.edit('editor');
        this.editor.setTheme('ace/theme/monokai');
        this.editor.session.setMode('ace/mode/typescript');

        AppState.AceEditor = AppState.AceEditor || {};
        AppState.AceEditor[this.props.id] = this.editor;

        this.props.loadExample(0);
    }

    render() {
        return (lsx`
        (div (@ (className "AceEditorOuterWrap"))
            (div (@ (id ${this.props.id})
                    (className "AceEditorDiv") )))`);
    }
}


class ExampleLoader extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {};
    }

    handleExampleSelected(i) {
        this.props.loadExample(i);
    }

    render() {
        return (lsx`
        (Template
            (select (@ (style (display "inline-block")
                              (width "300px") )
                       (onChange ${(e) => this.handleExampleSelected(e.target.value)}) )
                ($=for ${exampleCodes}
                    (option (@ (value $index)) ($get $data "name") )
                )
            )
        )`);
    }
}


class EvaluateButtons extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {};
    }

    handleCompileToJsonSchemaClick(evt) {
        const editor = AppState.AceEditor[this.props.editorId];
        this.props.compileToJsonSchema(editor.getValue(),
            document.getElementById(this.props.outputId));
    };

    handleCompileToGraphQlClick(evt) {
        const editor = AppState.AceEditor[this.props.editorId];
        this.props.compileToGraphQl(editor.getValue(),
            document.getElementById(this.props.outputId));
    };

    handleCompileToProtobufClick(evt) {
        const editor = AppState.AceEditor[this.props.editorId];
        this.props.compileToProtobuf(editor.getValue(),
            document.getElementById(this.props.lsxRootId),
            document.getElementById(this.props.outputId));
    };

    render() {
        return (lsx`
        (Template
            (button (@ (style (textTransform "none"))
                       (className "waves-effect waves-light red lighten-1 btn")
                       (onClick ${(e) => this.handleCompileToJsonSchemaClick(e)}) ) "Compile to JSON Schema")
            " "
            (button (@ (style (textTransform "none"))
                       (className "waves-effect waves-light red lighten-1 btn")
                       (onClick ${(e) => this.handleCompileToGraphQlClick(e)}) ) "Compile to GraphQL (experimental)")
            " "
            (button (@ (style (textTransform "none"))
                       (className "waves-effect waves-light red lighten-1 btn")
                       (onClick ${(e) => this.handleCompileToProtobufClick(e)}) ) "Compile to Protobuf3 (experimental)")
        )`);
    }
}


class App extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {};

        fetch('https://cdn.jsdelivr.net/npm/ajv@6.11.0/lib/refs/json-schema-draft-06.json')
        .then(async (resp) => {
            if (resp.ok) {
                this.jsonSchema = await resp.text();
            }
        })
        .catch(e => console.error(e.message));
    }

    loadExample(i) {
        const editor = AppState.AceEditor['editor'];
        editor.setValue(exampleCodes[i].code);
        editor.clearSelection();
    }

    compileToJsonSchema(code, outputElement) {
        let r = '';

        try {
            const schema = tynder.compile(code);
            r = tynder.generateJsonSchema(schema);

            // check syntax
            if (this.jsonSchema) {
                const ajv = new Ajv();
                ajv.addMetaSchema(JSON.parse(this.jsonSchema));
                const validate = ajv.compile(JSON.parse(r));
                validate({});
            } else {
                r = `${'Failed to download the JSON Schema meta schema file (refs/json-schema-draft-06.json).'}\n\n${r}`;
            }
        } catch (e) {
            r = `${e.toString()}\n\n${r}`;
        }

        let x = document.createElement('pre');
        x.style.margin = '0';
        x.spellcheck = false;
        x.contentEditable = true;
        x.innerText = r;

        ReactDOM.unmountComponentAtNode(outputElement);
        while (outputElement.firstChild) {
            outputElement.removeChild(outputElement.firstChild);
        }
        outputElement.appendChild(x);
    }

    compileToGraphQl(code, outputElement) {
        let r = '';

        try {
            const schema = tynder.compile(code);
            r = tynder.generateGraphQlCode(schema);
        } catch (e) {
            r = e.toString();
        }

        let x = document.createElement('pre');
        x.style.margin = '0';
        x.spellcheck = false;
        x.contentEditable = true;
        x.innerText = r;

        ReactDOM.unmountComponentAtNode(outputElement);
        while (outputElement.firstChild) {
            outputElement.removeChild(outputElement.firstChild);
        }
        outputElement.appendChild(x);
    }

    compileToProtobuf(code, lsxRootElement, outputElement) {
        let r = '';

        try {
            const schema = tynder.compile(code);
            r = tynder.generateProto3Code(schema);
        } catch (e) {
            r = e.toString();
        }

        let x = document.createElement('pre');
        x.style.margin = '0';
        x.spellcheck = false;
        x.contentEditable = true;
        x.innerText = r;

        ReactDOM.unmountComponentAtNode(outputElement);
        while (outputElement.firstChild) {
            outputElement.removeChild(outputElement.firstChild);
        }
        outputElement.appendChild(x);
    }

    render() {
        return (lsx`
        (Template
            (div (@ (style (margin "4px")))
                (ExampleLoader  (@ (loadExample ${(i) => this.loadExample(i)}) ))
                " "
                (EvaluateButtons (@ (editorId "editor")
                                   (lsxRootId "root")
                                   (outputId "root")
                                   (compileToJsonSchema ${(code, outputElement) =>
                                       this.compileToJsonSchema(code, outputElement)})
                                   (compileToGraphQl ${(code, outputElement) =>
                                       this.compileToGraphQl(code, outputElement)})
                                   (compileToProtobuf ${(code, lsxRootElement, outputElement) =>
                                       this.compileToProtobuf(code, lsxRootElement, outputElement)}) ))
            )
            (div (@ (style (display "flex")
                           (flexWrap "wrap") ))
                (AceEditor (@ (id "editor")
                              (loadExample ${(i) => this.loadExample(i)}) ))
                (div (@ (id "root")
                        (className "grey OutletDiv") ))
            )
        )`);
    }
}



window.lsx = liyad.LSX({
    jsx: React.createElement,
    jsxFlagment: React.Fragment,
    components: {
        AceEditor,
        ExampleLoader,
        EvaluateButtons,
        App,
    },
});


}
