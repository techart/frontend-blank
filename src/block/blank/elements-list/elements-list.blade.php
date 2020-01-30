<div class="{{ $block }}">
	@foreach ($items as $item)
		<div class="{{ $block->elem('item') }}">
			{!! $item !!}
		</div>
	@endforeach
</div>