var e="Git Rebase Message",a="git-rebase",t=[{captures:{1:{name:"punctuation.definition.comment.git-rebase"}},match:"^\\s*(#).*$\\n?",name:"comment.line.number-sign.git-rebase"},{captures:{1:{name:"support.function.git-rebase"},2:{name:"constant.sha.git-rebase"},3:{name:"meta.commit-message.git-rebase"}},match:"^\\s*(pick|p|reword|r|edit|e|squash|s|fixup|f|drop|d)\\s+([0-9a-f]+)\\s+(.*)$",name:"meta.commit-command.git-rebase"},{captures:{1:{name:"support.function.git-rebase"},2:{patterns:[{include:"source.shell"}]}},match:"^\\s*(exec|x)\\s+(.*)$",name:"meta.commit-command.git-rebase"},{captures:{1:{name:"support.function.git-rebase"}},match:"^\\s*(break|b)\\s*$",name:"meta.commit-command.git-rebase"}],s="text.git-rebase",m={displayName:e,name:a,patterns:t,scopeName:s};export{m as default,e as displayName,a as name,t as patterns,s as scopeName};
