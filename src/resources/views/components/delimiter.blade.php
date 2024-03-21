@if ($direction == 'vertical')
<svg {{ $attributes->class(['delimiter-vertical']) }}>
    <use xlink:href="#delimiter-vertical"></use>
</svg>
@else
<div class="delimiter-horizontal"></div>
@endif
