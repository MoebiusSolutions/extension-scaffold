import App from './App.svelte';

let app;

function loadStylesheet(parent, url, base) {
	const href = new URL(url, base)

	const link = document.createElement('link')
	link.rel = 'stylesheet'
	link.href = href.toString()
	parent.appendChild(link)
}

export async function activate(scaffold, base) {
	const div = await scaffold.chrome.panels.addPanel({
		title: 'Svelte Panel',
		id: 'ext.example.svelte',
		location: 'right',
		resizeHandle: true,
	})

	loadStylesheet(div, '/global.css', base)
	loadStylesheet(div, '/build/bundle.css', base)

	app = new App({
		target: div,
		props: {
			name: 'world'
		}
	});
}
