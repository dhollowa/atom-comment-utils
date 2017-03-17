commentblock
 = preamble:emptyline*
   opening:opening_commentline
   body:body_commentline*
   closing:closing_commentline?
   postamble:emptyline* {
     return [opening, body, closing]
   }

opening_commentline
 = opening_prefix tokens* newline

body_commentline
 = body_prefix? tokens* newline

closing_commentline
 = whitespace? tokens* closing_suffix newline

emptyline
 = whitespace? newline

tokens
 = head:whitespace?
   tail:token
   trailing:whitespace? {
     return tail
   }

token
 = (!"*/" tokenchar)+ { return { key:"token", value:text() } }

tokenchar
 = [^\n\ ]

opening_prefix
 = leading:whitespace?
   prefix:"/**" whitespace? {
     return {
       key:"opening_prefix",
       value:(leading == null) ? prefix : leading+prefix
     }
   }

body_prefix
 = leading:whitespace?
   (!"*/" "*")
   whitespace? {
     return { key:"body_prefix", value:(leading == null) ? "*" : leading+"*" }
   }

closing_suffix
 = suffix:"*/"
   whitespace? {
     return { key:"closing_prefix", value:suffix }
   }

whitespace
 = body:whitespacechar+ { return text() }

whitespacechar
 = " "

newline
 = "\n" { return { key:"eol", value:null } }
