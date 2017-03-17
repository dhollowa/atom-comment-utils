'use babel'

export default class EmitCppComments02 {
  static emitCPPComments(prefix, tokens, eol, lineLength) {
    if (tokens.lenth == 0) {
      return ""
    }

    // Prefixes: /**, *, */ for start line, body lines, and end line respectively.
    spaceCount = prefix.lastIndexOf(" ") + 1
    startPrefix = " ".repeat(spaceCount) + "/**"
    bodyPrefix = " ".repeat(spaceCount) + " * "
    endPrefix = " ".repeat(spaceCount) + " */"

    lines = []
    line = `${ startPrefix }`
    tokens.forEach(token => {
      if (line.length + 1 /* " " */ + token.length > lineLength) {
        lines.push(line)
        line = `${ bodyPrefix }`
      }
      line += ` ${ token }`
    })
    suffix = " */"
    if (lines.length == 0 && line.length + suffix.length <= lineLength) {
      line += suffix
      lines.push(line)
    } else {
      lines.push(line)
      lines.push(endPrefix)
    }
    return lines.join("\n") + (eol ? "\n" : "")
  }
}
