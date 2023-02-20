<script>
	import '../app.postcss';
	import Header from './Header.svelte';
	import Footer from './Footer.svelte';
	import './styles.css';
</script>

<div class="app display flex bg-black items-center flex-col"> <!-- Base -->
	<div class="flex flex-col items-center bg-white md:!w-[768px]  xl:!w-[1024px]"> <!--White space-->
		<Header />

		<main>
			<slot />
		</main>

		<Footer />
	</div>
</div>
