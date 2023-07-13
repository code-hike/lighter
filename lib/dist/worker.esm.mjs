import onig$1 from 'vscode-oniguruma/release/onig.wasm?module';

async function readJSON(folder, filename) {
    throw new Error("no fs");
}

// this will be replaced at build time with the version from package json
// endpoints:
// /grammars/${name}.json
// /themes/${name}.json
async function fetchJSON(endpoint) {
    const r = await fetch(`https://lighter.codehike.org/${endpoint}.json`);
    return await r.json();
}

// from https://stackoverflow.com/a/53936623/1325646
const isValidHex = (hex) => /^#([A-Fa-f0-9]{3,4}){1,2}$/.test(hex);
const getChunksFromString = (st, chunkSize) => st.match(new RegExp(`.{${chunkSize}}`, "g"));
const convertHexUnitTo256 = (hex) => parseInt(hex.repeat(2 / hex.length), 16);
function getAlphaFloat(a, alpha) {
    if (typeof a !== "undefined") {
        return a / 255;
    }
    if (typeof alpha != "number" || alpha < 0 || alpha > 1) {
        return 1;
    }
    return alpha;
}
function hexToObject(hex) {
    if (!hex) {
        return undefined;
    }
    if (!isValidHex(hex)) {
        throw new Error("Invalid color string, must be a valid hex color");
    }
    const chunkSize = Math.floor((hex.length - 1) / 3);
    const hexArr = getChunksFromString(hex.slice(1), chunkSize);
    const [r, g, b, a] = hexArr.map(convertHexUnitTo256);
    return {
        r,
        g,
        b,
        a: getAlphaFloat(a, 1),
    };
}
function objectToHex(object) {
    if (!object) {
        return undefined;
    }
    const { r, g, b, a } = object;
    const alpha = Math.round(a * 255);
    return `#${r.toString(16).padStart(2, "0")}${g
        .toString(16)
        .padStart(2, "0")}${b.toString(16).padStart(2, "0")}${alpha
        .toString(16)
        .padStart(2, "0")}`;
}
function transparent(color, opacity) {
    if (!color) {
        return color;
    }
    const { r, g, b, a } = hexToObject(color);
    return objectToHex({ r, g, b, a: a * opacity });
}

function getColorScheme(theme) {
    return theme.type === "from-css" ? "var(--ch-0)" : theme.type;
}
function getColor(theme, name) {
    const colors = theme.colors || {};
    if (colors[name]) {
        return colors[name];
    }
    const defaultColors = defaults[name];
    if (!defaultColors) {
        throw new Error(`Unknown theme color key: ${name}`);
    }
    if (typeof defaultColors === "string") {
        return getColor(theme, defaultColors);
    }
    return getDefault(theme, defaultColors);
}
function getDefault(theme, defaults) {
    const defaultByScheme = defaults[theme.type];
    if (Array.isArray(defaultByScheme)) {
        const [fn, name, ...args] = defaultByScheme;
        const color = getColor(theme, name);
        return fn(color, ...args);
    }
    return defaultByScheme;
}
// defaults from: https://github.com/microsoft/vscode/blob/main/src/vs/workbench/common/theme.ts
// and: https://github.com/microsoft/vscode/blob/main/src/vs/editor/common/core/editorColorRegistry.ts
// and: https://github.com/microsoft/vscode/blob/main/src/vs/platform/theme/common/colorRegistry.ts
// keys from : https://code.visualstudio.com/api/references/theme-color#editor-groups-tabs
const contrastBorder = "#6FC3DF";
const defaults = {
    "editor.foreground": { dark: "#bbbbbb", light: "#333333", hc: "#ffffff" },
    "editorLineNumber.foreground": {
        dark: "#858585",
        light: "#237893",
        hc: "#fffffe",
    },
    "editor.selectionBackground": {
        light: "#ADD6FF",
        dark: "#264F78",
        hc: "#f3f518",
    },
    "editor.background": { light: "#fffffe", dark: "#1E1E1E", hc: "#000000" },
    "editorGroupHeader.tabsBackground": { dark: "#252526", light: "#F3F3F3" },
    "tab.activeBackground": "editor.background",
    "tab.activeForeground": { dark: "#ffffff", light: "#333333", hc: "#ffffff" },
    "tab.border": { dark: "#252526", light: "#F3F3F3", hc: contrastBorder },
    "tab.activeBorder": "tab.activeBackground",
    "tab.inactiveBackground": { dark: "#2D2D2D", light: "#ECECEC" },
    "tab.inactiveForeground": {
        dark: [transparent, "tab.activeForeground", 0.5],
        light: [transparent, "tab.activeForeground", 0.5],
        hc: "#ffffff",
    },
    "diffEditor.insertedTextBackground": {
        dark: "#9ccc2c33",
        light: "#9ccc2c40",
    },
    "diffEditor.removedTextBackground": { dark: "#ff000033", light: "#ff000033" },
    "diffEditor.insertedLineBackground": {
        dark: "#9bb95533",
        light: "#9bb95533",
    },
    "diffEditor.removedLineBackground": { dark: "#ff000033", light: "#ff000033" },
    "icon.foreground": { dark: "#C5C5C5", light: "#424242", hc: "#FFFFFF" },
    "sideBar.background": { dark: "#252526", light: "#F3F3F3", hc: "#000000" },
    "sideBar.foreground": "editor.foreground",
    "sideBar.border": "sideBar.background",
    "list.inactiveSelectionBackground": { dark: "#37373D", light: "#E4E6F1" },
    "list.inactiveSelectionForeground": {},
    "list.hoverBackground": { dark: "#2A2D2E", light: "#F0F0F0" },
    "list.hoverForeground": {},
    "editorGroupHeader.tabsBorder": { hc: contrastBorder },
    "tab.activeBorderTop": { hc: contrastBorder },
    "tab.hoverBackground": "tab.inactiveBackground",
    "tab.hoverForeground": "tab.inactiveForeground",
    "editor.rangeHighlightBackground": { dark: "#ffffff0b", light: "#fdff0033" },
    "editor.infoForeground": { dark: "#3794FF", light: "#1a85ff", hc: "#3794FF" },
    "input.border": { hc: contrastBorder },
    "input.background": { dark: "#3C3C3C", light: "#fffffe", hc: "#000000" },
    "input.foreground": "editor.foreground",
    "editor.lineHighlightBackground": {},
    focusBorder: { light: "#0090F1", dark: "#007FD4", hc: contrastBorder },
    "editorGroup.border": {
        dark: "#444444",
        light: "#E7E7E7",
        hc: contrastBorder,
    },
    "list.activeSelectionBackground": {
        dark: "#094771",
        light: "#0060C0",
        hc: "#000000",
    },
    "list.activeSelectionForeground": {
        dark: "#fffffe",
        light: "#fffffe",
        hc: "#fffffe",
    },
    // this aren't from vscode, they are specific to lighter
    "lighter.inlineBackground": {
        dark: [transparent, "editor.background", 0.9],
        light: [transparent, "editor.background", 0.9],
    },
};

const promiseCache = new Map();
const themeCache = new Map();
async function preloadTheme(theme) {
    if (typeof theme === "string") {
        const name = theme;
        if (!THEME_NAMES.includes(name)) {
            throw new UnknownThemeError(name);
        }
        if (!promiseCache.has(name)) {
            const promise = reallyLoadThemeByName(name).then((theme) => {
                themeCache.set(name, theme);
                return theme;
            });
            promiseCache.set(name, promise);
        }
        return promiseCache.get(name);
    }
    return theme;
}
function getTheme(theme) {
    let rawTheme = null;
    if (typeof theme === "string") {
        rawTheme = themeCache.get(theme);
        if (!rawTheme) {
            throw new Error("Syntax highlighting error: theme not loaded");
        }
    }
    else {
        rawTheme = theme;
    }
    return toFinalTheme(rawTheme);
}
async function reallyLoadThemeByName(name) {
    try {
        return await readJSON("themes", name + ".json");
    }
    catch (e) {
        return await fetchJSON(`themes/${name}`);
    }
}
function toFinalTheme(theme) {
    if (!theme) {
        return undefined;
    }
    const settings = theme.settings || theme.tokenColors || [];
    const finalTheme = {
        name: theme.name || "unknown-theme",
        type: getThemeType(theme),
        foreground: "",
        background: "",
        settings,
        colors: theme.colors || {},
        colorNames: theme.colorNames,
    };
    const globalSetting = settings.find((s) => !s.scope);
    if (globalSetting) {
        const { foreground, background } = (globalSetting === null || globalSetting === void 0 ? void 0 : globalSetting.settings) || {};
        const newColors = {};
        if (foreground && !finalTheme.colors["editor.foreground"]) {
            newColors["editor.foreground"] = foreground;
        }
        if (background && !finalTheme.colors["editor.background"]) {
            newColors["editor.background"] = background;
        }
        if (Object.keys(newColors).length > 0) {
            finalTheme.colors = Object.assign(Object.assign({}, finalTheme.colors), newColors);
        }
        finalTheme.foreground = foreground;
        finalTheme.background = background;
    }
    if (!globalSetting) {
        finalTheme.settings = [
            {
                settings: {
                    foreground: getColor(finalTheme, "editor.foreground"),
                    background: getColor(finalTheme, "editor.background"),
                },
            },
            ...finalTheme.settings,
        ];
    }
    finalTheme.background =
        finalTheme.background || getColor(finalTheme, "editor.background");
    finalTheme.foreground =
        finalTheme.foreground || getColor(finalTheme, "editor.foreground");
    if (theme.type === "from-css" && !finalTheme.colorNames) {
        const colorNames = {};
        let counter = 0;
        finalTheme.settings = finalTheme.settings.map((s) => {
            const setting = Object.assign(Object.assign({}, s), { settings: Object.assign({}, s.settings) });
            const { foreground, background } = setting.settings || {};
            if (foreground && !colorNames[foreground]) {
                colorNames[foreground] = `#${counter.toString(16).padStart(6, "0")}`;
                counter++;
            }
            if (background && !colorNames[background]) {
                colorNames[background] = `#${counter.toString(16).padStart(6, "0")}`;
                counter++;
            }
            if (foreground) {
                setting.settings.foreground = colorNames[foreground];
            }
            if (background) {
                setting.settings.background = colorNames[background];
            }
            return setting;
        });
        finalTheme.colorNames = colorNames;
    }
    return finalTheme;
}
function getThemeType(theme) {
    var _a;
    if (theme.type === "from-css") {
        return "from-css";
    }
    const themeType = theme.type
        ? theme.type
        : ((_a = theme.name) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes("light"))
            ? "light"
            : "dark";
    if (themeType === "light") {
        return "light";
    }
    else {
        return "dark";
    }
}
const THEME_NAMES = [
    "dark-plus",
    "dracula-soft",
    "dracula",
    "github-dark",
    "github-dark-dimmed",
    "github-from-css",
    "github-light",
    "light-plus",
    "material-darker",
    "material-default",
    "material-from-css",
    "material-lighter",
    "material-ocean",
    "material-palenight",
    "min-dark",
    "min-light",
    "monokai",
    "nord",
    "one-dark-pro",
    "poimandres",
    "slack-dark",
    "slack-ochin",
    "solarized-dark",
    "solarized-light",
];
class UnknownThemeError extends Error {
    constructor(theme) {
        super(`Unknown theme: ${theme}`);
        this.theme = theme;
    }
}
function getAllThemeColors(theme) {
    const c = (key) => {
        if (key === "colorScheme") {
            return getColorScheme(theme);
        }
        if (key === "foreground") {
            return theme.foreground;
        }
        if (key === "background") {
            return theme.background;
        }
        return getColor(theme, key);
    };
    return {
        colorScheme: c("colorScheme"),
        foreground: c("foreground"),
        background: c("background"),
        lighter: {
            inlineBackground: c("lighter.inlineBackground"),
        },
        editor: {
            background: c("editor.background"),
            foreground: c("editor.foreground"),
            lineHighlightBackground: c("editor.lineHighlightBackground"),
            rangeHighlightBackground: c("editor.rangeHighlightBackground"),
            infoForeground: c("editor.infoForeground"),
            selectionBackground: c("editor.selectionBackground"),
        },
        focusBorder: c("focusBorder"),
        tab: {
            activeBackground: c("tab.activeBackground"),
            activeForeground: c("tab.activeForeground"),
            inactiveBackground: c("tab.inactiveBackground"),
            inactiveForeground: c("tab.inactiveForeground"),
            border: c("tab.border"),
            activeBorder: c("tab.activeBorder"),
        },
        editorGroup: {
            border: c("editorGroup.border"),
        },
        editorGroupHeader: {
            tabsBackground: c("editorGroupHeader.tabsBackground"),
        },
        editorLineNumber: {
            foreground: c("editorLineNumber.foreground"),
        },
        input: {
            background: c("input.background"),
            foreground: c("input.foreground"),
            border: c("input.border"),
        },
        icon: {
            foreground: c("icon.foreground"),
        },
        sideBar: {
            background: c("sideBar.background"),
            foreground: c("sideBar.foreground"),
            border: c("sideBar.border"),
        },
        list: {
            activeSelectionBackground: c("list.activeSelectionBackground"),
            activeSelectionForeground: c("list.activeSelectionForeground"),
            hoverBackground: c("list.hoverBackground"),
            hoverForeground: c("list.hoverForeground"),
        },
    };
}

