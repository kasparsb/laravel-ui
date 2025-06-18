@inject('helpers', 'Kasparsb\Ui\Helpers')

@php
$hasEmptyState = isset($emptyState) && !$emptyState->isEmpty();
$hasNewItemPlaceholder = isset($newItemPlaceholder) && !$newItemPlaceholder->isEmpty();
@endphp

<div
    data-repeatable-container

    @if ($newItemLink)
    data-new-item-link="{{ $newItemLink }}"
    @endif

    @if ($hasEmptyState)
    data-repeatable-has-empty-state
    @endif

    @if ($isEmpty)
    data-repeatable-state="empty"
    @endif

    @if ($idFieldSelector)
    data-repeatable-id-field-selector="{{ $idFieldSelector }}"
    @endif
    @if ($deletedFieldSelector)
    data-repeatable-deleted-field-selector="{{ $deletedFieldSelector }}"
    @endif
    >

    <div data-repeatable-content>
        {{ $slot }}
    </div>

    <div data-repeatable-new-item-placeholder>
        @if ($hasNewItemPlaceholder)
        {{ $newItemPlaceholder }}
        @else
        <div hidden></div>
        @endif
    </div>

    @if ($hasEmptyState)
    <div data-repeatable-empty-state>
        {{ $emptyState }}
    </div>
    @endif

</div>
