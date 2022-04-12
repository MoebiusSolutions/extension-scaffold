import Tonic from '@optoolco/tonic'

export class EsRibbonDropdown extends Tonic {
  static hoistedStylesheet() { return /*css*/`

es-ribbon-dropdown {
  order: 1;
  align-self: stretch;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
es-ribbon-dropdown svg {
  fill: var(--es-theme-text-secondary-on-background);
  top: 0px;
  margin-bottom: 0px;
}
.ribbon-dropdown {
  visibility: hidden;
  display: block;
  position: absolute;
  z-index: 1000;
  width: max-content;

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
.ribbon-dropdown:focus,
.ribbon-dropdown:focus-within,
.ribbon-dropdown:focus-visible {
  outline: none;
}

  `}
  connected() {
    const btn: HTMLElement | null = this.parentElement
    if (!btn) {
      throw new Error('Failed to find parentElement')
    }
    const rd: HTMLDivElement | null = this.querySelector('.ribbon-dropdown')
    if (!rd) {
      throw new Error('Failed to find .ribbon-dropdown')
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
      rd.style.left = `${rel.offsetLeft}px`
      rd.style.top = `${rel.offsetTop + rel.offsetHeight}px`
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

      if (el.closest('es-ribbon-dropdown') && !el.closest('.ribbon-dropdown')) {
        toggle()
        e.stopPropagation()
      }
    })
    rd.addEventListener('focusout', (e: FocusEvent) => {
      const relatedTarget = e.relatedTarget

      // Without this we cannot click on radio buttons in the dropdown
      if (pointerDown) { return }
      // Focus heading to a child
      if (relatedTarget) { return }

      hide()
    })
    this.addEventListener('es-ribbon-dropdown-request', (e: Event) => {
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
    this.dispatchEvent(new CustomEvent('es-ribbon-dropdown-request', { detail: 'open' }))
  }
  close() {
    this.dispatchEvent(new CustomEvent('es-ribbon-dropdown-request', { detail: 'close' }))
  }
  render() {
    return this.html/*html*/`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" >
        <path d="M0 0h24v24H0z" fill="none"/><path d="M7 10l5 5 5-5z"/>
      </svg>
      <div tabindex="0" class="ribbon-dropdown">
        <div class="elevation">
          ${this.children}
        </div>
      </div>
    `
  }
}
