import Tonic from '@optoolco/tonic'

export class EsRibbonSideDropdown extends Tonic {
  static hoistedStylesheet() { return /*css*/`

es-ribbon-side-dropdown {
  width: max-content;
}
es-ribbon-side-dropdown svg {
  fill: var(--es-theme-text-secondary-on-background);
  top: 0px;
}
.ribbon-side-dropdown {
  visibility: hidden;
  width: max-content;
  left: 0px;

  background: var(--es-theme-surface);
  fill: var(--es-theme-text-secondary-on-background);
  color: var(--es-theme-text-secondary-on-background);
  box-shadow: 2px 2px 1px -1px rgba(0, 0, 0, 0.2), 2px 1px 1px 0px rgba(0, 0, 0, 0.14), 2px 1px 3px 0px rgba(0, 0, 0, 0.12);
}
es-ribbon-dropdown es-ribbon-row:hover {
  background: var(--es-theme-text-secondary-on-background);
}
es-ribbon-side-dropdown  es-ribbon-dropdown-item {
  background: var(--es-theme-surface);
  fill: var(--es-theme-text-secondary-on-background);
  color: var(--es-theme-text-secondary-on-background);
}
es-ribbon-dropdown es-ribbon-row:hover es-ribbon-side-dropdown  es-ribbon-dropdown-item {
  visibility: visible;
}
.ribbon-dropdown .ribbon-side-dropdown {
  display: inline-block; 
  position: absolute;
  left: 100%;
}
.ribbon-side-dropdown > div {
  background: rgba(255,255,255,0.06);
}
.ribbon-side-dropdown:focus,
.ribbon-side-dropdown:focus-within,
.ribbon-side-dropdown:focus-visible {
  outline: none;
}

  `}
  connected() {
    const btn: HTMLElement | null = this.parentElement
    if (!btn) {
      throw new Error('Failed to find parentElement')
    }
    const rd: HTMLDivElement | null = this.querySelector('.ribbon-side-dropdown')
    if (!rd) {
      throw new Error('Failed to find .ribbon-side-dropdown')
    }
    const md: HTMLDivElement | null = document.querySelector('#es-modal-pane')
    if (!md) {
      throw new Error('Failed to find #es-modal-pane')
    }

    const show = () => {
      const rel = this.parentElement || this
      this.classList.add('open')
      btn.classList.add('open')
      md.style.display = 'block'
      rd.style.left = `100%`
      rd.style.top = `0px`
      rd.focus()
    }
    const hide = () => {
      this.classList.remove('open')
      btn.classList.remove('open')
      md.style.display = 'none'
    }
    const toggle = () => {
      if (this.classList.contains('open')) {
        hide()
      } else {
        show()
      }
    }

    let pointerDown = false

    btn.addEventListener('pointerdown', (e: PointerEvent) => pointerDown = true)
    btn.addEventListener('pointerup', (e: PointerEvent) => pointerDown = false)
    btn.addEventListener('pointerleave', (e: PointerEvent) => {
      if (pointerDown) {
        pointerDown = false
        hide()
      }
    })
    btn.addEventListener('click', (e) => {
      const el: HTMLElement | null = e.target as any
      if (!el) { return }

      if (!el.closest('es-ribbon-button-split')) {
        toggle()
        return
      }

      if (el.closest('es-ribbon-side-dropdown') && !el.closest('.ribbon-side-dropdown')) {
        toggle()
        e.stopPropagation()
      }
    })
    rd.addEventListener('blur', () => {
      if (pointerDown) { return }
      hide()
    })
    this.addEventListener('es-ribbon-side-dropdown-request', (e: Event) => {
      const ce: CustomEvent = e as any
      if (ce.detail === 'open') {
        show()
      }
      if (ce.detail === 'close') {
        hide()
      }
    })
  }
  open() {
    this.dispatchEvent(new CustomEvent('es-ribbon-side-dropdown-request', { detail: 'open' }))
  }
  close() {
    this.dispatchEvent(new CustomEvent('es-ribbon-side-dropdown-request', { detail: 'close' }))
  }
  render() {
    return this.html/*html*/`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" >
        <path d="M0 0h24v24H0z" fill="none"/><path d="M10 12l7,5 -7,5 z"/>
      </svg>
      <div tabindex="0" class="ribbon-side-dropdown">
        <div class="elevation">
          ${this.children}
        </div>
      </div>
    `
  }
}
