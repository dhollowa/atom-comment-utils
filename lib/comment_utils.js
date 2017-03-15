'use babel'

import {CompositeDisposable} from 'atom'
import {Range} from 'atom'

import EditScope from './edit_scope'

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
    // TODO(dhollowa): Hook up cascading parser logic, and then cycle the generators.
    editor.setTextInBufferRange(marker.getBufferRange(), "hello")
    scope.done()
  }
}
