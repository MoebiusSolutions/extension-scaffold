import {
  publishJson, subscribeJson,
} from '@moesol/inter-widget-communication'

/**
 * Console Log
 */
export interface ConsoleLogRecord {
  level: string
  args: any[]
}

/**
 * Network Log Configuration
 */
export interface NetworkLogConfigurationQuery {
}
export interface NetworkLogConfigurationResponse {
  enabled: boolean
}

/**
 * Network Log Fetch Request
 */
export interface NetworkLogFetchRecord {
  fetchId: string,
  url: string
}
/**
 * Network Log Response
 */
 export interface NetworkLogResponseRecord {
  fetchId: string,
  url: string
  status: number,
  statusText: string
  isError?: boolean,
  duration: number,
}

export interface DeveloperExtensionMessages {
  'extension-scaffold.console.log': ConsoleLogRecord
  'extension-scaffold.network.log.config.query':    NetworkLogConfigurationQuery
  'extension-scaffold.network.log.config.response': NetworkLogConfigurationResponse
  'extension-scaffold.network.log.fetch':           NetworkLogFetchRecord
  'extension-scaffold.network.log.response': NetworkLogFetchRecord
}

export function onDevTools<K extends keyof DeveloperExtensionMessages>(
  channel: K,
  listener: (sender: string, payload: DeveloperExtensionMessages[K], channel: string) => void
) {
  subscribeJson(channel, listener)
}
export function emitDevTools<K extends keyof DeveloperExtensionMessages>(
  channel: K, 
  payload: DeveloperExtensionMessages[K]) 
{
  publishJson(channel, payload)
}

export interface InitConsoleLogOptions {
  /**
   * levels defaults to ['debug', 'info', 'log', 'warn', 'error']
   */
  levels?: string[]
}

export function initConsoleLog(options?: InitConsoleLogOptions) {
  const levels = options?.levels ?? ['debug', 'info', 'log', 'warn', 'error']

  function logPush(level: string, args: any[]) {
    emitDevTools('extension-scaffold.console.log', { level, args })
  }
  try {
    levels.forEach(level => {
      const origFn: any = console[level as keyof Console]
      function newFn(...args: any) { 
        origFn.apply(console, args)
        logPush(level, args.map(toString))
      }
      console[level as keyof Console] = newFn as any
    })
    function toString(a: any) {
      if (a instanceof Error) {
        return a.stack ?? a
      }
      return a
    }
    window.addEventListener('error', (evt: ErrorEvent) => {
      logPush('error', [toString(evt.error)])
    })
    window.addEventListener('unhandledrejection', (evt: PromiseRejectionEvent) => {
      logPush('error', ['Unhandled promise rejection', toString(evt.reason)])
    })
  } catch (e) {
    console.error('Failed to hook console functions')
  }
}

export function initNetworkLog(url: string) {
  onDevTools('extension-scaffold.network.log.config.response', (_, p) => {
    if (p.enabled) {
      registerServiceWorker(url)
    } else {
      unregisterServiceWorker(url)
    }
  })
  emitDevTools('extension-scaffold.network.log.config.query', {})
}

const registerServiceWorker = async (baseUrl: string) => {
  if (!('serviceWorker' in navigator)) {
    console.warn('Browser lacks serviceWorker support')
    return
  }
  try {
    // We neeed baseUrl to get the protocol etc.
    const swUrl = new URL('debug-network-service-worker.js', baseUrl).href
    const registration = await navigator.serviceWorker.register(swUrl);
    if (registration.installing) {
      console.log('Service worker installing');
    } else if (registration.waiting) {
      console.log('Service worker installed');
    } else if (registration.active) {
      console.log('Service worker active');
    }

    navigator.serviceWorker.addEventListener('message', msg => {
      switch  (msg.data.type) {
      case 'extension-scaffold.network-debug.fetch':
        emitDevTools('extension-scaffold.network.log.fetch', msg.data)
        break;
      case 'extension-scaffold.network-debug.response':
        emitDevTools('extension-scaffold.network.log.response', msg.data)
        break;
      }
    })

  } catch (error) {
    console.error(`Registration failed with ${error}`);
  }
};

const unregisterServiceWorker = async (url: string) => {
  if (!('serviceWorker' in navigator)) {
    return
  }
  const r = await navigator.serviceWorker.getRegistration()
  console.log('Unregistering', r)
  r?.unregister()
}
