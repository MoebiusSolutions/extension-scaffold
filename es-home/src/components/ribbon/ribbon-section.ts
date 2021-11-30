import Tonic from '@optoolco/tonic'

export class EsRibbonSection extends Tonic {
  stylesheet() {
    return `
    `
  }
  render() {
    return this.html`
      <div class="ribbon-section-items">
        ${this.children}
      </div>
      <div class="ribbon-section-label">${this.props.name}</div>
    `
  }
}
