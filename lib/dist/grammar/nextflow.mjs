var e="Nextflow",n="nextflow",t=[{include:"#nextflow"}],o={"enum-def":{begin:"^\\s*(enum)\\s+(\\w+)\\s*{",beginCaptures:{1:{name:"keyword.nextflow"},2:{name:"storage.type.groovy"}},end:"}",patterns:[{include:"source.nextflow-groovy#comments"},{include:"#enum-values"}]},"enum-values":{patterns:[{begin:"(?<=;|^)\\s*\\b([A-Z0-9_]+)(?=\\s*(?:,|}|\\(|$))",beginCaptures:{1:{name:"constant.enum.name.groovy"}},end:",|(?=})|^(?!\\s*\\w+\\s*(?:,|$))",patterns:[{begin:"\\(",end:"\\)",name:"meta.enum.value.groovy",patterns:[{match:",",name:"punctuation.definition.seperator.parameter.groovy"},{include:"#groovy-code"}]}]}]},"function-body":{patterns:[{match:"\\s"},{begin:"(?=(?:\\w|<)[^(]*\\s+(?:[\\w$]|<)+\\s*\\()",end:"(?=[\\w$]+\\s*\\()",name:"meta.method.return-type.java",patterns:[{include:"source.nextflow-groovy#types"}]},{begin:"([\\w$]+)\\s*\\(",beginCaptures:{1:{name:"entity.name.function.java"}},end:"\\)",name:"meta.definition.method.signature.java",patterns:[{begin:"(?=[^)])",end:"(?=\\))",name:"meta.method.parameters.groovy",patterns:[{begin:"(?=[^,)])",end:"(?=,|\\))",name:"meta.method.parameter.groovy",patterns:[{match:",",name:"punctuation.definition.separator.groovy"},{begin:"=",beginCaptures:{0:{name:"keyword.operator.assignment.groovy"}},end:"(?=,|\\))",name:"meta.parameter.default.groovy",patterns:[{include:"source.nextflow-groovy#groovy-code"}]},{include:"source.nextflow-groovy#parameters"}]}]}]},{begin:"(?=<)",end:"(?=\\s)",name:"meta.method.paramerised-type.groovy",patterns:[{begin:"<",end:">",name:"storage.type.parameters.groovy",patterns:[{include:"source.nextflow-groovy#types"},{match:",",name:"punctuation.definition.seperator.groovy"}]}]},{begin:"{",end:"(?=})",name:"meta.method.body.java",patterns:[{include:"source.nextflow-groovy#groovy-code"}]}]},"function-def":{applyEndPatternLast:1,begin:"(?:(?<=;|^|{)(?=\\s*(?:(?:def)|(?:(?:(?:boolean|byte|char|short|int|float|long|double)|(?:@?(?:[a-zA-Z]\\w*\\.)*[A-Z]+\\w*))[\\[\\]]*(?:<.*>)?)n)\\s+([^=]+\\s+)?\\w+\\s*\\())",end:"}|(?=[^{])",name:"meta.definition.method.groovy",patterns:[{include:"#function-body"}]},"include-statement":{patterns:[{match:"^\\b(include)\\b",name:"keyword.nextflow"},{match:"\\b(from)\\b",name:"keyword.nextflow"}]},nextflow:{patterns:[{include:"#enum-def"},{include:"#function-def"},{include:"#process-def"},{include:"#workflow-def"},{include:"#output-def"},{include:"#include-statement"},{include:"source.nextflow-groovy"}]},"output-def":{begin:"^\\s*(output)\\s*{",beginCaptures:{1:{name:"keyword.nextflow"}},end:"}",name:"output.nextflow",patterns:[{include:"source.nextflow-groovy#groovy"}]},"process-body":{patterns:[{match:"(?:input|output|when|script|shell|exec):",name:"constant.block.nextflow"},{match:"\\b(tuple|path|file|val|stdin|stdout)(\\(|\\s)",name:"entity.name.function.nextflow"},{include:"source.nextflow-groovy#groovy"}]},"process-def":{begin:"^\\s*(process)\\s+(\\w+|\"[^\"]+\"|'[^']+')\\s*{",beginCaptures:{1:{name:"keyword.nextflow"},2:{name:"function.nextflow"}},end:"}",name:"process.nextflow",patterns:[{include:"#process-body"}]},"workflow-body":{patterns:[{match:"(?:take|main|emit):",name:"constant.block.nextflow"},{include:"source.nextflow-groovy#groovy"}]},"workflow-def":{begin:"^\\s*(workflow)(?:\\s+(\\w+|\"[^\"]+\"|'[^']+'))?\\s*{",beginCaptures:{1:{name:"keyword.nextflow"},2:{name:"constant.nextflow"}},end:"}",name:"workflow.nextflow",patterns:[{include:"#workflow-body"}]}},a="source.nextflow",r={displayName:e,name:n,patterns:t,repository:o,scopeName:a};export{r as default,e as displayName,n as name,t as patterns,o as repository,a as scopeName};
