<script lang="ts">
	import news from '../news';
	import Carousel from "$lib/Carousel/Carousel.svelte";
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Achronia home" />
</svelte:head>

<section class="flex flex-col items-center">
	<div>
		<h1 class="flex justify-center p-5 text-xl">What is Achronia?</h1>
		<p class="text-base mx-20 text-center">
			Achronia is a fun monster-catching videogame 
			with retro style and an open-world map. It has a 
			single player mode, where you'll face challenges and
			tame Achronians, and a multiplayer one, where you'll
			play agains other explorers to see who's the best!
		</p>
		<div class="text-center text-lg mt-10 mb-20">Are you ready to start your adventure?</div>

		<h1 class="flex justify-center p-5 text-xl">News</h1>
	</div>

	<div class="flex w-3/4 justify-center">
		<Carousel divClass="h-none"
			images={news}/>
	</div>
</section>

<style>
</style>
