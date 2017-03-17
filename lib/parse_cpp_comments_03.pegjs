commentblock
 = preamble:emptyline*
   single:single_commentline
   postamble:emptyline* {
     return single
   }

single_commentline
 = prefix:opening_prefix
   tokens:tokens*
   closing_suffix
   newline? {
     return [ prefix, tokens]
   }

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
   prefix:("/**" / "/*")
   whitespace? {
     return {
       key:"prefix",
       value:(leading == null) ? prefix : leading+prefix
     }
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
