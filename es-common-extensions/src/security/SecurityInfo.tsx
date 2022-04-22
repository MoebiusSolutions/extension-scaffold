import React from 'react'
import ReactDOM from 'react-dom'
import { publishJson, subscribeJson, initialize } from '@gots/noowf-inter-widget-communication';
import { fetchTokenInfo } from './securityRequests';
import type { ExtensionScaffoldApi } from '@gots/es-runtime/build/es-api'
import { GenericModalPanel } from './GenericModal';
import { Spinner } from './Spinner';

const UserAvatar = () => <svg viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1600 1405q0 120-73 189.5t-194 69.5h-874q-121 0-194-69.5t-73-189.5q0-53 3.5-103.5t14-109 26.5-108.5 43-97.5 62-81 85.5-53.5 111.5-20q9 0 42 21.5t74.5 48 108 48 133.5 21.5 133.5-21.5 108-48 74.5-48 42-21.5q61 0 111.5 20t85.5 53.5 62 81 43 97.5 26.5 108.5 14 109 3.5 103.5zm-320-893q0 159-112.5 271.5t-271.5 112.5-271.5-112.5-112.5-271.5 112.5-271.5 271.5-112.5 271.5 112.5 112.5 271.5z"/></svg>          
const UserUnknown = () => <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 448c-110.532 0-200-89.431-200-200 0-110.495 89.472-200 200-200 110.491 0 200 89.471 200 200 0 110.53-89.431 200-200 200zm107.244-255.2c0 67.052-72.421 68.084-72.421 92.863V300c0 6.627-5.373 12-12 12h-45.647c-6.627 0-12-5.373-12-12v-8.659c0-35.745 27.1-50.034 47.579-61.516 17.561-9.845 28.324-16.541 28.324-29.579 0-17.246-21.999-28.693-39.784-28.693-23.189 0-33.894 10.977-48.942 29.969-4.057 5.12-11.46 6.071-16.666 2.124l-27.824-21.098c-5.107-3.872-6.251-11.066-2.644-16.363C184.846 131.491 214.94 112 261.794 112c49.071 0 101.45 38.304 101.45 88.8zM298 368c0 23.159-18.841 42-42 42s-42-18.841-42-42 18.841-42 42-42 42 18.841 42 42z"/></svg>

export const SecurityInfo: React.FC<{container: HTMLElement, scaffold: ExtensionScaffoldApi}> = ({ container, scaffold }) => {
  const [principal, setPrincipal] = React.useState<any>({});
  const [requestInProgress, setRequestInProgress] = React.useState<boolean>(false);
  const [infoModalContent, setInfoModalContent] = React.useState<any>();
  const [infoModalOpen, setInfoModalOpen] = React.useState<boolean>(false);
  const [loginModalContent, setLoginModalContent] = React.useState<any>();
  const [loginModalOpen, setLoginModalOpen] = React.useState<boolean>(false);

  React.useEffect(() => {
    initialize()
  }, [])

  React.useEffect(() => {
    setRequestInProgress(true)
    fetchTokenInfo()
      .then((response={}) => {
        const { userId } = response
        if (userId) {
          setPrincipal(response)
          publishJson('security.principal', response)
        } else {
          setPrincipal({})
          publishJson('security.principal', {})
        }        
      })
      .catch(error => {
        const message = `Unable to get user identity: ${error}`
        console.error(message)
        setLoginModalContent(message)
        setLoginModalOpen(true)
      })
      .finally(() => {
        setRequestInProgress(false)
      })
  }, [setPrincipal, setLoginModalContent, setRequestInProgress]);

  React.useEffect(() => {
      subscribeJson('security.principal.request', (sender, payload, topic) => {
        publishJson('security.principal.response', principal)
      })
  }, [principal])

  React.useEffect(() => {
    if (infoModalOpen) {
        scaffold.chrome.panels.addPanel({
            id: 'security.infomodal',
            location: 'portal-wide',
        }).then(portalDiv => {
            ReactDOM.render(
                <GenericModalPanel  content={infoModalContent} title='Principal Info' showFooter={false} 
                  onAccept={() => {}} onCancel={() => setInfoModalOpen(false)}
                />, portalDiv)
        })
    } else {
        scaffold.chrome.panels.removePanel('security.infomodal')
    }
  }, [infoModalOpen, infoModalContent, setInfoModalOpen])

  React.useEffect(() => {
    if (loginModalOpen) {
        scaffold.chrome.panels.addPanel({
            id: 'security.loginmodal',
            location: 'portal-wide',
        }).then(portalDiv => {
            ReactDOM.render(
                <GenericModalPanel  content={loginModalContent} title='Unknown User' showFooter={true} showCancelButton={false}
                onAcceptText='Retry Login' onCancelText='Cancel' onAccept={() => window.location.reload()}
                  onCancel={() => {/* can't used app if not logged in */}}
                />, portalDiv)
        })
    } else {
        scaffold.chrome.panels.removePanel('security.loginmodal')
    }
  }, [loginModalOpen, loginModalContent, setLoginModalOpen])

  const logout = () => {
    // TODO: we can't fully log the user out yet
    //       and if we are only using PKI without an icam backend, a true logout isn't possible
    //       but maybe we could at least redirect back to the login splash page
    setLoginModalContent("User logged out")
    setPrincipal({})
    publishJson('security.principal', {})
  }

  const login = () => {
    setRequestInProgress(true)
    fetchTokenInfo()
    .then((response={}) => {
      const { userId } = response
      if (userId) {
        setPrincipal(response);
        publishJson('security.principal', response)
      } else {
        setPrincipal({})
        publishJson('security.principal', {})
      }        
    })
    .catch(error => {
      const message = `Unable to get user identity: ${error}`
      console.error(message)
      setLoginModalContent(message)
      setLoginModalOpen(true)
    })
    .finally(() => {
      setRequestInProgress(false)
    })
  }

  const getUserAvatar = () => {
    if (requestInProgress) {
      return <Spinner />
    } else if (principal.userId) {
      return <UserAvatar />
    } else {
      return <label onClick={() => openLoginModal(loginModalContent)}><UserUnknown /></label>
    } 
  }

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

  const getPrincipalContent = () => {
    const { userId, citizenship, clearance, source } = principal;
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
          {getPrincipalEntry("Clearance", clearance)}
          {getPrincipalEntry("Citizenship", citizenship)}
          {getPrincipalEntry("Authentication", source)}
        </div>
    </>
  }

  const openLoginModal = (content: any) => {
    setLoginModalContent(content)
    setLoginModalOpen(true);
  }

  const openInfoModal = (content: any) => {
    setInfoModalContent(content)
    setInfoModalOpen(true);
  }

  const getUserMenu = () => {
    const { userId } = principal;
    const infoContent = getPrincipalContent();

    return <es-ribbon-dropdown>
      <es-ribbon-dropdown-item>
      <label onClick={() => openInfoModal(infoContent)}>{userId}</label>
      </es-ribbon-dropdown-item>
      <es-ribbon-dropdown-item onClick={logout}>
        <label>Logout</label>
      </es-ribbon-dropdown-item>
    </es-ribbon-dropdown>
  }

  return <es-ribbon-section>
    <div style={{ display: 'flex', alignItems: 'flex-end'}}>
        <es-ribbon-button>
          {getUserAvatar()}
          {principal.userId && getUserMenu()}
        </es-ribbon-button>
    </div>
  </es-ribbon-section>
  
}
