import Tonic from '@optoolco/tonic'

export class EsRibbonButton extends Tonic {
  stylesheet() {
    return `
    .ribbon-button-label {
      font-size: 10px;
    }
    `
  }
  render() {
    return this.html`
      <div class="ribbon-button">
        ${this.children}
        <div class="ribbon-button-label">${this.props.name}</div>
      </div>
    `
  }
}
