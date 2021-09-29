@php
	/**
	 * $logo string
	 * $phone string
	 * $cabinet string
	 * $search string
	 * $basket string
	 * $menu string
	**/
@endphp
<div class="{{ $block }}">
	<div class="{{ $block->elem('middle') }}">
		<div class="{{ $block->elem('row') }}">
			<div class="{{ $block->elem('logo') }}">{!! $logo !!}</div>
			<div class="{{ $block->elem('phone') }}">{!! $phone !!}</div>
			<div class="{{ $block->elem('cabinet') }}">{!! $cabinet !!}</div>
			<div class="{{ $block->elem('search') }}">{!! $search !!}</div>
			<div class="{{ $block->elem('basket') }}">{!! $basket !!}</div>
			<div class="{{ $block->elem('menu') }}">{!! $menu !!}</div>
		</div>
	</div>
</div>