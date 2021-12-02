import type { ExtensionScaffoldApi, RibbonBar } from '@gots/es-runtime/build/es-api'
import Tonic from '@optoolco/tonic'
import { EsRibbonSection } from './ribbon-section';
import { EsRibbonButton } from './ribbon-button';
import { EsRibbonDropdown } from './ribbon-dropdown';

export interface Ribbon {
  tab?: string
  sections?: string[]
}

class RibbonBarImpl implements RibbonBar {
  private readonly ribbon
  constructor(ribbon: EsRibbon) {
    this.ribbon = ribbon
  }
  claimRibbonTab(title: string) {return null}
  claimRibbonPanel(id: string) {
    try {
      return this.ribbon.claimRibbonPanel(id)
    } catch (e) {
      console.error('Error', e)
      return null
    }
  }
}

export class EsRibbon extends Tonic {
  public ribbon?: Ribbon[]
  private _activeIndex = 1

  stylesheet() {
    return `
    .ribbon-head {
      display: flex;
      padding-left: 4px;
      padding-top: 4px;
      border-bottom: 1px solid;
    }
    .ribbon-tab {
      border: solid;
      border-width: 1px 1px 0 1px;
      border-top-right-radius: 5px;
      border-top-left-radius: 5px;
      user-select: none;
      padding-left: 10px;
      padding-right: 10px;
      cursor: pointer;
    }
    .ribbon-tab.active {
      margin-bottom: -1px;
      color: var(--es-theme-text-primary-on-background);
      border-left: 1px solid var(--es-theme-text-secondary-on-background);
      border-top: 1px solid var(--es-theme-text-secondary-on-background);
      border-right: 1px solid var(--es-theme-text-secondary-on-background);
      position: relative;
      background-color: var(--es-theme-surface);
    }
    .ribbon-tab.active::after {
      content: "";
      position: absolute;
      top: 0px;
      bottom: 0px;
      left: 0px;
      right: 0px;
      background: rgba(255,255,255,0.03);
    }

    .ribbon-body {
      display: grid;
      grid-template-areas: 'ribbon';
    }
    .ribbon {
      grid-area: ribbon;
      visibility: hidden;
      display: flex;
    }
    .ribbon.active {
      visibility: visible;
    }
    es-ribbon-section {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }
    .ribbon-section {
      border-right: 1px solid;
      padding: 8px;
      display: flex;
      user-select: none;
    }
    .ribbon-section-items {
      display: flex;
      justify-content: space-around;
      flex-grow: 1;
    }
    .ribbon-section-label {
      font-size: 12px;
      text-align: center;
    }

    es-ribbon-button {
      fill: var(--es-theme-text-secondary-on-background);
      padding-left: 4px;
      padding-right: 4px;
      align-items: center;
      justify-content: center;
      text-align: center;
      cursor: pointer;
    }
    es-ribbon-button:hover {
      fill: var(--es-theme-text-primary-on-background);
      color: var(--es-theme-text-primary-on-background);
      background: rgba(0, 0, 0, 0.2);
    }
    es-ribbon-button:hover svg {
      fill: var(--es-theme-text-primary-on-background);
    }
    es-ribbon-button svg {
      width: 24px;
      height: 24px;
    }
    es-ribbon-button label {
      display: block;
      font-size: 10px;
    }

    es-ribbon-dropdown {
      display: block;
      height: 8px;
    }
    es-ribbon-dropdown svg {
      fill: var(--es-theme-text-secondary-on-background);
      margin-top: -8px;
    }
    .ribbon-dropdown {
      visibility: hidden;
      display: block;
      position: fixed;
      z-index: 2;
      margin-top: -12px;
      background: var(--es-theme-surface);
      fill: var(--es-theme-text-secondary-on-background);
      color: var(--es-theme-text-secondary-on-background);
      box-shadow: 2px 2px 1px -1px rgba(0, 0, 0, 0.2), 2px 1px 1px 0px rgba(0, 0, 0, 0.14), 2px 1px 3px 0px rgba(0, 0, 0, 0.12);
    }
    es-ribbon-dropdown.open .ribbon-dropdown {
      visibility: visible;
    }
    .ribbon-dropdown > div {
      background: rgba(255,255,255,0.06);
    }
    `
  }
  public set activeIndex(idx: number) {
    this._activeIndex = idx

    this.querySelectorAll('.ribbon-tab').forEach(e => e.classList.remove('active'))
    this.querySelector(`.ribbon-tab[data-idx="${idx}"]`)?.classList.add('active')

    this.querySelectorAll('.ribbon').forEach(e => e.classList.remove('active'))
    this.querySelector(`#${this.makeId(idx)}`)?.classList.add('active')
  }
  public get activeIndex() {
    return this._activeIndex
  }

  claimRibbonTab(title: string) { return null }

  claimRibbonPanel(id: string): HTMLDivElement | null {
    const matches = this.querySelectorAll(`#${id.replace(/\./g, '\\.')}`)
    if (matches.length > 1) {
      console.error('Duplicate ids found', id)
    } else if (matches.length < 1) {
      console.error('Element not found', id)
    } else {
      return matches.item(0) as HTMLDivElement
    }
    return null
  }
  makeId(idx: number) {
    return `es-ribbon-${idx}`
  }
  connected() {
    this.activeIndex = 0
  }
  onclick = (e: MouseEvent) => {
    const div = e.target as HTMLDivElement
    if (div?.dataset['idx'] && div.classList.contains('ribbon-tab')) {
      this.activeIndex = Number(div?.dataset['idx'])
    }
  }
  render() {
    if (!this.ribbon) { return }

    const tabs = this.ribbon.map((r: Ribbon, idx) => {
      const cls = this.activeIndex === idx ? `ribbon-tab active` : `ribbon-tab`
        return this.html`<div class="${cls}" data-idx="${String(idx)}" tabindex="0">${r.tab}</div>`
    })
    const ribbons = this.ribbon.map((r: Ribbon, idx: number) => {
      const cls = this.activeIndex === idx ? `ribbon active` : `ribbon`
      const sections = r.sections?.map(s => this.html`<div class="ribbon-section" id="${s}">...</div>`)
      return this.html`<div id="${this.makeId(idx)}" class="${cls}">${sections}</div>`
    })
    return this.html`<nav>
      <div class="ribbon-head">${tabs}</div>
      <div class="ribbon-body">${ribbons}</div>
    </nav>`
  }
  static async addPanel(scaffold: ExtensionScaffoldApi, ribbon?: Ribbon[]) {
    const panelDiv = await scaffold.chrome.panels.addPanel({
      id: 'es-home.ribbon',
      location: 'top-bar',
      initialWidthOrHeight: '',
    })
    const esRibbon: EsRibbon = document.createElement('es-ribbon') as any
    esRibbon.ribbon = ribbon
    panelDiv.appendChild(esRibbon)
    return new RibbonBarImpl(esRibbon)
  }
}

Tonic.add(EsRibbon)
Tonic.add(EsRibbonSection)
Tonic.add(EsRibbonButton)
Tonic.add(EsRibbonDropdown)
