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


//// [3] ////
{name: "Example3: Fields",
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

type D = Partial<A>;

interface E {
    /** additional props */
    [propNames: string]: any;
}`},


];



class AceEditor extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {};
        this.editor = null;
    }

    componentDidMount() {
        this.editor = ace.edit(this.props.id);
        this.editor.setTheme('ace/theme/monokai');
        this.editor.session.setMode('ace/mode/' + this.props.lang);

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

    handleValidateByTynderClick(evt) {
        const schemaEditor = AppState.AceEditor[this.props.schemaEditorId];
        const dataEditor = AppState.AceEditor[this.props.dataEditorId];
        this.props.validateByTynder(schemaEditor.getValue(), dataEditor.getValue(),
            document.getElementById(this.props.outputId));
    };

    handleValidateByAjvClick(evt) {
        const schemaEditor = AppState.AceEditor[this.props.schemaEditorId];
        const dataEditor = AppState.AceEditor[this.props.dataEditorId];
        this.props.validateByAjv(schemaEditor.getValue(), dataEditor.getValue(),
            document.getElementById(this.props.outputId));
    };

    render() {
        return (lsx`
        (Template
            (button (@ (style (textTransform "none"))
                       (className "waves-effect waves-light red lighten-1 btn")
                       (onClick ${(e) => this.handleValidateByTynderClick(e)}) ) "Validate by Tynder")
            " "
            (button (@ (style (textTransform "none"))
                       (className "waves-effect waves-light red lighten-1 btn")
                       (onClick ${(e) => this.handleValidateByAjvClick(e)}) ) "Validate by Ajv (JSON Schema)")
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
        const editor = AppState.AceEditor['schemaEditor'];
        editor.setValue(exampleCodes[i].code);
        editor.clearSelection();
    }

    validateByTynder(code, data, outputElement) {
        let r = '';

        try {
            const targetEntryName = document.querySelector('#targetEntryName');
            const schema = tynder.compile(code);
            const ctx = {
                checkAll: true,
                schema,
            };
            if (tynder.validate(JSON.parse(data), tynder.getType(schema, targetEntryName.value), ctx)) {
                r = `Validation succeeded. (Tynder)`;
            } else {
                r = JSON.stringify(ctx.errors, null, 4);
            }
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

    validateByAjv(code, data, outputElement) {
        let r = '';

        try {
            const schema = tynder.compile(code);

            if (this.jsonSchema) {
                const targetEntryName = document.querySelector('#targetEntryName');
                const ajv = new Ajv();
                ajv.addMetaSchema(JSON.parse(this.jsonSchema));
                const validate = ajv.addSchema(tynder.generateJsonSchemaObject(schema))
                                    .getSchema(`#/definitions/${targetEntryName.value}`);
                if (validate(JSON.parse(data))) {
                    r = `Validation succeeded. (Ajv)`;
                } else {
                    r = JSON.stringify(validate.errors, null, 4);
                }
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

    componentDidMount() {
        {
            M.updateTextFields();
            const targetEntryName = document.querySelector('#targetEntryName');
            targetEntryName.value = 'Folder';
        }
        {
            const editor = AppState.AceEditor['dataEditor'];
            editor.setValue(`{}`);
            editor.clearSelection();
        }
    }

    render() {
        return (lsx`
        (Template
            (div (@ (style (margin "4px")))
                (ExampleLoader  (@ (loadExample ${(i) => this.loadExample(i)}) ))
                " "
                (div (@ (className "input-field inline")
                        (style (margin "0")
                               (padding "0") ))
                    (input (@ (id "targetEntryName")
                              (style (width "200px")
                                     (color "white")
                                     (margin "0")
                                     (padding "0") )))
                    (label (@ (id "targetEntryNameLabel")
                              (for "targetEntryName")
                              (className "active") )
                        "Target entry name:") )
                " "
                (EvaluateButtons (@ (schemaEditorId "schemaEditor")
                                    (dataEditorId "dataEditor")
                                    (outputId "root")
                                    (validateByTynder ${(code, data, outputElement) =>
                                        this.validateByTynder(code, data, outputElement)})
                                    (validateByAjv ${(code, data, outputElement) =>
                                        this.validateByAjv(code, data, outputElement)}) ))
            )
            (div (@ (style (display "flex")
                           (flexWrap "wrap") ))
                (AceEditor (@ (id "schemaEditor")
                              (lang "typescript")
                              (loadExample ${(i) => this.loadExample(i)}) ))
                (AceEditor (@ (id "dataEditor")
                              (lang "json")
                              (loadExample ${(i) => ""}) ))
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
