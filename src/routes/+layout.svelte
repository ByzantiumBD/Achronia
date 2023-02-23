<script>
	import '../app.postcss';
	import Header from './Header.svelte';
	import Footer from './Footer.svelte';
	import './styles.css';
</script>

<div class="app display flex bg-game bg-top
	bg-cover bg-fixed items-center flex-col text-myblack"> <!-- Base -->
	<div class="flex flex-col items-center
		md:!w-[768px] xl:!w-[1024px]"> <!--Column-->
		<Header />
		<div 
			class="flex flex-col items-center md:!w-[768px]
				xl:!w-[1024px] pt-5 bodybox"> <!--White space-->
			<main class="min-h-[75vh]">
				<slot />
				<div class="flex justify-center pt-10">
					<img src="/favicon.png" alt="Achronia Logo" class="px-10 mb-3 max-w-none h-none !w-36">
				</div>
			</main>
			<Footer />
		</div>
	</div>
</div>

<style>
	.bodybox {
		border-image: url('/border_site1.png') 36 fill;
		border-width: 15px;
	}
</style>