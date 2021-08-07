<script context="module">
	export const prerender = true;
	
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<div class="uk-section uk-section-default">
    <div class="uk-container">

        <h3>Section Default</h3>

        <div class="uk-grid-match uk-child-width-1-3@m" uk-grid>
            <div>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</p>
            </div>
            <div>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</p>
            </div>
            <div>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</p>
            </div>
        </div>

    </div>
</div>


	<div class="uk-child-width-1-1@s uk-grid-collapse uk-text-left" uk-grid>
		<div>
			<div class="uk-tile">
			</div>
		</div>
		<div>
			<div class="uk-tile uk-tile-primary">
				<p class="uk-h4">Primary</p>
			</div>
		</div>
		<div>
			<div class="uk-tile uk-tile-secondary">
				<p class="uk-h4">Secondary</p>
			</div>
		</div>
	</div>

<style>

</style>
