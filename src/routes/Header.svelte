<script lang="ts">
    import { base } from '$app/paths'
	import title from "$lib/img/achronia_logo.png"
	import gem from "$lib/img/achronia_logo_phone.png"
	import { Navbar, NavLi, NavUl, NavHamburger, Button } from 'flowbite-svelte';
	import pointer from "$lib/Carousel/arrow-right.png"
	import { onMount } from 'svelte';
	import { border } from './stores';

	enum status {
		normal = "pixelbuttonstd",
		hover = "pixelbuttonhover",
		focus = "pixelbuttonactive"
	}
	let buttonStatus = status.normal
	function makeHover() { buttonStatus = status.hover }
	function makeFocus() { buttonStatus = status.focus; setTimeout(makeNormal, 300) }
	function makeNormal() { buttonStatus = status.normal }
</script>

<div class="m-auto">
	<img
		class="py-3 !w-[200px] hidden sm:block sm:!w-[500px] md:!w-[500px] xl:!w-[650px] !max-w-none"
		src={title}
		alt="Achronia Logo"
	/>
	<img
		class="py-3 !w-[270px] sm:hidden"
		src={gem}
		alt="Achronia Logo"
	>
</div>

<Navbar class="p-5 bg-transparent mb-3" navClass="!bg-transparent px-2 sm:px-4 py-2.5 w-full" let:hidden let:toggle>
	<div class="pixelbox {"b"+($border + 1)} w-full list-none justify-between flex flex-col md:flex-row mx-auto gap-x-8">
		<div class="flex md:order-2 w-full md:w-auto justify-between">
			<NavHamburger on:click={toggle} />
			<button on:mouseenter={makeHover} on:mouseleave={makeNormal} on:focus={makeHover} on:mousedown={makeFocus} on:click={makeFocus}
				class="pixelbutton {buttonStatus} mr-4 px-3">
				<Button btnClass="text-center text-orange-1 text-lg inline-flex items-center justify-center" href="{base}/404">
					Play!
				</Button>
			</button>
		</div>
		<NavUl {hidden} class="order-1 ">
			<NavLi class="hover:underline text-base" 
				activeClass="" nonActiveClass="" href="{base}/">
				<span class="flex items-center">
					<img class="w-3 h-3 mr-2" src={pointer} alt="pointer">
					Home
				</span>
			</NavLi>
			<NavLi class="hover:underline text-base" 
				activeClass="" nonActiveClass="" href="{base}/404">
				<span class="flex items-center">
					<img class="w-3 h-3 mr-2" src={pointer} alt="pointer">
					Notes
				</span>
			</NavLi>
			<NavLi class="hover:underline text-base" 
				activeClass="" nonActiveClass="" href="{base}/404">
				<span class="flex items-center">
					<img class="w-3 h-3 mr-2" src={pointer} alt="pointer">
					News
				</span>
			</NavLi>
			<NavLi class="hover:underline text-base" 
				activeClass="" nonActiveClass="" href="{base}/404">
				<span class="flex items-center">
					<img class="w-3 h-3 mr-2" src={pointer} alt="pointer">
					Shop
				</span>
			</NavLi>
		</NavUl>
	</div>
</Navbar>

<style>
	.pixelbox {
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
	.pixelbutton {
		border-width: 15px;
		cursor: pointer;
	}
	.pixelbuttonstd{
		border-image: url('/border_button.png') 36 fill;
	}
	.pixelbuttonhover{
		border-image: url('/border_button_hover.png') 36 fill;
	}
	.pixelbuttonactive{
		border-image: url('/border_button_focus.png') 36 fill;
	}
</style>
