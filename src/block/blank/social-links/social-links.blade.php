<div class="{{ $block }}">
	<div class="{{ $block->elem('list') }}">
		@foreach($list as $social)
			<a
				class="{{ $block->elem('link')->mod('type', $social['type']) }}"
				href="{{ $social['link'] }}"
				target="_blank"
				title="{{ $social['name'] }}"
			>{{ $social['name'] }}</a>
		@endforeach
	</div>
</div>