<div
    {{ $attributes->class([
        'menu-item',
    ]) }}
    data-dropdown-menu-close-stack="false"
    data-options-list-option
    data-value="{{ $value }}"
    {{ $checked ? 'data-checked' : '' }}
    >{{ $slot }}</div>