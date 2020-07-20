<article class="{{ $block }}" id="{{ $editAreaId }}">
	<div class="{{ $block->elem('img-container') }}">
		@if ($image)
			<img
				class="{{ $block->elem('img') }}"
				src="{{ $image['src'] }}"
				alt="{{ $image['alt'] }}"
				title="{{ $image['title'] }}"
				width="{{ $image['width'] }}"
				height="{{ $image['height'] }}"
			>
		@endif
	</div>
	<div class="{{ $block->elem('right-box') }}">
		<div class="{{ $block->elem('title') }}">
			<span class="{{ $block->elem('id') }}">#{{ $id }}</span>
			<a class="{{ $block->elem('link') }}" href="{{ $url }}">
				{!! $title !!}
			</a>
		</div>
		<div class="{{ $block->elem('text') }}">{!! $text !!}</div>
		@if ($date)
			<div class="{{ $block->elem('date') }}">{{ $date }}</div>
		@endif
	</div>
</article>