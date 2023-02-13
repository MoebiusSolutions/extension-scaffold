/**
 * This file is just a silly example to show everything working in the browser.
 * When you're ready to start on your site, clear the file. Happy hacking!
 **/

import { initConsoleLog, initNetworkLog } from '@moesol/es-iframe-to-dev-ext';
import { initialize, subscribeJson } from '@moesol/inter-widget-communication';

function setupIwc() {
  const url = new URL(window.location.toString())
  const provider = url.searchParams.get('iwc') ?? 'broadcast'
  const busUrl = url.searchParams.get('busUrl') ?? 'bcst-bus'

  initialize({
    // @ts-ignore
    provider,
    busUrl
  })
  subscribeJson('es.ping.topic', (sender, message, topic) => {
    const div = document.getElementById('ping')
    if (div) {
      div.innerText = JSON.stringify({ sender, message, topic })
    }
  })
}

function bindButtons() {
  document.getElementById('hello')?.addEventListener('click', () => {
    console.log('logging hello at info')
  })
  document.getElementById('world')?.addEventListener('click', () => {
    console.warn('logging world at warn')
  })
  document.getElementById('fetch')?.addEventListener('click', () => {
    fetch('http://hastings-foundation.org')
  })
  document.getElementById('throw')?.addEventListener('click', () => {
    throw new Error('throw test')
  })
}

setupIwc()

initConsoleLog()

initNetworkLog(window.location.href)

bindButtons()

console.log('IFrame example loaded')
