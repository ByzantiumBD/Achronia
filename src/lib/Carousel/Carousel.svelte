<script lang="ts">
    import Slide from './Slide.svelte';
    import arrowLeft from "./arrow-left.png"
    import arrowRight from "./arrow-right.png"
    export let images: any[];
    export let slideControls: boolean = true;
    let hover = false;
    $: loop = !hover;
    export let duration: number = 3000;
    // Carousel
    export let divClass: string = 'overflow-hidden relative h-56 rounded-lg sm:h-64 xl:h-80 2xl:h-96';
    let imageShowingIndex: number = 0;
    $: image = images[imageShowingIndex];
    const nextSlide = () => {
      if (imageShowingIndex === images.length - 1) {
        imageShowingIndex = 0;
      } else {
        imageShowingIndex += 1;
      }
    };
    const prevSlide = () => {
      if (imageShowingIndex === 0) {
        imageShowingIndex = images.length - 1;
      } else {
        imageShowingIndex -= 1;
      }
    };
    if (loop) {
      setInterval(() => {
        nextSlide();
      }, duration);
    }
  </script>
  
  <div id="default-carousel" 
    on:mouseenter={()=>{hover=true}} 
    on:mouseleave={()=>{hover=false}} 
    class="relative">
    <div class={divClass}>
      <Slide {image} />
    </div>
    {#if slideControls}
      <!-- Slider controls -->
      <button
        on:click={prevSlide}
        type="button"
        class="flex absolute top-0 left-0 z-30 justify-center items-center px-4 h-full cursor-pointer group focus:outline-none"
        data-carousel-prev>
        <span
          class="inline-flex justify-center items-center w-8 h-8 rounded-full sm:w-10 sm:h-10 bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
          {#if $$slots.previous}
            <slot name="previous" />
          {:else}
            <img src={arrowLeft} alt="previous"/>
          {/if}
          <span class="hidden">Previous</span>
        </span>
      </button>
      <button
        on:click={nextSlide}
        type="button"
        class="flex absolute top-0 right-0 z-30 justify-center items-center px-4 h-full cursor-pointer group focus:outline-none"
        data-carousel-next>
        <span
          class="inline-flex justify-center items-center w-8 h-8 rounded-full sm:w-10 sm:h-10 bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
          {#if $$slots.next}
            <slot name="next" />
          {:else}
          <img src={arrowRight} alt="next"/>
          {/if}
          <span class="hidden">Next</span>
        </span>
      </button>
    {/if}
  </div>