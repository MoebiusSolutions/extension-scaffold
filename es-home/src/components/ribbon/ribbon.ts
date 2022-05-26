import type { ExtensionScaffoldApi, RibbonBar } from '@gots/es-runtime/build/es-api'
import Tonic from '@optoolco/tonic'
import { EsRibbonSection } from './ribbon-section';
import { EsRibbonRow } from './ribbon-row';
import { EsRibbonColumn } from './ribbon-column';
import { EsRibbonButton } from './ribbon-button';
import { EsRibbonDropdown } from './ribbon-dropdown';
import { EsRibbonSideDropdown } from './ribbon-side-dropdown';
import { EsRibbonButtonSmall } from './ribbon-button-small';
import { EsRibbonButtonSplit } from './ribbon-button-split';
import { EsRibbonDropdownItem } from './ribbon-dropdown-item';

export interface RibbonTab {
  tab?: string
  hidden?: boolean
  sections?: string[]
}
export interface RibbonArea {
  location?: 'left-of-tabs' | 'right-of-tabs'
  hidden?: boolean
  sections?: string[]
}

type RibbonTabOrArea = RibbonTab | RibbonArea

class RibbonBarImpl implements RibbonBar {
  private readonly esRibbon
  constructor(ribbon: EsRibbon) {
    this.esRibbon = ribbon
  }
  private wrapCall(f: () => HTMLDivElement | null) {
    try {
      return f()
    } catch (e) {
      console.error('Error', e)
      return null
    }
  }
  claimRibbonTab(title: string) {
    return this.wrapCall(() => this.esRibbon.claimRibbonTab(title))
  }
  claimRibbonPanel(id: string) {
    return this.wrapCall(() => this.esRibbon.claimRibbonPanel(id))
  }
  showRibbonTab(id: string) {
    return this.wrapCall(() => this.esRibbon.showRibbonTab(id))
  }
  hideRibbonTab(id: string) {
    return this.wrapCall(() => this.esRibbon.hideRibbonTab(id))
  }
}

export class EsRibbon extends Tonic {
  public ribbon?: RibbonTabOrArea[]

  stylesheet() { return /*css*/`

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background-color: rgba(155, 155, 155, 0.5);
  border-radius: 20px;
  border: transparent;
}
::-webkit-scrollbar-corner {
  background: transparent;
}
 
.ribbon-head {
  display: flex;
  padding-left: 4px;
  padding-top: 4px;
  border-bottom: 1px solid;
}
.ribbon-tab {
  border: solid;
  border-width: 1px 1px 0 1px;
  border-top-right-radius: 3px;
  border-top-left-radius: 3px;
  user-select: none;
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 4px;
  cursor: pointer;
  margin-top: auto;
  overflow: hidden; /* prevents track animation from toggling vscroll */
}
.ribbon-left-of-tabs {
  display: flex;
  margin-right: 8px;
}
.ribbon-right-of-tabs {
  display: flex;
  flex-grow: 1;
  margin-right: 8px;
  justify-content: flex-end;
}
.ribbon-tab.hidden {
  display: none;
}
.ribbon-tab.active {
  margin-bottom: -1px;
  padding-bottom: 5px;
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
  inset: 0px;
  background: rgba(255,255,255,0.03);
}

.ribbon-body {
  display: none;
  grid-template-areas: 'ribbon';
  overflow: auto;
}
.ribbon-body.open {
  display: grid;
}
.ribbon-body.float.open {
  position: absolute;
  left: 0px;
  right: 0px;
  z-index: 5;
  background: var(--es-theme-surface);
}
.ribbon-controls {
  position: absolute;
  bottom: 4px;
  right: 4px;
  user-select: none;
  fill: var(--es-theme-text-secondary-on-background);
  cursor: pointer;
}
.ribbon-body.float.open .unfold-less {
  display: none;
}
.ribbon-body.un-float.open .unfold-more {
  display: none;
}
.ribbon-body.float.open .ribbon {
  background: rgba(255,255,255, 0.03);
}
.ribbon {
  grid-area: ribbon;
  visibility: hidden;
  display: flex;
}
.ribbon.active {
  visibility: visible;
}

${EsRibbonSection.hoistedStylesheet()}
${EsRibbonRow.hoistedStylesheet()}
${EsRibbonColumn.hoistedStylesheet()}
${EsRibbonButton.hoistedStylesheet()}
${EsRibbonButtonSmall.hoistedStylesheet()}
${EsRibbonButtonSplit.hoistedStylesheet()}
${EsRibbonDropdown.hoistedStylesheet()}
${EsRibbonSideDropdown.hoistedStylesheet()}
${EsRibbonDropdownItem.hoistedStylesheet()}

  `}

  withTab(title: string, lamda: (tabDiv: HTMLDivElement) => void) {
    let tabDiv: HTMLDivElement | null = null
    this.querySelectorAll('.ribbon-tab').forEach(d => {
      const div = d as HTMLDivElement
      if (div.innerText === title) {
        tabDiv = div
        lamda(tabDiv)
      }
    })
    return tabDiv
  }
  claimRibbonTab(title: string) { 
    return this.withTab(title, () => {})
  }
  showRibbonTab(title: string) {
    return this.withTab(title, tabDiv => {
      tabDiv.style.display = 'block'
    })
  }
  hideRibbonTab(title: string) {
    return this.withTab(title, tabDiv => {
      tabDiv.style.display = 'none'
    })
  }

