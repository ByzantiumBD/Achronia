<script lang="ts">
    export let image: {pic: string, title: string, short: string};
    export let slideClass: string = 'mx-20 flex flex-col align-center';
</script>
  
<div class={slideClass}>
  <div class="pxbox">
    <img src={image.pic} alt="news pic" class="rounded-lg w-full h-full">
  </div>
  <h1 class="text-center mt-5 text-pink-2">{image.title}</h1>
  <p class="text-center text-sm mt-3">{image.short}</p>
</div>


<style>
	.pxbox {
    position: relative;
	}
  
  .pxbox:after {
		border-image: url('/border_site2.png') 36 fill;
		border-width: 15px;
    content: '';
    position: absolute;
    top: -10px;
    bottom: -10px;
    left: -10px;
    right: -10px;
  }
</style>