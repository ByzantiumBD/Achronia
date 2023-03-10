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
		<h1 class="flex justify-center text-center p-10 text-2xl text-blue-4">What is Achronia?</h1>
		<p class="text-base mx-20 text-center">
			Achronia is a fun monster-catching videogame 
			with retro style and an open-world map. It has a 
			single player mode, where you'll face challenges and
			tame Achronians, and a multiplayer one, where you'll
			play against other explorers to see who's the best!
		</p>
		<div class="text-center text-lg mt-10 mb-20 text-pink-2">Are you ready to start your adventure?</div>

		<h1 class="flex justify-center p-10 text-2xl text-blue-4">- News -</h1>
	</div>

	<div class="flex w-3/4 justify-center">
		<Carousel divClass="h-none"
			images={news}/>
	</div>
</section>

<style>
</style>