// generated by lib/utils/3.update-languages-data.mjs
const LANG_NAMES = [
    "abap",
    "actionscript-3",
    "ada",
    "apache",
    "apex",
    "apl",
    "applescript",
    "ara",
    "asm",
    "astro",
    "awk",
    "ballerina",
    "bash",
    "bat",
    "batch",
    "be",
    "beancount",
    "berry",
    "bibtex",
    "bicep",
    "blade",
    "c",
    "c#",
    "cadence",
    "cdc",
    "clarity",
    "clj",
    "clojure",
    "cmake",
    "cmd",
    "cobol",
    "codeql",
    "coffee",
    "console",
    "cpp",
    "crystal",
    "cs",
    "csharp",
    "css",
    "cue",
    "cypher",
    "d",
    "dart",
    "dax",
    "diff",
    "docker",
    "dockerfile",
    "dream-maker",
    "elixir",
    "elm",
    "erb",
    "erl",
    "erlang",
    "f#",
    "fish",
    "fs",
    "fsharp",
    "fsl",
    "gdresource",
    "gdscript",
    "gdshader",
    "gherkin",
    "git-commit",
    "git-rebase",
    "glimmer-js",
    "glimmer-ts",
    "glsl",
    "gnuplot",
    "go",
    "graphql",
    "groovy",
    "hack",
    "haml",
    "handlebars",
    "haskell",
    "hbs",
    "hcl",
    "hjson",
    "hlsl",
    "hs",
    "html",
    "http",
    "imba",
    "ini",
    "jade",
    "java",
    "javascript",
    "jinja-html",
    "jison",
    "js",
    "json",
    "json5",
    "jsonc",
    "jsonl",
    "jsonnet",
    "jssm",
    "jsx",
    "julia",
    "kotlin",
    "kql",
    "kusto",
    "latex",
    "less",
    "liquid",
    "lisp",
    "logo",
    "lua",
    "make",
    "makefile",
    "markdown",
    "marko",
    "matlab",
    "md",
    "mdx",
    "mermaid",
    "narrat",
    "nextflow",
    "nginx",
    "nim",
    "nix",
    "objc",
    "objective-c",
    "objective-cpp",
    "ocaml",
    "pascal",
    "perl",
    "perl6",
    "php",
    "plsql",
    "postcss",
    "powerquery",
    "powershell",
    "prisma",
    "prolog",
    "properties",
    "proto",
    "ps",
    "ps1",
    "pug",
    "puppet",
    "purescript",
    "py",
    "python",
    "ql",
    "r",
    "raku",
    "razor",
    "rb",
    "reg",
    "rel",
    "riscv",
    "rs",
    "rst",
    "ruby",
    "rust",
    "sas",
    "sass",
    "scala",
    "scheme",
    "scss",
    "sh",
    "shader",
    "shaderlab",
    "shell",
    "shellscript",
    "shellsession",
    "smalltalk",
    "solidity",
    "sparql",
    "sql",
    "ssh-config",
    "stata",
    "styl",
    "stylus",
    "svelte",
    "swift",
    "system-verilog",
    "tasl",
    "tcl",
    "tex",
    "text",
    "toml",
    "ts",
    "tsx",
    "turtle",
    "twig",
    "txt",
    "typescript",
    "v",
    "vb",
    "verilog",
    "vhdl",
    "vim",
    "viml",
    "vimscript",
    "vue",
    "vue-html",
    "vyper",
    "wasm",
    "wenyan",
    "wgsl",
    "wolfram",
    "xml",
    "xsl",
    "yaml",
    "yml",
    "zenscript",
    "zsh",
    "文言"
];
const aliasOrIdToScope = {
    "abap": "source.abap",
    "actionscript-3": "source.actionscript.3",
    "ada": "source.ada",
    "apache": "source.apacheconf",
    "apex": "source.apex",
    "apl": "source.apl",
    "applescript": "source.applescript",
    "ara": "source.ara",
    "asm": "source.asm.x86_64",
    "astro": "source.astro",
    "awk": "source.awk",
    "ballerina": "source.ballerina",
    "bat": "source.batchfile",
    "batch": "source.batchfile",
    "beancount": "text.beancount",
    "berry": "source.berry",
    "be": "source.berry",
    "bibtex": "text.bibtex",
    "bicep": "source.bicep",
    "blade": "text.html.php.blade",
    "c": "source.c",
    "cadence": "source.cadence",
    "cdc": "source.cadence",
    "clarity": "source.clar",
    "clojure": "source.clojure",
    "clj": "source.clojure",
    "cmake": "source.cmake",
    "cobol": "source.cobol",
    "codeql": "source.ql",
    "ql": "source.ql",
    "coffee": "source.coffee",
    "cpp": "source.cpp",
    "crystal": "source.crystal",
    "csharp": "source.cs",
    "c#": "source.cs",
    "cs": "source.cs",
    "css": "source.css",
    "cue": "source.cue",
    "cypher": "source.cypher",
    "d": "source.d",
    "dart": "source.dart",
    "dax": "source.dax",
    "diff": "source.diff",
    "docker": "source.dockerfile",
    "dockerfile": "source.dockerfile",
    "dream-maker": "source.dm",
    "elixir": "source.elixir",
    "elm": "source.elm",
    "erb": "text.html.erb",
    "erlang": "source.erlang",
    "erl": "source.erlang",
    "fish": "source.fish",
    "fsharp": "source.fsharp",
    "f#": "source.fsharp",
    "fs": "source.fsharp",
    "gdresource": "source.gdresource",
    "gdscript": "source.gdscript",
    "gdshader": "source.gdshader",
    "gherkin": "text.gherkin.feature",
    "git-commit": "text.git-commit",
    "git-rebase": "text.git-rebase",
    "glimmer-js": "source.gjs",
    "glimmer-ts": "source.gts",
    "glsl": "source.glsl",
    "gnuplot": "source.gnuplot",
    "go": "source.go",
    "graphql": "source.graphql",
    "groovy": "source.groovy",
    "hack": "source.hack",
    "haml": "text.haml",
    "handlebars": "text.html.handlebars",
    "hbs": "text.html.handlebars",
    "haskell": "source.haskell",
    "hs": "source.haskell",
    "hcl": "source.hcl",
    "hjson": "source.hjson",
    "hlsl": "source.hlsl",
    "html": "text.html.basic",
    "http": "source.http",
    "imba": "source.imba",
    "ini": "source.ini",
    "properties": "source.ini",
    "java": "source.java",
    "javascript": "source.js",
    "js": "source.js",
    "jinja-html": "text.html.jinja",
    "jison": "source.jison",
    "json": "source.json",
    "json5": "source.json5",
    "jsonc": "source.json.comments",
    "jsonl": "source.json.lines",
    "jsonnet": "source.jsonnet",
    "jssm": "source.jssm",
    "fsl": "source.jssm",
    "jsx": "source.js.jsx",
    "julia": "source.julia",
    "kotlin": "source.kotlin",
    "kusto": "source.kusto",
    "kql": "source.kusto",
    "latex": "text.tex.latex",
    "less": "source.css.less",
    "liquid": "text.html.liquid",
    "lisp": "source.lisp",
    "logo": "source.logo",
    "lua": "source.lua",
    "make": "source.makefile",
    "makefile": "source.makefile",
    "markdown": "text.html.markdown",
    "md": "text.html.markdown",
    "marko": "text.marko",
    "matlab": "source.matlab",
    "mdx": "source.mdx",
    "mermaid": "source.mermaid",
    "narrat": "source.narrat",
    "nextflow": "source.nextflow",
    "nginx": "source.nginx",
    "nim": "source.nim",
    "nix": "source.nix",
    "objective-c": "source.objc",
    "objc": "source.objc",
    "objective-cpp": "source.objcpp",
    "ocaml": "source.ocaml",
    "pascal": "source.pascal",
    "perl": "source.perl",
    "php": "source.php",
    "plsql": "source.plsql.oracle",
    "postcss": "source.css.postcss",
    "powerquery": "source.powerquery",
    "powershell": "source.powershell",
    "ps": "source.powershell",
    "ps1": "source.powershell",
    "prisma": "source.prisma",
    "prolog": "source.prolog",
    "proto": "source.proto",
    "pug": "text.pug",
    "jade": "text.pug",
    "puppet": "source.puppet",
    "purescript": "source.purescript",
    "python": "source.python",
    "py": "source.python",
    "r": "source.r",
    "raku": "source.perl.6",
    "perl6": "source.perl.6",
    "razor": "text.aspnetcorerazor",
    "reg": "source.reg",
    "rel": "source.rel",
    "riscv": "source.riscv",
    "rst": "source.rst",
    "ruby": "source.ruby",
    "rb": "source.ruby",
    "rust": "source.rust",
    "rs": "source.rust",
    "sas": "source.sas",
    "sass": "source.sass",
    "scala": "source.scala",
    "scheme": "source.scheme",
    "scss": "source.css.scss",
    "shaderlab": "source.shaderlab",
    "shader": "source.shaderlab",
    "shellscript": "source.shell",
    "bash": "source.shell",
    "console": "source.shell",
    "sh": "source.shell",
    "shell": "source.shell",
    "zsh": "source.shell",
    "shellsession": "text.shell-session",
    "smalltalk": "source.smalltalk",
    "solidity": "source.solidity",
    "sparql": "source.sparql",
    "sql": "source.sql",
    "ssh-config": "source.ssh-config",
    "stata": "source.stata",
    "stylus": "source.stylus",
    "styl": "source.stylus",
    "svelte": "source.svelte",
    "swift": "source.swift",
    "system-verilog": "source.systemverilog",
    "tasl": "source.tasl",
    "tcl": "source.tcl",
    "tex": "text.tex",
    "toml": "source.toml",
    "tsx": "source.tsx",
    "turtle": "source.turtle",
    "twig": "text.html.twig",
    "txt": "source.txt",
    "typescript": "source.ts",
    "ts": "source.ts",
    "v": "source.v",
    "vb": "source.asp.vb.net",
    "cmd": "source.asp.vb.net",
    "verilog": "source.verilog",
    "vhdl": "source.vhdl",
    "viml": "source.viml",
    "vim": "source.viml",
    "vimscript": "source.viml",
    "vue-html": "text.html.vue-html",
    "vue": "source.vue",
    "vyper": "source.vyper",
    "wasm": "source.wat",
    "wenyan": "source.wenyan",
    "文言": "source.wenyan",
    "wgsl": "source.wgsl",
    "wolfram": "source.wolfram",
    "xml": "text.xml",
    "xsl": "text.xml.xsl",
    "yaml": "source.yaml",
    "yml": "source.yaml",
    "zenscript": "source.zenscript"
};
const scopeToLanguageData = {
    "source.abap": {
        "id": "abap",
        "path": "abap.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.actionscript.3": {
        "id": "actionscript-3",
        "path": "actionscript-3.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.ada": {
        "id": "ada",
        "path": "ada.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.apacheconf": {
        "id": "apache",
        "path": "apache.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.apex": {
        "id": "apex",
        "path": "apex.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.apl": {
        "id": "apl",
        "path": "apl.tmLanguage.json",
        "embeddedScopes": [
            "source.java",
            "source.json",
            "source.js",
            "source.css",
            "text.xml",
            "text.html.basic"
        ]
    },
    "source.applescript": {
        "id": "applescript",
        "path": "applescript.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.ara": {
        "id": "ara",
        "path": "ara.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.asm.x86_64": {
        "id": "asm",
        "path": "asm.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.astro": {
        "id": "astro",
        "path": "astro.tmLanguage.json",
        "embeddedScopes": [
            "source.tsx",
            "source.css.postcss",
            "source.css.less",
            "source.css.scss",
            "source.css",
            "source.sass",
            "source.stylus",
            "source.ts",
            "source.js",
            "source.json"
        ]
    },
    "source.awk": {
        "id": "awk",
        "path": "awk.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.ballerina": {
        "id": "ballerina",
        "path": "ballerina.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.batchfile": {
        "id": "bat",
        "path": "bat.tmLanguage.json",
        "embeddedScopes": []
    },
    "text.beancount": {
        "id": "beancount",
        "path": "beancount.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.berry": {
        "id": "berry",
        "path": "berry.tmLanguage.json",
        "embeddedScopes": []
    },
    "text.bibtex": {
        "id": "bibtex",
        "path": "bibtex.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.bicep": {
        "id": "bicep",
        "path": "bicep.tmLanguage.json",
        "embeddedScopes": []
    },
    "text.html.php.blade": {
        "id": "blade",
        "path": "blade.tmLanguage.json",
        "embeddedScopes": [
            "source.java",
            "source.css",
            "source.json",
            "source.js",
            "source.sql",
            "text.xml",
            "text.html.basic"
        ]
    },
    "source.c": {
        "id": "c",
        "path": "c.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.cadence": {
        "id": "cadence",
        "path": "cadence.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.clar": {
        "id": "clarity",
        "path": "clarity.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.clojure": {
        "id": "clojure",
        "path": "clojure.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.cmake": {
        "id": "cmake",
        "path": "cmake.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.cobol": {
        "id": "cobol",
        "path": "cobol.tmLanguage.json",
        "embeddedScopes": [
            "source.css",
            "source.js",
            "source.java",
            "text.html.basic",
            "source.sql"
        ]
    },
    "source.ql": {
        "id": "codeql",
        "path": "codeql.tmLanguage.json",
        "embeddedScopes": [
            "source.gnuplot",
            "source.haskell",
            "text.tex",
            "source.stylus",
            "source.sass",
            "source.glsl",
            "text.bibtex",
            "text.tex.latex",
            "source.elixir",
            "source.erlang",
            "text.html.handlebars",
            "source.dart",
            "source.fsharp",
            "source.cs",
            "source.tsx",
            "source.ts",
            "source.shell",
            "source.scala",
            "source.rust",
            "source.julia",
            "source.python",
            "source.powershell",
            "source.perl.6",
            "source.css.scss",
            "source.swift",
            "source.objc",
            "source.css.less",
            "source.json.comments",
            "source.json",
            "source.js",
            "text.pug",
            "source.groovy",
            "source.go",
            "text.git-rebase",
            "text.git-commit",
            "source.dockerfile",
            "source.diff",
            "source.cpp",
            "source.c",
            "source.coffee",
            "source.clojure",
            "source.batchfile",
            "source.yaml",
            "text.xml.xsl",
            "text.xml",
            "source.asp.vb.net",
            "source.sql",
            "source.php",
            "source.ruby",
            "source.r",
            "source.perl",
            "source.makefile",
            "source.lua",
            "source.java",
            "source.ini",
            "text.html.basic",
            "source.css",
            "text.html.markdown"
        ]
    },
    "source.coffee": {
        "id": "coffee",
        "path": "coffee.tmLanguage.json",
        "embeddedScopes": [
            "source.js"
        ]
    },
    "source.cpp": {
        "id": "cpp",
        "path": "cpp.tmLanguage.json",
        "embeddedScopes": [
            "source.c",
            "source.sql",
            "source.glsl"
        ]
    },
    "source.crystal": {
        "id": "crystal",
        "path": "crystal.tmLanguage.json",
        "embeddedScopes": [
            "source.shell",
            "source.js",
            "source.c",
            "source.css",
            "source.sql",
            "text.html.basic"
        ]
    },
    "source.cs": {
        "id": "csharp",
        "path": "csharp.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.css": {
        "id": "css",
        "path": "css.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.cue": {
        "id": "cue",
        "path": "cue.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.cypher": {
        "id": "cypher",
        "path": "cypher.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.d": {
        "id": "d",
        "path": "d.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.dart": {
        "id": "dart",
        "path": "dart.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.dax": {
        "id": "dax",
        "path": "dax.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.diff": {
        "id": "diff",
        "path": "diff.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.dockerfile": {
        "id": "docker",
        "path": "docker.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.dm": {
        "id": "dream-maker",
        "path": "dream-maker.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.elixir": {
        "id": "elixir",
        "path": "elixir.tmLanguage.json",
        "embeddedScopes": [
            "source.css",
            "source.js",
            "text.html.basic"
        ]
    },
    "source.elm": {
        "id": "elm",
        "path": "elm.tmLanguage.json",
        "embeddedScopes": [
            "source.c",
            "source.glsl"
        ]
    },
    "text.html.erb": {
        "id": "erb",
        "path": "erb.tmLanguage.json",
        "embeddedScopes": [
            "source.java",
            "source.lua",
            "source.shell",
            "source.c",
            "source.sql",
            "text.xml",
            "source.css",
            "source.js",
            "source.ruby",
            "text.html.basic"
        ]
    },
    "source.erlang": {
        "id": "erlang",
        "path": "erlang.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.fish": {
        "id": "fish",
        "path": "fish.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.fsharp": {
        "id": "fsharp",
        "path": "fsharp.tmLanguage.json",
        "embeddedScopes": [
            "source.gnuplot",
            "source.haskell",
            "text.tex",
            "source.stylus",
            "source.sass",
            "source.glsl",
            "text.bibtex",
            "text.tex.latex",
            "source.elixir",
            "source.erlang",
            "text.html.handlebars",
            "source.dart",
            "source.cs",
            "source.tsx",
            "source.ts",
            "source.shell",
            "source.scala",
            "source.rust",
            "source.julia",
            "source.python",
            "source.powershell",
            "source.perl.6",
            "source.css.scss",
            "source.swift",
            "source.objc",
            "source.css.less",
            "source.json.comments",
            "source.json",
            "source.js",
            "text.pug",
            "source.groovy",
            "source.go",
            "text.git-rebase",
            "text.git-commit",
            "source.dockerfile",
            "source.diff",
            "source.cpp",
            "source.c",
            "source.coffee",
            "source.clojure",
            "source.batchfile",
            "source.yaml",
            "text.xml.xsl",
            "text.xml",
            "source.asp.vb.net",
            "source.sql",
            "source.php",
            "source.ruby",
            "source.r",
            "source.perl",
            "source.makefile",
            "source.lua",
            "source.java",
            "source.ini",
            "text.html.basic",
            "source.css",
            "text.html.markdown"
        ]
    },
    "source.gdresource": {
        "id": "gdresource",
        "path": "gdresource.tmLanguage.json",
        "embeddedScopes": [
            "source.gdscript",
            "source.gdshader"
        ]
    },
    "source.gdscript": {
        "id": "gdscript",
        "path": "gdscript.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.gdshader": {
        "id": "gdshader",
        "path": "gdshader.tmLanguage.json",
        "embeddedScopes": []
    },
    "text.gherkin.feature": {
        "id": "gherkin",
        "path": "gherkin.tmLanguage.json",
        "embeddedScopes": []
    },
    "text.git-commit": {
        "id": "git-commit",
        "path": "git-commit.tmLanguage.json",
        "embeddedScopes": [
            "source.diff"
        ]
    },
    "text.git-rebase": {
        "id": "git-rebase",
        "path": "git-rebase.tmLanguage.json",
        "embeddedScopes": [
            "source.shell"
        ]
    },
    "source.gjs": {
        "id": "glimmer-js",
        "path": "glimmer-js.tmLanguage.json",
        "embeddedScopes": [
            "source.yaml",
            "source.css",
            "text.html.basic",
            "text.html.handlebars",
            "source.js"
        ]
    },
    "source.gts": {
        "id": "glimmer-ts",
        "path": "glimmer-ts.tmLanguage.json",
        "embeddedScopes": [
            "source.yaml",
            "source.js",
            "source.css",
            "text.html.basic",
            "text.html.handlebars",
            "source.ts"
        ]
    },
    "source.glsl": {
        "id": "glsl",
        "path": "glsl.tmLanguage.json",
        "embeddedScopes": [
            "source.c"
        ]
    },
    "source.gnuplot": {
        "id": "gnuplot",
        "path": "gnuplot.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.go": {
        "id": "go",
        "path": "go.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.graphql": {
        "id": "graphql",
        "path": "graphql.tmLanguage.json",
        "embeddedScopes": [
            "source.tsx",
            "source.js.jsx",
            "source.ts",
            "source.js"
        ]
    },
    "source.groovy": {
        "id": "groovy",
        "path": "groovy.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.hack": {
        "id": "hack",
        "path": "hack.tmLanguage.json",
        "embeddedScopes": [
            "source.css",
            "source.js",
            "source.sql",
            "text.html.basic"
        ]
    },
    "text.haml": {
        "id": "haml",
        "path": "haml.tmLanguage.json",
        "embeddedScopes": [
            "source.gnuplot",
            "source.haskell",
            "text.tex",
            "source.stylus",
            "source.glsl",
            "text.bibtex",
            "text.tex.latex",
            "source.elixir",
            "source.erlang",
            "text.html.handlebars",
            "source.dart",
            "source.fsharp",
            "source.cs",
            "source.tsx",
            "source.ts",
            "source.scala",
            "source.rust",
            "source.julia",
            "source.python",
            "source.powershell",
            "source.perl.6",
            "source.css.scss",
            "source.swift",
            "source.objc",
            "source.css.less",
            "source.json.comments",
            "source.json",
            "text.pug",
            "source.groovy",
            "source.go",
            "text.git-rebase",
            "text.git-commit",
            "source.dockerfile",
            "source.diff",
            "source.cpp",
            "source.clojure",
            "source.batchfile",
            "source.yaml",
            "text.xml.xsl",
            "source.asp.vb.net",
            "source.php",
            "source.r",
            "source.perl",
            "source.makefile",
            "source.java",
            "source.ini",
            "source.lua",
            "source.shell",
            "source.c",
            "source.sql",
            "text.xml",
            "text.html.basic",
            "source.css",
            "text.html.markdown",
            "source.coffee",
            "source.sass",
            "source.js",
            "source.ruby"
        ]
    },
    "text.html.handlebars": {
        "id": "handlebars",
        "path": "handlebars.tmLanguage.json",
        "embeddedScopes": [
            "source.yaml",
            "source.js",
            "source.css",
            "text.html.basic"
        ]
    },
    "source.haskell": {
        "id": "haskell",
        "path": "haskell.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.hcl": {
        "id": "hcl",
        "path": "hcl.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.hjson": {
        "id": "hjson",
        "path": "hjson.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.hlsl": {
        "id": "hlsl",
        "path": "hlsl.tmLanguage.json",
        "embeddedScopes": []
    },
    "text.html.basic": {
        "id": "html",
        "path": "html.tmLanguage.json",
        "embeddedScopes": [
            "source.css",
            "source.js"
        ]
    },
    "source.http": {
        "id": "http",
        "path": "http.tmLanguage.json",
        "embeddedScopes": [
            "source.tsx",
            "source.js.jsx",
            "source.ts",
            "source.js",
            "source.java",
            "source.graphql",
            "text.xml",
            "source.json",
            "source.shell"
        ]
    },
    "source.imba": {
        "id": "imba",
        "path": "imba.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.ini": {
        "id": "ini",
        "path": "ini.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.java": {
        "id": "java",
        "path": "java.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.js": {
        "id": "javascript",
        "path": "javascript.tmLanguage.json",
        "embeddedScopes": []
    },
    "text.html.jinja": {
        "id": "jinja-html",
        "path": "jinja-html.tmLanguage.json",
        "embeddedScopes": [
            "source.css",
            "source.js",
            "text.html.basic"
        ]
    },
    "source.jison": {
        "id": "jison",
        "path": "jison.tmLanguage.json",
        "embeddedScopes": [
            "source.js"
        ]
    },
    "source.json": {
        "id": "json",
        "path": "json.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.json5": {
        "id": "json5",
        "path": "json5.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.json.comments": {
        "id": "jsonc",
        "path": "jsonc.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.json.lines": {
        "id": "jsonl",
        "path": "jsonl.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.jsonnet": {
        "id": "jsonnet",
        "path": "jsonnet.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.jssm": {
        "id": "jssm",
        "path": "jssm.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.js.jsx": {
        "id": "jsx",
        "path": "jsx.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.julia": {
        "id": "julia",
        "path": "julia.tmLanguage.json",
        "embeddedScopes": [
            "source.c",
            "source.glsl",
            "source.sql",
            "source.r",
            "source.js",
            "source.python",
            "source.cpp"
        ]
    },
    "source.kotlin": {
        "id": "kotlin",
        "path": "kotlin.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.kusto": {
        "id": "kusto",
        "path": "kusto.tmLanguage.json",
        "embeddedScopes": []
    },
    "text.tex.latex": {
        "id": "latex",
        "path": "latex.tmLanguage.json",
        "embeddedScopes": [
            "source.glsl",
            "source.shell",
            "source.sql",
            "source.cpp",
            "source.c",
            "source.r",
            "source.gnuplot",
            "source.scala",
            "source.rust",
            "source.yaml",
            "source.python",
            "source.ts",
            "source.js",
            "source.ruby",
            "source.julia",
            "source.lua",
            "source.java",
            "text.xml",
            "text.html.basic",
            "source.haskell",
            "source.css",
            "text.tex"
        ]
    },
    "source.css.less": {
        "id": "less",
        "path": "less.tmLanguage.json",
        "embeddedScopes": [
            "source.css"
        ]
    },
    "text.html.liquid": {
        "id": "liquid",
        "path": "liquid.tmLanguage.json",
        "embeddedScopes": [
            "source.js",
            "source.json",
            "source.css",
            "text.html.basic"
        ]
    },
    "source.lisp": {
        "id": "lisp",
        "path": "lisp.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.logo": {
        "id": "logo",
        "path": "logo.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.lua": {
        "id": "lua",
        "path": "lua.tmLanguage.json",
        "embeddedScopes": [
            "source.c"
        ]
    },
    "source.makefile": {
        "id": "make",
        "path": "make.tmLanguage.json",
        "embeddedScopes": []
    },
    "text.html.markdown": {
        "id": "markdown",
        "path": "markdown.tmLanguage.json",
        "embeddedScopes": [
            "source.gnuplot",
            "source.haskell",
            "text.tex",
            "source.stylus",
            "source.sass",
            "source.glsl",
            "text.bibtex",
            "text.tex.latex",
            "source.elixir",
            "source.erlang",
            "text.html.handlebars",
            "source.dart",
            "source.fsharp",
            "source.cs",
            "source.tsx",
            "source.ts",
            "source.shell",
            "source.scala",
            "source.rust",
            "source.julia",
            "source.python",
            "source.powershell",
            "source.perl.6",
            "source.css.scss",
            "source.swift",
            "source.objc",
            "source.css.less",
            "source.json.comments",
            "source.json",
            "source.js",
            "text.pug",
            "source.groovy",
            "source.go",
            "text.git-rebase",
            "text.git-commit",
            "source.dockerfile",
            "source.diff",
            "source.cpp",
            "source.c",
            "source.coffee",
            "source.clojure",
            "source.batchfile",
            "source.yaml",
            "text.xml.xsl",
            "text.xml",
            "source.asp.vb.net",
            "source.sql",
            "source.php",
            "source.ruby",
            "source.r",
            "source.perl",
            "source.makefile",
            "source.lua",
            "source.java",
            "source.ini",
            "text.html.basic",
            "source.css"
        ]
    },
    "text.marko": {
        "id": "marko",
        "path": "marko.tmLanguage.json",
        "embeddedScopes": [
            "source.js",
            "source.css.scss",
            "source.css.less",
            "source.css"
        ]
    },
    "source.matlab": {
        "id": "matlab",
        "path": "matlab.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.mdx": {
        "id": "mdx",
        "path": "mdx.tmLanguage.json",
        "embeddedScopes": [
            "source.gnuplot",
            "text.tex",
            "source.stylus",
            "source.sass",
            "text.bibtex",
            "text.tex.latex",
            "text.html.handlebars",
            "source.dart",
            "source.fsharp",
            "source.powershell",
            "source.perl.6",
            "source.json.comments",
            "text.pug",
            "source.groovy",
            "text.git-rebase",
            "text.git-commit",
            "source.batchfile",
            "text.xml.xsl",
            "source.asp.vb.net",
            "source.php",
            "source.js.jsx",
            "source.glsl",
            "source.ts",
            "source.swift",
            "text.xml",
            "source.sql",
            "text.shell-session",
            "source.shell",
            "source.css.scss",
            "source.scala",
            "source.rust",
            "source.ruby",
            "source.r",
            "source.python",
            "source.perl",
            "source.objc",
            "text.html.markdown",
            "source.makefile",
            "source.lua",
            "source.css.less",
            "source.kotlin",
            "source.julia",
            "source.json",
            "source.js",
            "source.java",
            "source.ini",
            "text.html.basic",
            "source.haskell",
            "source.graphql",
            "source.go",
            "source.erlang",
            "source.elm",
            "source.elixir",
            "source.dockerfile",
            "source.diff",
            "source.css",
            "source.cs",
            "source.cpp",
            "source.coffee",
            "source.clojure",
            "source.c",
            "source.yaml",
            "source.toml",
            "source.tsx"
        ]
    },
    "source.mermaid": {
        "id": "mermaid",
        "path": "mermaid.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.narrat": {
        "id": "narrat",
        "path": "narrat.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.nextflow": {
        "id": "nextflow",
        "path": "nextflow.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.nginx": {
        "id": "nginx",
        "path": "nginx.tmLanguage.json",
        "embeddedScopes": [
            "source.c",
            "source.lua"
        ]
    },
    "source.nim": {
        "id": "nim",
        "path": "nim.tmLanguage.json",
        "embeddedScopes": [
            "source.gnuplot",
            "source.haskell",
            "text.tex",
            "source.stylus",
            "source.sass",
            "text.bibtex",
            "text.tex.latex",
            "source.elixir",
            "source.erlang",
            "text.html.handlebars",
            "source.dart",
            "source.fsharp",
            "source.cs",
            "source.tsx",
            "source.ts",
            "source.shell",
            "source.scala",
            "source.rust",
            "source.julia",
            "source.python",
            "source.powershell",
            "source.perl.6",
            "source.css.scss",
            "source.swift",
            "source.objc",
            "source.css.less",
            "source.json.comments",
            "source.json",
            "text.pug",
            "source.groovy",
            "source.go",
            "text.git-rebase",
            "text.git-commit",
            "source.dockerfile",
            "source.diff",
            "source.cpp",
            "source.coffee",
            "source.clojure",
            "source.batchfile",
            "source.yaml",
            "text.xml.xsl",
            "source.asp.vb.net",
            "source.sql",
            "source.php",
            "source.ruby",
            "source.r",
            "source.perl",
            "source.makefile",
            "source.lua",
            "source.ini",
            "source.java",
            "text.html.markdown",
            "source.glsl",
            "source.css",
            "source.js",
            "text.xml",
            "text.html.basic",
            "source.c"
        ]
    },
    "source.nix": {
        "id": "nix",
        "path": "nix.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.objc": {
        "id": "objective-c",
        "path": "objective-c.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.objcpp": {
        "id": "objective-cpp",
        "path": "objective-cpp.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.ocaml": {
        "id": "ocaml",
        "path": "ocaml.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.pascal": {
        "id": "pascal",
        "path": "pascal.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.perl": {
        "id": "perl",
        "path": "perl.tmLanguage.json",
        "embeddedScopes": [
            "source.java",
            "source.sql",
            "source.js",
            "source.css",
            "text.xml",
            "text.html.basic"
        ]
    },
    "source.php": {
        "id": "php",
        "path": "php.tmLanguage.json",
        "embeddedScopes": [
            "source.java",
            "source.css",
            "source.json",
            "source.js",
            "source.sql",
            "text.xml",
            "text.html.basic"
        ]
    },
    "source.plsql.oracle": {
        "id": "plsql",
        "path": "plsql.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.css.postcss": {
        "id": "postcss",
        "path": "postcss.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.powerquery": {
        "id": "powerquery",
        "path": "powerquery.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.powershell": {
        "id": "powershell",
        "path": "powershell.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.prisma": {
        "id": "prisma",
        "path": "prisma.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.prolog": {
        "id": "prolog",
        "path": "prolog.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.proto": {
        "id": "proto",
        "path": "proto.tmLanguage.json",
        "embeddedScopes": []
    },
    "text.pug": {
        "id": "pug",
        "path": "pug.tmLanguage.json",
        "embeddedScopes": [
            "text.html.basic",
            "source.coffee",
            "source.stylus",
            "source.css.scss",
            "source.sass",
            "source.css",
            "source.js"
        ]
    },
    "source.puppet": {
        "id": "puppet",
        "path": "puppet.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.purescript": {
        "id": "purescript",
        "path": "purescript.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.python": {
        "id": "python",
        "path": "python.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.r": {
        "id": "r",
        "path": "r.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.perl.6": {
        "id": "raku",
        "path": "raku.tmLanguage.json",
        "embeddedScopes": []
    },
    "text.aspnetcorerazor": {
        "id": "razor",
        "path": "razor.tmLanguage.json",
        "embeddedScopes": [
            "source.css",
            "source.js",
            "source.cs",
            "text.html.basic"
        ]
    },
    "source.reg": {
        "id": "reg",
        "path": "reg.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.rel": {
        "id": "rel",
        "path": "rel.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.riscv": {
        "id": "riscv",
        "path": "riscv.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.rst": {
        "id": "rst",
        "path": "rst.tmLanguage.json",
        "embeddedScopes": [
            "source.java",
            "source.lua",
            "source.c",
            "source.css",
            "text.xml",
            "text.html.basic",
            "source.sql",
            "source.glsl",
            "source.ruby",
            "source.cmake",
            "source.yaml",
            "source.shell",
            "source.js",
            "source.python",
            "source.cpp"
        ]
    },
    "source.ruby": {
        "id": "ruby",
        "path": "ruby.tmLanguage.json",
        "embeddedScopes": [
            "source.java",
            "source.lua",
            "source.shell",
            "source.js",
            "source.c",
            "source.css",
            "source.sql",
            "text.xml",
            "text.html.basic"
        ]
    },
    "source.rust": {
        "id": "rust",
        "path": "rust.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.sas": {
        "id": "sas",
        "path": "sas.tmLanguage.json",
        "embeddedScopes": [
            "source.sql"
        ]
    },
    "source.sass": {
        "id": "sass",
        "path": "sass.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.scala": {
        "id": "scala",
        "path": "scala.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.scheme": {
        "id": "scheme",
        "path": "scheme.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.css.scss": {
        "id": "scss",
        "path": "scss.tmLanguage.json",
        "embeddedScopes": [
            "source.css"
        ]
    },
    "source.shaderlab": {
        "id": "shaderlab",
        "path": "shaderlab.tmLanguage.json",
        "embeddedScopes": [
            "source.hlsl"
        ]
    },
    "source.shell": {
        "id": "shellscript",
        "path": "shellscript.tmLanguage.json",
        "embeddedScopes": []
    },
    "text.shell-session": {
        "id": "shellsession",
        "path": "shellsession.tmLanguage.json",
        "embeddedScopes": [
            "source.shell"
        ]
    },
    "source.smalltalk": {
        "id": "smalltalk",
        "path": "smalltalk.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.solidity": {
        "id": "solidity",
        "path": "solidity.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.sparql": {
        "id": "sparql",
        "path": "sparql.tmLanguage.json",
        "embeddedScopes": [
            "source.turtle"
        ]
    },
    "source.sql": {
        "id": "sql",
        "path": "sql.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.ssh-config": {
        "id": "ssh-config",
        "path": "ssh-config.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.stata": {
        "id": "stata",
        "path": "stata.tmLanguage.json",
        "embeddedScopes": [
            "source.sql"
        ]
    },
    "source.stylus": {
        "id": "stylus",
        "path": "stylus.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.svelte": {
        "id": "svelte",
        "path": "svelte.tmLanguage.json",
        "embeddedScopes": [
            "source.gnuplot",
            "source.haskell",
            "text.tex",
            "source.glsl",
            "text.bibtex",
            "text.tex.latex",
            "source.elixir",
            "source.erlang",
            "text.html.handlebars",
            "source.dart",
            "source.fsharp",
            "source.cs",
            "source.tsx",
            "source.shell",
            "source.scala",
            "source.rust",
            "source.julia",
            "source.python",
            "source.powershell",
            "source.perl.6",
            "source.swift",
            "source.objc",
            "source.json.comments",
            "source.json",
            "source.groovy",
            "source.go",
            "text.git-rebase",
            "text.git-commit",
            "source.dockerfile",
            "source.diff",
            "source.cpp",
            "source.c",
            "source.clojure",
            "source.batchfile",
            "source.yaml",
            "text.xml.xsl",
            "text.xml",
            "source.asp.vb.net",
            "source.sql",
            "source.php",
            "source.ruby",
            "source.r",
            "source.perl",
            "source.makefile",
            "source.lua",
            "source.java",
            "source.ini",
            "text.html.basic",
            "text.html.markdown",
            "text.pug",
            "source.css.postcss",
            "source.css.less",
            "source.css.scss",
            "source.css",
            "source.sass",
            "source.stylus",
            "source.coffee",
            "source.ts",
            "source.js"
        ]
    },
    "source.swift": {
        "id": "swift",
        "path": "swift.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.systemverilog": {
        "id": "system-verilog",
        "path": "system-verilog.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.tasl": {
        "id": "tasl",
        "path": "tasl.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.tcl": {
        "id": "tcl",
        "path": "tcl.tmLanguage.json",
        "embeddedScopes": []
    },
    "text.tex": {
        "id": "tex",
        "path": "tex.tmLanguage.json",
        "embeddedScopes": [
            "source.r"
        ]
    },
    "source.toml": {
        "id": "toml",
        "path": "toml.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.tsx": {
        "id": "tsx",
        "path": "tsx.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.turtle": {
        "id": "turtle",
        "path": "turtle.tmLanguage.json",
        "embeddedScopes": []
    },
    "text.html.twig": {
        "id": "twig",
        "path": "twig.tmLanguage.json",
        "embeddedScopes": [
            "source.java",
            "source.lua",
            "source.shell",
            "source.c",
            "source.json",
            "source.sql",
            "text.xml",
            "text.html.basic",
            "source.ruby",
            "source.python",
            "source.php",
            "source.js",
            "source.css"
        ]
    },
    "source.txt": {
        "id": "txt",
        "path": "txt.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.ts": {
        "id": "typescript",
        "path": "typescript.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.v": {
        "id": "v",
        "path": "v.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.asp.vb.net": {
        "id": "vb",
        "path": "vb.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.verilog": {
        "id": "verilog",
        "path": "verilog.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.vhdl": {
        "id": "vhdl",
        "path": "vhdl.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.viml": {
        "id": "viml",
        "path": "viml.tmLanguage.json",
        "embeddedScopes": []
    },
    "text.html.vue-html": {
        "id": "vue-html",
        "path": "vue-html.tmLanguage.json",
        "embeddedScopes": [
            "source.gnuplot",
            "source.haskell",
            "text.tex",
            "source.glsl",
            "text.bibtex",
            "text.tex.latex",
            "source.elixir",
            "source.erlang",
            "text.html.handlebars",
            "source.dart",
            "source.fsharp",
            "source.cs",
            "source.shell",
            "source.scala",
            "source.rust",
            "source.julia",
            "source.python",
            "source.powershell",
            "source.perl.6",
            "source.swift",
            "source.objc",
            "source.groovy",
            "source.go",
            "text.git-rebase",
            "text.git-commit",
            "source.dockerfile",
            "source.diff",
            "source.cpp",
            "source.c",
            "source.coffee",
            "source.clojure",
            "source.batchfile",
            "text.xml.xsl",
            "text.xml",
            "source.asp.vb.net",
            "source.sql",
            "source.php",
            "source.ruby",
            "source.r",
            "source.perl",
            "source.makefile",
            "source.lua",
            "source.java",
            "source.ini",
            "source.graphql",
            "source.toml",
            "source.yaml",
            "source.json5",
            "source.json.comments",
            "source.json",
            "source.tsx",
            "source.js.jsx",
            "source.ts",
            "source.css.less",
            "source.css.scss",
            "source.css",
            "source.sass",
            "source.stylus",
            "text.pug",
            "text.html.markdown",
            "text.html.basic",
            "source.js",
            "source.vue"
        ]
    },
    "source.vue": {
        "id": "vue",
        "path": "vue.tmLanguage.json",
        "embeddedScopes": [
            "source.gnuplot",
            "source.haskell",
            "text.tex",
            "source.glsl",
            "text.bibtex",
            "text.tex.latex",
            "source.elixir",
            "source.erlang",
            "text.html.handlebars",
            "source.dart",
            "source.fsharp",
            "source.cs",
            "source.shell",
            "source.scala",
            "source.rust",
            "source.julia",
            "source.python",
            "source.powershell",
            "source.perl.6",
            "source.swift",
            "source.objc",
            "source.groovy",
            "source.go",
            "text.git-rebase",
            "text.git-commit",
            "source.dockerfile",
            "source.diff",
            "source.cpp",
            "source.c",
            "source.coffee",
            "source.clojure",
            "source.batchfile",
            "text.xml.xsl",
            "text.xml",
            "source.asp.vb.net",
            "source.sql",
            "source.php",
            "source.ruby",
            "source.r",
            "source.perl",
            "source.makefile",
            "source.lua",
            "source.java",
            "source.ini",
            "source.graphql",
            "source.toml",
            "source.yaml",
            "source.json5",
            "source.json.comments",
            "source.json",
            "source.tsx",
            "source.js.jsx",
            "source.ts",
            "source.js",
            "source.css.less",
            "source.css.scss",
            "source.css",
            "source.sass",
            "source.stylus",
            "text.pug",
            "text.html.markdown",
            "text.html.basic"
        ]
    },
    "source.vyper": {
        "id": "vyper",
        "path": "vyper.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.wat": {
        "id": "wasm",
        "path": "wasm.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.wenyan": {
        "id": "wenyan",
        "path": "wenyan.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.wgsl": {
        "id": "wgsl",
        "path": "wgsl.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.wolfram": {
        "id": "wolfram",
        "path": "wolfram.tmLanguage.json",
        "embeddedScopes": []
    },
    "text.xml": {
        "id": "xml",
        "path": "xml.tmLanguage.json",
        "embeddedScopes": [
            "source.java"
        ]
    },
    "text.xml.xsl": {
        "id": "xsl",
        "path": "xsl.tmLanguage.json",
        "embeddedScopes": [
            "source.java",
            "text.xml"
        ]
    },
    "source.yaml": {
        "id": "yaml",
        "path": "yaml.tmLanguage.json",
        "embeddedScopes": []
    },
    "source.zenscript": {
        "id": "zenscript",
        "path": "zenscript.tmLanguage.json",
        "embeddedScopes": []
    }
};

var e = {
    d: (t, n) => {
      for (var s in n)
        e.o(n, s) &&
          !e.o(t, s) &&
          Object.defineProperty(t, s, { enumerable: !0, get: n[s] });
    },
    o: (e, t) => Object.prototype.hasOwnProperty.call(e, t),
  },
  t = {};
e.d(t, {
  _X: () => Pe,
  Bz: () => Ae,
  ot: () => we,
  u: () => Se,
  jG: () => o,
  Pn: () => Re,
});
const n = "undefined" != typeof process && !!process.env.VSCODE_TEXTMATE_DEBUG;
var s;
function r(e, t) {
  const n = [],
    s = (function (e) {
      let t = /([LR]:|[\w\.:][\w\.:\-]*|[\,\|\-\(\)])/g,
        n = t.exec(e);
      return {
        next: () => {
          if (!n) return null;
          const s = n[0];
          return (n = t.exec(e)), s;
        },
      };
    })(e);
  let r = s.next();
  for (; null !== r; ) {
    let e = 0;
    if (2 === r.length && ":" === r.charAt(1)) {
      switch (r.charAt(0)) {
        case "R":
          e = 1;
          break;
        case "L":
          e = -1;
          break;
        default:
          console.log(`Unknown priority ${r} in scope selector`);
      }
      r = s.next();
    }
    let t = a();
    if ((n.push({ matcher: t, priority: e }), "," !== r)) break;
    r = s.next();
  }
  return n;
  function o() {
    if ("-" === r) {
      r = s.next();
      const e = o();
      return (t) => !!e && !e(t);
    }
    if ("(" === r) {
      r = s.next();
      const e = (function () {
        const e = [];
        let t = a();
        for (; t && (e.push(t), "|" === r || "," === r); ) {
          do {
            r = s.next();
          } while ("|" === r || "," === r);
          t = a();
        }
        return (t) => e.some((e) => e(t));
      })();
      return ")" === r && (r = s.next()), e;
    }
    if (i(r)) {
      const e = [];
      do {
        e.push(r), (r = s.next());
      } while (i(r));
      return (n) => t(e, n);
    }
    return null;
  }
  function a() {
    const e = [];
    let t = o();
    for (; t; ) e.push(t), (t = o());
    return (t) => e.every((e) => e(t));
  }
}
function i(e) {
  return !!e && !!e.match(/[\w\.:]+/);
}
function o(e) {
  "function" == typeof e.dispose && e.dispose();
}
function a(e) {
  return Array.isArray(e)
    ? (function (e) {
        let t = [];
        for (let n = 0, s = e.length; n < s; n++) t[n] = a(e[n]);
        return t;
      })(e)
    : "object" == typeof e
    ? (function (e) {
        let t = {};
        for (let n in e) t[n] = a(e[n]);
        return t;
      })(e)
    : e;
}
function c(e, ...t) {
  return (
    t.forEach((t) => {
      for (let n in t) e[n] = t[n];
    }),
    e
  );
}
function l(e) {
  const t = ~e.lastIndexOf("/") || ~e.lastIndexOf("\\");
  return 0 === t
    ? e
    : ~t == e.length - 1
    ? l(e.substring(0, e.length - 1))
    : e.substr(1 + ~t);
}
!(function (e) {
  (e.toBinaryStr = function (e) {
    let t = e.toString(2);
    for (; t.length < 32; ) t = "0" + t;
    return t;
  }),
    (e.print = function (t) {
      const n = e.getLanguageId(t),
        s = e.getTokenType(t),
        r = e.getFontStyle(t),
        i = e.getForeground(t),
        o = e.getBackground(t);
      console.log({
        languageId: n,
        tokenType: s,
        fontStyle: r,
        foreground: i,
        background: o,
      });
    }),
    (e.getLanguageId = function (e) {
      return (255 & e) >>> 0;
    }),
    (e.getTokenType = function (e) {
      return (768 & e) >>> 8;
    }),
    (e.containsBalancedBrackets = function (e) {
      return 0 != (1024 & e);
    }),
    (e.getFontStyle = function (e) {
      return (30720 & e) >>> 11;
    }),
    (e.getForeground = function (e) {
      return (16744448 & e) >>> 15;
    }),
    (e.getBackground = function (e) {
      return (4278190080 & e) >>> 24;
    }),
    (e.set = function (t, n, s, r, i, o, a) {
      let c = e.getLanguageId(t),
        l = e.getTokenType(t),
        h = e.containsBalancedBrackets(t) ? 1 : 0,
        u = e.getFontStyle(t),
        p = e.getForeground(t),
        d = e.getBackground(t);
      return (
        0 !== n && (c = n),
        8 !== s && (l = s),
        null !== r && (h = r ? 1 : 0),
        -1 !== i && (u = i),
        0 !== o && (p = o),
        0 !== a && (d = a),
        ((c << 0) |
          (l << 8) |
          (h << 10) |
          (u << 11) |
          (p << 15) |
          (d << 24)) >>>
          0
      );
    });
})(s || (s = {}));
let h = /\$(\d+)|\${(\d+):\/(downcase|upcase)}/g;
class u {
  static hasCaptures(e) {
    return null !== e && ((h.lastIndex = 0), h.test(e));
  }
  static replaceCaptures(e, t, n) {
    return e.replace(h, (e, s, r, i) => {
      let o = n[parseInt(s || r, 10)];
      if (!o) return e;
      {
        let e = t.substring(o.start, o.end);
        for (; "." === e[0]; ) e = e.substring(1);
        switch (i) {
          case "downcase":
            return e.toLowerCase();
          case "upcase":
            return e.toUpperCase();
          default:
            return e;
        }
      }
    });
  }
}
function p(e, t) {
  return e < t ? -1 : e > t ? 1 : 0;
}
function d(e, t) {
  if (null === e && null === t) return 0;
  if (!e) return -1;
  if (!t) return 1;
  let n = e.length,
    s = t.length;
  if (n === s) {
    for (let s = 0; s < n; s++) {
      let n = p(e[s], t[s]);
      if (0 !== n) return n;
    }
    return 0;
  }
  return n - s;
}
function f(e) {
  return !!(
    /^#[0-9a-f]{6}$/i.test(e) ||
    /^#[0-9a-f]{8}$/i.test(e) ||
    /^#[0-9a-f]{3}$/i.test(e) ||
    /^#[0-9a-f]{4}$/i.test(e)
  );
}
function m(e) {
  return e.replace(/[\-\\\{\}\*\+\?\|\^\$\.\,\[\]\(\)\#\s]/g, "\\$&");
}
class g {
  constructor(e) {
    (this.fn = e), (this.cache = new Map());
  }
  get(e) {
    if (this.cache.has(e)) return this.cache.get(e);
    const t = this.fn(e);
    return this.cache.set(e, t), t;
  }
}
const _ =
  "undefined" == typeof performance
    ? function () {
        return Date.now();
      }
    : function () {
        return performance.now();
      };
class y {
  constructor(e) {
    this.scopeName = e;
  }
  toKey() {
    return this.scopeName;
  }
}
class C {
  constructor(e, t) {
    (this.scopeName = e), (this.ruleName = t);
  }
  toKey() {
    return `${this.scopeName}#${this.ruleName}`;
  }
}
class k {
  constructor() {
    (this._references = []),
      (this._seenReferenceKeys = new Set()),
      (this.visitedRule = new Set());
  }
  get references() {
    return this._references;
  }
  add(e) {
    const t = e.toKey();
    this._seenReferenceKeys.has(t) ||
      (this._seenReferenceKeys.add(t), this._references.push(e));
  }
}
class b {
  constructor(e, t) {
    (this.repo = e),
      (this.initialScopeName = t),
      (this.seenFullScopeRequests = new Set()),
      (this.seenPartialScopeRequests = new Set()),
      this.seenFullScopeRequests.add(this.initialScopeName),
      (this.Q = [new y(this.initialScopeName)]);
  }
  processQueue() {
    const e = this.Q;
    this.Q = [];
    const t = new k();
    for (const n of e) S(n, this.initialScopeName, this.repo, t);
    for (const e of t.references)
      if (e instanceof y) {
        if (this.seenFullScopeRequests.has(e.scopeName)) continue;
        this.seenFullScopeRequests.add(e.scopeName), this.Q.push(e);
      } else {
        if (this.seenFullScopeRequests.has(e.scopeName)) continue;
        if (this.seenPartialScopeRequests.has(e.toKey())) continue;
        this.seenPartialScopeRequests.add(e.toKey()), this.Q.push(e);
      }
  }
}
function S(e, t, n, s) {
  const r = n.lookup(e.scopeName);
  if (!r) {
    if (e.scopeName === t) throw new Error(`No grammar provided for <${t}>`);
    return;
  }
  const i = n.lookup(t);
  e instanceof y
    ? A({ baseGrammar: i, selfGrammar: r }, s)
    : w(
        e.ruleName,
        { baseGrammar: i, selfGrammar: r, repository: r.repository },
        s
      );
  const o = n.injections(e.scopeName);
  if (o) for (const e of o) s.add(new y(e));
}
function w(e, t, n) {
  t.repository && t.repository[e] && P([t.repository[e]], t, n);
}
function A(e, t) {
  e.selfGrammar.patterns &&
    Array.isArray(e.selfGrammar.patterns) &&
    P(
      e.selfGrammar.patterns,
      { ...e, repository: e.selfGrammar.repository },
      t
    ),
    e.selfGrammar.injections &&
      P(
        Object.values(e.selfGrammar.injections),
        { ...e, repository: e.selfGrammar.repository },
        t
      );
}
function P(e, t, n) {
  for (const s of e) {
    if (n.visitedRule.has(s)) continue;
    n.visitedRule.add(s);
    const e = s.repository ? c({}, t.repository, s.repository) : t.repository;
    Array.isArray(s.patterns) && P(s.patterns, { ...t, repository: e }, n);
    const r = s.include;
    if (!r) continue;
    const i = v(r);
    switch (i.kind) {
      case 0:
        A({ ...t, selfGrammar: t.baseGrammar }, n);
        break;
      case 1:
        A(t, n);
        break;
      case 2:
        w(i.ruleName, { ...t, repository: e }, n);
        break;
      case 3:
      case 4:
        const s =
          i.scopeName === t.selfGrammar.scopeName
            ? t.selfGrammar
            : i.scopeName === t.baseGrammar.scopeName
            ? t.baseGrammar
            : void 0;
        if (s) {
          const r = {
            baseGrammar: t.baseGrammar,
            selfGrammar: s,
            repository: e,
          };
          4 === i.kind ? w(i.ruleName, r, n) : A(r, n);
        } else
          4 === i.kind
            ? n.add(new C(i.scopeName, i.ruleName))
            : n.add(new y(i.scopeName));
    }
  }
}
class R {
  constructor() {
    this.kind = 0;
  }
}
class N {
  constructor() {
    this.kind = 1;
  }
}
class I {
  constructor(e) {
    (this.ruleName = e), (this.kind = 2);
  }
}
class G {
  constructor(e) {
    (this.scopeName = e), (this.kind = 3);
  }
}
class x {
  constructor(e, t) {
    (this.scopeName = e), (this.ruleName = t), (this.kind = 4);
  }
}
function v(e) {
  if ("$base" === e) return new R();
  if ("$self" === e) return new N();
  const t = e.indexOf("#");
  if (-1 === t) return new G(e);
  if (0 === t) return new I(e.substring(1));
  {
    const n = e.substring(0, t),
      s = e.substring(t + 1);
    return new x(n, s);
  }
}
const E = /\\(\d+)/,
  L = /\\(\d+)/g;
class T {
  constructor(e, t, n, s) {
    (this.$location = e),
      (this.id = t),
      (this._name = n || null),
      (this._nameIsCapturing = u.hasCaptures(this._name)),
      (this._contentName = s || null),
      (this._contentNameIsCapturing = u.hasCaptures(this._contentName));
  }
  get debugName() {
    const e = this.$location
      ? `${l(this.$location.filename)}:${this.$location.line}`
      : "unknown";
    return `${this.constructor.name}#${this.id} @ ${e}`;
  }
  getName(e, t) {
    return this._nameIsCapturing &&
      null !== this._name &&
      null !== e &&
      null !== t
      ? u.replaceCaptures(this._name, e, t)
      : this._name;
  }
  getContentName(e, t) {
    return this._contentNameIsCapturing && null !== this._contentName
      ? u.replaceCaptures(this._contentName, e, t)
      : this._contentName;
  }
}
class $ extends T {
  constructor(e, t, n, s, r) {
    super(e, t, n, s), (this.retokenizeCapturedWithRuleId = r);
  }
  dispose() {}
  collectPatterns(e, t) {
    throw new Error("Not supported!");
  }
  compile(e, t) {
    throw new Error("Not supported!");
  }
  compileAG(e, t, n, s) {
    throw new Error("Not supported!");
  }
}
class B extends T {
  constructor(e, t, n, s, r) {
    super(e, t, n, null),
      (this._match = new W(s, this.id)),
      (this.captures = r),
      (this._cachedCompiledPatterns = null);
  }
  dispose() {
    this._cachedCompiledPatterns &&
      (this._cachedCompiledPatterns.dispose(),
      (this._cachedCompiledPatterns = null));
  }
  get debugMatchRegExp() {
    return `${this._match.source}`;
  }
  collectPatterns(e, t) {
    t.push(this._match);
  }
  compile(e, t) {
    return this._getCachedCompiledPatterns(e).compile(e);
  }
  compileAG(e, t, n, s) {
    return this._getCachedCompiledPatterns(e).compileAG(e, n, s);
  }
  _getCachedCompiledPatterns(e) {
    return (
      this._cachedCompiledPatterns ||
        ((this._cachedCompiledPatterns = new D()),
        this.collectPatterns(e, this._cachedCompiledPatterns)),
      this._cachedCompiledPatterns
    );
  }
}
class M extends T {
  constructor(e, t, n, s, r) {
    super(e, t, n, s),
      (this.patterns = r.patterns),
      (this.hasMissingPatterns = r.hasMissingPatterns),
      (this._cachedCompiledPatterns = null);
  }
  dispose() {
    this._cachedCompiledPatterns &&
      (this._cachedCompiledPatterns.dispose(),
      (this._cachedCompiledPatterns = null));
  }
  collectPatterns(e, t) {
    for (const n of this.patterns) e.getRule(n).collectPatterns(e, t);
  }
  compile(e, t) {
    return this._getCachedCompiledPatterns(e).compile(e);
  }
  compileAG(e, t, n, s) {
    return this._getCachedCompiledPatterns(e).compileAG(e, n, s);
  }
  _getCachedCompiledPatterns(e) {
    return (
      this._cachedCompiledPatterns ||
        ((this._cachedCompiledPatterns = new D()),
        this.collectPatterns(e, this._cachedCompiledPatterns)),
      this._cachedCompiledPatterns
    );
  }
}
class O extends T {
  constructor(e, t, n, s, r, i, o, a, c, l) {
    super(e, t, n, s),
      (this._begin = new W(r, this.id)),
      (this.beginCaptures = i),
      (this._end = new W(o || "￿", -1)),
      (this.endHasBackReferences = this._end.hasBackReferences),
      (this.endCaptures = a),
      (this.applyEndPatternLast = c || !1),
      (this.patterns = l.patterns),
      (this.hasMissingPatterns = l.hasMissingPatterns),
      (this._cachedCompiledPatterns = null);
  }
  dispose() {
    this._cachedCompiledPatterns &&
      (this._cachedCompiledPatterns.dispose(),
      (this._cachedCompiledPatterns = null));
  }
  get debugBeginRegExp() {
    return `${this._begin.source}`;
  }
  get debugEndRegExp() {
    return `${this._end.source}`;
  }
  getEndWithResolvedBackReferences(e, t) {
    return this._end.resolveBackReferences(e, t);
  }
  collectPatterns(e, t) {
    t.push(this._begin);
  }
  compile(e, t) {
    return this._getCachedCompiledPatterns(e, t).compile(e);
  }
  compileAG(e, t, n, s) {
    return this._getCachedCompiledPatterns(e, t).compileAG(e, n, s);
  }
  _getCachedCompiledPatterns(e, t) {
    if (!this._cachedCompiledPatterns) {
      this._cachedCompiledPatterns = new D();
      for (const t of this.patterns)
        e.getRule(t).collectPatterns(e, this._cachedCompiledPatterns);
      this.applyEndPatternLast
        ? this._cachedCompiledPatterns.push(
            this._end.hasBackReferences ? this._end.clone() : this._end
          )
        : this._cachedCompiledPatterns.unshift(
            this._end.hasBackReferences ? this._end.clone() : this._end
          );
    }
    return (
      this._end.hasBackReferences &&
        (this.applyEndPatternLast
          ? this._cachedCompiledPatterns.setSource(
              this._cachedCompiledPatterns.length() - 1,
              t
            )
          : this._cachedCompiledPatterns.setSource(0, t)),
      this._cachedCompiledPatterns
    );
  }
}
class j extends T {
  constructor(e, t, n, s, r, i, o, a, c) {
    super(e, t, n, s),
      (this._begin = new W(r, this.id)),
      (this.beginCaptures = i),
      (this.whileCaptures = a),
      (this._while = new W(o, -2)),
      (this.whileHasBackReferences = this._while.hasBackReferences),
      (this.patterns = c.patterns),
      (this.hasMissingPatterns = c.hasMissingPatterns),
      (this._cachedCompiledPatterns = null),
      (this._cachedCompiledWhilePatterns = null);
  }
  dispose() {
    this._cachedCompiledPatterns &&
      (this._cachedCompiledPatterns.dispose(),
      (this._cachedCompiledPatterns = null)),
      this._cachedCompiledWhilePatterns &&
        (this._cachedCompiledWhilePatterns.dispose(),
        (this._cachedCompiledWhilePatterns = null));
  }
  get debugBeginRegExp() {
    return `${this._begin.source}`;
  }
  get debugWhileRegExp() {
    return `${this._while.source}`;
  }
  getWhileWithResolvedBackReferences(e, t) {
    return this._while.resolveBackReferences(e, t);
  }
  collectPatterns(e, t) {
    t.push(this._begin);
  }
  compile(e, t) {
    return this._getCachedCompiledPatterns(e).compile(e);
  }
  compileAG(e, t, n, s) {
    return this._getCachedCompiledPatterns(e).compileAG(e, n, s);
  }
  _getCachedCompiledPatterns(e) {
    if (!this._cachedCompiledPatterns) {
      this._cachedCompiledPatterns = new D();
      for (const t of this.patterns)
        e.getRule(t).collectPatterns(e, this._cachedCompiledPatterns);
    }
    return this._cachedCompiledPatterns;
  }
  compileWhile(e, t) {
    return this._getCachedCompiledWhilePatterns(e, t).compile(e);
  }
  compileWhileAG(e, t, n, s) {
    return this._getCachedCompiledWhilePatterns(e, t).compileAG(e, n, s);
  }
  _getCachedCompiledWhilePatterns(e, t) {
    return (
      this._cachedCompiledWhilePatterns ||
        ((this._cachedCompiledWhilePatterns = new D()),
        this._cachedCompiledWhilePatterns.push(
          this._while.hasBackReferences ? this._while.clone() : this._while
        )),
      this._while.hasBackReferences &&
        this._cachedCompiledWhilePatterns.setSource(0, t || "￿"),
      this._cachedCompiledWhilePatterns
    );
  }
}
class F {
  static createCaptureRule(e, t, n, s, r) {
    return e.registerRule((e) => new $(t, e, n, s, r));
  }
  static getCompiledRuleId(e, t, n) {
    return (
      e.id ||
        t.registerRule((s) => {
          if (((e.id = s), e.match))
            return new B(
              e.$vscodeTextmateLocation,
              e.id,
              e.name,
              e.match,
              F._compileCaptures(e.captures, t, n)
            );
          if (void 0 === e.begin) {
            e.repository && (n = c({}, n, e.repository));
            let s = e.patterns;
            return (
              void 0 === s && e.include && (s = [{ include: e.include }]),
              new M(
                e.$vscodeTextmateLocation,
                e.id,
                e.name,
                e.contentName,
                F._compilePatterns(s, t, n)
              )
            );
          }
          return e.while
            ? new j(
                e.$vscodeTextmateLocation,
                e.id,
                e.name,
                e.contentName,
                e.begin,
                F._compileCaptures(e.beginCaptures || e.captures, t, n),
                e.while,
                F._compileCaptures(e.whileCaptures || e.captures, t, n),
                F._compilePatterns(e.patterns, t, n)
              )
            : new O(
                e.$vscodeTextmateLocation,
                e.id,
                e.name,
                e.contentName,
                e.begin,
                F._compileCaptures(e.beginCaptures || e.captures, t, n),
                e.end,
                F._compileCaptures(e.endCaptures || e.captures, t, n),
                e.applyEndPatternLast,
                F._compilePatterns(e.patterns, t, n)
              );
        }),
      e.id
    );
  }
  static _compileCaptures(e, t, n) {
    let s = [];
    if (e) {
      let r = 0;
      for (const t in e) {
        if ("$vscodeTextmateLocation" === t) continue;
        const e = parseInt(t, 10);
        e > r && (r = e);
      }
      for (let e = 0; e <= r; e++) s[e] = null;
      for (const r in e) {
        if ("$vscodeTextmateLocation" === r) continue;
        const i = parseInt(r, 10);
        let o = 0;
        e[r].patterns && (o = F.getCompiledRuleId(e[r], t, n)),
          (s[i] = F.createCaptureRule(
            t,
            e[r].$vscodeTextmateLocation,
            e[r].name,
            e[r].contentName,
            o
          ));
      }
    }
    return s;
  }
  static _compilePatterns(e, t, n) {
    let s = [];
    if (e)
      for (let r = 0, i = e.length; r < i; r++) {
        const i = e[r];
        let o = -1;
        if (i.include) {
          const e = v(i.include);
          switch (e.kind) {
            case 0:
            case 1:
              o = F.getCompiledRuleId(n[i.include], t, n);
              break;
            case 2:
              let s = n[e.ruleName];
              s && (o = F.getCompiledRuleId(s, t, n));
              break;
            case 3:
            case 4:
              const r = e.scopeName,
                a = 4 === e.kind ? e.ruleName : null,
                c = t.getExternalGrammar(r, n);
              if (c)
                if (a) {
                  let e = c.repository[a];
                  e && (o = F.getCompiledRuleId(e, t, c.repository));
                } else
                  o = F.getCompiledRuleId(c.repository.$self, t, c.repository);
          }
        } else o = F.getCompiledRuleId(i, t, n);
        if (-1 !== o) {
          const e = t.getRule(o);
          let n = !1;
          if (
            ((e instanceof M || e instanceof O || e instanceof j) &&
              e.hasMissingPatterns &&
              0 === e.patterns.length &&
              (n = !0),
            n)
          )
            continue;
          s.push(o);
        }
      }
    return { patterns: s, hasMissingPatterns: (e ? e.length : 0) !== s.length };
  }
}
class W {
  constructor(e, t) {
    if (e) {
      const t = e.length;
      let n = 0,
        s = [],
        r = !1;
      for (let i = 0; i < t; i++)
        if ("\\" === e.charAt(i) && i + 1 < t) {
          const t = e.charAt(i + 1);
          "z" === t
            ? (s.push(e.substring(n, i)),
              s.push("$(?!\\n)(?<!\\n)"),
              (n = i + 2))
            : ("A" !== t && "G" !== t) || (r = !0),
            i++;
        }
      (this.hasAnchor = r),
        0 === n
          ? (this.source = e)
          : (s.push(e.substring(n, t)), (this.source = s.join("")));
    } else (this.hasAnchor = !1), (this.source = e);
    this.hasAnchor
      ? (this._anchorCache = this._buildAnchorCache())
      : (this._anchorCache = null),
      (this.ruleId = t),
      (this.hasBackReferences = E.test(this.source));
  }
  clone() {
    return new W(this.source, this.ruleId);
  }
  setSource(e) {
    this.source !== e &&
      ((this.source = e),
      this.hasAnchor && (this._anchorCache = this._buildAnchorCache()));
  }
  resolveBackReferences(e, t) {
    let n = t.map((t) => e.substring(t.start, t.end));
    return (
      (L.lastIndex = 0),
      this.source.replace(L, (e, t) => m(n[parseInt(t, 10)] || ""))
    );
  }
  _buildAnchorCache() {
    let e,
      t,
      n,
      s,
      r = [],
      i = [],
      o = [],
      a = [];
    for (e = 0, t = this.source.length; e < t; e++)
      (n = this.source.charAt(e)),
        (r[e] = n),
        (i[e] = n),
        (o[e] = n),
        (a[e] = n),
        "\\" === n &&
          e + 1 < t &&
          ((s = this.source.charAt(e + 1)),
          "A" === s
            ? ((r[e + 1] = "￿"),
              (i[e + 1] = "￿"),
              (o[e + 1] = "A"),
              (a[e + 1] = "A"))
            : "G" === s
            ? ((r[e + 1] = "￿"),
              (i[e + 1] = "G"),
              (o[e + 1] = "￿"),
              (a[e + 1] = "G"))
            : ((r[e + 1] = s), (i[e + 1] = s), (o[e + 1] = s), (a[e + 1] = s)),
          e++);
    return {
      A0_G0: r.join(""),
      A0_G1: i.join(""),
      A1_G0: o.join(""),
      A1_G1: a.join(""),
    };
  }
  resolveAnchors(e, t) {
    return this.hasAnchor && this._anchorCache
      ? e
        ? t
          ? this._anchorCache.A1_G1
          : this._anchorCache.A1_G0
        : t
        ? this._anchorCache.A0_G1
        : this._anchorCache.A0_G0
      : this.source;
  }
}
class D {
  constructor() {
    (this._items = []),
      (this._hasAnchors = !1),
      (this._cached = null),
      (this._anchorCache = {
        A0_G0: null,
        A0_G1: null,
        A1_G0: null,
        A1_G1: null,
      });
  }
  dispose() {
    this._disposeCaches();
  }
  _disposeCaches() {
    this._cached && (this._cached.dispose(), (this._cached = null)),
      this._anchorCache.A0_G0 &&
        (this._anchorCache.A0_G0.dispose(), (this._anchorCache.A0_G0 = null)),
      this._anchorCache.A0_G1 &&
        (this._anchorCache.A0_G1.dispose(), (this._anchorCache.A0_G1 = null)),
      this._anchorCache.A1_G0 &&
        (this._anchorCache.A1_G0.dispose(), (this._anchorCache.A1_G0 = null)),
      this._anchorCache.A1_G1 &&
        (this._anchorCache.A1_G1.dispose(), (this._anchorCache.A1_G1 = null));
  }
  push(e) {
    this._items.push(e), (this._hasAnchors = this._hasAnchors || e.hasAnchor);
  }
  unshift(e) {
    this._items.unshift(e),
      (this._hasAnchors = this._hasAnchors || e.hasAnchor);
  }
  length() {
    return this._items.length;
  }
  setSource(e, t) {
    this._items[e].source !== t &&
      (this._disposeCaches(), this._items[e].setSource(t));
  }
  compile(e) {
    if (!this._cached) {
      let t = this._items.map((e) => e.source);
      this._cached = new q(
        e,
        t,
        this._items.map((e) => e.ruleId)
      );
    }
    return this._cached;
  }
  compileAG(e, t, n) {
    return this._hasAnchors
      ? t
        ? n
          ? (this._anchorCache.A1_G1 ||
              (this._anchorCache.A1_G1 = this._resolveAnchors(e, t, n)),
            this._anchorCache.A1_G1)
          : (this._anchorCache.A1_G0 ||
              (this._anchorCache.A1_G0 = this._resolveAnchors(e, t, n)),
            this._anchorCache.A1_G0)
        : n
        ? (this._anchorCache.A0_G1 ||
            (this._anchorCache.A0_G1 = this._resolveAnchors(e, t, n)),
          this._anchorCache.A0_G1)
        : (this._anchorCache.A0_G0 ||
            (this._anchorCache.A0_G0 = this._resolveAnchors(e, t, n)),
          this._anchorCache.A0_G0)
      : this.compile(e);
  }
  _resolveAnchors(e, t, n) {
    let s = this._items.map((e) => e.resolveAnchors(t, n));
    return new q(
      e,
      s,
      this._items.map((e) => e.ruleId)
    );
  }
}
class q {
  constructor(e, t, n) {
    (this.regExps = t),
      (this.rules = n),
      (this.scanner = e.createOnigScanner(t));
  }
  dispose() {
    "function" == typeof this.scanner.dispose && this.scanner.dispose();
  }
  toString() {
    const e = [];
    for (let t = 0, n = this.rules.length; t < n; t++)
      e.push("   - " + this.rules[t] + ": " + this.regExps[t]);
    return e.join("\n");
  }
  findNextMatchSync(e, t, n) {
    const s = this.scanner.findNextMatchSync(e, t, n);
    return s
      ? { ruleId: this.rules[s.index], captureIndices: s.captureIndices }
      : null;
  }
}
class z {
  constructor(e, t, n) {
    (this._colorMap = e),
      (this._defaults = t),
      (this._root = n),
      (this._cachedMatchRoot = new g((e) => this._root.match(e)));
  }
  static createFromRawTheme(e, t) {
    return this.createFromParsedTheme(
      (function (e) {
        if (!e) return [];
        if (!e.settings || !Array.isArray(e.settings)) return [];
        let t = e.settings,
          n = [],
          s = 0;
        for (let e = 0, r = t.length; e < r; e++) {
          let r,
            i = t[e];
          if (!i.settings) continue;
          if ("string" == typeof i.scope) {
            let e = i.scope;
            (e = e.replace(/^[,]+/, "")),
              (e = e.replace(/[,]+$/, "")),
              (r = e.split(","));
          } else r = Array.isArray(i.scope) ? i.scope : [""];
          let o = -1;
          if ("string" == typeof i.settings.fontStyle) {
            o = 0;
            let e = i.settings.fontStyle.split(" ");
            for (let t = 0, n = e.length; t < n; t++)
              switch (e[t]) {
                case "italic":
                  o |= 1;
                  break;
                case "bold":
                  o |= 2;
                  break;
                case "underline":
                  o |= 4;
                  break;
                case "strikethrough":
                  o |= 8;
              }
          }
          let a = null;
          "string" == typeof i.settings.foreground &&
            f(i.settings.foreground) &&
            (a = i.settings.foreground);
          let c = null;
          "string" == typeof i.settings.background &&
            f(i.settings.background) &&
            (c = i.settings.background);
          for (let t = 0, i = r.length; t < i; t++) {
            let i = r[t].trim().split(" "),
              l = i[i.length - 1],
              h = null;
            i.length > 1 && ((h = i.slice(0, i.length - 1)), h.reverse()),
              (n[s++] = new H(l, h, e, o, a, c));
          }
        }
        return n;
      })(e),
      t
    );
  }
  static createFromParsedTheme(e, t) {
    return (function (e, t) {
      e.sort((e, t) => {
        let n = p(e.scope, t.scope);
        return 0 !== n
          ? n
          : ((n = d(e.parentScopes, t.parentScopes)),
            0 !== n ? n : e.index - t.index);
      });
      let n = 0,
        s = "#000000",
        r = "#ffffff";
      for (; e.length >= 1 && "" === e[0].scope; ) {
        let t = e.shift();
        -1 !== t.fontStyle && (n = t.fontStyle),
          null !== t.foreground && (s = t.foreground),
          null !== t.background && (r = t.background);
      }
      let i = new X(t),
        o = new Q(n, i.getId(s), i.getId(r)),
        a = new Y(new V(0, null, -1, 0, 0), []);
      for (let t = 0, n = e.length; t < n; t++) {
        let n = e[t];
        a.insert(
          0,
          n.scope,
          n.parentScopes,
          n.fontStyle,
          i.getId(n.foreground),
          i.getId(n.background)
        );
      }
      return new z(i, o, a);
    })(e, t);
  }
  getColorMap() {
    return this._colorMap.getColorMap();
  }
  getDefaults() {
    return this._defaults;
  }
  match(e) {
    if (null === e) return this._defaults;
    const t = e.scopeName,
      n = this._cachedMatchRoot.get(t).find((t) =>
        (function (e, t) {
          if (null === t) return !0;
          let n = 0,
            s = t[n];
          for (; e; ) {
            if (K(e.scopeName, s)) {
              if ((n++, n === t.length)) return !0;
              s = t[n];
            }
            e = e.parent;
          }
          return !1;
        })(e.parent, t.parentScopes)
      );
    return n ? new Q(n.fontStyle, n.foreground, n.background) : null;
  }
}
class U {
  constructor(e, t) {
    (this.parent = e), (this.scopeName = t);
  }
  static push(e, t) {
    for (const n of t) e = new U(e, n);
    return e;
  }
  static from(...e) {
    let t = null;
    for (let n = 0; n < e.length; n++) t = new U(t, e[n]);
    return t;
  }
  push(e) {
    return new U(this, e);
  }
  getSegments() {
    let e = this;
    const t = [];
    for (; e; ) t.push(e.scopeName), (e = e.parent);
    return t.reverse(), t;
  }
  toString() {
    return this.getSegments().join(" ");
  }
  extends(e) {
    return this === e || (null !== this.parent && this.parent.extends(e));
  }
  getExtensionIfDefined(e) {
    const t = [];
    let n = this;
    for (; n && n !== e; ) t.push(n.scopeName), (n = n.parent);
    return n === e ? t.reverse() : void 0;
  }
}
function K(e, t) {
  return t === e || (e.startsWith(t) && "." === e[t.length]);
}
class Q {
  constructor(e, t, n) {
    (this.fontStyle = e), (this.foregroundId = t), (this.backgroundId = n);
  }
}
class H {
  constructor(e, t, n, s, r, i) {
    (this.scope = e),
      (this.parentScopes = t),
      (this.index = n),
      (this.fontStyle = s),
      (this.foreground = r),
      (this.background = i);
  }
}
class X {
  constructor(e) {
    if (
      ((this._lastColorId = 0),
      (this._id2color = []),
      (this._color2id = Object.create(null)),
      Array.isArray(e))
    ) {
      this._isFrozen = !0;
      for (let t = 0, n = e.length; t < n; t++)
        (this._color2id[e[t]] = t), (this._id2color[t] = e[t]);
    } else this._isFrozen = !1;
  }
  getId(e) {
    if (null === e) return 0;
    e = e.toUpperCase();
    let t = this._color2id[e];
    if (t) return t;
    if (this._isFrozen) throw new Error(`Missing color in color map - ${e}`);
    return (
      (t = ++this._lastColorId),
      (this._color2id[e] = t),
      (this._id2color[t] = e),
      t
    );
  }
  getColorMap() {
    return this._id2color.slice(0);
  }
}
class V {
  constructor(e, t, n, s, r) {
    (this.scopeDepth = e),
      (this.parentScopes = t),
      (this.fontStyle = n),
      (this.foreground = s),
      (this.background = r);
  }
  clone() {
    return new V(
      this.scopeDepth,
      this.parentScopes,
      this.fontStyle,
      this.foreground,
      this.background
    );
  }
  static cloneArr(e) {
    let t = [];
    for (let n = 0, s = e.length; n < s; n++) t[n] = e[n].clone();
    return t;
  }
  acceptOverwrite(e, t, n, s) {
    this.scopeDepth > e
      ? console.log("how did this happen?")
      : (this.scopeDepth = e),
      -1 !== t && (this.fontStyle = t),
      0 !== n && (this.foreground = n),
      0 !== s && (this.background = s);
  }
}
class Y {
  constructor(e, t = [], n = {}) {
    (this._mainRule = e),
      (this._children = n),
      (this._rulesWithParentScopes = t);
  }
  static _sortBySpecificity(e) {
    return 1 === e.length || e.sort(this._cmpBySpecificity), e;
  }
  static _cmpBySpecificity(e, t) {
    if (e.scopeDepth === t.scopeDepth) {
      const n = e.parentScopes,
        s = t.parentScopes;
      let r = null === n ? 0 : n.length,
        i = null === s ? 0 : s.length;
      if (r === i)
        for (let e = 0; e < r; e++) {
          const t = n[e].length,
            r = s[e].length;
          if (t !== r) return r - t;
        }
      return i - r;
    }
    return t.scopeDepth - e.scopeDepth;
  }
  match(e) {
    if ("" === e)
      return Y._sortBySpecificity(
        [].concat(this._mainRule).concat(this._rulesWithParentScopes)
      );
    let t,
      n,
      s = e.indexOf(".");
    return (
      -1 === s
        ? ((t = e), (n = ""))
        : ((t = e.substring(0, s)), (n = e.substring(s + 1))),
      this._children.hasOwnProperty(t)
        ? this._children[t].match(n)
        : Y._sortBySpecificity(
            [].concat(this._mainRule).concat(this._rulesWithParentScopes)
          )
    );
  }
  insert(e, t, n, s, r, i) {
    if ("" === t) return void this._doInsertHere(e, n, s, r, i);
    let o,
      a,
      c,
      l = t.indexOf(".");
    -1 === l
      ? ((o = t), (a = ""))
      : ((o = t.substring(0, l)), (a = t.substring(l + 1))),
      this._children.hasOwnProperty(o)
        ? (c = this._children[o])
        : ((c = new Y(
            this._mainRule.clone(),
            V.cloneArr(this._rulesWithParentScopes)
          )),
          (this._children[o] = c)),
      c.insert(e + 1, a, n, s, r, i);
  }
  _doInsertHere(e, t, n, s, r) {
    if (null !== t) {
      for (let i = 0, o = this._rulesWithParentScopes.length; i < o; i++) {
        let o = this._rulesWithParentScopes[i];
        if (0 === d(o.parentScopes, t))
          return void o.acceptOverwrite(e, n, s, r);
      }
      -1 === n && (n = this._mainRule.fontStyle),
        0 === s && (s = this._mainRule.foreground),
        0 === r && (r = this._mainRule.background),
        this._rulesWithParentScopes.push(new V(e, t, n, s, r));
    } else this._mainRule.acceptOverwrite(e, n, s, r);
  }
}
class J {
  constructor(e, t) {
    (this.languageId = e), (this.tokenType = t);
  }
}
class Z {
  constructor(e, t) {
    (this._getBasicScopeAttributes = new g((e) => {
      const t = this._scopeToLanguage(e),
        n = this._toStandardTokenType(e);
      return new J(t, n);
    })),
      (this._defaultAttributes = new J(e, 8)),
      (this._embeddedLanguagesMatcher = new ee(Object.entries(t || {})));
  }
  getDefaultAttributes() {
    return this._defaultAttributes;
  }
  getBasicScopeAttributes(e) {
    return null === e
      ? Z._NULL_SCOPE_METADATA
      : this._getBasicScopeAttributes.get(e);
  }
  _scopeToLanguage(e) {
    return this._embeddedLanguagesMatcher.match(e) || 0;
  }
  _toStandardTokenType(e) {
    const t = e.match(Z.STANDARD_TOKEN_TYPE_REGEXP);
    if (!t) return 8;
    switch (t[1]) {
      case "comment":
        return 1;
      case "string":
        return 2;
      case "regex":
        return 3;
      case "meta.embedded":
        return 0;
    }
    throw new Error("Unexpected match for standard token type!");
  }
}
(Z._NULL_SCOPE_METADATA = new J(0, 0)),
  (Z.STANDARD_TOKEN_TYPE_REGEXP = /\b(comment|string|regex|meta\.embedded)\b/);
class ee {
  constructor(e) {
    if (0 === e.length) (this.values = null), (this.scopesRegExp = null);
    else {
      this.values = new Map(e);
      const t = e.map(([e, t]) => m(e));
      t.sort(),
        t.reverse(),
        (this.scopesRegExp = new RegExp(`^((${t.join(")|(")}))($|\\.)`, ""));
    }
  }
  match(e) {
    if (!this.scopesRegExp) return;
    const t = e.match(this.scopesRegExp);
    return t ? this.values.get(t[1]) : void 0;
  }
}
class te {
  constructor(e, t) {
    (this.stack = e), (this.stoppedEarly = t);
  }
}
function ne(e, t, s, r, i, o, a, c) {
  const l = t.content.length;
  let h = !1,
    u = -1;
  if (a) {
    const a = (function (e, t, s, r, i, o) {
      let a = i.beginRuleCapturedEOL ? 0 : -1;
      const c = [];
      for (let t = i; t; t = t.pop()) {
        const n = t.getRule(e);
        n instanceof j && c.push({ rule: n, stack: t });
      }
      for (let l = c.pop(); l; l = c.pop()) {
        const { ruleScanner: c, findOptions: h } = re(
            l.rule,
            e,
            l.stack.endRule,
            s,
            r === a
          ),
          u = c.findNextMatchSync(t, r, h);
        if (
          (n &&
            (console.log("  scanning for while rule"),
            console.log(c.toString())),
          !u)
        ) {
          n &&
            console.log(
              "  popping " + l.rule.debugName + " - " + l.rule.debugWhileRegExp
            ),
            (i = l.stack.pop());
          break;
        }
        if (-2 !== u.ruleId) {
          i = l.stack.pop();
          break;
        }
        u.captureIndices &&
          u.captureIndices.length &&
          (o.produce(l.stack, u.captureIndices[0].start),
          ie(e, t, s, l.stack, o, l.rule.whileCaptures, u.captureIndices),
          o.produce(l.stack, u.captureIndices[0].end),
          (a = u.captureIndices[0].end),
          u.captureIndices[0].end > r &&
            ((r = u.captureIndices[0].end), (s = !1)));
      }
      return { stack: i, linePos: r, anchorPosition: a, isFirstLine: s };
    })(e, t, s, r, i, o);
    (i = a.stack), (r = a.linePos), (s = a.isFirstLine), (u = a.anchorPosition);
  }
  const p = Date.now();
  for (; !h; ) {
    if (0 !== c && Date.now() - p > c) return new te(i, !0);
    d();
  }
  return new te(i, !1);
  function d() {
    n &&
      (console.log(""),
      console.log(
        `@@scanNext ${r}: |${t.content.substr(r).replace(/\n$/, "\\n")}|`
      ));
    const a = (function (e, t, s, r, i, o) {
      const a = (function (e, t, s, r, i, o) {
          const a = i.getRule(e),
            { ruleScanner: c, findOptions: l } = se(
              a,
              e,
              i.endRule,
              s,
              r === o
            );
          let h = 0;
          n && (h = _());
          const u = c.findNextMatchSync(t, r, l);
          if (n) {
            const e = _() - h;
            e > 5 &&
              console.warn(
                `Rule ${a.debugName} (${a.id}) matching took ${e} against '${t}'`
              ),
              console.log(
                `  scanning for (linePos: ${r}, anchorPosition: ${o})`
              ),
              console.log(c.toString()),
              u &&
                console.log(
                  `matched rule id: ${u.ruleId} from ${u.captureIndices[0].start} to ${u.captureIndices[0].end}`
                );
          }
          return u
            ? { captureIndices: u.captureIndices, matchedRuleId: u.ruleId }
            : null;
        })(e, t, s, r, i, o),
        c = e.getInjections();
      if (0 === c.length) return a;
      const l = (function (e, t, s, r, i, o, a) {
        let c,
          l = Number.MAX_VALUE,
          h = null,
          u = 0;
        const p = o.contentNameScopesList.getScopeNames();
        for (let o = 0, d = e.length; o < d; o++) {
          const d = e[o];
          if (!d.matcher(p)) continue;
          const f = t.getRule(d.ruleId),
            { ruleScanner: m, findOptions: g } = se(f, t, null, r, i === a),
            _ = m.findNextMatchSync(s, i, g);
          if (!_) continue;
          n &&
            (console.log(`  matched injection: ${d.debugSelector}`),
            console.log(m.toString()));
          const y = _.captureIndices[0].start;
          if (
            !(y >= l) &&
            ((l = y),
            (h = _.captureIndices),
            (c = _.ruleId),
            (u = d.priority),
            l === i)
          )
            break;
        }
        return h
          ? { priorityMatch: -1 === u, captureIndices: h, matchedRuleId: c }
          : null;
      })(c, e, t, s, r, i, o);
      if (!l) return a;
      if (!a) return l;
      const h = a.captureIndices[0].start,
        u = l.captureIndices[0].start;
      return u < h || (l.priorityMatch && u === h) ? l : a;
    })(e, t, s, r, i, u);
    if (!a)
      return (
        n && console.log("  no more matches."), o.produce(i, l), void (h = !0)
      );
    const c = a.captureIndices,
      p = a.matchedRuleId,
      d = !!(c && c.length > 0) && c[0].end > r;
    if (-1 === p) {
      const a = i.getRule(e);
      n && console.log("  popping " + a.debugName + " - " + a.debugEndRegExp),
        o.produce(i, c[0].start),
        (i = i.withContentNameScopesList(i.nameScopesList)),
        ie(e, t, s, i, o, a.endCaptures, c),
        o.produce(i, c[0].end);
      const p = i;
      if (((i = i.parent), (u = p.getAnchorPos()), !d && p.getEnterPos() === r))
        return (
          n &&
            console.error(
              "[1] - Grammar is in an endless loop - Grammar pushed & popped a rule without advancing"
            ),
          (i = p),
          o.produce(i, l),
          void (h = !0)
        );
    } else {
      const a = e.getRule(p);
      o.produce(i, c[0].start);
      const f = i,
        m = a.getName(t.content, c),
        g = i.contentNameScopesList.pushAttributed(m, e);
      if (((i = i.push(p, r, u, c[0].end === l, null, g, g)), a instanceof O)) {
        const r = a;
        n &&
          console.log("  pushing " + r.debugName + " - " + r.debugBeginRegExp),
          ie(e, t, s, i, o, r.beginCaptures, c),
          o.produce(i, c[0].end),
          (u = c[0].end);
        const p = r.getContentName(t.content, c),
          m = g.pushAttributed(p, e);
        if (
          ((i = i.withContentNameScopesList(m)),
          r.endHasBackReferences &&
            (i = i.withEndRule(
              r.getEndWithResolvedBackReferences(t.content, c)
            )),
          !d && f.hasSameRuleAs(i))
        )
          return (
            n &&
              console.error(
                "[2] - Grammar is in an endless loop - Grammar pushed the same rule without advancing"
              ),
            (i = i.pop()),
            o.produce(i, l),
            void (h = !0)
          );
      } else if (a instanceof j) {
        const r = a;
        n && console.log("  pushing " + r.debugName),
          ie(e, t, s, i, o, r.beginCaptures, c),
          o.produce(i, c[0].end),
          (u = c[0].end);
        const p = r.getContentName(t.content, c),
          m = g.pushAttributed(p, e);
        if (
          ((i = i.withContentNameScopesList(m)),
          r.whileHasBackReferences &&
            (i = i.withEndRule(
              r.getWhileWithResolvedBackReferences(t.content, c)
            )),
          !d && f.hasSameRuleAs(i))
        )
          return (
            n &&
              console.error(
                "[3] - Grammar is in an endless loop - Grammar pushed the same rule without advancing"
              ),
            (i = i.pop()),
            o.produce(i, l),
            void (h = !0)
          );
      } else {
        const r = a;
        if (
          (n &&
            console.log(
              "  matched " + r.debugName + " - " + r.debugMatchRegExp
            ),
          ie(e, t, s, i, o, r.captures, c),
          o.produce(i, c[0].end),
          (i = i.pop()),
          !d)
        )
          return (
            n &&
              console.error(
                "[4] - Grammar is in an endless loop - Grammar is not advancing, nor is it pushing/popping"
              ),
            (i = i.safePop()),
            o.produce(i, l),
            void (h = !0)
          );
      }
    }
    c[0].end > r && ((r = c[0].end), (s = !1));
  }
}
function se(e, t, n, s, r) {
  return { ruleScanner: e.compileAG(t, n, s, r), findOptions: 0 };
}
function re(e, t, n, s, r) {
  return { ruleScanner: e.compileWhileAG(t, n, s, r), findOptions: 0 };
}
function ie(e, t, n, s, r, i, a) {
  if (0 === i.length) return;
  const c = t.content,
    l = Math.min(i.length, a.length),
    h = [],
    u = a[0].end;
  for (let t = 0; t < l; t++) {
    const l = i[t];
    if (null === l) continue;
    const p = a[t];
    if (0 === p.length) continue;
    if (p.start > u) break;
    for (; h.length > 0 && h[h.length - 1].endPos <= p.start; )
      r.produceFromScopes(h[h.length - 1].scopes, h[h.length - 1].endPos),
        h.pop();
    if (
      (h.length > 0
        ? r.produceFromScopes(h[h.length - 1].scopes, p.start)
        : r.produce(s, p.start),
      l.retokenizeCapturedWithRuleId)
    ) {
      const t = l.getName(c, a),
        i = s.contentNameScopesList.pushAttributed(t, e),
        h = l.getContentName(c, a),
        u = i.pushAttributed(h, e),
        d = s.push(l.retokenizeCapturedWithRuleId, p.start, -1, !1, null, i, u),
        f = e.createOnigString(c.substring(0, p.end));
      ne(e, f, n && 0 === p.start, p.start, d, r, !1, 0), o(f);
      continue;
    }
    const d = l.getName(c, a);
    if (null !== d) {
      const t = (
        h.length > 0 ? h[h.length - 1].scopes : s.contentNameScopesList
      ).pushAttributed(d, e);
      h.push(new oe(t, p.end));
    }
  }
  for (; h.length > 0; )
    r.produceFromScopes(h[h.length - 1].scopes, h[h.length - 1].endPos),
      h.pop();
}
class oe {
  constructor(e, t) {
    (this.scopes = e), (this.endPos = t);
  }
}
function ae(e, t, n, s, i) {
  const o = r(t, ce),
    a = F.getCompiledRuleId(n, s, i.repository);
  for (const n of o)
    e.push({
      debugSelector: t,
      matcher: n.matcher,
      ruleId: a,
      grammar: i,
      priority: n.priority,
    });
}
function ce(e, t) {
  if (t.length < e.length) return !1;
  let n = 0;
  return e.every((e) => {
    for (let s = n; s < t.length; s++) if (le(t[s], e)) return (n = s + 1), !0;
    return !1;
  });
}
function le(e, t) {
  if (!e) return !1;
  if (e === t) return !0;
  const n = t.length;
  return e.length > n && e.substr(0, n) === t && "." === e[n];
}
class he {
  constructor(e, t, n, s, i, o, a, c) {
    if (
      ((this._rootScopeName = e),
      (this.balancedBracketSelectors = o),
      (this._onigLib = c),
      (this._basicScopeAttributesProvider = new Z(n, s)),
      (this._rootId = -1),
      (this._lastRuleId = 0),
      (this._ruleId2desc = [null]),
      (this._includedGrammars = {}),
      (this._grammarRepository = a),
      (this._grammar = ue(t, null)),
      (this._injections = null),
      (this._tokenTypeMatchers = []),
      i)
    )
      for (const e of Object.keys(i)) {
        const t = r(e, ce);
        for (const n of t)
          this._tokenTypeMatchers.push({ matcher: n.matcher, type: i[e] });
      }
  }
  get themeProvider() {
    return this._grammarRepository;
  }
  dispose() {
    for (const e of this._ruleId2desc) e && e.dispose();
  }
  createOnigScanner(e) {
    return this._onigLib.createOnigScanner(e);
  }
  createOnigString(e) {
    return this._onigLib.createOnigString(e);
  }
  getMetadataForScope(e) {
    return this._basicScopeAttributesProvider.getBasicScopeAttributes(e);
  }
  _collectInjections() {
    const e = [],
      t = this._rootScopeName,
      n = ((e) =>
        e === this._rootScopeName ? this._grammar : this.getExternalGrammar(e))(
        t
      );
    if (n) {
      const s = n.injections;
      if (s) for (let t in s) ae(e, t, s[t], this, n);
      const r = this._grammarRepository.injections(t);
      r &&
        r.forEach((t) => {
          const n = this.getExternalGrammar(t);
          if (n) {
            const t = n.injectionSelector;
            t && ae(e, t, n, this, n);
          }
        });
    }
    return e.sort((e, t) => e.priority - t.priority), e;
  }
  getInjections() {
    if (
      null === this._injections &&
      ((this._injections = this._collectInjections()),
      n && this._injections.length > 0)
    ) {
      console.log(
        `Grammar ${this._rootScopeName} contains the following injections:`
      );
      for (const e of this._injections) console.log(`  - ${e.debugSelector}`);
    }
    return this._injections;
  }
  registerRule(e) {
    const t = ++this._lastRuleId,
      n = e(t);
    return (this._ruleId2desc[t] = n), n;
  }
  getRule(e) {
    return this._ruleId2desc[e];
  }
  getExternalGrammar(e, t) {
    if (this._includedGrammars[e]) return this._includedGrammars[e];
    if (this._grammarRepository) {
      const n = this._grammarRepository.lookup(e);
      if (n)
        return (
          (this._includedGrammars[e] = ue(n, t && t.$base)),
          this._includedGrammars[e]
        );
    }
  }
  tokenizeLine(e, t, n = 0) {
    const s = this._tokenize(e, t, !1, n);
    return {
      tokens: s.lineTokens.getResult(s.ruleStack, s.lineLength),
      ruleStack: s.ruleStack,
      stoppedEarly: s.stoppedEarly,
    };
  }
  tokenizeLine2(e, t, n = 0) {
    const s = this._tokenize(e, t, !0, n);
    return {
      tokens: s.lineTokens.getBinaryResult(s.ruleStack, s.lineLength),
      ruleStack: s.ruleStack,
      stoppedEarly: s.stoppedEarly,
    };
  }
  _tokenize(e, t, n, r) {
    let i;
    if (
      (-1 === this._rootId &&
        ((this._rootId = F.getCompiledRuleId(
          this._grammar.repository.$self,
          this,
          this._grammar.repository
        )),
        this.getInjections()),
      t && t !== de.NULL)
    )
      (i = !1), t.reset();
    else {
      i = !0;
      const e = this._basicScopeAttributesProvider.getDefaultAttributes(),
        n = this.themeProvider.getDefaults(),
        r = s.set(
          0,
          e.languageId,
          e.tokenType,
          null,
          n.fontStyle,
          n.foregroundId,
          n.backgroundId
        ),
        o = this.getRule(this._rootId).getName(null, null);
      let a;
      (a = o
        ? pe.createRootAndLookUpScopeName(o, r, this)
        : pe.createRoot("unknown", r)),
        (t = new de(null, this._rootId, -1, -1, !1, null, a, a));
    }
    e += "\n";
    const a = this.createOnigString(e),
      c = a.content.length,
      l = new me(n, e, this._tokenTypeMatchers, this.balancedBracketSelectors),
      h = ne(this, a, i, 0, t, l, !0, r);
    return (
      o(a),
      {
        lineLength: c,
        lineTokens: l,
        ruleStack: h.stack,
        stoppedEarly: h.stoppedEarly,
      }
    );
  }
}
function ue(e, t) {
  return (
    ((e = a(e)).repository = e.repository || {}),
    (e.repository.$self = {
      $vscodeTextmateLocation: e.$vscodeTextmateLocation,
      patterns: e.patterns,
      name: e.scopeName,
    }),
    (e.repository.$base = t || e.repository.$self),
    e
  );
}
class pe {
  constructor(e, t, n) {
    (this.parent = e), (this.scopePath = t), (this.tokenAttributes = n);
  }
  static fromExtension(e, t) {
    let n = e,
      s = e?.scopePath ?? null;
    for (const e of t)
      (s = U.push(s, e.scopeNames)),
        (n = new pe(n, s, e.encodedTokenAttributes));
    return n;
  }
  static createRoot(e, t) {
    return new pe(null, new U(null, e), t);
  }
  static createRootAndLookUpScopeName(e, t, n) {
    const s = n.getMetadataForScope(e),
      r = new U(null, e),
      i = n.themeProvider.themeMatch(r),
      o = pe.mergeAttributes(t, s, i);
    return new pe(null, r, o);
  }
  get scopeName() {
    return this.scopePath.scopeName;
  }
  toString() {
    return this.getScopeNames().join(" ");
  }
  equals(e) {
    return pe.equals(this, e);
  }
  static equals(e, t) {
    for (;;) {
      if (e === t) return !0;
      if (!e && !t) return !0;
      if (!e || !t) return !1;
      if (
        e.scopeName !== t.scopeName ||
        e.tokenAttributes !== t.tokenAttributes
      )
        return !1;
      (e = e.parent), (t = t.parent);
    }
  }
  static mergeAttributes(e, t, n) {
    let r = -1,
      i = 0,
      o = 0;
    return (
      null !== n &&
        ((r = n.fontStyle), (i = n.foregroundId), (o = n.backgroundId)),
      s.set(e, t.languageId, t.tokenType, null, r, i, o)
    );
  }
  pushAttributed(e, t) {
    if (null === e) return this;
    if (-1 === e.indexOf(" ")) return pe._pushAttributed(this, e, t);
    const n = e.split(/ /g);
    let s = this;
    for (const e of n) s = pe._pushAttributed(s, e, t);
    return s;
  }
  static _pushAttributed(e, t, n) {
    const s = n.getMetadataForScope(t),
      r = e.scopePath.push(t),
      i = n.themeProvider.themeMatch(r),
      o = pe.mergeAttributes(e.tokenAttributes, s, i);
    return new pe(e, r, o);
  }
  getScopeNames() {
    return this.scopePath.getSegments();
  }
  getExtensionIfDefined(e) {
    const t = [];
    let n = this;
    for (; n && n !== e; )
      t.push({
        encodedTokenAttributes: n.tokenAttributes,
        scopeNames: n.scopePath.getExtensionIfDefined(
          n.parent?.scopePath ?? null
        ),
      }),
        (n = n.parent);
    return n === e ? t.reverse() : void 0;
  }
}
class de {
  constructor(e, t, n, s, r, i, o, a) {
    (this.parent = e),
      (this.ruleId = t),
      (this.beginRuleCapturedEOL = r),
      (this.endRule = i),
      (this.nameScopesList = o),
      (this.contentNameScopesList = a),
      (this._stackElementBrand = void 0),
      (this.depth = this.parent ? this.parent.depth + 1 : 1),
      (this._enterPos = n),
      (this._anchorPos = s);
  }
  equals(e) {
    return null !== e && de._equals(this, e);
  }
  static _equals(e, t) {
    return (
      e === t ||
      (!!this._structuralEquals(e, t) &&
        pe.equals(e.contentNameScopesList, t.contentNameScopesList))
    );
  }
  static _structuralEquals(e, t) {
    for (;;) {
      if (e === t) return !0;
      if (!e && !t) return !0;
      if (!e || !t) return !1;
      if (
        e.depth !== t.depth ||
        e.ruleId !== t.ruleId ||
        e.endRule !== t.endRule
      )
        return !1;
      (e = e.parent), (t = t.parent);
    }
  }
  clone() {
    return this;
  }
  static _reset(e) {
    for (; e; ) (e._enterPos = -1), (e._anchorPos = -1), (e = e.parent);
  }
  reset() {
    de._reset(this);
  }
  pop() {
    return this.parent;
  }
  safePop() {
    return this.parent ? this.parent : this;
  }
  push(e, t, n, s, r, i, o) {
    return new de(this, e, t, n, s, r, i, o);
  }
  getEnterPos() {
    return this._enterPos;
  }
  getAnchorPos() {
    return this._anchorPos;
  }
  getRule(e) {
    return e.getRule(this.ruleId);
  }
  toString() {
    const e = [];
    return this._writeString(e, 0), "[" + e.join(",") + "]";
  }
  _writeString(e, t) {
    return (
      this.parent && (t = this.parent._writeString(e, t)),
      (e[t++] = `(${
        this.ruleId
      }, ${this.nameScopesList?.toString()}, ${this.contentNameScopesList?.toString()})`),
      t
    );
  }
  withContentNameScopesList(e) {
    return this.contentNameScopesList === e
      ? this
      : this.parent.push(
          this.ruleId,
          this._enterPos,
          this._anchorPos,
          this.beginRuleCapturedEOL,
          this.endRule,
          this.nameScopesList,
          e
        );
  }
  withEndRule(e) {
    return this.endRule === e
      ? this
      : new de(
          this.parent,
          this.ruleId,
          this._enterPos,
          this._anchorPos,
          this.beginRuleCapturedEOL,
          e,
          this.nameScopesList,
          this.contentNameScopesList
        );
  }
  hasSameRuleAs(e) {
    let t = this;
    for (; t && t._enterPos === e._enterPos; ) {
      if (t.ruleId === e.ruleId) return !0;
      t = t.parent;
    }
    return !1;
  }
  toStateStackFrame() {
    return {
      ruleId: this.ruleId,
      beginRuleCapturedEOL: this.beginRuleCapturedEOL,
      endRule: this.endRule,
      nameScopesList:
        this.nameScopesList?.getExtensionIfDefined(
          this.parent?.nameScopesList ?? null
        ) ?? [],
      contentNameScopesList:
        this.contentNameScopesList?.getExtensionIfDefined(
          this.nameScopesList
        ) ?? [],
    };
  }
  static pushFrame(e, t) {
    const n = pe.fromExtension(e?.nameScopesList ?? null, t.nameScopesList);
    return new de(
      e,
      t.ruleId,
      t.enterPos ?? -1,
      t.anchorPos ?? -1,
      t.beginRuleCapturedEOL,
      t.endRule,
      n,
      pe.fromExtension(n, t.contentNameScopesList)
    );
  }
}
de.NULL = new de(null, 0, 0, 0, !1, null, null, null);
class fe {
  constructor(e, t) {
    (this.allowAny = !1),
      (this.balancedBracketScopes = e.flatMap((e) =>
        "*" === e ? ((this.allowAny = !0), []) : r(e, ce).map((e) => e.matcher)
      )),
      (this.unbalancedBracketScopes = t.flatMap((e) =>
        r(e, ce).map((e) => e.matcher)
      ));
  }
  get matchesAlways() {
    return this.allowAny && 0 === this.unbalancedBracketScopes.length;
  }
  get matchesNever() {
    return 0 === this.balancedBracketScopes.length && !this.allowAny;
  }
  match(e) {
    for (const t of this.unbalancedBracketScopes) if (t(e)) return !1;
    for (const t of this.balancedBracketScopes) if (t(e)) return !0;
    return this.allowAny;
  }
}
class me {
  constructor(e, t, s, r) {
    (this.balancedBracketSelectors = r),
      (this._emitBinaryTokens = e),
      (this._tokenTypeOverrides = s),
      (this._lineText = n ? t : null),
      (this._tokens = []),
      (this._binaryTokens = []),
      (this._lastTokenEndIndex = 0);
  }
  produce(e, t) {
    this.produceFromScopes(e.contentNameScopesList, t);
  }
  produceFromScopes(e, t) {
    if (this._lastTokenEndIndex >= t) return;
    if (this._emitBinaryTokens) {
      let r = e?.tokenAttributes ?? 0,
        i = !1;
      if (
        (this.balancedBracketSelectors?.matchesAlways && (i = !0),
        this._tokenTypeOverrides.length > 0 ||
          (this.balancedBracketSelectors &&
            !this.balancedBracketSelectors.matchesAlways &&
            !this.balancedBracketSelectors.matchesNever))
      ) {
        const t = e?.getScopeNames() ?? [];
        for (const e of this._tokenTypeOverrides)
          e.matcher(t) && (r = s.set(r, 0, e.type, null, -1, 0, 0));
        this.balancedBracketSelectors &&
          (i = this.balancedBracketSelectors.match(t));
      }
      if (
        (i && (r = s.set(r, 0, 8, i, -1, 0, 0)),
        this._binaryTokens.length > 0 &&
          this._binaryTokens[this._binaryTokens.length - 1] === r)
      )
        return void (this._lastTokenEndIndex = t);
      if (n) {
        const n = e?.getScopeNames() ?? [];
        console.log(
          "  token: |" +
            this._lineText
              .substring(this._lastTokenEndIndex, t)
              .replace(/\n$/, "\\n") +
            "|"
        );
        for (let e = 0; e < n.length; e++) console.log("      * " + n[e]);
      }
      return (
        this._binaryTokens.push(this._lastTokenEndIndex),
        this._binaryTokens.push(r),
        void (this._lastTokenEndIndex = t)
      );
    }
    const r = e?.getScopeNames() ?? [];
    if (n) {
      console.log(
        "  token: |" +
          this._lineText
            .substring(this._lastTokenEndIndex, t)
            .replace(/\n$/, "\\n") +
          "|"
      );
      for (let e = 0; e < r.length; e++) console.log("      * " + r[e]);
    }
    this._tokens.push({
      startIndex: this._lastTokenEndIndex,
      endIndex: t,
      scopes: r,
    }),
      (this._lastTokenEndIndex = t);
  }
  getResult(e, t) {
    return (
      this._tokens.length > 0 &&
        this._tokens[this._tokens.length - 1].startIndex === t - 1 &&
        this._tokens.pop(),
      0 === this._tokens.length &&
        ((this._lastTokenEndIndex = -1),
        this.produce(e, t),
        (this._tokens[this._tokens.length - 1].startIndex = 0)),
      this._tokens
    );
  }
  getBinaryResult(e, t) {
    this._binaryTokens.length > 0 &&
      this._binaryTokens[this._binaryTokens.length - 2] === t - 1 &&
      (this._binaryTokens.pop(), this._binaryTokens.pop()),
      0 === this._binaryTokens.length &&
        ((this._lastTokenEndIndex = -1),
        this.produce(e, t),
        (this._binaryTokens[this._binaryTokens.length - 2] = 0));
    const n = new Uint32Array(this._binaryTokens.length);
    for (let e = 0, t = this._binaryTokens.length; e < t; e++)
      n[e] = this._binaryTokens[e];
    return n;
  }
}
function ge(e, t, n) {
  const s = e.length;
  let r = 0,
    i = 1,
    o = 0;
  function a(t) {
    if (null === n) r += t;
    else
      for (; t > 0; )
        10 === e.charCodeAt(r) ? (r++, i++, (o = 0)) : (r++, o++), t--;
  }
  function c(e) {
    null === n ? (r = e) : a(e - r);
  }
  function l() {
    for (; r < s; ) {
      let t = e.charCodeAt(r);
      if (32 !== t && 9 !== t && 13 !== t && 10 !== t) break;
      a(1);
    }
  }
  function h(t) {
    return e.substr(r, t.length) === t && (a(t.length), !0);
  }
  function u(t) {
    let n = e.indexOf(t, r);
    c(-1 !== n ? n + t.length : s);
  }
  function p(t) {
    let n = e.indexOf(t, r);
    if (-1 !== n) {
      let s = e.substring(r, n);
      return c(n + t.length), s;
    }
    {
      let t = e.substr(r);
      return c(s), t;
    }
  }
  s > 0 && 65279 === e.charCodeAt(0) && (r = 1);
  let d = 0,
    f = null,
    m = [],
    g = [],
    _ = null;
  function y(e, t) {
    m.push(d), g.push(f), (d = e), (f = t);
  }
  function C() {
    if (0 === m.length) return k("illegal state stack");
    (d = m.pop()), (f = g.pop());
  }
  function k(t) {
    throw new Error(
      "Near offset " + r + ": " + t + " ~~~" + e.substr(r, 50) + "~~~"
    );
  }
  const b = function () {
      if (null === _) return k("missing <key>");
      let e = {};
      null !== n && (e[n] = { filename: t, line: i, char: o }),
        (f[_] = e),
        (_ = null),
        y(1, e);
    },
    S = function () {
      if (null === _) return k("missing <key>");
      let e = [];
      (f[_] = e), (_ = null), y(2, e);
    },
    w = function () {
      let e = {};
      null !== n && (e[n] = { filename: t, line: i, char: o }),
        f.push(e),
        y(1, e);
    },
    A = function () {
      let e = [];
      f.push(e), y(2, e);
    };
  function P() {
    if (1 !== d) return k("unexpected </dict>");
    C();
  }
  function R() {
    return 1 === d || 2 !== d ? k("unexpected </array>") : void C();
  }
  function N(e) {
    if (1 === d) {
      if (null === _) return k("missing <key>");
      (f[_] = e), (_ = null);
    } else 2 === d ? f.push(e) : (f = e);
  }
  function I(e) {
    if (isNaN(e)) return k("cannot parse float");
    if (1 === d) {
      if (null === _) return k("missing <key>");
      (f[_] = e), (_ = null);
    } else 2 === d ? f.push(e) : (f = e);
  }
  function G(e) {
    if (isNaN(e)) return k("cannot parse integer");
    if (1 === d) {
      if (null === _) return k("missing <key>");
      (f[_] = e), (_ = null);
    } else 2 === d ? f.push(e) : (f = e);
  }
  function x(e) {
    if (1 === d) {
      if (null === _) return k("missing <key>");
      (f[_] = e), (_ = null);
    } else 2 === d ? f.push(e) : (f = e);
  }
  function v(e) {
    if (1 === d) {
      if (null === _) return k("missing <key>");
      (f[_] = e), (_ = null);
    } else 2 === d ? f.push(e) : (f = e);
  }
  function E(e) {
    if (1 === d) {
      if (null === _) return k("missing <key>");
      (f[_] = e), (_ = null);
    } else 2 === d ? f.push(e) : (f = e);
  }
  function L() {
    let e = p(">"),
      t = !1;
    return (
      47 === e.charCodeAt(e.length - 1) &&
        ((t = !0), (e = e.substring(0, e.length - 1))),
      { name: e.trim(), isClosed: t }
    );
  }
  function T(e) {
    if (e.isClosed) return "";
    let t = p("</");
    return (
      u(">"),
      t
        .replace(/&#([0-9]+);/g, function (e, t) {
          return String.fromCodePoint(parseInt(t, 10));
        })
        .replace(/&#x([0-9a-f]+);/g, function (e, t) {
          return String.fromCodePoint(parseInt(t, 16));
        })
        .replace(/&amp;|&lt;|&gt;|&quot;|&apos;/g, function (e) {
          switch (e) {
            case "&amp;":
              return "&";
            case "&lt;":
              return "<";
            case "&gt;":
              return ">";
            case "&quot;":
              return '"';
            case "&apos;":
              return "'";
          }
          return e;
        })
    );
  }
  for (; r < s && (l(), !(r >= s)); ) {
    const c = e.charCodeAt(r);
    if ((a(1), 60 !== c)) return k("expected <");
    if (r >= s) return k("unexpected end of input");
    const p = e.charCodeAt(r);
    if (63 === p) {
      a(1), u("?>");
      continue;
    }
    if (33 === p) {
      if ((a(1), h("--"))) {
        u("--\x3e");
        continue;
      }
      u(">");
      continue;
    }
    if (47 === p) {
      if ((a(1), l(), h("plist"))) {
        u(">");
        continue;
      }
      if (h("dict")) {
        u(">"), P();
        continue;
      }
      if (h("array")) {
        u(">"), R();
        continue;
      }
      return k("unexpected closed tag");
    }
    let m = L();
    switch (m.name) {
      case "dict":
        1 === d
          ? b()
          : 2 === d
          ? w()
          : ((f = {}),
            null !== n && (f[n] = { filename: t, line: i, char: o }),
            y(1, f)),
          m.isClosed && P();
        continue;
      case "array":
        1 === d ? S() : 2 === d ? A() : ((f = []), y(2, f)), m.isClosed && R();
        continue;
      case "key":
        ($ = T(m)),
          1 !== d
            ? k("unexpected <key>")
            : null !== _
            ? k("too many <key>")
            : (_ = $);
        continue;
      case "string":
        N(T(m));
        continue;
      case "real":
        I(parseFloat(T(m)));
        continue;
      case "integer":
        G(parseInt(T(m), 10));
        continue;
      case "date":
        x(new Date(T(m)));
        continue;
      case "data":
        v(T(m));
        continue;
      case "true":
        T(m), E(!0);
        continue;
      case "false":
        T(m), E(!1);
        continue;
    }
    if (!/^plist/.test(m.name)) return k("unexpected opened tag " + m.name);
  }
  var $;
  return f;
}
function _e(e, t) {
  throw new Error(
    "Near offset " +
      e.pos +
      ": " +
      t +
      " ~~~" +
      e.source.substr(e.pos, 50) +
      "~~~"
  );
}
class ye {
  constructor(e) {
    (this.source = e),
      (this.pos = 0),
      (this.len = e.length),
      (this.line = 1),
      (this.char = 0);
  }
}
class Ce {
  constructor() {
    (this.value = null),
      (this.type = 0),
      (this.offset = -1),
      (this.len = -1),
      (this.line = -1),
      (this.char = -1);
  }
  toLocation(e) {
    return { filename: e, line: this.line, char: this.char };
  }
}
function ke(e, t) {
  (t.value = null),
    (t.type = 0),
    (t.offset = -1),
    (t.len = -1),
    (t.line = -1),
    (t.char = -1);
  let n,
    s = e.source,
    r = e.pos,
    i = e.len,
    o = e.line,
    a = e.char;
  for (;;) {
    if (r >= i) return !1;
    if (((n = s.charCodeAt(r)), 32 !== n && 9 !== n && 13 !== n)) {
      if (10 !== n) break;
      r++, o++, (a = 0);
    } else r++, a++;
  }
  if (((t.offset = r), (t.line = o), (t.char = a), 34 === n)) {
    for (t.type = 1, r++, a++; ; ) {
      if (r >= i) return !1;
      if (((n = s.charCodeAt(r)), r++, a++, 92 !== n)) {
        if (34 === n) break;
      } else r++, a++;
    }
    t.value = s
      .substring(t.offset + 1, r - 1)
      .replace(/\\u([0-9A-Fa-f]{4})/g, (e, t) =>
        String.fromCodePoint(parseInt(t, 16))
      )
      .replace(/\\(.)/g, (t, n) => {
        switch (n) {
          case '"':
            return '"';
          case "\\":
            return "\\";
          case "/":
            return "/";
          case "b":
            return "\b";
          case "f":
            return "\f";
          case "n":
            return "\n";
          case "r":
            return "\r";
          case "t":
            return "\t";
          default:
            _e(e, "invalid escape sequence");
        }
        throw new Error("unreachable");
      });
  } else if (91 === n) (t.type = 2), r++, a++;
  else if (123 === n) (t.type = 3), r++, a++;
  else if (93 === n) (t.type = 4), r++, a++;
  else if (125 === n) (t.type = 5), r++, a++;
  else if (58 === n) (t.type = 6), r++, a++;
  else if (44 === n) (t.type = 7), r++, a++;
  else if (110 === n) {
    if (((t.type = 8), r++, a++, (n = s.charCodeAt(r)), 117 !== n)) return !1;
    if ((r++, a++, (n = s.charCodeAt(r)), 108 !== n)) return !1;
    if ((r++, a++, (n = s.charCodeAt(r)), 108 !== n)) return !1;
    r++, a++;
  } else if (116 === n) {
    if (((t.type = 9), r++, a++, (n = s.charCodeAt(r)), 114 !== n)) return !1;
    if ((r++, a++, (n = s.charCodeAt(r)), 117 !== n)) return !1;
    if ((r++, a++, (n = s.charCodeAt(r)), 101 !== n)) return !1;
    r++, a++;
  } else if (102 === n) {
    if (((t.type = 10), r++, a++, (n = s.charCodeAt(r)), 97 !== n)) return !1;
    if ((r++, a++, (n = s.charCodeAt(r)), 108 !== n)) return !1;
    if ((r++, a++, (n = s.charCodeAt(r)), 115 !== n)) return !1;
    if ((r++, a++, (n = s.charCodeAt(r)), 101 !== n)) return !1;
    r++, a++;
  } else
    for (t.type = 11; ; ) {
      if (r >= i) return !1;
      if (
        ((n = s.charCodeAt(r)),
        !(
          46 === n ||
          (n >= 48 && n <= 57) ||
          101 === n ||
          69 === n ||
          45 === n ||
          43 === n
        ))
      )
        break;
      r++, a++;
    }
  return (
    (t.len = r - t.offset),
    null === t.value && (t.value = s.substr(t.offset, t.len)),
    (e.pos = r),
    (e.line = o),
    (e.char = a),
    !0
  );
}
class be {
  constructor(e, t) {
    (this._onigLibPromise = t),
      (this._grammars = new Map()),
      (this._rawGrammars = new Map()),
      (this._injectionGrammars = new Map()),
      (this._theme = e);
  }
  dispose() {
    for (const e of this._grammars.values()) e.dispose();
  }
  setTheme(e) {
    this._theme = e;
  }
  getColorMap() {
    return this._theme.getColorMap();
  }
  addGrammar(e, t) {
    this._rawGrammars.set(e.scopeName, e),
      t && this._injectionGrammars.set(e.scopeName, t);
  }
  lookup(e) {
    return this._rawGrammars.get(e);
  }
  injections(e) {
    return this._injectionGrammars.get(e);
  }
  getDefaults() {
    return this._theme.getDefaults();
  }
  themeMatch(e) {
    return this._theme.match(e);
  }
  async grammarForScopeName(e, t, n, s, r) {
    if (!this._grammars.has(e)) {
      let i = this._rawGrammars.get(e);
      if (!i) return null;
      this._grammars.set(
        e,
        (function (e, t, n, s, r, i, o, a) {
          return new he(e, t, n, s, r, i, o, a);
        })(e, i, t, n, s, r, this, await this._onigLibPromise)
      );
    }
    return this._grammars.get(e);
  }
}
function Se(e, t) {
  let n = 0;
  const s = [];
  let r = e,
    i = t;
  for (; r !== i; )
    r && (!i || r.depth >= i.depth)
      ? (n++, (r = r.parent))
      : (s.push(i.toStateStackFrame()), (i = i.parent));
  return { pops: n, newFrames: s.reverse() };
}
function we(e, t) {
  let n = e;
  for (let e = 0; e < t.pops; e++) n = n.parent;
  for (const e of t.newFrames) n = de.pushFrame(n, e);
  return n;
}
class Ae {
  constructor(e) {
    (this._options = e),
      (this._syncRegistry = new be(
        z.createFromRawTheme(e.theme, e.colorMap),
        e.onigLib
      )),
      (this._ensureGrammarCache = new Map());
  }
  dispose() {
    this._syncRegistry.dispose();
  }
  setTheme(e, t) {
    this._syncRegistry.setTheme(z.createFromRawTheme(e, t));
  }
  getColorMap() {
    return this._syncRegistry.getColorMap();
  }
  loadGrammarWithEmbeddedLanguages(e, t, n) {
    return this.loadGrammarWithConfiguration(e, t, { embeddedLanguages: n });
  }
  loadGrammarWithConfiguration(e, t, n) {
    return this._loadGrammar(
      e,
      t,
      n.embeddedLanguages,
      n.tokenTypes,
      new fe(
        n.balancedBracketSelectors || [],
        n.unbalancedBracketSelectors || []
      )
    );
  }
  loadGrammar(e) {
    return this._loadGrammar(e, 0, null, null, null);
  }
  async _loadGrammar(e, t, n, s, r) {
    const i = new b(this._syncRegistry, e);
    for (; i.Q.length > 0; )
      await Promise.all(i.Q.map((e) => this._loadSingleGrammar(e.scopeName))),
        i.processQueue();
    return this._grammarForScopeName(e, t, n, s, r);
  }
  async _loadSingleGrammar(e) {
    return (
      this._ensureGrammarCache.has(e) ||
        this._ensureGrammarCache.set(e, this._doLoadSingleGrammar(e)),
      this._ensureGrammarCache.get(e)
    );
  }
  async _doLoadSingleGrammar(e) {
    const t = await this._options.loadGrammar(e);
    if (t) {
      const n =
        "function" == typeof this._options.getInjections
          ? this._options.getInjections(e)
          : void 0;
      this._syncRegistry.addGrammar(t, n);
    }
  }
  async addGrammar(e, t = [], n = 0, s = null) {
    return (
      this._syncRegistry.addGrammar(e, t),
      await this._grammarForScopeName(e.scopeName, n, s)
    );
  }
  _grammarForScopeName(e, t = 0, n = null, s = null, r = null) {
    return this._syncRegistry.grammarForScopeName(e, t, n, s, r);
  }
}
const Pe = de.NULL,
  Re = function (e, t = null) {
    return null !== t && /\.json$/.test(t)
      ? ((s = e),
        (r = t),
        n
          ? (function (e, t, n) {
              let s = new ye(e),
                r = new Ce(),
                i = 0,
                o = null,
                a = [],
                c = [];
              function l() {
                a.push(i), c.push(o);
              }
              function h() {
                (i = a.pop()), (o = c.pop());
              }
              function u(e) {
                _e(s, e);
              }
              for (; ke(s, r); ) {
                if (0 === i) {
                  if (
                    (null !== o && u("too many constructs in root"),
                    3 === r.type)
                  ) {
                    (o = {}),
                      (o.$vscodeTextmateLocation = r.toLocation(t)),
                      l(),
                      (i = 1);
                    continue;
                  }
                  if (2 === r.type) {
                    (o = []), l(), (i = 4);
                    continue;
                  }
                  u("unexpected token in root");
                }
                if (2 === i) {
                  if (5 === r.type) {
                    h();
                    continue;
                  }
                  if (7 === r.type) {
                    i = 3;
                    continue;
                  }
                  u("expected , or }");
                }
                if (1 === i || 3 === i) {
                  if (1 === i && 5 === r.type) {
                    h();
                    continue;
                  }
                  if (1 === r.type) {
                    let e = r.value;
                    if (
                      ((ke(s, r) && 6 === r.type) || u("expected colon"),
                      ke(s, r) || u("expected value"),
                      (i = 2),
                      1 === r.type)
                    ) {
                      o[e] = r.value;
                      continue;
                    }
                    if (8 === r.type) {
                      o[e] = null;
                      continue;
                    }
                    if (9 === r.type) {
                      o[e] = !0;
                      continue;
                    }
                    if (10 === r.type) {
                      o[e] = !1;
                      continue;
                    }
                    if (11 === r.type) {
                      o[e] = parseFloat(r.value);
                      continue;
                    }
                    if (2 === r.type) {
                      let t = [];
                      (o[e] = t), l(), (i = 4), (o = t);
                      continue;
                    }
                    if (3 === r.type) {
                      let n = {};
                      (n.$vscodeTextmateLocation = r.toLocation(t)),
                        (o[e] = n),
                        l(),
                        (i = 1),
                        (o = n);
                      continue;
                    }
                  }
                  u("unexpected token in dict");
                }
                if (5 === i) {
                  if (4 === r.type) {
                    h();
                    continue;
                  }
                  if (7 === r.type) {
                    i = 6;
                    continue;
                  }
                  u("expected , or ]");
                }
                if (4 === i || 6 === i) {
                  if (4 === i && 4 === r.type) {
                    h();
                    continue;
                  }
                  if (((i = 5), 1 === r.type)) {
                    o.push(r.value);
                    continue;
                  }
                  if (8 === r.type) {
                    o.push(null);
                    continue;
                  }
                  if (9 === r.type) {
                    o.push(!0);
                    continue;
                  }
                  if (10 === r.type) {
                    o.push(!1);
                    continue;
                  }
                  if (11 === r.type) {
                    o.push(parseFloat(r.value));
                    continue;
                  }
                  if (2 === r.type) {
                    let e = [];
                    o.push(e), l(), (i = 4), (o = e);
                    continue;
                  }
                  if (3 === r.type) {
                    let e = {};
                    (e.$vscodeTextmateLocation = r.toLocation(t)),
                      o.push(e),
                      l(),
                      (i = 1),
                      (o = e);
                    continue;
                  }
                  u("unexpected token in array");
                }
                u("unknown state");
              }
              return 0 !== c.length && u("unclosed constructs"), o;
            })(s, r)
          : JSON.parse(s))
      : (function (e, t) {
          return n
            ? (function (e, t, n) {
                return ge(e, t, "$vscodeTextmateLocation");
              })(e, t)
            : (function (e) {
                return ge(e, null, null);
              })(e);
        })(e, t);
    var s, r;
  };
t._X;
  var Ie = t.Bz;
  t.ot;
  t.u;
  t.jG;
  t.Pn;

var Onig = (() => {
  typeof document !== "undefined" && document.currentScript
      ? document.currentScript.src
      : undefined;

  return function (Onig) {
    Onig = Onig || {};

    var Module = typeof Onig != "undefined" ? Onig : {};
    var readyPromiseResolve, readyPromiseReject;
    Module["ready"] = new Promise(function (resolve, reject) {
      readyPromiseResolve = resolve;
      readyPromiseReject = reject;
    });
    var moduleOverrides = Object.assign({}, Module);
    var ENVIRONMENT_IS_WORKER = false;
    var scriptDirectory = "";
    function locateFile(path) {
      if (Module["locateFile"]) {
        return Module["locateFile"](path, scriptDirectory);
      }
      return scriptDirectory + path;
    }
    var readBinary;
    {
      readBinary = function readBinary(f) {
        let data;
        if (typeof readbuffer == "function") {
          return new Uint8Array(readbuffer(f));
        }
        data = read(f, "binary");
        assert(typeof data == "object");
        return data;
      };
      if (typeof scriptArgs != "undefined") {
        scriptArgs;
      }
      if (typeof onig_print != "undefined") {
        if (typeof console == "undefined") console = {};
        console.log = onig_print;
        console.warn = console.error =
          typeof printErr != "undefined" ? printErr : onig_print;
      }
    }
    var out = Module["print"] || console.log.bind(console);
    var err = Module["printErr"] || console.warn.bind(console);
    Object.assign(Module, moduleOverrides);
    moduleOverrides = null;
    if (Module["arguments"]) Module["arguments"];
    if (Module["thisProgram"]) Module["thisProgram"];
    if (Module["quit"]) Module["quit"];
    var wasmBinary;
    if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];
    Module["noExitRuntime"] || true;
    if (typeof WebAssembly != "object") {
      abort("no native wasm support detected");
    }
    var wasmMemory;
    var ABORT = false;
    function assert(condition, text) {
      if (!condition) {
        abort(text);
      }
    }
    var UTF8Decoder =
      typeof TextDecoder != "undefined" ? new TextDecoder("utf8") : undefined;
    function UTF8ArrayToString(heapOrArray, idx, maxBytesToRead) {
      var endIdx = idx + maxBytesToRead;
      var endPtr = idx;
      while (heapOrArray[endPtr] && !(endPtr >= endIdx)) ++endPtr;
      if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
        return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr));
      }
      var str = "";
      while (idx < endPtr) {
        var u0 = heapOrArray[idx++];
        if (!(u0 & 128)) {
          str += String.fromCharCode(u0);
          continue;
        }
        var u1 = heapOrArray[idx++] & 63;
        if ((u0 & 224) == 192) {
          str += String.fromCharCode(((u0 & 31) << 6) | u1);
          continue;
        }
        var u2 = heapOrArray[idx++] & 63;
        if ((u0 & 240) == 224) {
          u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
        } else {
          u0 =
            ((u0 & 7) << 18) |
            (u1 << 12) |
            (u2 << 6) |
            (heapOrArray[idx++] & 63);
        }
        if (u0 < 65536) {
          str += String.fromCharCode(u0);
        } else {
          var ch = u0 - 65536;
          str += String.fromCharCode(55296 | (ch >> 10), 56320 | (ch & 1023));
        }
      }
      return str;
    }
    function UTF8ToString(ptr, maxBytesToRead) {
      return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : "";
    }
    var buffer,
      HEAPU8,
      HEAPU32;
    function updateGlobalBufferAndViews(buf) {
      buffer = buf;
      Module["HEAP8"] = new Int8Array(buf);
      Module["HEAP16"] = new Int16Array(buf);
      Module["HEAP32"] = new Int32Array(buf);
      Module["HEAPU8"] = HEAPU8 = new Uint8Array(buf);
      Module["HEAPU16"] = new Uint16Array(buf);
      Module["HEAPU32"] = HEAPU32 = new Uint32Array(buf);
      Module["HEAPF32"] = new Float32Array(buf);
      Module["HEAPF64"] = new Float64Array(buf);
    }
    Module["INITIAL_MEMORY"] || 16777216;
    var __ATPRERUN__ = [];
    var __ATINIT__ = [];
    var __ATPOSTRUN__ = [];
    function preRun() {
      if (Module["preRun"]) {
        if (typeof Module["preRun"] == "function")
          Module["preRun"] = [Module["preRun"]];
        while (Module["preRun"].length) {
          addOnPreRun(Module["preRun"].shift());
        }
      }
      callRuntimeCallbacks(__ATPRERUN__);
    }
    function initRuntime() {
      callRuntimeCallbacks(__ATINIT__);
    }
    function postRun() {
      if (Module["postRun"]) {
        if (typeof Module["postRun"] == "function")
          Module["postRun"] = [Module["postRun"]];
        while (Module["postRun"].length) {
          addOnPostRun(Module["postRun"].shift());
        }
      }
      callRuntimeCallbacks(__ATPOSTRUN__);
    }
    function addOnPreRun(cb) {
      __ATPRERUN__.unshift(cb);
    }
    function addOnInit(cb) {
      __ATINIT__.unshift(cb);
    }
    function addOnPostRun(cb) {
      __ATPOSTRUN__.unshift(cb);
    }
    var runDependencies = 0;
    var dependenciesFulfilled = null;
    function addRunDependency(id) {
      runDependencies++;
      if (Module["monitorRunDependencies"]) {
        Module["monitorRunDependencies"](runDependencies);
      }
    }
    function removeRunDependency(id) {
      runDependencies--;
      if (Module["monitorRunDependencies"]) {
        Module["monitorRunDependencies"](runDependencies);
      }
      if (runDependencies == 0) {
        if (dependenciesFulfilled) {
          var callback = dependenciesFulfilled;
          dependenciesFulfilled = null;
          callback();
        }
      }
    }
    function abort(what) {
      {
        if (Module["onAbort"]) {
          Module["onAbort"](what);
        }
      }
      what = "Aborted(" + what + ")";
      err(what);
      ABORT = true;
      what += ". Build with -sASSERTIONS for more info.";
      var e = new WebAssembly.RuntimeError(what);
      readyPromiseReject(e);
      throw e;
    }
    var dataURIPrefix = "data:application/octet-stream;base64,";
    function isDataURI(filename) {
      return filename.startsWith(dataURIPrefix);
    }
    var wasmBinaryFile;
    wasmBinaryFile = "onig.wasm";
    if (!isDataURI(wasmBinaryFile)) {
      wasmBinaryFile = locateFile(wasmBinaryFile);
    }
    function getBinary(file) {
      try {
        if (file == wasmBinaryFile && wasmBinary) {
          return new Uint8Array(wasmBinary);
        }
        if (readBinary) {
          return readBinary(file);
        }
        throw "both async and sync fetching of the wasm failed";
      } catch (err) {
        abort(err);
      }
    }
    function getBinaryPromise() {
      if (!wasmBinary && (ENVIRONMENT_IS_WORKER)) {
        if (typeof fetch == "function") {
          return fetch(wasmBinaryFile, { credentials: "same-origin" })
            .then(function (response) {
              if (!response["ok"]) {
                throw (
                  "failed to load wasm binary file at '" + wasmBinaryFile + "'"
                );
              }
              return response["arrayBuffer"]();
            })
            .catch(function () {
              return getBinary(wasmBinaryFile);
            });
        }
      }
      return Promise.resolve().then(function () {
        return getBinary(wasmBinaryFile);
      });
    }
    function createWasm() {
      var info = { env: asmLibraryArg, wasi_snapshot_preview1: asmLibraryArg };
      function receiveInstance(instance, module) {
        var exports = instance.exports;
        Module["asm"] = exports;
        wasmMemory = Module["asm"]["memory"];
        updateGlobalBufferAndViews(wasmMemory.buffer);
        Module["asm"]["__indirect_function_table"];
        addOnInit(Module["asm"]["__wasm_call_ctors"]);
        removeRunDependency();
      }
      addRunDependency();
      function receiveInstantiationResult(result) {
        receiveInstance(result["instance"]);
      }
      function instantiateArrayBuffer(receiver) {
        return getBinaryPromise()
          .then(function (binary) {
            return WebAssembly.instantiate(binary, info);
          })
          .then(function (instance) {
            return instance;
          })
          .then(receiver, function (reason) {
            err("failed to asynchronously prepare wasm: " + reason);
            abort(reason);
          });
      }
      function instantiateAsync() {
        if (
          !wasmBinary &&
          typeof WebAssembly.instantiateStreaming == "function" &&
          !isDataURI(wasmBinaryFile) &&
          typeof fetch == "function"
        ) {
          return fetch(wasmBinaryFile, { credentials: "same-origin" }).then(
            function (response) {
              var result = WebAssembly.instantiateStreaming(response, info);
              return result.then(receiveInstantiationResult, function (reason) {
                err("wasm streaming compile failed: " + reason);
                err("falling back to ArrayBuffer instantiation");
                return instantiateArrayBuffer(receiveInstantiationResult);
              });
            }
          );
        } else {
          return instantiateArrayBuffer(receiveInstantiationResult);
        }
      }
      if (Module["instantiateWasm"]) {
        try {
          var exports = Module["instantiateWasm"](info, receiveInstance);
          return exports;
        } catch (e) {
          err("Module.instantiateWasm callback failed with error: " + e);
          readyPromiseReject(e);
        }
      }
      instantiateAsync().catch(readyPromiseReject);
      return {};
    }
    function callRuntimeCallbacks(callbacks) {
      while (callbacks.length > 0) {
        callbacks.shift()(Module);
      }
    }
    var _emscripten_get_now;
    if (typeof dateNow != "undefined") {
      _emscripten_get_now = dateNow;
    } else _emscripten_get_now = () => performance.now();
    function _emscripten_memcpy_big(dest, src, num) {
      HEAPU8.copyWithin(dest, src, src + num);
    }
    function getHeapMax() {
      return 2147483648;
    }
    function emscripten_realloc_buffer(size) {
      try {
        wasmMemory.grow((size - buffer.byteLength + 65535) >>> 16);
        updateGlobalBufferAndViews(wasmMemory.buffer);
        return 1;
      } catch (e) {}
    }
    function _emscripten_resize_heap(requestedSize) {
      var oldSize = HEAPU8.length;
      requestedSize = requestedSize >>> 0;
      var maxHeapSize = getHeapMax();
      if (requestedSize > maxHeapSize) {
        return false;
      }
      let alignUp = (x, multiple) =>
        x + ((multiple - (x % multiple)) % multiple);
      for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
        var overGrownHeapSize = oldSize * (1 + 0.2 / cutDown);
        overGrownHeapSize = Math.min(
          overGrownHeapSize,
          requestedSize + 100663296
        );
        var newSize = Math.min(
          maxHeapSize,
          alignUp(Math.max(requestedSize, overGrownHeapSize), 65536)
        );
        var replacement = emscripten_realloc_buffer(newSize);
        if (replacement) {
          return true;
        }
      }
      return false;
    }
    var printCharBuffers = [null, [], []];
    function printChar(stream, curr) {
      var buffer = printCharBuffers[stream];
      if (curr === 0 || curr === 10) {
        (stream === 1 ? out : err)(UTF8ArrayToString(buffer, 0));
        buffer.length = 0;
      } else {
        buffer.push(curr);
      }
    }
    function _fd_write(fd, iov, iovcnt, pnum) {
      var num = 0;
      for (var i = 0; i < iovcnt; i++) {
        var ptr = HEAPU32[iov >> 2];
        var len = HEAPU32[(iov + 4) >> 2];
        iov += 8;
        for (var j = 0; j < len; j++) {
          printChar(fd, HEAPU8[ptr + j]);
        }
        num += len;
      }
      HEAPU32[pnum >> 2] = num;
      return 0;
    }
    var asmLibraryArg = {
      emscripten_get_now: _emscripten_get_now,
      emscripten_memcpy_big: _emscripten_memcpy_big,
      emscripten_resize_heap: _emscripten_resize_heap,
      fd_write: _fd_write,
    };
    createWasm();
    (Module["___wasm_call_ctors"] = function () {
      return (Module["___wasm_call_ctors"] =
        Module["asm"]["__wasm_call_ctors"]).apply(null, arguments);
    });
    (Module["___errno_location"] = function () {
      return (Module["___errno_location"] =
        Module["asm"]["__errno_location"]).apply(null, arguments);
    });
    (Module["_omalloc"] = function () {
      return (Module["_omalloc"] = Module["asm"]["omalloc"]).apply(
        null,
        arguments
      );
    });
    (Module["_ofree"] = function () {
      return (Module["_ofree"] = Module["asm"]["ofree"]).apply(
        null,
        arguments
      );
    });
    (Module["_getLastOnigError"] = function () {
      return (Module["_getLastOnigError"] =
        Module["asm"]["getLastOnigError"]).apply(null, arguments);
    });
    (Module["_createOnigScanner"] = function () {
      return (Module["_createOnigScanner"] =
        Module["asm"]["createOnigScanner"]).apply(null, arguments);
    });
    (Module["_freeOnigScanner"] = function () {
      return (Module["_freeOnigScanner"] =
        Module["asm"]["freeOnigScanner"]).apply(null, arguments);
    });
    (Module["_findNextOnigScannerMatch"] =
      function () {
        return (Module[
          "_findNextOnigScannerMatch"
        ] =
          Module["asm"]["findNextOnigScannerMatch"]).apply(null, arguments);
      });
    (Module["_findNextOnigScannerMatchDbg"] =
      function () {
        return (Module[
          "_findNextOnigScannerMatchDbg"
        ] =
          Module["asm"]["findNextOnigScannerMatchDbg"]).apply(null, arguments);
      });
    (Module["stackSave"] = function () {
      return (Module["stackSave"] =
        Module["asm"]["stackSave"]).apply(null, arguments);
    });
    (Module["stackRestore"] = function () {
      return (Module["stackRestore"] =
        Module["asm"]["stackRestore"]).apply(null, arguments);
    });
    (Module["stackAlloc"] = function () {
      return (Module["stackAlloc"] =
        Module["asm"]["stackAlloc"]).apply(null, arguments);
    });
    (Module["dynCall_jiji"] = function () {
      return (Module["dynCall_jiji"] =
        Module["asm"]["dynCall_jiji"]).apply(null, arguments);
    });
    Module["UTF8ToString"] = UTF8ToString;
    var calledRun;
    dependenciesFulfilled = function runCaller() {
      if (!calledRun) run();
      if (!calledRun) dependenciesFulfilled = runCaller;
    };
    function run(args) {
      if (runDependencies > 0) {
        return;
      }
      preRun();
      if (runDependencies > 0) {
        return;
      }
      function doRun() {
        if (calledRun) return;
        calledRun = true;
        Module["calledRun"] = true;
        if (ABORT) return;
        initRuntime();
        readyPromiseResolve(Module);
        if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]();
        postRun();
      }
      if (Module["setStatus"]) {
        Module["setStatus"]("Running...");
        setTimeout(function () {
          setTimeout(function () {
            Module["setStatus"]("");
          }, 1);
          doRun();
        }, 1);
      } else {
        doRun();
      }
    }
    if (Module["preInit"]) {
      if (typeof Module["preInit"] == "function")
        Module["preInit"] = [Module["preInit"]];
      while (Module["preInit"].length > 0) {
        Module["preInit"].pop()();
      }
    }
    run();

    return Onig.ready;
  };
})();

/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
let onigBinding = null;
let defaultDebugCall = false;
function throwLastOnigError(onigBinding) {
    throw new Error(onigBinding.UTF8ToString(onigBinding._getLastOnigError()));
}
class UtfString {
    static _utf8ByteLength(str) {
        let result = 0;
        for (let i = 0, len = str.length; i < len; i++) {
            const charCode = str.charCodeAt(i);
            let codepoint = charCode;
            let wasSurrogatePair = false;
            if (charCode >= 0xd800 && charCode <= 0xdbff) {
                // Hit a high surrogate, try to look for a matching low surrogate
                if (i + 1 < len) {
                    const nextCharCode = str.charCodeAt(i + 1);
                    if (nextCharCode >= 0xdc00 && nextCharCode <= 0xdfff) {
                        // Found the matching low surrogate
                        codepoint =
                            (((charCode - 0xd800) << 10) + 0x10000) | (nextCharCode - 0xdc00);
                        wasSurrogatePair = true;
                    }
                }
            }
            if (codepoint <= 0x7f) {
                result += 1;
            }
            else if (codepoint <= 0x7ff) {
                result += 2;
            }
            else if (codepoint <= 0xffff) {
                result += 3;
            }
            else {
                result += 4;
            }
            if (wasSurrogatePair) {
                i++;
            }
        }
        return result;
    }
    constructor(str) {
        const utf16Length = str.length;
        const utf8Length = UtfString._utf8ByteLength(str);
        const computeIndicesMapping = utf8Length !== utf16Length;
        const utf16OffsetToUtf8 = computeIndicesMapping
            ? new Uint32Array(utf16Length + 1)
            : null;
        if (computeIndicesMapping) {
            utf16OffsetToUtf8[utf16Length] = utf8Length;
        }
        const utf8OffsetToUtf16 = computeIndicesMapping
            ? new Uint32Array(utf8Length + 1)
            : null;
        if (computeIndicesMapping) {
            utf8OffsetToUtf16[utf8Length] = utf16Length;
        }
        const utf8Value = new Uint8Array(utf8Length);
        let i8 = 0;
        for (let i16 = 0; i16 < utf16Length; i16++) {
            const charCode = str.charCodeAt(i16);
            let codePoint = charCode;
            let wasSurrogatePair = false;
            if (charCode >= 0xd800 && charCode <= 0xdbff) {
                // Hit a high surrogate, try to look for a matching low surrogate
                if (i16 + 1 < utf16Length) {
                    const nextCharCode = str.charCodeAt(i16 + 1);
                    if (nextCharCode >= 0xdc00 && nextCharCode <= 0xdfff) {
                        // Found the matching low surrogate
                        codePoint =
                            (((charCode - 0xd800) << 10) + 0x10000) | (nextCharCode - 0xdc00);
                        wasSurrogatePair = true;
                    }
                }
            }
            if (computeIndicesMapping) {
                utf16OffsetToUtf8[i16] = i8;
                if (wasSurrogatePair) {
                    utf16OffsetToUtf8[i16 + 1] = i8;
                }
                if (codePoint <= 0x7f) {
                    utf8OffsetToUtf16[i8 + 0] = i16;
                }
                else if (codePoint <= 0x7ff) {
                    utf8OffsetToUtf16[i8 + 0] = i16;
                    utf8OffsetToUtf16[i8 + 1] = i16;
                }
                else if (codePoint <= 0xffff) {
                    utf8OffsetToUtf16[i8 + 0] = i16;
                    utf8OffsetToUtf16[i8 + 1] = i16;
                    utf8OffsetToUtf16[i8 + 2] = i16;
                }
                else {
                    utf8OffsetToUtf16[i8 + 0] = i16;
                    utf8OffsetToUtf16[i8 + 1] = i16;
                    utf8OffsetToUtf16[i8 + 2] = i16;
                    utf8OffsetToUtf16[i8 + 3] = i16;
                }
            }
            if (codePoint <= 0x7f) {
                utf8Value[i8++] = codePoint;
            }
            else if (codePoint <= 0x7ff) {
                utf8Value[i8++] =
                    0b11000000 | ((codePoint & 0b00000000000000000000011111000000) >>> 6);
                utf8Value[i8++] =
                    0b10000000 | ((codePoint & 0b00000000000000000000000000111111) >>> 0);
            }
            else if (codePoint <= 0xffff) {
                utf8Value[i8++] =
                    0b11100000 |
                        ((codePoint & 0b00000000000000001111000000000000) >>> 12);
                utf8Value[i8++] =
                    0b10000000 | ((codePoint & 0b00000000000000000000111111000000) >>> 6);
                utf8Value[i8++] =
                    0b10000000 | ((codePoint & 0b00000000000000000000000000111111) >>> 0);
            }
            else {
                utf8Value[i8++] =
                    0b11110000 |
                        ((codePoint & 0b00000000000111000000000000000000) >>> 18);
                utf8Value[i8++] =
                    0b10000000 |
                        ((codePoint & 0b00000000000000111111000000000000) >>> 12);
                utf8Value[i8++] =
                    0b10000000 | ((codePoint & 0b00000000000000000000111111000000) >>> 6);
                utf8Value[i8++] =
                    0b10000000 | ((codePoint & 0b00000000000000000000000000111111) >>> 0);
            }
            if (wasSurrogatePair) {
                i16++;
            }
        }
        this.utf16Length = utf16Length;
        this.utf8Length = utf8Length;
        this.utf16Value = str;
        this.utf8Value = utf8Value;
        this.utf16OffsetToUtf8 = utf16OffsetToUtf8;
        this.utf8OffsetToUtf16 = utf8OffsetToUtf16;
    }
    createString(onigBinding) {
        const result = onigBinding._omalloc(this.utf8Length);
        onigBinding.HEAPU8.set(this.utf8Value, result);
        return result;
    }
}
class OnigString {
    constructor(str) {
        this.id = ++OnigString.LAST_ID;
        if (!onigBinding) {
            throw new Error(`Must invoke loadWASM first.`);
        }
        this._onigBinding = onigBinding;
        this.content = str;
        const utfString = new UtfString(str);
        this.utf16Length = utfString.utf16Length;
        this.utf8Length = utfString.utf8Length;
        this.utf16OffsetToUtf8 = utfString.utf16OffsetToUtf8;
        this.utf8OffsetToUtf16 = utfString.utf8OffsetToUtf16;
        if (this.utf8Length < 10000 && !OnigString._sharedPtrInUse) {
            if (!OnigString._sharedPtr) {
                OnigString._sharedPtr = onigBinding._omalloc(10000);
            }
            OnigString._sharedPtrInUse = true;
            onigBinding.HEAPU8.set(utfString.utf8Value, OnigString._sharedPtr);
            this.ptr = OnigString._sharedPtr;
        }
        else {
            this.ptr = utfString.createString(onigBinding);
        }
    }
    convertUtf8OffsetToUtf16(utf8Offset) {
        if (this.utf8OffsetToUtf16) {
            if (utf8Offset < 0) {
                return 0;
            }
            if (utf8Offset > this.utf8Length) {
                return this.utf16Length;
            }
            return this.utf8OffsetToUtf16[utf8Offset];
        }
        return utf8Offset;
    }
    convertUtf16OffsetToUtf8(utf16Offset) {
        if (this.utf16OffsetToUtf8) {
            if (utf16Offset < 0) {
                return 0;
            }
            if (utf16Offset > this.utf16Length) {
                return this.utf8Length;
            }
            return this.utf16OffsetToUtf8[utf16Offset];
        }
        return utf16Offset;
    }
    dispose() {
        if (this.ptr === OnigString._sharedPtr) {
            OnigString._sharedPtrInUse = false;
        }
        else {
            this._onigBinding._ofree(this.ptr);
        }
    }
}
OnigString.LAST_ID = 0;
OnigString._sharedPtr = 0; // a pointer to a string of 10000 bytes
OnigString._sharedPtrInUse = false;
class OnigScanner {
    constructor(patterns) {
        if (!onigBinding) {
            throw new Error(`Must invoke loadWASM first.`);
        }
        const strPtrsArr = [];
        const strLenArr = [];
        for (let i = 0, len = patterns.length; i < len; i++) {
            const utfString = new UtfString(patterns[i]);
            strPtrsArr[i] = utfString.createString(onigBinding);
            strLenArr[i] = utfString.utf8Length;
        }
        const strPtrsPtr = onigBinding._omalloc(4 * patterns.length);
        onigBinding.HEAPU32.set(strPtrsArr, strPtrsPtr / 4);
        const strLenPtr = onigBinding._omalloc(4 * patterns.length);
        onigBinding.HEAPU32.set(strLenArr, strLenPtr / 4);
        const scannerPtr = onigBinding._createOnigScanner(strPtrsPtr, strLenPtr, patterns.length);
        for (let i = 0, len = patterns.length; i < len; i++) {
            onigBinding._ofree(strPtrsArr[i]);
        }
        onigBinding._ofree(strLenPtr);
        onigBinding._ofree(strPtrsPtr);
        if (scannerPtr === 0) {
            throwLastOnigError(onigBinding);
        }
        this._onigBinding = onigBinding;
        this._ptr = scannerPtr;
    }
    dispose() {
        this._onigBinding._freeOnigScanner(this._ptr);
    }
    findNextMatchSync(string, startPosition, arg) {
        let debugCall = defaultDebugCall;
        let options = 0 /* FindOption.None */;
        if (typeof arg === "number") {
            if (arg & 8 /* FindOption.DebugCall */) {
                debugCall = true;
            }
            options = arg;
        }
        else if (typeof arg === "boolean") {
            debugCall = arg;
        }
        if (typeof string === "string") {
            string = new OnigString(string);
            const result = this._findNextMatchSync(string, startPosition, debugCall, options);
            string.dispose();
            return result;
        }
        return this._findNextMatchSync(string, startPosition, debugCall, options);
    }
    _findNextMatchSync(string, startPosition, debugCall, options) {
        const onigBinding = this._onigBinding;
        let resultPtr;
        if (debugCall) {
            resultPtr = onigBinding._findNextOnigScannerMatchDbg(this._ptr, string.id, string.ptr, string.utf8Length, string.convertUtf16OffsetToUtf8(startPosition), options);
        }
        else {
            resultPtr = onigBinding._findNextOnigScannerMatch(this._ptr, string.id, string.ptr, string.utf8Length, string.convertUtf16OffsetToUtf8(startPosition), options);
        }
        if (resultPtr === 0) {
            // no match
            return null;
        }
        const HEAPU32 = onigBinding.HEAPU32;
        let offset = resultPtr / 4; // byte offset -> uint32 offset
        const index = HEAPU32[offset++];
        const count = HEAPU32[offset++];
        let captureIndices = [];
        for (let i = 0; i < count; i++) {
            const beg = string.convertUtf8OffsetToUtf16(HEAPU32[offset++]);
            const end = string.convertUtf8OffsetToUtf16(HEAPU32[offset++]);
            captureIndices[i] = {
                start: beg,
                end: end,
                length: end - beg,
            };
        }
        return {
            index: index,
            captureIndices: captureIndices,
        };
    }
}
function _loadWASM(loader, print, resolve, reject) {
    Onig({
        print: print,
        instantiateWasm: (importObject, callback) => {
            if (typeof performance === "undefined") {
                // performance.now() is not available in this environment, so use Date.now()
                const get_now = () => Date.now();
                importObject.env.emscripten_get_now = get_now;
                importObject.wasi_snapshot_preview1.emscripten_get_now = get_now;
            }
            loader(importObject).then((instantiatedSource) => callback(instantiatedSource.instance), reject);
            return {}; // indicate async instantiation
        },
    }).then((binding) => {
        onigBinding = binding;
        resolve();
    });
}
function isInstantiatorOptionsObject(dataOrOptions) {
    return (typeof dataOrOptions.instantiator === "function");
}
function isDataOptionsObject(dataOrOptions) {
    return typeof dataOrOptions.data !== "undefined";
}
function isResponse(dataOrOptions) {
    return typeof Response !== "undefined" && dataOrOptions instanceof Response;
}
let initCalled = false;
let initPromise = null;
function loadWASM(dataOrOptions) {
    if (initCalled) {
        // Already initialized
        return initPromise;
    }
    initCalled = true;
    let loader;
    let print;
    if (isInstantiatorOptionsObject(dataOrOptions)) {
        loader = dataOrOptions.instantiator;
        print = dataOrOptions.print;
    }
    else {
        let data;
        if (isDataOptionsObject(dataOrOptions)) {
            data = dataOrOptions.data;
            print = dataOrOptions.print;
        }
        else {
            data = dataOrOptions;
        }
        if (isResponse(data)) {
            if (typeof WebAssembly.instantiateStreaming === "function") {
                loader = _makeResponseStreamingLoader(data);
            }
            else {
                loader = _makeResponseNonStreamingLoader(data);
            }
        }
        else {
            loader = _makeArrayBufferLoader(data);
        }
    }
    let resolve;
    let reject;
    initPromise = new Promise((_resolve, _reject) => {
        resolve = _resolve;
        reject = _reject;
    });
    _loadWASM(loader, print, resolve, reject);
    return initPromise;
}
function _makeArrayBufferLoader(data) {
    return (importObject) => WebAssembly.instantiate(data, importObject);
}
function _makeResponseStreamingLoader(data) {
    return (importObject) => WebAssembly.instantiateStreaming(data, importObject);
}
function _makeResponseNonStreamingLoader(data) {
    return async (importObject) => {
        const arrayBuffer = await data.arrayBuffer();
        return WebAssembly.instantiate(arrayBuffer, importObject);
    };
}
function createOnigString(str) {
    return new OnigString(str);
}
function createOnigScanner(patterns) {
    return new OnigScanner(patterns);
}

function aliasToLangData(alias) {
    const scope = aliasOrIdToScope[alias];
    if (!scope) {
        return undefined;
    }
    const { id } = scopeToLanguageData[scope];
    return {
        id: id,
        scopeName: scope,
    };
}
function scopeToLangData(scope) {
    const data = scopeToLanguageData[scope];
    return data;
}

const sourceToGrammarPromise = new Map();
let shouldUseFileSystemPromise = undefined;
let shouldUseFileSystem = undefined;
async function loadGrammarByScope(scope) {
    if (sourceToGrammarPromise.has(scope)) {
        return sourceToGrammarPromise.get(scope);
    }
    // we don't have all the scopes, usually not a problem
    const lang = scopeToLangData(scope);
    if (!lang) {
        return Promise.resolve(undefined);
    }
    let grammarPromise = undefined;
    if (shouldUseFileSystemPromise === undefined) {
        grammarPromise = loadGrammarFromFile(lang.path);
        shouldUseFileSystemPromise = grammarPromise
            .then(() => true)
            .catch(() => false);
    }
    if (shouldUseFileSystem === undefined) {
        shouldUseFileSystem = await shouldUseFileSystemPromise;
    }
    if (shouldUseFileSystem) {
        const promise = grammarPromise || loadGrammarFromFile(lang.path);
        sourceToGrammarPromise.set(scope, promise);
        return promise;
    }
    // console.log("loading from network", lang.id);
    const fetchPromise = fetchJSON(`grammars/${lang.id}`);
    const subScopes = lang.embeddedScopes;
    subScopes.forEach((subScope) => {
        if (!sourceToGrammarPromise.has(subScope)) {
            const subPromise = fetchPromise.then((gs) => gs.find((g) => g.scopeName === subScope));
            sourceToGrammarPromise.set(subScope, subPromise);
        }
    });
    const promise = fetchPromise.then((gs) => gs.find((g) => g.scopeName === scope));
    sourceToGrammarPromise.set(scope, promise);
    return promise;
}
async function loadGrammarFromFile(path) {
    return (await readJSON());
}

// import { MetadataConsts, FontStyle } from "vscode-textmate";
// MetadataConsts
const FONT_STYLE_MASK = 0b00000000000000000111100000000000;
const FOREGROUND_MASK = 0b00000000111111111000000000000000;
const STYLE_MASK = 0b00000000111111111111100000000000;
const FONT_STYLE_OFFSET = 11;
const FOREGROUND_OFFSET = 15;
const FontStyle = {
    NotSet: -1,
    None: 0,
    Italic: 1,
    Bold: 2,
    Underline: 4,
    Strikethrough: 8,
};
function tokenize(code, grammar, colors) {
    let stack = null;
    const lines = code.split(/\r?\n|\r/g);
    return lines.map((line) => {
        const { rawTokens, nextStack } = tokenizeLine(grammar, stack, line);
        stack = nextStack;
        return rawTokens.map(({ content, metadata }) => ({
            content,
            style: getStyle(metadata, colors),
        }));
    });
}
function tokenizeLine(grammar, stack, line, config) {
    const { tokens, ruleStack } = grammar.tokenizeLine2(line, stack);
    const newTokens = [];
    let tokenEnd = line.length;
    for (let i = tokens.length - 2; i >= 0; i = i - 2) {
        const tokenStart = tokens[i];
        const metadata = tokens[i + 1];
        const content = line.slice(tokenStart, tokenEnd);
        newTokens.unshift({ content, metadata });
        tokenEnd = tokenStart;
    }
    let rawTokens = [];
    if (config === null || config === void 0 ? void 0 : config.preserveWhitespace) {
        rawTokens = newTokens;
    }
    else {
        // join empty space tokens with the previous token (or the next token if there's no previous token)
        for (let i = 0; i < newTokens.length; i++) {
            const token = newTokens[i];
            if (token.content.trim() !== "") {
                // if has same style as previous token, join with previous token
                const prev = rawTokens[rawTokens.length - 1];
                if (prev &&
                    (prev.metadata & STYLE_MASK) === (token.metadata & STYLE_MASK)) {
                    prev.content += token.content;
                }
                else {
                    rawTokens.push(token);
                }
            }
            else if (rawTokens.length > 0) {
                rawTokens[rawTokens.length - 1].content += token.content;
            }
            else if (i < newTokens.length - 1) {
                newTokens[i + 1].content = token.content + newTokens[i + 1].content;
            }
            else {
                rawTokens.push(token);
            }
        }
    }
    return { rawTokens, nextStack: ruleStack };
}
function tokenizeWithScopes(code, grammar, colors) {
    let stack = null;
    const lines = code.split(/\r?\n|\r/g);
    return lines.map((line) => {
        const { rawTokens, nextStack } = tokenizeLine(grammar, stack, line, {
            preserveWhitespace: true,
        });
        const newTokens = rawTokens.map(({ content, metadata }) => ({
            content,
            style: getStyle(metadata, colors),
        }));
        const tokensWithScopes = addScopesToLine(line, stack, grammar, newTokens);
        stack = nextStack;
        return tokensWithScopes;
    });
}
function addScopesToLine(line, stack, grammar, styledTokens) {
    const { tokens } = grammar.tokenizeLine(line, stack);
    const newTokens = [];
    for (let i = 0; i < tokens.length; i++) {
        const { startIndex, endIndex, scopes } = tokens[i];
        let count = 0;
        const styledToken = styledTokens.find((t) => {
            count += t.content.length;
            if (startIndex < count) {
                return true;
            }
        });
        newTokens.push(Object.assign(Object.assign({}, styledToken), { content: line.slice(startIndex, endIndex), scopes: scopes.reverse() }));
    }
    return newTokens;
}
function getStyle(metadata, colors) {
    const fg = (metadata & FOREGROUND_MASK) >>> FOREGROUND_OFFSET;
    // const bg = (metadata & BACKGROUND_MASK) >>> BACKGROUND_OFFSET;
    const style = {
        color: colors[fg],
        // backgroundColor: colors[bg],
    };
    const fs = (metadata & FONT_STYLE_MASK) >>> FONT_STYLE_OFFSET;
    if (fs & FontStyle.Italic) {
        style["fontStyle"] = "italic";
    }
    if (fs & FontStyle.Bold) {
        style["fontWeight"] = "bold";
    }
    if (fs & FontStyle.Underline) {
        style["textDecoration"] = "underline";
    }
    if (fs & FontStyle.Strikethrough) {
        style["textDecoration"] = "line-through";
    }
    return style;
}

// @ts-ignore
const instantiator = (importsObject) => WebAssembly.instantiate(onig$1, importsObject).then((instance) => ({
    instance,
}));
var onig = { instantiator };

let registry = null;
function preloadGrammars(languages) {
    // initialize the registry the first time
    if (!registry) {
        const onigLibPromise = loadWASM(onig).then(() => ({
            createOnigScanner,
            createOnigString,
        }));
        registry = new Ie({
            onigLib: onigLibPromise,
            loadGrammar: (scopeName) => loadGrammarByScope(scopeName),
        });
    }
    const promises = languages
        .filter((alias) => alias != "text")
        .map((alias) => {
        const langData = aliasToLangData(alias);
        if (!langData) {
            throw new UnknownLanguageError(alias);
        }
        return registry.loadGrammar(langData.scopeName);
    });
    return Promise.all(promises);
}
function getGrammar(alias) {
    if (alias == "text") {
        return {
            langId: "text",
            grammar: null,
        };
    }
    const langData = aliasToLangData(alias);
    if (!langData) {
        throw new UnknownLanguageError(alias);
    }
    const grammar = getGrammarFromRegistry(langData.scopeName);
    if (!grammar) {
        throw new Error(`Syntax highlighting error: grammar for ${alias} not loaded`);
    }
    return {
        langId: langData.id,
        grammar,
    };
}
function getGrammarFromRegistry(scopeName) {
    const { _syncRegistry } = registry;
    return _syncRegistry === null || _syncRegistry === void 0 ? void 0 : _syncRegistry._grammars.get(scopeName);
}
class UnknownLanguageError extends Error {
    constructor(alias) {
        super(`Unknown language: ${alias}`);
        this.alias = alias;
    }
}
function highlightTokens(code, grammar, theme) {
    registry.setTheme(theme);
    const colorMap = getColorMap(theme);
    return tokenize(code, grammar, colorMap);
}
function getColorMap(theme) {
    const colorMap = registry.getColorMap();
    if (!theme.colorNames)
        return colorMap;
    return colorMap.map((c) => {
        const key = Object.keys(theme.colorNames).find((key) => theme.colorNames[key].toUpperCase() === c.toUpperCase());
        return key || c;
    });
}
function highlightTokensWithScopes(code, grammar, theme) {
    registry.setTheme(theme);
    const colorMap = registry.getColorMap();
    return tokenizeWithScopes(code, grammar, colorMap);
}
function highlightText(code) {
    const lines = code.split(/\r?\n|\r/g);
    return lines.map((line) => [{ content: line, style: {} }]);
}

function parseRelativeRanges(relativeRange, lineNumber) {
    if (!relativeRange) {
        return [{ fromLineNumber: lineNumber, toLineNumber: lineNumber }];
    }
    if (relativeRange.startsWith("[")) {
        return getInlineRanges(relativeRange, lineNumber);
    }
    const parts = splitParts(relativeRange.slice(1, -1));
    return parts
        .map((part) => {
        // if the part has columns
        if (part.includes("[")) {
            console.log("part", part);
            const [lineString, columnSplit] = part.split("[");
            const relativeLineNumber = Number(lineString);
            const globalLineNumber = lineNumber + relativeLineNumber - 1;
            if (!isNaturalNumber(globalLineNumber)) {
                throw new RangeNumberError(lineString);
            }
            return getInlineRanges("[" + columnSplit, globalLineNumber);
        }
        // if no columns
        const { from, to } = partToExtremes(part);
        return [
            {
                fromLineNumber: from + lineNumber - 1,
                toLineNumber: to + lineNumber - 1,
            },
        ];
    })
        .flat();
}
// parse "[1,2:3,4]" into an array of ranges
function getInlineRanges(columnRangeString, lineNumber) {
    const parts = splitParts(columnRangeString.slice(1, -1));
    return parts.map((part) => {
        const { from, to } = partToExtremes(part);
        return { lineNumber, fromColumn: from, toColumn: to };
    });
}
function partToExtremes(part) {
    // Transforms something like
    // - "1:3" to {from:1, to: 3}
    // - "4" to {from:4, to:4}
    const [start, end] = part.split(":");
    if (!isNaturalNumber(start)) {
        throw new RangeNumberError(start);
    }
    const from = Number(start);
    if (from < 1) {
        throw new LineOrColumnNumberError();
    }
    if (!end) {
        return { from, to: from };
    }
    else {
        if (!isNaturalNumber(end)) {
            throw new RangeNumberError(end);
        }
        return { from, to: +end };
    }
}
// split a string like "1,3[4:5,6],7:8" into ["1", "3[4:5,6]", "7:8"]
function splitParts(rangeString) {
    return rangeString.split(/,(?![^\[]*\])/g);
}
function isNaturalNumber(n) {
    n = n.toString(); // force the value in case it is not
    var n1 = Math.abs(n), n2 = parseInt(n, 10);
    return !isNaN(n1) && n2 === n1 && n1.toString() === n;
}
class RangeNumberError extends Error {
    constructor(number) {
        super(`Invalid number "${number}" in range string`);
        this.number = number;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
class LineOrColumnNumberError extends Error {
    constructor() {
        super(`Invalid line or column number in range string`);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

const PUNCTUATION = "#001";
const COMMENT = "#010";
const commentsTheme = {
    name: "comments",
    type: "light",
    foreground: "",
    background: "",
    colors: {},
    settings: [
        { settings: { foreground: "#000" } },
        {
            scope: ["punctuation.definition.comment"],
            settings: { foreground: PUNCTUATION },
        },
        { scope: "comment", settings: { foreground: COMMENT } },
        // { scope: "comment.line", settings: { foreground: LINE_COMMENT } },
        // { scope: "comment.block", settings: { foreground: BLOCK_COMMENT } },
    ],
};
function extractCommentsFromCode(code, grammar, lang, annotationNames) {
    const lines = !grammar
        ? highlightText(code)
        : highlightTokens(code, grammar, commentsTheme);
    const allAnnotations = [];
    let lineNumber = 1;
    const newCode = lines
        .map((line) => {
        const { annotations, lineWithoutComments } = getAnnotationsFromLine(line, annotationNames, lineNumber);
        allAnnotations.push(...annotations);
        if (!lineWithoutComments) {
            return null;
        }
        const lineText = lineWithoutComments.map((t) => t.content).join("");
        // remove mdx comment wrapper https://github.com/code-hike/lighter/issues/23
        if (lang === "mdx" &&
            annotations.length > 0 &&
            lineText.trim() === "{}") {
            return null;
        }
        lineNumber++;
        return lineText;
    })
        .filter((line) => line !== null)
        .join(`\n`);
    return { newCode, annotations: allAnnotations };
}
function getAnnotationsFromLine(tokens, names, lineNumber) {
    // if no punctuation return empty
    if (!tokens.some((token) => token.style.color === PUNCTUATION)) {
        return { annotations: [], lineWithoutComments: tokens };
    }
    // first get the annotations without touching the line
    const comments = [];
    let i = 0;
    while (i < tokens.length) {
        const token = tokens[i];
        if (token.style.color !== COMMENT) {
            // not a comment
            i++;
            continue;
        }
        const { name, query, rangeString } = getAnnotationData(token.content);
        if (!names.includes(name)) {
            // a comment, but not an annotation
            i++;
            continue;
        }
        // we have an annotation
        const prevToken = tokens[i - 1];
        const nextToken = tokens[i + 1];
        const commentTokens = [];
        if (prevToken && prevToken.style.color === PUNCTUATION) {
            commentTokens.push(prevToken);
        }
        commentTokens.push(token);
        if (nextToken && nextToken.style.color === PUNCTUATION) {
            commentTokens.push(nextToken);
        }
        comments.push({
            tokens: commentTokens,
            name,
            query,
            ranges: parseRelativeRanges(rangeString, lineNumber),
        });
        i += 2;
    }
    // remove the comments from the line
    let newLine = tokens;
    for (const comment of comments) {
        newLine = newLine.filter((token) => !comment.tokens.includes(token));
    }
    // if the newLine is whitespace, set it to null
    if (newLine.every((token) => token.content.trim() === "")) {
        newLine = null;
    }
    return {
        annotations: comments.map((a) => ({
            name: a.name,
            query: a.query,
            ranges: a.ranges,
        })),
        lineWithoutComments: newLine,
    };
}
function getAnnotationData(content) {
    var _a;
    const regex = /\s*([\w-]+)?(\([^\)]*\)|\[[^\]]*\])?(.*)$/;
    const match = content.match(regex);
    const name = match[1];
    const rangeString = match[2];
    const query = (_a = match[3]) === null || _a === void 0 ? void 0 : _a.trim();
    return { name, rangeString, query };
}

function annotateLine(line, annotations) {
    let annotatedLine = [];
    let columnNumber = 1;
    line.forEach((token) => {
        annotatedLine.push({
            fromColumn: columnNumber,
            toColumn: columnNumber + token.content.length - 1,
            token,
        });
        columnNumber += token.content.length;
    });
    annotations.forEach((annotation) => {
        annotatedLine = reannotateLine(annotatedLine, annotation);
    });
    // remove the fake groups
    return annotatedLine.map((group) => removeFakeGroups$1(group));
}
function removeFakeGroups$1(group) {
    if ("tokens" in group) {
        return {
            annotationName: group.annotationName,
            annotationQuery: group.annotationQuery,
            fromColumn: group.fromColumn,
            toColumn: group.toColumn,
            tokens: group.tokens.map((group) => removeFakeGroups$1(group)),
        };
    }
    else {
        return group.token;
    }
}
function reannotateLine(annotatedLine, annotation) {
    const { range } = annotation;
    const { fromColumn, toColumn } = range;
    const newAnnotatedLine = [];
    let i = 0;
    while (i < annotatedLine.length && annotatedLine[i].toColumn < fromColumn) {
        newAnnotatedLine.push(annotatedLine[i]);
        i++;
    }
    if (i === annotatedLine.length) {
        return annotatedLine;
    }
    const newGroup = {
        annotationName: annotation.name,
        annotationQuery: annotation.query,
        fromColumn,
        toColumn,
        tokens: [],
    };
    const firstGroup = annotatedLine[i];
    if (firstGroup.fromColumn < fromColumn) {
        // we need to split the first group in two
        const [firstHalf, secondHalf] = splitGroup$1(firstGroup, fromColumn);
        newAnnotatedLine.push(firstHalf);
        newAnnotatedLine.push(newGroup);
        if (secondHalf.toColumn > toColumn) {
            // we need to split the second half in two
            const [secondFirstHalf, secondSecondHalf] = splitGroup$1(secondHalf, toColumn + 1);
            newGroup.tokens.push(secondFirstHalf);
            newAnnotatedLine.push(secondSecondHalf);
        }
        else {
            newGroup.tokens.push(secondHalf);
        }
        i++;
    }
    else {
        newAnnotatedLine.push(newGroup);
    }
    while (i < annotatedLine.length && annotatedLine[i].toColumn <= toColumn) {
        newGroup.tokens.push(annotatedLine[i]);
        i++;
    }
    if (i === annotatedLine.length) {
        return newAnnotatedLine;
    }
    const lastGroup = annotatedLine[i];
    if (lastGroup.fromColumn <= toColumn) {
        // we need to split the last group in two
        const [firstHalf, secondHalf] = splitGroup$1(lastGroup, toColumn + 1);
        newGroup.tokens.push(firstHalf);
        newAnnotatedLine.push(secondHalf);
        i++;
    }
    while (i < annotatedLine.length) {
        newAnnotatedLine.push(annotatedLine[i]);
        i++;
    }
    return newAnnotatedLine;
}
function splitGroup$1(group, column) {
    if ("token" in group) {
        const firstToken = Object.assign(Object.assign({}, group.token), { content: group.token.content.slice(0, column - group.fromColumn) });
        const secondToken = Object.assign(Object.assign({}, group.token), { content: group.token.content.slice(column - group.fromColumn) });
        const firstGroup = Object.assign(Object.assign({}, group), { toColumn: column - 1, token: firstToken });
        const secondGroup = Object.assign(Object.assign({}, group), { fromColumn: column, token: secondToken });
        return [firstGroup, secondGroup];
    }
    else {
        const firstTokens = [];
        const secondTokens = [];
        group.tokens.forEach((token) => {
            if (token.toColumn < column) {
                firstTokens.push(token);
            }
            else if (token.fromColumn >= column) {
                secondTokens.push(token);
            }
            else {
                const [firstGroup, secondGroup] = splitGroup$1(token, column);
                firstTokens.push(firstGroup);
                secondTokens.push(secondGroup);
            }
        });
        const firstGroup = Object.assign(Object.assign({}, group), { toColumn: column - 1, tokens: firstTokens });
        const secondGroup = Object.assign(Object.assign({}, group), { fromColumn: column, tokens: secondTokens });
        return [firstGroup, secondGroup];
    }
}

function annotateLines(lines, annotations) {
    let annotatedLines = lines.map((line, lineIndex) => ({
        fromLineNumber: lineIndex + 1,
        toLineNumber: lineIndex + 1,
        line,
    }));
    annotations.forEach((annotation) => {
        annotatedLines = reannotateLines(annotatedLines, annotation);
    });
    return annotatedLines.map((group) => removeFakeGroups(group));
}
function removeFakeGroups(group) {
    if ("line" in group) {
        return {
            lineNumber: group.fromLineNumber,
            tokens: group.line.tokens,
        };
    }
    else {
        return {
            annotationName: group.annotationName,
            annotationQuery: group.annotationQuery,
            fromLineNumber: group.fromLineNumber,
            toLineNumber: group.toLineNumber,
            lines: group.lines.map((line) => removeFakeGroups(line)),
        };
    }
}
function reannotateLines(annotatedLines, annotation) {
    const { range, name, query } = annotation;
    const { fromLineNumber, toLineNumber } = range;
    const newAnnotatedLines = [];
    let i = 0;
    while (i < annotatedLines.length &&
        annotatedLines[i].toLineNumber < fromLineNumber) {
        newAnnotatedLines.push(annotatedLines[i]);
        i++;
    }
    if (i === annotatedLines.length) {
        return newAnnotatedLines;
    }
    const newGroup = {
        annotationName: name,
        annotationQuery: query,
        fromLineNumber,
        toLineNumber,
        lines: [],
    };
    const firstGroup = annotatedLines[i];
    if (firstGroup.fromLineNumber < fromLineNumber) {
        const [firstHalf, secondHalf] = splitGroup(firstGroup, fromLineNumber);
        newAnnotatedLines.push(firstHalf);
        newAnnotatedLines.push(newGroup);
        if (secondHalf.toLineNumber > toLineNumber) {
            const [secondFirstHalf, secondSecondHalf] = splitGroup(secondHalf, toLineNumber + 1);
            newGroup.lines.push(secondFirstHalf);
            newAnnotatedLines.push(secondSecondHalf);
        }
        else {
            newGroup.lines.push(secondHalf);
        }
        i++;
    }
    else {
        newAnnotatedLines.push(newGroup);
    }
    while (i < annotatedLines.length &&
        annotatedLines[i].toLineNumber <= toLineNumber) {
        newGroup.lines.push(annotatedLines[i]);
        i++;
    }
    if (i === annotatedLines.length) {
        return newAnnotatedLines;
    }
    const lastGroup = annotatedLines[i];
    if (lastGroup.fromLineNumber <= toLineNumber) {
        const [firstHalf, secondHalf] = splitGroup(lastGroup, toLineNumber + 1);
        newGroup.lines.push(firstHalf);
        newAnnotatedLines.push(secondHalf);
        i++;
    }
    while (i < annotatedLines.length) {
        newAnnotatedLines.push(annotatedLines[i]);
        i++;
    }
    return newAnnotatedLines;
}
function splitGroup(group, lineNumber) {
    if ("line" in group) {
        return [
            Object.assign(Object.assign({}, group), { toLineNumber: lineNumber - 1 }),
            Object.assign(Object.assign({}, group), { fromLineNumber: lineNumber }),
        ];
    }
    else {
        const firstLines = [];
        const secondLines = [];
        group.lines.forEach((line) => {
            if (line.toLineNumber < lineNumber) {
                firstLines.push(line);
            }
            else if (line.fromLineNumber >= lineNumber) {
                secondLines.push(line);
            }
            else {
                const [firstLine, secondLine] = splitGroup(line, lineNumber);
                firstLines.push(firstLine);
                secondLines.push(secondLine);
            }
        });
        return [
            Object.assign(Object.assign({}, group), { toLineNumber: lineNumber - 1, lines: firstLines }),
            Object.assign(Object.assign({}, group), { fromLineNumber: lineNumber, lines: secondLines }),
        ];
    }
}

function applyAnnotations(lines, annotations) {
    const { inlineAnnotations, multilineAnnotations } = splitAnnotations(annotations);
    let annotatedLines = lines.map((line, lineIndex) => {
        const lineAnnotations = inlineAnnotations.filter((annotation) => annotation.range.lineNumber === lineIndex + 1);
        return {
            lineNumber: lineIndex + 1,
            tokens: annotateLine(line, lineAnnotations),
        };
    });
    return annotateLines(annotatedLines, multilineAnnotations);
}
function splitAnnotations(annotations) {
    const inlineAnnotations = [];
    const multilineAnnotations = [];
    annotations.forEach((annotation) => {
        annotation.ranges.forEach((range) => {
            if ("lineNumber" in range) {
                inlineAnnotations.push(Object.assign(Object.assign({}, annotation), { range }));
            }
            else {
                multilineAnnotations.push(Object.assign(Object.assign({}, annotation), { range }));
            }
        });
    });
    return {
        inlineAnnotations,
        multilineAnnotations,
    };
}

function isAnnotatedConfig(config) {
    return "annotations" in config;
}
async function preload(langs, theme) {
    await Promise.all([preloadGrammars(langs), preloadTheme(theme)]);
}
async function highlight(code, lang, themeOrThemeName = "dark-plus", config = {}) {
    const theCode = code || "";
    const theLang = lang || "text";
    if (typeof theCode !== "string") {
        throw new Error("Syntax highlighter error: code must be a string");
    }
    if (typeof theLang !== "string") {
        throw new Error("Syntax highlighter error: lang must be a string");
    }
    await preload([theLang], themeOrThemeName);
    return highlightSync(theCode, theLang, themeOrThemeName, config);
}
function highlightSync(code, lang, themeOrThemeName = "dark-plus", config = {}) {
    const theCode = code || "";
    const theLang = lang || "text";
    if (typeof theCode !== "string") {
        throw new Error("Syntax highlighter error: code must be a string");
    }
    if (typeof theLang !== "string") {
        throw new Error("Syntax highlighter error: lang must be a string");
    }
    const { langId, grammar } = getGrammar(theLang);
    const theme = getTheme(themeOrThemeName);
    const lines = langId == "text"
        ? highlightText(theCode)
        : (config === null || config === void 0 ? void 0 : config.scopes)
            ? highlightTokensWithScopes(theCode, grammar, theme)
            : highlightTokens(theCode, grammar, theme);
    if (isAnnotatedConfig(config)) {
        const annotations = (config === null || config === void 0 ? void 0 : config.annotations) || [];
        return {
            lines: applyAnnotations(lines, annotations),
            lang: langId,
            style: {
                color: theme.foreground,
                background: theme.background,
            },
        };
    }
    else {
        return {
            lines: lines,
            lang: langId,
            style: {
                color: theme.foreground,
                background: theme.background,
            },
        };
    }
}
async function extractAnnotations(code, lang, annotationNames = []) {
    if (annotationNames.length === 0) {
        return { code, annotations: [] };
    }
    await preloadGrammars([lang]);
    const { grammar } = getGrammar(lang);
    const { newCode, annotations } = extractCommentsFromCode(code, grammar, lang, annotationNames);
    return { code: newCode, annotations };
}
async function getThemeColors(themeOrThemeName) {
    if (!themeOrThemeName) {
        throw new Error("Syntax highlighter error: undefined theme");
    }
    await preload([], themeOrThemeName);
    const theme = getTheme(themeOrThemeName);
    return getAllThemeColors(theme);
}
function getThemeColorsSync(themeOrThemeName) {
    if (!themeOrThemeName) {
        throw new Error("Syntax highlighter error: undefined theme");
    }
    const theme = getTheme(themeOrThemeName);
    return getAllThemeColors(theme);
}

export { LANG_NAMES, THEME_NAMES, UnknownLanguageError, UnknownThemeError, extractAnnotations, getThemeColors, getThemeColorsSync, highlight, highlightSync, preload };
