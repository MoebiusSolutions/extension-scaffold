import Tonic from '@optoolco/tonic'

export class EsRibbonButton extends Tonic {
  render() {
    return this.html`
      ${this.children}
      <label>${this.props.name}</label>
    `
  }
}
