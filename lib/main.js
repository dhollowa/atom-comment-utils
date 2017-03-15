'use babel'

let commentUtils = null

export function activate () {
  const CommentUtils = require('./comment_utils')
  commentUtils = new CommentUtils()
  commentUtils.activate()
}

export function deactivate () {
  if (commentUtils) {
    commentUtils.deactivate()
    commentUtils.destroy()
    commentUtils = null
  }
}
