<div
    {{ $attributes->class([ 'menu-item', ]) }}
    data-options-list-option
    data-value="{{ $value }}"
    {{ $checked ? 'data-checked' : '' }}
    >{{ $slot }}</div>