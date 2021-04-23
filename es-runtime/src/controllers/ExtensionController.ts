import type { ExtensionScaffoldApi, AddPanelOptions } from '../../../es-api/es-api'

export function loadExtension(url: string) {
    import(url).then(activateExtension)
    .catch(e => console.error('Error loading extension', url, e))
}

class ApiImpl implements ExtensionScaffoldApi {
    private readonly panels = new Map<string, HTMLDivElement>()

    ping() {

    }
    addPanel(options: AddPanelOptions) {
        if (this.panels.has(options.id)) {
            console.warn('Duplicate panel added', options.id)
        }
        const locationClass = `ExtensionPanel-${options.location}`

        const outerPanel = document.createElement('div')
        outerPanel.setAttribute("class", `ExtensionPanel ${locationClass}`)

        const shadowDiv = document.createElement('div')
        shadowDiv.attachShadow({ mode: 'open'})

        const extPanel = document.createElement('div')

        const shadow = shadowDiv.shadowRoot
        if (!shadow) {
          throw new Error('Shadow root did not attach')
        }

        this.panels.set(options.id, outerPanel)

        document.body.appendChild(outerPanel)
        outerPanel.appendChild(shadowDiv)
        shadow.appendChild(extPanel)

        if (options.resizeHandle) {
            const dragDiv = document.createElement("div")
            dragDiv.setAttribute('class', 'drag-for-left')
            outerPanel.appendChild(dragDiv)
        }

        return Promise.resolve(extPanel)
    }

    hidePanel(id: string) {
        const div = this.panels.get(id)
        if (!div) {
            console.warn('Panel not found', id)
            return
        }
        div.style.display = 'none'
    }
}

const api = new ApiImpl()

function activateExtension(module: any) {
    console.log('Loaded', module)
    if (module.activate) {
        module.activate(api)
    }
}

export function loadExtensions() {
    // TODO need to design where we will host the list of extensions
    // For dev testing, hard coding an example
    loadExtension('http://localhost:9091/dist/extension-entry.js')
    loadExtension('http://localhost:9092/bundle.js')
    loadExtension('http://localhost:5000/build/bundle.js')
}
