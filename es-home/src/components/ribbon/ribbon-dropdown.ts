import Tonic from '@optoolco/tonic'

export class EsRibbonDropdown extends Tonic {
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
      this.classList.add('open')
      md.style.display = 'block'
      rd.focus()
    }
    const hide = () => {
      this.classList.remove('open')
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
    btn.addEventListener('click', (e: MouseEvent) => {
      toggle()
    })
    rd.addEventListener('blur', () => {
      if (pointerDown) { return }
      hide()
    })
  }
  render() {
    return this.html`
      <svg xmlns="http://www.w3.org/2000/svg" height="12px" viewBox="0 8 24 12" ><path d="M0 0h24v24H0z" fill="none"/><path d="M7 10l5 5 5-5z"/></svg>
      <div tabindex="0" class="ribbon-dropdown">
        <div class="elevation">
          ${this.children}
        </div>
      </div>
    `
  }
}
