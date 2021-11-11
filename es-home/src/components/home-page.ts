import Tonic from '@optoolco/tonic'

export class EsHomePage extends Tonic {
  private apps = [
    { label: "BG Optimizer", hash: "#bgo" },
    { label: "Adaptive ASW", hash: "#aasw" },
    { label: "Decision Support System", hash: "#dss" },
    { label: "Example", hash: "#example" },
    { label: "WasP-ET", hash: "#wasp-et" },
  ]
  onclick = (e: MouseEvent) => {
    console.log('click', e)
    const card = e.target
    if (card instanceof HTMLElement) {
      const app = card.dataset?.app
      if (app) {
        window.location.assign(app)
        window.location.reload()
      }
    }
  }
  render() {
    const appDivs = this.apps.map(
      a => this.html`<div class="es-card" data-app="${a.hash}">${a.label}</div>`)
    return this.html`
<style>
#es-home-page {
  background: var(--es-theme-surface, green);
  color: var(--es-theme-text-secondary-on-background, orange);
}
.es-title {
  padding-left: 2rem;
}
.es-apps {
  display: grid;
  grid-template-columns: repeat(auto-fill, 12rem);
  grid-auto-rows: 1fr;
}
.es-card {
  background: rgba(255,255,255,0.1);
  padding: 1rem;
  margin: 1rem;
  cursor: pointer;
  text-align: center;
}
.es-card:hover {
  background: rgba(255,255,255,0.2);
}
</style>
<h1 class="es-title">Applications</h1>
<div style="padding: 1rem;">
  <div class="es-apps">
    ${appDivs}
  </div>
</div>
`
  }
}
