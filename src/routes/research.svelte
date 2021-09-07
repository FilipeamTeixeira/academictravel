<script context="module">
	export const prerender = true;
	
	import research_sciences from "/static/json_files/research_sciences.json";
	import research_politics from "/static/json_files/research_politics.json";
	import research_economics from "/static/json_files/research_economics.json";
	import logo_science from "/static/pictures/logo_sciences.png";
	import logo_political from "/static/pictures/logo_political.png";
	import logo_economics from "/static/pictures/logo_economics.png";

</script>

<!-- <div style="overflow:auto; width:100%; height:100vh;">Soon...</div> -->


<div class="uk-section uk-margin-small-left uk-margin-small-right uk-padding-small-top" style="background-color: #F5F5F5;">
        <div class="uk-child-width-1-3@m uk-grid-small uk-padding-remove-bottom uk-margin-remove-bottom" uk-grid >
        <div>
			<div class = "uk-padding-remove uk-margin-remove">
				<img src = {logo_science} alt="" class = "uk-padding-remove-top uk-margin-remove-top">
			</div>
            <div class="uk-tile uk-padding-remove-top">
				<h2 class = "uk-text-bold">Department of Geography, Social and Economic Geography</h2>
				<p class = "uk-text-bold" style="font-family:Helvetica; font-weight:400">Journal publications:</p>
				{#each research_sciences['geography']['journal'] as research_sciences}
				<p style="font-family:Helvetica; font-weight:100;">{research_sciences.authors} 
					({research_sciences.year})<br>
					{research_sciences.title} <br>
					{research_sciences.journal} 
					{research_sciences.pages}</p>
				{/each}

				<p class = "uk-text-bold" style="font-family:Helvetica; font-weight:400">Doctoral dissertations:</p>
				{#each research_sciences['geography']['doctoral'] as research_sciences}
				<p style="font-family:Helvetica; font-weight:100;">{research_sciences.authors} 
					({research_sciences.year})<br>
					{research_sciences.title} <br>
					{research_sciences.journal} 
					{research_sciences.pages}</p>
				{/each}

				<p class = "uk-text-bold" style="font-family:Helvetica; font-weight:400">Master dissertations:</p>
				{#each research_sciences['geography']['master'] as research_sciences}
				<p style="font-family:Helvetica; font-weight:100;">{research_sciences.authors} 
					({research_sciences.year})<br>
					{research_sciences.title} <br>
					{research_sciences.journal} 
					{research_sciences.pages}</p>
				{/each}

				<p class = "uk-text-bold" style="font-family:Helvetica; font-weight:400">Media articles:</p>
				{#each research_sciences['geography']['media'] as research_sciences}
				<p style="font-family:Helvetica; font-weight:100;">{research_sciences.authors} 
					({research_sciences.year})<br>
					{research_sciences.title} <br>
					{research_sciences.journal} 
					{research_sciences.pages}</p>
				{/each}
			</div>
		</div>


        <div>
			<div class = "uk-padding-remove uk-margin-remove">
			<img src = {logo_economics} alt="" class = "uk-padding-remove uk-margin-remove">
		</div>
            <div class="uk-tile uk-padding-remove uk-margin-remove">
				<h2 class = "uk-text-bold">Centre for Sustainable Development</h2>
				<p class = "uk-text-bold" style="font-family:Helvetica; font-weight:400">Journal publications:</p>
				{#each research_economics['group']['journal'] as research_economics}
				<p style="font-family:Helvetica; font-weight:100;">{research_economics.authors} 
					({research_economics.year})<br>
					{research_economics.title} <br>
					{research_economics.journal} 
					{research_economics.pages}</p>
				{/each}

				<p class = "uk-text-bold" style="font-family:Helvetica; font-weight:400">Doctoral dissertations:</p>
				{#each research_economics['group']['doctoral'] as research_economics}
				<p style="font-family:Helvetica; font-weight:100;">{research_economics.authors} 
					({research_economics.year})<br>
					{research_economics.title} <br>
					{research_economics.journal} 
					{research_economics.pages}</p>
				{/each}

				<p class = "uk-text-bold" style="font-family:Helvetica; font-weight:400">Master dissertations:</p>
				{#each research_economics['group']['master'] as research_economics}
				<p style="font-family:Helvetica; font-weight:100;">{research_economics.authors} 
					({research_economics.year})<br>
					{research_economics.title} <br>
					{research_economics.journal} 
					{research_economics.pages}</p>
				{/each}

				<p class = "uk-text-bold" style="font-family:Helvetica; font-weight:400">Media articles:</p>
				{#each research_economics['group']['media'] as research_economics}
				<p style="font-family:Helvetica; font-weight:100;">{research_economics.authors} 
					({research_economics.year})<br>
					{research_economics.title} <br>
					{research_economics.journal} 
					{research_economics.pages}</p>
				{/each}
			</div>
		</div>



        <div>
			<div class = "uk-padding-remove uk-margin-remove">
				<img src = {logo_political} alt="" class = "uk-padding-remove uk-margin-remove">
			</div>
            <div class="uk-tile uk-padding-remove-top">
				<h2 class = "uk-text-bold">Centre for Higher Education Governance Ghent (CHEGG)</h2>
				<p class = "uk-text-bold" style="font-family:Helvetica; font-weight:400">Journal publications:</p>
				{#each research_politics['group']['journal'] as research_politics}
				<p style="font-family:Helvetica; font-weight:100;">{research_politics.authors} 
					({research_politics.year})<br>
					{research_politics.title} <br>
					{research_politics.journal} 
					{research_politics.pages}</p>
				{/each}

				<p class = "uk-text-bold" style="font-family:Helvetica; font-weight:400">Doctoral dissertations:</p>
				{#each research_politics['group']['doctoral'] as research_politics}
				<p style="font-family:Helvetica; font-weight:100;">{research_politics.authors} 
					({research_politics.year})<br>
					{research_politics.title} <br>
					{research_politics.journal} 
					{research_politics.pages}</p>
				{/each}

				<p class = "uk-text-bold" style="font-family:Helvetica; font-weight:400">Master dissertations:</p>
				{#each research_politics['group']['master'] as research_politics}
				<p style="font-family:Helvetica; font-weight:100;">{research_politics.authors} 
					({research_politics.year})<br>
					{research_politics.title} <br>
					{research_politics.journal} 
					{research_politics.pages}</p>
				{/each}

				<p class = "uk-text-bold" style="font-family:Helvetica; font-weight:400">Media articles:</p>
				{#each research_politics['group']['media'] as research_politics}
				<p style="font-family:Helvetica; font-weight:100;">{research_politics.authors} 
					({research_politics.year})<br>
					{research_politics.title} <br>
					{research_politics.journal} 
					{research_politics.pages}</p>
				{/each}
			</div>
		</div>


		</div>

</div>		

