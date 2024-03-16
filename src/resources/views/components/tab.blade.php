<button {{ $attributes->class([
    'tab',
    'selected' => $selected ? true : false,
]) }}>
    {{ $slot }}
</button>