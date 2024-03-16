@if ($as == 'link')
<a
    href="{{ $href }}"
    {{ $attributes->class([
    'tab',
    'selected' => $selected ? true : false,
    ]) }}
    >
    {{ $slot }}
</a>
@else
<button {{ $attributes->class([
    'tab',
    'selected' => $selected ? true : false,
]) }}>
    {{ $slot }}
</button>
@endif