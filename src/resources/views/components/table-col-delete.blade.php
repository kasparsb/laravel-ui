@inject('stateManager', 'Kasparsb\Ui\View\StateManager')

@php
    $stateManager->queueSvgIcons([
        'ui-icon-trash',
    ]);
@endphp
<x-ui::button-ghost
    class="icon"
    data-r="tableRowDelete"
    as="delete.tableRow"
    >
    <svg width="24" height="24" viewBox="0 0 24 24">
        <use xlink:href="#ui-icon-trash"></use>
    </svg>
</x-ui::button-ghost>