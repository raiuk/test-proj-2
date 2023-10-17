export class Option {
  id: string
  parent: Option | null
  child: Option | null

  constructor(id: string, parent: Option | null, child: Option | null) {
    this.id = id
    this.parent = parent
    this.child = child
  }

  removeChild() {
    this.child = null
  }

  removeOption() {
    this.removeChild()
    this.parent?.removeChild()
  }

  addChild(child: Option) {
    this.child = child
    this.child.parent = this
  }

  generateChildId(): string {
    if (!this.id) return ''
    const idArr = this.id.split('.')
    idArr[0] = (Number(idArr[0]) + 1).toString()
    return idArr.join('.')
  }

  getAllChildren(): Option[] {
    const optionsArr = []
    optionsArr.push(this)
    let child = this?.child
    while (child) {
      optionsArr.push(child)
      child = child?.child
    }

    return optionsArr
  }
}
