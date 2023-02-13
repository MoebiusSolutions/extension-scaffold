import React from 'react'
import ReactDOM from 'react-dom';
import { fetchTokenInfo } from './securityRequests';
import type { ExtensionScaffoldApi } from '@moesol/es-runtime/build/es-api'
import { publishJson, subscribeJson, unsubscribe } from '@moesol/inter-widget-communication';

export async function addLeftSecurityExample(es: ExtensionScaffoldApi) {
    const span = document.createElement('span')
    span.style.writingMode = "tb"
    span.style.transform = "rotate(180deg)"

    ReactDOM.render(<TabSecurityExample es={es} />, span)

    const panelDiv = await es.chrome.panels.addPanel({
        id: 'ext.snowpack.left.security.example',
        title: 'Security Example',
        icon: span,
        location: 'left',
    })

    ReactDOM.render(
        <React.StrictMode>
          <LeftSecurityExample es={es} />
        </React.StrictMode>,
        panelDiv
      )
    
}

const TabSecurityExample: React.FC<{es: ExtensionScaffoldApi}> = ({es}) => {
    return <>Security Info</>
}

export const LeftSecurityExample: React.FC<{ es: ExtensionScaffoldApi }> = ({ es }) => {
    const [principalFromPubSub, setPrincipalFromPubSub] = React.useState<any>({})
    const [principalFromRest, setPrincipalFromRest] = React.useState<any>({})

    React.useEffect(() => {
        fetchTokenInfo()
            .then(setPrincipalFromRest)
    }, [setPrincipalFromRest])

    React.useEffect(() => {
        // request the principal info from pubsub right now
        subscribeJson('security.principal.response', (_, payload: any) => {
            unsubscribe('security.principal.response')
            setPrincipalFromPubSub(payload)
        });
        publishJson('security.principal.request', {})
    }, [setPrincipalFromPubSub])

    React.useEffect(() => {
        // listen for changes to the security principal
        // * it might change during intialization
        // * it might change if the user logs out, either by choice or triggered by a session timeout.
        subscribeJson('security.principal', (_, payload: any) => {
            setPrincipalFromPubSub(payload)
        });
    }, [setPrincipalFromPubSub])

    const getPrincipalEntry = (label: string, value: any) => {
        if (!value) {
          return undefined;
        }
        return  <div className = 'security-pair'>
            <div className = 'security-label'>
                <label htmlFor={label}>{label}</label>
            </div>
            <div className = 'security-value' >
                <div id={label}>
                  {value}
                </div>
            </div>
            <br/>
        </div>
      }
    
      const getPrincipalContent = (principal: any) => {
        const { userId, source, opauth } = principal;
        const css = `
          .security-pair {
            position:relative;
            left:0;
            width: 100%;
          }
          .security-label {
            float: left;
            margin-right: 10px;
            white-space: nowrap;
        }
        .security-value {
            white-space: nowrap;
        }
        `
    
        return <>
          <style>{css}</style>
          <div>
              {getPrincipalEntry("User", userId)}
              {getPrincipalEntry("OPAUTH", opauth)}
              {getPrincipalEntry("Authentication", source)}
            </div>
        </>
      }

    return <div style={{
        padding: '1em',
    }}>

        <div style={{ border: 'solid' }}>
            Security Info From PubSub 
            <div>
                {getPrincipalContent(principalFromPubSub)}
            </div>
        </div>
        <div style={{ border: 'solid' }}>
            Security Info From Rest Service 
            <div>
                {getPrincipalContent(principalFromRest)}
            </div>
        </div>
    </div>
}
