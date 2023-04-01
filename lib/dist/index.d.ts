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
type FinalTheme = {
    name: string;
    type: "dark" | "light";
    settings: ThemeSetting[];
    colors: {
        [key: string]: string;
    };
};
declare const THEME_NAMES: readonly ["dark-plus", "dracula-soft", "dracula", "github-dark", "github-dark-dimmed", "github-light", "light-plus", "material-darker", "material-default", "material-lighter", "material-ocean", "material-palenight", "min-dark", "min-light", "monokai", "nord", "one-dark-pro", "poimandres", "slack-dark", "slack-ochin", "solarized-dark", "solarized-light"];
type NamesTuple$1 = typeof THEME_NAMES;
type StringTheme = NamesTuple$1[number];
type Theme = StringTheme | RawTheme;

declare const LANG_NAMES: string[];
type NamesTuple = typeof LANG_NAMES;
type LanguageAlias = NamesTuple[number];
type LanguageName = "abap" | "actionscript-3" | "ada" | "apache" | "apex" | "apl" | "applescript" | "ara" | "asm" | "astro" | "awk" | "ballerina" | "bat" | "berry" | "bibtex" | "bicep" | "blade" | "c" | "cadence" | "clarity" | "clojure" | "cmake" | "cobol" | "codeql" | "coffee" | "cpp" | "crystal" | "csharp" | "css" | "cue" | "d" | "dart" | "dax" | "diff" | "docker" | "dream-maker" | "elixir" | "elm" | "erb" | "erlang" | "fish" | "fsharp" | "gdresource" | "gdscript" | "gdshader" | "gherkin" | "git-commit" | "git-rebase" | "glsl" | "gnuplot" | "go" | "graphql" | "groovy" | "hack" | "haml" | "handlebars" | "haskell" | "hcl" | "hlsl" | "html" | "http" | "imba" | "ini" | "java" | "javascript" | "jinja-html" | "jison" | "json" | "json5" | "jsonc" | "jsonnet" | "jssm" | "jsx" | "julia" | "kotlin" | "kusto" | "latex" | "less" | "liquid" | "lisp" | "logo" | "lua" | "make" | "markdown" | "marko" | "matlab" | "mdx" | "mermaid" | "nginx" | "nim" | "nix" | "objective-c" | "objective-cpp" | "ocaml" | "pascal" | "perl" | "php" | "plsql" | "postcss" | "powerquery" | "powershell" | "prisma" | "prolog" | "proto" | "pug" | "puppet" | "purescript" | "python" | "r" | "raku" | "razor" | "reg" | "rel" | "riscv" | "rst" | "ruby" | "rust" | "sas" | "sass" | "scala" | "scheme" | "scss" | "shaderlab" | "shellscript" | "smalltalk" | "solidity" | "sparql" | "sql" | "ssh-config" | "stata" | "stylus" | "svelte" | "swift" | "system-verilog" | "tasl" | "tcl" | "tex" | "toml" | "tsx" | "turtle" | "twig" | "typescript" | "v" | "vb" | "verilog" | "vhdl" | "viml" | "vue-html" | "vue" | "wasm" | "wenyan" | "wgsl" | "xml" | "xsl" | "yaml" | "zenscript";

type ThemeColors = ReturnType<typeof getThemeColors>;
declare function getThemeColors(theme: FinalTheme): {
    background: string;
    foreground: string;
    lineNumberForeground: string;
    selectionBackground: string;
    editorBackground: string;
    editorGroupHeaderBackground: string;
    activeTabBackground: string;
    activeTabForeground: string;
    tabBorder: string;
    activeTabBorder: string;
    inactiveTabBackground: string;
    inactiveTabForeground: string;
    diffInsertedTextBackground: string;
    diffInsertedLineBackground: string;
    diffRemovedTextBackground: string;
    diffRemovedLineBackground: string;
    iconForeground: string;
    sideBarBackground: string;
    sideBarForeground: string;
    sideBarBorder: string;
    listSelectionBackground: string;
    listSelectionForeground: string;
    listHoverBackground: string;
    listHoverForeground: string;
    tabsBorder: string;
    activeTabTopBorder: string;
    hoverTabBackground: string;
    hoverTabForeground: string;
    colorScheme: "dark" | "light";
};

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
        color: string;
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

declare class UnknownThemeError extends Error {
    theme: string;
    constructor(theme: string);
}

type Config = {
    scopes?: boolean;
};
type AnnotatedConfig = {
    annotations: Annotation[];
} & Config;
type Result = {
    lines: Token[][];
    lang: LanguageName;
    colors: ThemeColors;
};
type AnnotatedResult = {
    lines: Lines;
    lang: LanguageName;
    colors: ThemeColors;
};
declare function highlight(code: string, lang: LanguageAlias, themeOrThemeName?: Theme, config?: Config): Promise<Result>;
declare function highlight(code: string, lang: LanguageAlias, themeOrThemeName: Theme, config: AnnotatedConfig): Promise<AnnotatedResult>;
/** @deprecated use highlight instead */
declare function highlightWithScopes(code: string, alias: LanguageAlias, themeOrThemeName?: Theme): Promise<Result>;
/** @deprecated use highlight instead */
declare function annotatedHighlight(code: string, alias: LanguageAlias, themeOrThemeName?: Theme, annotations?: Annotation[]): Promise<AnnotatedResult>;
declare function extractAnnotations(code: string, lang: LanguageAlias, annotationNames?: string[]): Promise<{
    code: string;
    annotations: Annotation[];
}>;

export { Annotation, LANG_NAMES, LanguageAlias, Line, LineGroup, Lines, RawTheme, StringTheme, THEME_NAMES, Theme, ThemeColors, Token, TokenGroup, Tokens, UnknownLanguageError, UnknownThemeError, annotatedHighlight, extractAnnotations, highlight, highlightWithScopes };
