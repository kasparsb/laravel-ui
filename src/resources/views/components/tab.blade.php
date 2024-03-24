@if ($as == 'link')
<a
    href="{{ $link }}"
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