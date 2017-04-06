'use babel'

export default class EmitCppComments04 {
  static emitCPPComments(prefix, tokens, eol, lineLength) {
    if (tokens.lenth == 0) {
      return ""
    }

    spaceCount = prefix.lastIndexOf(" ") + 1
    startPrefix = " ".repeat(spaceCount) + "*"

    lines = []
    line = `${ startPrefix }`
    tokens.forEach(token => {
      if (line.length + 1 /* " " */ + token.length > lineLength) {
        lines.push(line)
        line = `${ startPrefix }`
      }
      line += ` ${ token }`
    })
    lines.push(line)
    return lines.join("\n") + (eol ? "\n" : "")
  }
}
