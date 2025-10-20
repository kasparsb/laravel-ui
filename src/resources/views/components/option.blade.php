<div
    {{ $attributes->class([
        'menu-item',
    ]) }}
    data-dropdown-menu-close-stack="false"
    data-options-list-option
    data-value="{{ $value }}"
    @if ($checked)
    data-checked
    @endif
    @if ($disabled)
    disabled
    @endif
    >{{ $slot }}</div>