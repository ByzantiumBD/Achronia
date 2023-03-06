<script>
    import { base } from '$app/paths'
	import { border } from "./stores"
	import '../app.postcss';
	import Header from './Header.svelte';
	import Footer from './Footer.svelte';
	import './styles.css';

	function changeBorder() {
		border.update(n => (n+1)%6)
	}
</script>

<svelte:head>
	<link rel="icon" href="{base}/favicon.png" />
</svelte:head>

<div class="app display flex bg-game bg-top
	bg-cover bg-fixed items-center flex-col text-myblack"> <!-- Base -->
	<div class="flex flex-col items-center
		md:!w-[768px] xl:!w-[1024px]"> <!--Column-->
		<Header />
		<div 
			class="flex flex-col items-center md:!w-[768px]
				xl:!w-[1024px] pt-5 bodybox {"b"+($border+1)}"> <!--White space-->
			<main class="min-h-[75vh]">
				<slot />
				<div class="flex justify-center pt-10">
					<img on:click={changeBorder} src="{base}/favicon.png" alt="Achronia Logo" class="px-10 mb-3 max-w-none h-none !w-36">
				</div>
			</main>
			<Footer />
		</div>
	</div>
</div>

<style>
	.bodybox {
		border-width: 20px;
	}

	.b1 {
		border-image: url('/border_navbar1.png') 36 fill;
	}

	.b2 {
		border-image: url('/border_navbar2.png') 36 fill;
	}

	.b3 {
		border-image: url('/border_navbar3.png') 36 fill;
	}

	.b4 {
		border-image: url('/border_navbar4.png') 36 fill;
	}

	.b5 {
		border-image: url('/border_navbar5.png') 36 fill round;
	}

	.b6 {
		border-image: url('/border_navbar6.png') 36 fill;
	}
</style>