<script lang="ts">
	import { Navbar, NavLi, NavUl, NavHamburger, Button } from 'flowbite-svelte';
</script>

<div class="m-auto">
	<img
		class="pt-3 !w-[200px] sm:!w-[300px] md:!w-[500px] xl:!w-[650px] !max-w-none"
		src="/img/achronia_logo.png"
		alt="Achronia Logo"
	/>
</div>

<Navbar class="p-5" let:hidden let:toggle>
	<div class="boxettina w-full list-none justify-between flex mx-auto gap-x-8">
		<div class="flex md:order-2">
			<NavHamburger on:click={toggle} />
			<Button class="text-base" href="/game">Play</Button>
		</div>
		<NavUl {hidden} class="order-1 ">
			<NavLi class="hover:underline hover:text-red-500 text-base" href="/">Travel Log</NavLi>
			<NavLi class="hover:underline hover:text-red-500 text-base" href="/about">News</NavLi>
			<NavLi class="hover:underline hover:text-red-500 text-base" href="/services">Shop</NavLi>
		</NavUl>
	</div>
</Navbar>

<style>
	.boxettina {
		border-image: url('img/border_site.png') 9 fill;
		border-width: 20px;
	}
</style>
