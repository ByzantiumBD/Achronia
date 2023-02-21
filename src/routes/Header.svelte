<script lang="ts">
	import title from "$lib/img/achronia_logo.png"
	import { Navbar, NavLi, NavUl, NavHamburger, Button } from 'flowbite-svelte';
</script>

<div class="m-auto">
	<img
		class="py-3 !w-[200px] sm:!w-[300px] md:!w-[500px] xl:!w-[650px] !max-w-none"
		src={title}
		alt="Achronia Logo"
	/>
</div>

<Navbar class="p-5" let:hidden let:toggle>
	<div class="pixelbox w-full list-none justify-between flex mx-auto gap-x-8">
		<div class="flex md:order-2">
			<NavHamburger on:click={toggle} />
			<Button class="text-base" href="/game">Play</Button>
		</div>
		<NavUl {hidden} class="order-1 ">
			<NavLi class="hover:underline hover:text-red-500 text-base" href="/log">Travel Log</NavLi>
			<NavLi class="hover:underline hover:text-red-500 text-base" href="/news">News</NavLi>
			<NavLi class="hover:underline hover:text-red-500 text-base" href="/shop">Shop</NavLi>
		</NavUl>
	</div>
</Navbar>

<style>
	.pixelbox {
		border-image: url('/border_site.png') 9 fill;
		border-width: 20px;
	}
</style>
