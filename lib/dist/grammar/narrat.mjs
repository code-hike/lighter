var a="Narrat Language",e="narrat",t=[{include:"#comments"},{include:"#expression"}],n={commands:{patterns:[{match:"\\b(set|var)\\b",name:"keyword.commands.variables.narrat"},{match:"\\b(talk|think)\\b",name:"keyword.commands.text.narrat"},{match:"\\b(jump|run|wait|return|save|save_prompt)",name:"keyword.commands.flow.narrat"},{match:"\\b(log|clear_dialog)\\b",name:"keyword.commands.helpers.narrat"},{match:"\\b(set_screen|empty_layer|set_button)",name:"keyword.commands.screens.narrat"},{match:"\\b(play|pause|stop)\\b",name:"keyword.commands.audio.narrat"},{match:"\\b(notify|enable_notifications|disable_notifications)\\b",name:"keyword.commands.notifications.narrat"},{match:"\\b(set_stat|get_stat_value|add_stat)",name:"keyword.commands.stats.narrat"},{match:"\\b(neg|abs|random|random_float|random_from_args|min|max|clamp|floor|round|ceil|sqrt|^)\\b",name:"keyword.commands.math.narrat"},{match:"\\b(concat|join)\\b",name:"keyword.commands.string.narrat"},{match:"\\b(text_field)\\b",name:"keyword.commands.text_field.narrat"},{match:"\\b(add_level|set_level|add_xp|roll|get_level|get_xp)\\b",name:"keyword.commands.skills.narrat"},{match:"\\b(add_item|remove_item|enable_interaction|disable_interaction|has_item?|item_amount?)",name:"keyword.commands.inventory.narrat"},{match:"\\b(start_quest|start_objective|complete_objective|complete_quest|quest_started?|objective_started?|quest_completed?|objective_completed?)",name:"keyword.commands.quests.narrat"}]},comments:{patterns:[{match:"\\/\\/.*$",name:"comment.line.narrat"}]},expression:{patterns:[{include:"#keywords"},{include:"#commands"},{include:"#operators"},{include:"#primitives"},{include:"#strings"},{include:"#paren-expression"}]},interpolation:{patterns:[{match:"(\\w|\\.)+",name:"variable.interpolation.narrat"}]},keywords:{patterns:[{match:"\\b(if|else|choice)\\b",name:"keyword.control.narrat"},{match:"\\$[\\w|\\.]+\\b",name:"variable.value.narrat"},{match:"(?x)\n^\\w+\n(?=(\\s|\\w)*:)\n",name:"entity.name.function.narrat"},{match:"(?x)\n^\\w+\n(?!(\\s|\\w)*:)\n",name:"invalid.label.narrat"},{match:"(?<=\\w)[^^](\\b\\w+\\b)(?=(\\s|\\w)*:)",name:"entity.other.attribute-name"}]},operators:{patterns:[{match:"(&&|\\|\\||!=|==|>=|<=|<|>|!|\\?)\\s",name:"keyword.operator.logic.narrat"},{match:"(\\+|-|\\*|\\/)\\s",name:"keyword.operator.arithmetic.narrat"}]},"paren-expression":{begin:"\\(",beginCaptures:{0:{name:"punctuation.paren.open"}},end:"\\)",endCaptures:{0:{name:"punctuation.paren.close"}},name:"expression.group",patterns:[{include:"#expression"}]},primitives:{patterns:[{match:"\\b\\d+\\b",name:"constant.numeric.narrat"},{match:"\\btrue\\b",name:"constant.language.true.narrat"},{match:"\\bfalse\\b",name:"constant.language.false.narrat"},{match:"\\bnull\\b",name:"constant.language.null.narrat"},{match:"\\bundefined\\b",name:"constant.language.undefined.narrat"}]},strings:{begin:'"',end:'"',name:"string.quoted.double.narrat",patterns:[{match:"\\\\.",name:"constant.character.escape.narrat"},{begin:"%{",beginCaptures:{0:{name:"punctuation.template.open"}},end:"}",endCaptures:{0:{name:"punctuation.template.close.narrat"}},name:"expression.template",patterns:[{include:"#expression"},{include:"#interpolation"}]}]}},r="source.narrat",m={displayName:a,name:e,patterns:t,repository:n,scopeName:r};export{m as default,a as displayName,e as name,t as patterns,n as repository,r as scopeName};
