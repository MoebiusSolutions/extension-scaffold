import App from './App.svelte';

let app;

export async function activate(scaffold) {
	console.log('Svelte example activated')
	const div = await scaffold.chrome.panels.addPanel({
		id: 'ext.example.svelte',
		location: 'right',
		resizeHandle: true,
	})
	console.log('svelte - got panel', div)

	app = new App({
		target: div,
		props: {
			name: 'world'
		}
	});
}
