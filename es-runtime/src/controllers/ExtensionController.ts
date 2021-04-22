import type { ExtensionScaffoldApi, AddPanelOptions } from '../../../es-api/es-api'

export function loadExtension(url: string) {
    import(url).then(activateExtension)
    .catch(e => console.error('Error loading extension', url, e))
}

const api : ExtensionScaffoldApi = {
    ping: () => console.log('ping'),

    addPanel: (options: AddPanelOptions) => {
        const attachClass = `ExtensionPanel-${options.location}`

        const outerPanel = document.createElement('div')
        outerPanel.setAttribute("class", `ExtensionPanel ${attachClass}`)
        document.body.appendChild(outerPanel);

        const inPanel = document.createElement('div')
        inPanel.innerText = 'this is a test'

        outerPanel.attachShadow({ mode: 'open'})
        const shadow = outerPanel.shadowRoot
        if (!shadow) {
          throw new Error('Shadow root did not attach')
        }
        shadow.appendChild(inPanel)

        return Promise.resolve(inPanel)
    }
}

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
}
