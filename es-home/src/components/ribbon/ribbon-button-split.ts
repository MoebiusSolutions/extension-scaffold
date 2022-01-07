import Tonic from '@optoolco/tonic'

export class EsRibbonButtonSplit extends Tonic {
  static hoistedStylesheet() { return /*css*/`

es-ribbon-button-split es-ribbon-dropdown {
  border-left: 1px solid transparent;
  margin-left: 4px;
}
es-ribbon-button-split:hover es-ribbon-dropdown {
  border-left: 1px solid;
}
es-ribbon-button-split.open es-ribbon-dropdown {
  border-left: 1px solid transparent;
}

es-ribbon-button-split es-ribbon-dropdown:hover {
  background: rgba(255,255,255,0.38);
}
es-ribbon-button-split.open es-ribbon-dropdown:hover {
  background: transparent;
}
es-ribbon-button-split.has-dropdown {
  padding-right: 0px;
  align-self: flex-start;
}

.light es-ribbon-button-split:hover {
  background: rgba(0,0,0, 0.38);
}
.light es-ribbon-dropdown:hover {
  background: rgba(0,0,0, 0.38);
}

  `}
  connected() {
    if (this.querySelectorAll('es-ribbon-dropdown').length) {
      this.classList.add('has-dropdown')
    }
  }
  render() {
    this.classList.add('ribbon-button')
    return this.html/*html*/`
      ${this.children}
      <label>${this.props.label}</label>
    `
  }
}
