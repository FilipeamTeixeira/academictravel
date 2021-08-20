<script>
    	import { page } from '$app/stores';
        import airplane from '/src/lib/navbar_home/background.png';
</script>

<div class="uk-position-relative" style = "height: 80vh;"> <!--added new height-->
    <img src={airplane} alt="">
    <div class="uk-position-top">

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


        <div class="uk-child-width-1-1@s uk-grid-collapse uk-text-left" uk-grid>
            <div>
                <div class="uk-position-relative uk-visible-toggle" tabindex="-1" uk-slideshow = "autoplay: true; autoplay-interval: 4500; pause-on-hover: true;">
                    <ul class="uk-slideshow-items uk-margin-xlarge-top uk-padding-large-top"> <!--removed margin here-->
                        <li>
                            <div class="uk-position-center uk-position-small uk-text-center">
                                <p class="uk-margin-remove quote">The views were just magnificent as the windows were really large.</p>
                            </div>
                        </li>
                        <li>
                            <div class="uk-position-center uk-position-small uk-text-center">
                                <p class="uk-margin-remove quote">The best experience was waking up on the flixbus in the morning, looking at the Swedish landscape and hoping to spot an elk!</p>
                            </div>
                        </li>
                        <li>
                            <div class="uk-position-center uk-position-small uk-text-center">
                                <p class="uk-margin-remove quote">Slow traveling on the cargo ship with plenty of time to talk, read, work and rest along the way.</p>
                            </div>
                        </li>
                        <li>
                            <div class="uk-position-center uk-position-small uk-text-center">
                                <p class="uk-margin-remove quote">I usually get really a lot of work done during long train trips!</p>
                            </div>
                        </li>
                    </ul>
        
                    <a class="uk-position-center-left uk-position-small uk-hidden-hover" style="color:#d1d1d1;" href="#" uk-slidenav-previous uk-slideshow-item="previous"></a>
                    <a class="uk-position-center-right uk-position-small uk-hidden-hover" style="color:#d1d1d1;" href="#" uk-slidenav-next uk-slideshow-item="next"></a>
        
                </div>
            </div>
        </div>



</div>
</div>



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

.quote{
    font-weight: 100;
    font-family: 'Helvetica';
    font-size:medium;
    color:#8a8a8a;
}

</style>