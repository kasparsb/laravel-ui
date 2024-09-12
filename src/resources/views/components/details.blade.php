<dl {{ $attributes->class([
    'details-list' => true,
]) }}>
    @if (is_iterable($details))
        @foreach ($details as $term => $description)
        <x-ui::detail :term="$term" :description="$description" />
        @endforeach
    @else
    {{ $slot }}
    @endif
</dl>