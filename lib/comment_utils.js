'use babel'

import {CompositeDisposable} from 'atom'
import peg from "pegjs";
import {Range} from 'atom'

import EditScope from './edit_scope'
import parse_cpp_comments_01 from './parse_cpp_comments_01'

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
    try {
      tree = parse_cpp_comments_01.parse(selection)
      prefix = this.prefixFromParseTree(tree)
      tokens = this.tokensFromParseTree(tree)
      lineLength = atom.config.get('editor.preferredLineLength')
      result = this.formatCPPCommentsO1(prefix, tokens, lineLength)
      editor.setTextInBufferRange(marker.getBufferRange(), result)
    } catch (e) {
      console.log(e)
    }
    scope.done()
  }


  // This is a very long comment. This is a very long comment. This is a very long comment. This is
  // a very long comment. This is a very long comment. This is a very long comment. This is a very
  // long comment. This is a very long comment. This is a very long comment.
  formatCPPCommentsO1(prefix, tokens, lineLength) {
    if (tokens.lenth == 0) {
      return ""
    }
    lines = []
    line = `${ prefix }`
    tokens.forEach(token => {
      if (line.length + 1 /* " " */ + token.length > lineLength) {
        lines.push(line)
        line = `${ prefix }`
      }
      line += ` ${ token }`
    })
    lines.push(line)
    return lines.join("\n") + "\n"
  }

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
  }

  // Returns an string with the comment prefix inside.
  prefixFromParseTree(obj) {
    if (this.isArray(obj)) {
      prefix = null
      obj.forEach(child => {
        if (!prefix) {
          prefix = this.prefixFromParseTree(child)
        }
      })
      return prefix
    }
    if (this.isObject(obj)) {
      if ("key" in obj && obj["key"] === "prefix" && "value" in obj) {
        return obj["value"]
      }
      return null
    }
  }

  // Note that an array is an object, so check isArray first.
  isObject (obj) {
     return obj && (typeof obj  === "object");
  }

  isArray (obj) {
    return this.isObject(obj) && (obj instanceof Array);
  }
}
