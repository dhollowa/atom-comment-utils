'use babel'

export default class EditScope {
  constructor (onScopeClose) {
    this.operationCount = 0
    this.onScopeClose = onScopeClose
  }

  add (operationCount) {
    this.operationCount += operationCount
  }

  done () {
    this.operationCount -= 1
    if (this.operationCount <= 0) {
      this.onScopeClose()
    }
  }
}
