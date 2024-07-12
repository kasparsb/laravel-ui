<div
    {{ $attributes->class([ 'menu-item', ]) }}
    data-r="option"
    data-value="{{ $value }}"
    {{ $checked ? 'data-checked' : '' }}
    >{{ $slot }}</div>