@if ($isMain)
	<span class="{{ $block }}">
		<img
			class="{{ $block->elem('img') }}"
			src="{{ $assets->url('img/logo.svg') }}"
			alt="{{ $siteName }}"
		>
	</span>
@else
	<a href="{{ $mainPageUrl }}" class="{{ $block }}">
		<img
			class="{{ $block->elem('img') }}"
			src="{{ $assets->url('img/logo.svg') }}"
			alt="{{ $siteName }}"
		>
	</a>
@endif