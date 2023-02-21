<script lang="ts">
    export let image: {pic: string, title: string, short: string};
    export let slideClass: string = 'mx-20 flex flex-col align-center';
</script>
  
<div class={slideClass}>
  <img src={image.pic} alt="news pic">
  <h1 class="text-center ">{image.title}</h1>
  <p class="text-center text-sm mt-3">{image.short}</p>
</div>