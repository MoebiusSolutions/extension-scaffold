/**
 * This file is just a silly example to show everything working in the browser.
 * When you're ready to start on your site, clear the file. Happy hacking!
 **/

import confetti from 'canvas-confetti';
import { initialize, subscribeJson } from '@gots/noowf-inter-widget-communication';

function handleLoad() {
  confetti.create(document.getElementById('canvas') as HTMLCanvasElement, {
    resize: true,
    useWorker: true,
  })({ particleCount: 200, spread: 200 });
}

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

setupIwc()

console.log('IFrame example loaded')
