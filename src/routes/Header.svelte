<script lang="ts">
	import title from "$lib/img/achronia_logo.png"
	import { Navbar, NavLi, NavUl, NavHamburger, Button } from 'flowbite-svelte';
	import pointer from "$lib/Carousel/arrow-right.png"
	import { onMount } from 'svelte';

	enum status {
		normal = "pixelbuttonstd",
		hover = "pixelbuttonhover",
		focus = "pixelbuttonactive"
	}
	let buttonStatus = status.normal
	function makeHover() { buttonStatus = status.hover }
	function makeFocus() { buttonStatus = status.focus; setTimeout(makeNormal, 300) }
	function makeNormal() { buttonStatus = status.normal }

	onMount(async () => {
		makeHover();
		setTimeout(()=>{
			buttonStatus = status.focus; 
			setTimeout(makeNormal, 1);
		}, 1)
	});
</script>

<div class="m-auto">
	<img
		class="py-3 !w-[200px] sm:!w-[300px] md:!w-[500px] xl:!w-[650px] !max-w-none"
		src={title}
		alt="Achronia Logo"
	/>
</div>

<Navbar class="p-5 bg-transparent mb-3" navClass="!bg-transparent px-2 sm:px-4 py-2.5 w-full" let:hidden let:toggle>
	<div class="pixelbox w-full list-none justify-between flex flex-col md:flex-row mx-auto gap-x-8">
		<div class="flex md:order-2 w-full md:w-auto justify-between">
			<NavHamburger on:click={toggle} />
			<button on:mouseenter={makeHover} on:mouseleave={makeNormal} on:focus={makeHover} on:mousedown={makeFocus} on:click={makeFocus}
				class="pixelbutton {buttonStatus} mr-4 px-3">
				<Button btnClass="text-center text-orange-1 text-lg inline-flex items-center justify-center" href="/game">
					Play!
				</Button>
			</button>
		</div>
		<NavUl {hidden} class="order-1 ">
			<NavLi class="hover:underline text-base" 
				activeClass="" nonActiveClass="" href="/">
				<span class="flex items-center">
					<img class="w-3 h-3 mr-2" src={pointer} alt="pointer">
					Home
				</span>
			</NavLi>
			<NavLi class="hover:underline text-base" 
				activeClass="" nonActiveClass="" href="/log">
				<span class="flex items-center">
					<img class="w-3 h-3 mr-2" src={pointer} alt="pointer">
					Notes
				</span>
			</NavLi>
			<NavLi class="hover:underline text-base" 
				activeClass="" nonActiveClass="" href="/news">
				<span class="flex items-center">
					<img class="w-3 h-3 mr-2" src={pointer} alt="pointer">
					News
				</span>
			</NavLi>
			<NavLi class="hover:underline text-base" 
				activeClass="" nonActiveClass="" href="/shop">
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
		border-image: url('/border_site1.png') 36 fill;
		border-width: 15px;
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
