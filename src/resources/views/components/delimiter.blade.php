@inject('stateManager', 'Kasparsb\Ui\View\StateManager')

@if ($direction == 'vertical')
@php
    $svgIconsMarker = $stateManager->queueSvgIcon('ui-icon-delimiter-vertical');
@endphp
{!! $svgIconsMarker !!}
<svg {{ $attributes->class(['delimiter-vertical']) }}>
    <use xlink:href="#ui-icon-delimiter-vertical"></use>
</svg>
@else
<div class="delimiter-horizontal"></div>
@endif
