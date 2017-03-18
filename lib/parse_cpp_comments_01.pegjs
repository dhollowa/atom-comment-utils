endoflinecommentblock
  = preamble:emptyline*
    block:commentline*
    postamble:emptyline* {
      return block
    }

commentline
  = prefix tokens* endofline?

emptyline
  = whitespace? endofline

tokens
  = head:whitespace? tail:token trailing:whitespace? { return tail }

token
  = tokenchar+ { return { key:"token", value:text() } }

tokenchar
  = [^\t\v\f\ \u00A0\uFEFF\n\r\u2028\u2029]

prefix
  = whitespace? "//" { return { key:"prefix", value:text() } }

whitespace
  = whitespacechar+

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
