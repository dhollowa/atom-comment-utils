'use babel'

import {CompositeDisposable} from 'atom'
// import {peg} from 'pegjs'
import {Range} from 'atom'

import EditScope from './edit_scope'

export default class CommentUtils {
  constructor () {
    this.subscriptions = null
// this.parser = peg.generate("start = 'a'");
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
//       result = this.parser.parse(selection)
      result = "hello"
      editor.setTextInBufferRange(marker.getBufferRange(), JSON.stringify(result))
    } catch (e) {
      atom.notifications.addWarning(e)
    }
    scope.done()
  }
}
