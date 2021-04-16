export function loadExtension(url: string) {
    import(url).then(activateExtension)
    .catch(e => console.error('Error loading extension', url, e))
}

// TODO move this to es-api module
export interface Api {
    ping: () => void
    addPanel: (title: string) => Promise<HTMLDivElement>
}

const api : Api = {
    ping: () => console.log('ping'),

    addPanel: (title: string) => {
        const outerPanel = document.createElement('div')
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
    loadExtension('http://localhost:9090/dist/my-extension.js')
    loadExtension('http://localhost:9092/bundle.js')
}
