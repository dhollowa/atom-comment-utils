commentblock
 = preamble: emptyline* block:commentline* postamble:emptyline* { return block }

commentline
 = prefix tokens* newline

emptyline
 = whitespace? newline

tokens
 = head:whitespace? tail:token { return tail }

token
 = tokenchar+ { return { key:"token", value:text() } }

tokenchar
 = [^\n\ ]

prefix
 = whitespace? "//" { return { key:"prefix", value:text() } }

whitespace
 = whitespacechar+

whitespacechar
 = " "

newline
 = "\n" { return { key:"eol", value:null } }
