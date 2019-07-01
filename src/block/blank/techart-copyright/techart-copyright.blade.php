<div class="{{ $block }}">
	<a class="{{ $block->elem('link')->mod('design') }}" href="https://design.techart.ru/" target="_blank">Дизайн</a>
	и <a class="{{ $block->elem('link')->mod('web') }}" href="https://web.techart.ru/ " target="_blank">разработка сайта</a>
	@php
		//<a class="{{ $block->elem('link')->mod('research') }}" href="https://research.techart.ru/" target="_blank">маркетинговые исследования</a>
		//<a class="{{ $block->elem('link')->mod('web') }}" href="https://web.techart.ru/ " target="_blank">сопровождение сайта</a>
		//<a class="{{ $block->elem('link')->mod('promo') }}" href="https://promo.techart.ru/" target="_blank">продвижение сайта</a>
		//<a class="{{ $block->elem('link')->mod('photo') }}" href="https://photo.techart.ru/" target="_blank">фотосъемка</a>
	@endphp
	&mdash; <a class="{{ $block->elem('link')->mod('main') }}" href="https://techart.ru/" target="_blank">Текарт</a>.
</div>
