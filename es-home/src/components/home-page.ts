import Tonic from '@optoolco/tonic'

interface AppInfo {
  label: string
  hash: string
}

export class EsHomePage extends Tonic {
  private apps: AppInfo[] = [ ]
  private error?: Error = undefined
  connected = async () => {
    try {
      const rsp = await fetch(`apps/index.json`)
      this.apps = await rsp.json()
      this.error = undefined
    } catch (e) {
      this.apps = []
      this.error = e as Error
    }
    this.reRender()
  }
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
  renderError() {
    return this.html`<div class="es-error">
      Failed to load application list: ${this.error}
    </div>
    `
  }
  render() {
    const errorMessage = this.error ? this.renderError() : undefined
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
.es-error {
  background: rgba(255,0,0,0.3);
  padding: 1rem;
  text-align: center
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
  ${errorMessage}
  <div class="es-apps">
    ${appDivs}
  </div>
</div>
`
  }
}
