import adapter from '@sveltejs/adapter-netlify';

export default {
	kit: {
		adapter: adapter(), // currently the adapter does not take any options
		target: '#svelte'
	}
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte'
	}
};

//export default config;