  claimRibbonPanel(id: string): HTMLDivElement | null {
    const matches = this.querySelectorAll(`#${id.replace(/\./g, '\\.')}`)
    if (matches.length > 1) {
      console.error('Duplicate ids found', id)
    } else if (matches.length < 1) {
      console.error('Element not found', id)
    } else {
      const sectionDiv = matches.item(0) as HTMLDivElement
      try {
        if (!sectionDiv.classList.contains('loading')) {
          throw new Error(`Claiming an already claimed ribbon panel: ${id}`)
        } else {
          sectionDiv.classList.remove('loading')
        }
      } catch (e) {
        // Logs stack to issue
        console.warn(e)
      }
      return sectionDiv
    }
    return null
  }
  makeId(idx: number) {
    return `es-ribbon-${idx}`
  }
  connected() {
    const el: HTMLElement | null = document.getElementById('es-home.ribbon')
    if (el) {
      // Otherwise the dropdown menus cause a scrollbar, see
      // https://front-back.com/how-to-make-absolute-positioned-elements-overlap-their-overflow-hidden-parent/
      el.style.position = 'static' // 
    }
  }
  clearActive() {
    this.querySelectorAll('.ribbon-tab').forEach(el => el.classList.remove('active'))
    this.querySelectorAll('.ribbon').forEach(el => el.classList.remove('active'))
  }
  handleUnfold(e: MouseEvent) {
    const div = e.target as HTMLDivElement
    const rb = this.querySelector('.ribbon-body')
    const btn = div.closest('.ribbon-controls')
    if (!btn) { return }

    const less = div.closest('.expand-less')
    if (less) {
      this.clearActive()
      rb?.classList.remove('open')
      return
    }

    if (rb?.classList.contains('float')) {
      rb?.classList.add('un-float')
      rb?.classList.remove('float')
    } else {
      rb?.classList.add('float')
      rb?.classList.remove('un-float')
    }
  }  
  onclick = (e: MouseEvent) => {
    const div = e.target as HTMLDivElement
    const rb = this.querySelector('.ribbon-body')
    const tab = div.closest('.ribbon-tab') as HTMLDivElement
    const idx = Number(tab?.dataset['idx'])

    if (!tab) { 
      return this.handleUnfold(e)
    }
    if (tab.classList.contains('active')) {
      rb?.classList.remove('open')
      this.clearActive()
      return
    }
    rb?.classList.add('open')
    this.clearActive()
    tab.classList.add('active')
    this.querySelector(`#${this.makeId(idx)}`)?.classList.add('active')
  }
  private tabs(): RibbonTab[] {
    function isTab(rt: any): rt is RibbonTab {
      return rt.tab ? true : false
    }
    if (!this.ribbon) { return [] }
    return this.ribbon.filter(isTab)
  }
  private sectionsFor(location: 'left-of-tabs' | 'right-of-tabs'): RibbonArea[] {
    function isArea(rt: any): rt is RibbonArea {
      return rt.location ? true : false
    }
    if (!this.ribbon) { return [] }
    return this.ribbon.filter(rt => isArea(rt) && rt.location === location)
  }
  render() {
    const tabs = this.tabs().map((r: RibbonTab, idx) => {
      let cls = idx === 0 ? `ribbon-tab active` : `ribbon-tab`
      if (r.hidden) {
        cls = `${cls} hidden`
      }
      return this.html`<div class="${cls}" data-idx="${String(idx)}" tabindex="0" title="${r.tab}">${r.tab}</div>`
    })
    const leftOfTabs = this.sectionsFor('left-of-tabs').map((r: RibbonArea) => {
      const sections = r.sections?.map(s => this.html`<div class="loading" id="${s}">...</div>`)
      return this.html`<div class="ribbon-left-of-tabs">${sections}</div>`
    })
    const rightOfTabs = this.sectionsFor('right-of-tabs').map((r: RibbonArea) => {
      const sections =  r.sections?.map(s => this.html`<div class="loading" id="${s}">...</div>`)
      return this.html`<div class="ribbon-right-of-tabs">${sections}</div>`
    })
    const ribbons = this.tabs().map((r: RibbonTabOrArea, idx: number) => {
      const cls = idx === 0 ? `ribbon active` : `ribbon`
      const sections = r.sections?.map(s => this.html`<div class="ribbon-section loading" id="${s}">...</div>`)
      return this.html`<div id="${this.makeId(idx)}" class="${cls}">${sections}</div>`
    })
    return this.html/*html*/`<nav>
      <div class="ribbon-head">
        ${leftOfTabs}
        ${tabs}
        ${rightOfTabs}
      </div>

      <div class="ribbon-body un-float open">${ribbons}
        <div class="ribbon-controls">
          <svg class="unfold-more" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M12 5.83L15.17 9l1.41-1.41L12 3 7.41 7.59 8.83 9 12 5.83zm0 12.34L8.83 15l-1.41 1.41L12 21l4.59-4.59L15.17 15 12 18.17z"/>
          </svg>
          <svg class="unfold-less" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M7.41 18.59L8.83 20 12 16.83 15.17 20l1.41-1.41L12 14l-4.59 4.59zm9.18-13.18L15.17 4 12 7.17 8.83 4 7.41 5.41 12 10l4.59-4.59z"/>
          </svg>
          <svg class="expand-less" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"/>
          </svg>
        </div>
      </div>
    </nav>`
  }
  static async addPanel(scaffold: ExtensionScaffoldApi, ribbon?: RibbonTabOrArea[]) {
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
Tonic.add(EsRibbonRow)
Tonic.add(EsRibbonColumn)
Tonic.add(EsRibbonButton)
Tonic.add(EsRibbonButtonSmall)
Tonic.add(EsRibbonButtonSplit)
Tonic.add(EsRibbonDropdown)
Tonic.add(EsRibbonSideDropdown)
Tonic.add(EsRibbonDropdownItem)
