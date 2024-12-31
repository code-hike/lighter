type LineNumber = number;
type ColumnNumber = number;
type MultiLineRange = {
    fromLineNumber: LineNumber;
    toLineNumber: LineNumber;
};
type InlineRange = {
    lineNumber: LineNumber;
    fromColumn: ColumnNumber;
    toColumn: ColumnNumber;
};
type CodeRange = MultiLineRange | InlineRange;

type RawTheme = {
    name?: string;
    type?: string;
    tokenColors?: ThemeSetting[];
    colors?: {
        [key: string]: string;
    };
    [key: string]: any;
};
type ThemeSetting = {
    name?: string;
    scope?: string | string[];
    settings: {
        fontStyle?: string;
        foreground?: string;
        background?: string;
    };
};
declare const THEME_NAMES: readonly ["dark-plus", "dracula-soft", "dracula", "github-dark", "github-dark-dimmed", "github-from-css", "github-light", "light-plus", "material-darker", "material-default", "material-from-css", "material-lighter", "material-ocean", "material-palenight", "min-dark", "min-light", "monokai", "nord", "one-dark-pro", "poimandres", "slack-dark", "slack-ochin", "solarized-dark", "solarized-light"];
type NamesTuple$1 = typeof THEME_NAMES;
type StringTheme = NamesTuple$1[number];
type Theme = StringTheme | RawTheme;
declare class UnknownThemeError extends Error {
    theme: string;
    constructor(theme: string);
}

declare const LANG_NAMES: string[];
type NamesTuple = typeof LANG_NAMES;
type LanguageAlias = NamesTuple[number];
type LanguageName = "abap" | "actionscript-3" | "ada" | "angular-html" | "angular-ts" | "apache" | "apex" | "apl" | "applescript" | "ara" | "asciidoc" | "asm" | "astro" | "awk" | "ballerina" | "bat" | "beancount" | "berry" | "bibtex" | "bicep" | "blade" | "bsl" | "c" | "cadence" | "cairo" | "clarity" | "clojure" | "cmake" | "cobol" | "codeowners" | "codeql" | "coffee" | "common-lisp" | "coq" | "cpp" | "crystal" | "csharp" | "css" | "csv" | "cue" | "cypher" | "d" | "dart" | "dax" | "desktop" | "diff" | "docker" | "dotenv" | "dream-maker" | "edge" | "elixir" | "elm" | "emacs-lisp" | "erb" | "erlang" | "fennel" | "fish" | "fluent" | "fortran-fixed-form" | "fortran-free-form" | "fsharp" | "gdresource" | "gdscript" | "gdshader" | "genie" | "gherkin" | "git-commit" | "git-rebase" | "gleam" | "glimmer-js" | "glimmer-ts" | "glsl" | "gnuplot" | "go" | "graphql" | "groovy" | "hack" | "haml" | "handlebars" | "haskell" | "haxe" | "hcl" | "hjson" | "hlsl" | "html" | "html-derivative" | "http" | "hxml" | "hy" | "imba" | "ini" | "java" | "javascript" | "jinja" | "jison" | "json" | "json5" | "jsonc" | "jsonl" | "jsonnet" | "jssm" | "jsx" | "julia" | "kotlin" | "kusto" | "latex" | "lean" | "less" | "liquid" | "log" | "logo" | "lua" | "luau" | "make" | "markdown" | "marko" | "matlab" | "mdc" | "mdx" | "mermaid" | "mipsasm" | "mojo" | "move" | "narrat" | "nextflow" | "nginx" | "nim" | "nix" | "nushell" | "objective-c" | "objective-cpp" | "ocaml" | "pascal" | "perl" | "php" | "plsql" | "po" | "polar" | "postcss" | "powerquery" | "powershell" | "prisma" | "prolog" | "proto" | "pug" | "puppet" | "purescript" | "python" | "qml" | "qmldir" | "qss" | "r" | "racket" | "raku" | "razor" | "reg" | "regexp" | "rel" | "riscv" | "rst" | "ruby" | "rust" | "sas" | "sass" | "scala" | "scheme" | "scss" | "sdbl" | "shaderlab" | "shellscript" | "shellsession" | "smalltalk" | "solidity" | "soy" | "sparql" | "splunk" | "sql" | "ssh-config" | "stata" | "stylus" | "svelte" | "swift" | "system-verilog" | "systemd" | "talonscript" | "tasl" | "tcl" | "templ" | "terraform" | "tex" | "toml" | "ts-tags" | "tsv" | "tsx" | "turtle" | "twig" | "txt" | "typescript" | "typespec" | "typst" | "v" | "vala" | "vb" | "verilog" | "vhdl" | "viml" | "vue" | "vue-html" | "vyper" | "wasm" | "wenyan" | "wgsl" | "wikitext" | "wolfram" | "xml" | "xsl" | "yaml" | "zenscript" | "zig";

