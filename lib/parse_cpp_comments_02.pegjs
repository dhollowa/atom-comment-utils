endoflinecommentblock
  = preamble:emptyline*
    opening:opening_commentline
    body:body_commentline*
    closing:closing_commentline
    postamble:emptyline* {
      return [opening, body, closing]
    }

opening_commentline
  = opening_prefix tokens* endofline

body_commentline
  = body_prefix? tokens* endofline

closing_commentline
  = whitespace? tokens* closing_suffix endofline?

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
  = "\t"
    / "\v"
    / "\f"
    / " "
    / "\u00A0"
    / "\uFEFF"

endofline
  = "\n"
    / "\r\n"
    / "\r"
    / "\u2028"
    / "\u2029" {
      return { key:"eol", value:null }
    }
