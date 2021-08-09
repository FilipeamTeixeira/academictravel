<script>
	import { page } from '$app/stores';
	import NavbarHome from '/src/lib/navbar_home/navbar_home.svelte';
	import Navbar from '/src/lib/navbar/navbar.svelte';
	import NavbarMap from '/src/lib/navbar_map/navbar_map.svelte';
	import '../app.css';
	import '@fontsource/roboto';

</script>

{#if $page.path === '/'}
<NavbarHome />
{/if}
{#if $page.path === '/map'}
<NavbarMap />
{/if}
{#if $page.path !== '/' && $page.path !== '/map'}
<Navbar />
{/if}



<main>
	<slot />
</main>

<footer>

</footer>

<div id="offcanvas" uk-offcanvas="mode: push; overlay: true">
    <div class="uk-offcanvas-bar">
        <div class="uk-panel">
            <ul class="uk-nav uk-nav-default tm-nav">
                <li class:active={$page.path === '/'}><a sveltekit:prefetch href="/">Home</a></li>
                <li class:active={$page.path === '/map'}><a sveltekit:prefetch href="/map">Map</a></li>
                <li class:active={$page.path === '/frontrunners'}><a sveltekit:prefetch href="/frontrunners">FrontRunners</a></li>
                <li class:active={$page.path === '/faqs'}><a sveltekit:prefetch href="/faqs">FAQ</a></li>
                <li class:active={$page.path === '/research'}><a sveltekit:prefetch href="/research">UGent Research</a></li>
                <li class:active={$page.path === '/about_us'}><a sveltekit:prefetch href="/about_us">About Us</a></li>
             </ul>
        </div>
    </div>
</div>

<style>
	main {
		font-family: 'Roboto';
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 0;
		width: 100%;
		margin: 0 auto;
		box-sizing: border-box;
		background: #f5f5f5;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 40px;
		background: #f5f5f5;
	}

/*	footer a {
		font-weight: bold;
	}
*/

	@media (min-width: 480px) {
		footer {
			padding: 40px 0;
		}
	}

</style>
