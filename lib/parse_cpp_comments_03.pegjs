commentblock
 = preamble:emptyline*
   single:single_commentline
   postamble:emptyline* {
     return single
   }

single_commentline
 = prefix:opening_prefix
   tokens:tokens*
   suffix:closing_suffix
   eol:endofline? {
     return [ prefix, tokens, suffix, eol]
   }

emptyline
 = whitespace? endofline

tokens
 = head:whitespace?
   tail:token
   trailing:whitespace? {
     return tail
   }

token
 = (!"*/" tokenchar)+ { return { key:"token", value:text() } }

tokenchar
  = [^\t\v\f\ \u00A0\uFEFF\n\r\u2028\u2029]

opening_prefix
 = leading:whitespace?
   prefix:("/**" / "/*")
   whitespace? {
     return {
       key:"prefix",
       value:(leading == null) ? "" : leading
     }
   }
closing_suffix
 = suffix:"*/"
   whitespace? {
     return { key:"closing_suffix", value:suffix }
   }

whitespace
 = body:whitespacechar+ { return text() }

whitespacechar
 = "\t"
   / "\v"
   / "\f"
   / " "
   / "\u00A0"
   / "\uFEFF"

endofline
  = ("\n"
    / "\r\n"
    / "\r"
    / "\u2028"
    / "\u2029") {
      return { key:"eol", value:null }
    }
