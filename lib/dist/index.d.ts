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
type LanguageName = "abap" | "actionscript-3" | "ada" | "apache" | "apex" | "apl" | "applescript" | "ara" | "asm" | "astro" | "awk" | "ballerina" | "bat" | "beancount" | "berry" | "bibtex" | "bicep" | "blade" | "c" | "cadence" | "clarity" | "clojure" | "cmake" | "cobol" | "codeql" | "coffee" | "cpp" | "crystal" | "csharp" | "css" | "cue" | "cypher" | "d" | "dart" | "dax" | "diff" | "docker" | "dream-maker" | "elixir" | "elm" | "erb" | "erlang" | "fish" | "fsharp" | "gdresource" | "gdscript" | "gdshader" | "gherkin" | "git-commit" | "git-rebase" | "glimmer-js" | "glimmer-ts" | "glsl" | "gnuplot" | "go" | "graphql" | "groovy" | "hack" | "haml" | "handlebars" | "haskell" | "hcl" | "hjson" | "hlsl" | "html" | "http" | "imba" | "ini" | "java" | "javascript" | "jinja-html" | "jison" | "json" | "json5" | "jsonc" | "jsonl" | "jsonnet" | "jssm" | "jsx" | "julia" | "kotlin" | "kusto" | "latex" | "less" | "liquid" | "lisp" | "logo" | "lua" | "make" | "markdown" | "marko" | "matlab" | "mdx" | "mermaid" | "narrat" | "nextflow" | "nginx" | "nim" | "nix" | "objective-c" | "objective-cpp" | "ocaml" | "pascal" | "perl" | "php" | "plsql" | "postcss" | "powerquery" | "powershell" | "prisma" | "prolog" | "proto" | "pug" | "puppet" | "purescript" | "python" | "r" | "raku" | "razor" | "reg" | "rel" | "riscv" | "rst" | "ruby" | "rust" | "sas" | "sass" | "scala" | "scheme" | "scss" | "shaderlab" | "shellscript" | "shellsession" | "smalltalk" | "solidity" | "sparql" | "sql" | "ssh-config" | "stata" | "stylus" | "svelte" | "swift" | "system-verilog" | "tasl" | "tcl" | "tex" | "toml" | "tsx" | "turtle" | "twig" | "typescript" | "v" | "vb" | "verilog" | "vhdl" | "viml" | "vue-html" | "vue" | "vyper" | "wasm" | "wenyan" | "wgsl" | "wolfram" | "xml" | "xsl" | "yaml" | "zenscript";

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

type Annotation = {
    name: string;
    query?: string;
    ranges: CodeRange[];
};

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
    };
};
type AnnotatedLighterResult = {
    lines: Lines;
    lang: LanguageName;
    style: {
        color: string;
        background: string;
    };
};

declare function preload(langs: LanguageAlias[], theme?: Theme): Promise<void>;
declare function highlight(code: string, lang: LanguageAlias, themeOrThemeName?: Theme, config?: Config): Promise<LighterResult>;
declare function highlight(code: string, lang: LanguageAlias, themeOrThemeName: Theme, config: AnnotatedConfig): Promise<AnnotatedLighterResult>;
declare function highlightSync(code: string, lang: LanguageAlias, themeOrThemeName?: Theme, config?: Config): LighterResult;
declare function highlightSync(code: string, lang: LanguageAlias, themeOrThemeName: Theme, config: AnnotatedConfig): AnnotatedLighterResult;
declare function extractAnnotations(code: string, lang: LanguageAlias, annotationNames?: string[]): Promise<{
    code: string;
    annotations: Annotation[];
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
