<script lang="ts">
    import { border } from "../../routes/stores";
    export let image: {pic: string, pic_small: string, title: string, short: string};
    export let slideClass: string = 'mx-20 flex flex-col align-center';
    let w: number;
</script>
  
<svelte:window bind:innerWidth={w}/>
<div class={slideClass}>
  <div class="pxbox {"b"+($border +1)}">
    <img src={w > 768? 
      image.pic : image.pic_small} alt="news pic" class="w-full h-full">
  </div>
  <h1 class="text-center mt-5 text-pink-2">{image.title}</h1>
  <p class="text-center text-sm mt-3">{image.short}</p>
</div>


<style>
	.pxbox {
    position: relative;
    --img: '/ad_site1.png';
	}
  
  .pxbox:after {
		border-width: 15px;
    content: '';
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
  }

  .b1:after {
    border-image: url('/ad_site1.png') 36 fill;
  }

  .b2:after {
    border-image: url('/ad_site2.png') 36 fill;
  }

  .b3:after {
    border-image: url('/ad_site3.png') 36 fill;
  }

  .b4:after {
    border-image: url('/ad_site4.png') 36 fill;
  }

  .b5:after {
    border-image: url('/ad_site5.png') 36 fill round;
  }

  .b6:after {
    border-image: url('/ad_site6.png') 36 fill;
  }
</style>