@inject('stateManager', 'Kasparsb\Ui\View\StateManager')

@php
    $stateManager->queueSvgIcon('ui-icon-dots');
@endphp
<x-ui::button-ghost
    class="icon small"
    data-r="tableRowActions"
    :menu="$menu"
    :menu-show="$menuShow"
    :menu-position-dir="$menuPositionDir"
    :menu-position-at-dir="$menuPositionAtDir"
    >
    <svg width="24" height="24" viewBox="0 0 24 24">
        <use xlink:href="#ui-icon-dots"></use>
    </svg>
</x-ui::button-ghost>