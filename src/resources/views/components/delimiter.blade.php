@inject('stateManager', 'Kasparsb\Ui\View\StateManager')

@if ($direction == 'vertical')
@php
    $stateManager->queueSvgIcon('ui-icon-delimiter-vertical');
@endphp
<svg {{ $attributes->class(['delimiter-vertical']) }}>
    <use xlink:href="#ui-icon-delimiter-vertical"></use>
</svg>
@else
<div class="delimiter-horizontal"></div>
@endif
