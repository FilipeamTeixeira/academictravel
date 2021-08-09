<script>
    	import { page } from '$app/stores';
</script>

<!-- uk-sticky="animation: uk-animation-slide-top; sel-target: .uk-navbar-container; cls-active: uk-navbar-sticky uk-light; cls-inactive: uk-navbar-transparent; top: 200" -->

<nav class="uk-navbar uk-navbar-transparent">
    <div class="uk-navbar-center">
        <div class = "uk-navbar-item"> 
        <span style = "font-size:20px; font-weight:100;"> Academic </span>
        <span style = "font-size:20px; font-weight:300;">Travel</span>
        </div>   
    </div>

    <div class="uk-navbar-left">
        <ul class="uk-navbar-nav uk-visible@m">
            <li class:active={$page.path === '/'}><a sveltekit:prefetch href="/">Home</a></li>
            <li class:active={$page.path === '/map'}><a sveltekit:prefetch href="/map">Map</a></li>
            <li class:active={$page.path === '/frontrunners'}><a sveltekit:prefetch href="/frontrunners">FrontRunners</a></li>
        </ul>

        <div class="uk-navbar-item uk-visible@m">
        </div>
    </div>

    <div class="uk-navbar-right">
        <ul class="uk-navbar-nav uk-visible@m">
            <li class:active={$page.path === '/faqs'}><a sveltekit:prefetch href="/faqs">FAQ</a></li>
            <li class:active={$page.path === '/research'}><a sveltekit:prefetch href="/research">UGent Research</a></li>
            <li class:active={$page.path === '/about_us'}><a sveltekit:prefetch href="/about_us">About Us</a></li>
        </ul>
        <!-- svelte-ignore a11y-missing-content -->
        <a class="uk-navbar-toggle uk-hidden@m" href="#offcanvas" uk-toggle style = "font-size:25px; font-weight:300;">≡</a>
    </div>
</nav>

<style>

.uk-navbar-nav > li > a {
    color:rgb(79, 79, 79);
}

.uk-navbar-nav > li:hover > a,
.uk-navbar-nav > li > a:focus,
.uk-navbar-nav > li.uk-open > a {
    color: #005599;
}

span{
    display: inline-block;
    margin-right: -3px;
}

</style>