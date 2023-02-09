<script lang="ts">
    import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte'
</script>

<Navbar let:hidden let:toggle>
    <NavBrand href="/">
        <img
        src="/img/achronia_logo.png"
        class="mr-3 h-6 sm:h-9"
        alt="Achronia Logo"
        />
    </NavBrand>
    <NavHamburger on:click={toggle} />
    <NavUl {hidden}>
        <NavLi href="/" active={true}>Home</NavLi>
        <NavLi href="/about">About</NavLi>
        <NavLi href="/services">Services</NavLi>
        <NavLi href="/contact">Contact</NavLi>
    </NavUl>
</Navbar>