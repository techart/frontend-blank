@php
/**
 * $withoutContainer bool
 * $content string
 * $header string
 * $footer string
**/
@endphp

<div class="{{ $block }}">
	<main class="{{ $block->elem('content') }}">
		@if (!$withoutContainer)
			<div class="{{ $block->elem('page-container') }}">
		@endif

				{!! $content !!}

		@if (!$withoutContainer)
			</div>
		@endif
	</main>
	<header class="{{ $block->elem('header') }}">
		{!! $header !!}
	</header>
	<footer class="{{ $block->elem('footer') }}">
		{!! $footer !!}
	</footer>
</div>