type Annotation = {
    name: string;
    query?: string;
    ranges: CodeRange[];
};
type AnnotationData = {
    name: string;
    rangeString: string;
    query?: string;
};
type AnnotationExtractor = string[] | ((comment: string) => null | AnnotationData);

type Token = {
    content: string;
    style: {
        color?: string;
        fontStyle?: "italic";
        fontWeight?: "bold";
        textDecoration?: "underline" | "line-through";
    };
    scopes?: string[];
};
type TokenGroup = {
    annotationName: string;
    annotationQuery?: string;
    fromColumn: number;
    toColumn: number;
    tokens: Tokens;
};
type Tokens = (Token | TokenGroup)[];
type Line = {
    lineNumber: number;
    tokens: Tokens;
};
type LineGroup = {
    annotationName: string;
    annotationQuery?: string;
    fromLineNumber: number;
    toLineNumber: number;
    lines: Lines;
};
type Lines = (Line | LineGroup)[];

declare class UnknownLanguageError extends Error {
    alias: string;
    constructor(alias: string);
}

type Config = {
    scopes?: boolean;
};
type AnnotatedConfig = {
    annotations: Annotation[];
} & Config;
type LighterResult = {
    lines: Token[][];
    lang: LanguageName;
    style: {
        color: string;
        background: string;
        colorScheme: string;
    };
};
type AnnotatedLighterResult = {
    lines: Lines;
    lang: LanguageName;
    style: {
        color: string;
        background: string;
        colorScheme: string;
    };
};

declare function preload(langs: LanguageAlias[], theme?: Theme): Promise<void>;
declare function highlight(code: string, lang: LanguageAlias, themeOrThemeName?: Theme, config?: Config): Promise<LighterResult>;
declare function highlight(code: string, lang: LanguageAlias, themeOrThemeName: Theme, config: AnnotatedConfig): Promise<AnnotatedLighterResult>;
declare function highlightSync(code: string, lang: LanguageAlias, themeOrThemeName?: Theme, config?: Config): LighterResult;
declare function highlightSync(code: string, lang: LanguageAlias, themeOrThemeName: Theme, config: AnnotatedConfig): AnnotatedLighterResult;
declare function extractAnnotations(code: string, lang: LanguageAlias, annotationExtractor?: AnnotationExtractor): Promise<{
    code: string;
    annotations: {
        ranges: CodeRange[];
        name: string;
        query?: string;
    }[];
}>;
declare function getThemeColors(themeOrThemeName: Theme): Promise<{
    colorScheme: string;
    foreground: string;
    background: string;
    lighter: {
        inlineBackground: string;
    };
    editor: {
        background: string;
        foreground: string;
        lineHighlightBackground: string;
        rangeHighlightBackground: string;
        infoForeground: string;
        selectionBackground: string;
    };
    focusBorder: string;
    tab: {
        activeBackground: string;
        activeForeground: string;
        inactiveBackground: string;
        inactiveForeground: string;
        border: string;
        activeBorder: string;
        activeBorderTop: string;
    };
    editorGroup: {
        border: string;
    };
    editorGroupHeader: {
        tabsBackground: string;
    };
    editorLineNumber: {
        foreground: string;
    };
    input: {
        background: string;
        foreground: string;
        border: string;
    };
    icon: {
        foreground: string;
    };
    sideBar: {
        background: string;
        foreground: string;
        border: string;
    };
    list: {
        activeSelectionBackground: string;
        activeSelectionForeground: string;
        hoverBackground: string;
        hoverForeground: string;
    };
}>;
declare function getThemeColorsSync(themeOrThemeName: Theme): {
    colorScheme: string;
    foreground: string;
    background: string;
    lighter: {
        inlineBackground: string;
    };
    editor: {
        background: string;
        foreground: string;
        lineHighlightBackground: string;
        rangeHighlightBackground: string;
        infoForeground: string;
        selectionBackground: string;
    };
    focusBorder: string;
    tab: {
        activeBackground: string;
        activeForeground: string;
        inactiveBackground: string;
        inactiveForeground: string;
        border: string;
        activeBorder: string;
        activeBorderTop: string;
    };
    editorGroup: {
        border: string;
    };
    editorGroupHeader: {
        tabsBackground: string;
    };
    editorLineNumber: {
        foreground: string;
    };
    input: {
        background: string;
        foreground: string;
        border: string;
    };
    icon: {
        foreground: string;
    };
    sideBar: {
        background: string;
        foreground: string;
        border: string;
    };
    list: {
        activeSelectionBackground: string;
        activeSelectionForeground: string;
        hoverBackground: string;
        hoverForeground: string;
    };
};
type LighterColors = ReturnType<typeof getThemeColors>;

export { AnnotatedLighterResult, Annotation, LANG_NAMES, LanguageAlias, LighterColors, LighterResult, Line, LineGroup, Lines, RawTheme, StringTheme, THEME_NAMES, Theme, Token, TokenGroup, Tokens, UnknownLanguageError, UnknownThemeError, extractAnnotations, getThemeColors, getThemeColorsSync, highlight, highlightSync, preload };
