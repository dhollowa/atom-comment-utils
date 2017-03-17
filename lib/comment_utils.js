'use babel'

import {CompositeDisposable} from 'atom'
import peg from "pegjs";
import {Range} from 'atom'

import EditScope from './edit_scope'
import emit_cpp_comments_01 from './emit_cpp_comments_01'   // // ...
import emit_cpp_comments_02 from './emit_cpp_comments_02'   // /** ...\n */
import parse_cpp_comments_01 from './parse_cpp_comments_01' // // ...
import parse_cpp_comments_02 from './parse_cpp_comments_02' // /** ...\n */
import parse_cpp_comments_03 from './parse_cpp_comments_03' // /** ... */

export default class CommentUtils {
  constructor () {
    this.subscriptions = null
  }

  activate () {
    this.subscriptions = new CompositeDisposable
    return this.subscriptions.add(atom.commands.add('atom-workspace', {
      'comment-utils:cycle-selection': () => this.cycleSelection()
    }))
  }

  deactivate () {
    this.subscriptions.dispose()
  }

  cycleSelection () {
    editor = atom.workspace.getActiveTextEditor()
    if (!editor) {
      return
    }
    view = atom.views.getView(editor)
    if (!view) {
      return
    }

    scope = new EditScope(() => {
      editor.groupChangesSinceCheckpoint()
      view.focus()
    })

    ranges = editor.getSelectedBufferRanges()
    scope.add(ranges.length)
    editor.createCheckpoint()

    properties = { reversed: true, invalidate: 'never' }
    ranges.forEach(range => {
      marker = editor.markBufferRange(range, properties)
      this.cycleRange(marker, editor, scope)
    })
  }

  cycleRange (marker, editor, scope) {
    selection = editor.getTextInBufferRange(marker.getBufferRange())
    parsed = false
    lineLength = atom.config.get('editor.preferredLineLength')
    try {
      tree = parse_cpp_comments_01.parse(selection)
      parsed = true
      prefix = this.prefixFromParseTree(tree)
      tokens = this.tokensFromParseTree(tree)
      tokens = this.mergeDoxygenTokens(tokens)
      eol = this.lastNodeIsEOL(tree)
      result = emit_cpp_comments_01.emitCPPComments(prefix, tokens, eol, lineLength)
      editor.setTextInBufferRange(marker.getBufferRange(), result)
    } catch (e) {
      console.log(e)
    }

    if (!parsed) try {
      tree = parse_cpp_comments_02.parse(selection)
      parsed = true
      prefix = this.prefixFromParseTree(tree)
      tokens = this.tokensFromParseTree(tree)
      tokens = this.mergeDoxygenTokens(tokens)
      eol = this.lastNodeIsEOL(tree)
      result = emit_cpp_comments_02.emitCPPComments(prefix, tokens, eol, lineLength)
      editor.setTextInBufferRange(marker.getBufferRange(), result)
      parsed = true
    } catch (e) {
      console.log(e)
    }

    if (!parsed) try {
      tree = parse_cpp_comments_03.parse(selection)
      parsed = true
      prefix = this.prefixFromParseTree(tree)
      tokens = this.tokensFromParseTree(tree)
      tokens = this.mergeDoxygenTokens(tokens)
      eol = this.lastNodeIsEOL(tree)
      result = emit_cpp_comments_02.emitCPPComments(prefix, tokens, eol, lineLength)
      editor.setTextInBufferRange(marker.getBufferRange(), result)
      parsed = true
    } catch (e) {
      console.log(e)
    }

    scope.done()
  }
/** a b */
  // Returns an array of strings with tokens inside.
  tokensFromParseTree(obj) {
    if (this.isArray(obj)) {
      tokens = []
      obj.forEach(child => {
        tokens = tokens.concat(this.tokensFromParseTree(child))
      })
      return tokens
    }
    if (this.isObject(obj)) {
      if ("key" in obj && obj["key"] === "token" && "value" in obj) {
        return [ obj["value"] ]
      }
      return []
    }
    return []
  }

  // Returns a string with the comment prefix inside.
  prefixFromParseTree(obj) {
    if (this.isArray(obj)) {
      prefix = ""
      obj.every(child => {
        prefix = this.prefixFromParseTree(child)
        return prefix.length == 0
      })
      return prefix
    }
    if (this.isObject(obj)) {
      if ("key" in obj && obj["key"] === "prefix" && "value" in obj) {
        return obj["value"]
      }
      return ""
    }
    return ""
  }

  lastNodeIsEOL(obj) {
    lastNodeIsEOL = false
    if (this.isArray(obj)) {
      obj.reverse().every(child => {
        lastNodeIsEOL = this.lastNodeIsEOL(child)
        return false
      })
      return lastNodeIsEOL
    }
    if (this.isObject(obj)) {
      if ("key" in obj && obj["key"] === "eol") {
        return true
      }
      return false
    }
    return false
  }

  mergeDoxygenTokens(tokens) {
    merged = []
    doxygenToken = null
    tokens.forEach(token => {
      if (doxygenToken != null) {
        doxygenToken += " " + token
        merged.push(doxygenToken)
        doxygenToken = null
      } else if (token.indexOf("@") == 0) {
        doxygenToken = token
      } else {
        merged.push(token)
      }
    })
    if (doxygenToken != null) {
      merged.push(doxygenToken)
    }
    return merged
  }

  // Note that an array is an object, so check isArray first.
  isObject (obj) {
     return obj && (typeof obj  === "object");
  }

  isArray (obj) {
    return this.isObject(obj) && (obj instanceof Array);
  }
}
