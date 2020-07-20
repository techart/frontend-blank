<section class="{{ $block }}">
	@foreach ($items as $item)
		<div class="{{ $block->elem('item') }}">
			{!! $item !!}
		</div>
	@endforeach
</section>