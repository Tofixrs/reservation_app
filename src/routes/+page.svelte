<script lang="ts">
	import * as Carouzel from '$lib/client/components/carouzel';
	import Img1 from '$lib/assets/images/front_page/HotelWarszawa1.jpg';
	import Img2 from '$lib/assets/images/front_page/HotelWarszawa2.jpg';
	import Img3 from '$lib/assets/images/front_page/HotelWarszawa3.jpg';
	import Img4 from '$lib/assets/images/front_page/HotelWarszawa4.jpg';
	import Img5 from '$lib/assets/images/front_page/HotelWarszawa5.jpg';
	import { _ } from 'svelte-i18n';
</script>

<h1 class="text-center text-5xl max-sm:text-3xl">{$_('name')}</h1>
<Carouzel.Root class="m-auto max-w-[65%] max-sm:max-w-[100%]">
	<Carouzel.Item><img src={Img1} alt="" class="rounded-xl" /></Carouzel.Item>
	<Carouzel.Item><img src={Img2} alt="" class="rounded-xl" /></Carouzel.Item>
	<Carouzel.Item><img src={Img3} alt="" class="rounded-xl" /></Carouzel.Item>
	<Carouzel.Item><img src={Img4} alt="" class="rounded-xl" /></Carouzel.Item>
	<Carouzel.Item><img src={Img5} alt="" class="rounded-xl" /></Carouzel.Item>
</Carouzel.Root>

<div class="flex justify-center text-4xl max-sm:text-2xl">
	<a
		href="/rooms"
		class="text-text border-text hover:text-primary hover:border-primary block rounded-3xl border-2 px-10 py-5 text-center no-underline transition-colors"
	>
		{$_('reserve_now')}
	</a>
</div>
