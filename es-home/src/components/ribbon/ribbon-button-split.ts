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

.light es-ribbon-button-split:hover {
  background: rgba(0,0,0, 0.38);
}
.light es-ribbon-dropdown:hover {
  background: rgba(0,0,0, 0.38);
}

  `}
  render() {
    this.classList.add('ribbon-button')
    return this.html/*html*/`
      ${this.children}
      <label>${this.props.name}</label>
    `
  }
}
