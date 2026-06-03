@inject('helpers', 'Kasparsb\Ui\Helpers')
@inject('stateManager', 'Kasparsb\Ui\View\StateManager')

@php
    $stateManager->queueSvgIcons([
        'ui-icon-loading',
    ]);
@endphp

<span {{ $attributes->class([
    'spinner' => true,
    'w-4' => !$helpers->hasAnyWidthClass($attributes->get('class')),
]) }} >
    <svg width="24" height="24" viewBox="0 0 24 24">
        <use xlink:href="#ui-icon-loading"></use>
    </svg>
</span>