
@if ($hasPages)
<nav {{ $attributes->class(['pagination']) }}>
    @if ($onFirstPage)
        <x-ui::button-ghost as="link" class="icon" disabled="true">
            <svg width="24" height="24" viewBox="0 0 24 24">
                <use xlink:href="#angle-left"></use>
            </svg>
        </x-ui::button-ghost>
    @else
        <x-ui::button-ghost as="link" class="icon" :link="$previousPageUrl">
            <svg width="24" height="24" viewBox="0 0 24 24">
                <use xlink:href="#angle-left"></use>
            </svg>
        </x-ui::button-ghost>
    @endif


    {{-- Pagination Elements --}}
    @foreach ($elements as $element)
    {{-- "Three Dots" Separator --}}
    @if (is_string($element))
        <x-ui::button-ghost class="icon" :disabled="true">{{ $element }}</x-ui::button-ghost>
    @endif

    {{-- Array Of Links --}}
    @if (is_array($element))
        @foreach ($element as $page => $url)
            @if ($page == $currentPage)
                <x-ui::button-outline class="icon">{{ $page }}</x-ui::button-outline>
            @else
                <x-ui::button-ghost class="icon" as="link" :link="$url">{{ $page }}</x-ui::button-ghost>
            @endif
        @endforeach
    @endif
    @endforeach



    @if ($hasMorePages)
        <x-ui::button-ghost as="link" class="icon" :link="$nextPageUrl">
            <svg width="24" height="24" viewBox="0 0 24 24">
                <use xlink:href="#angle-right"></use>
            </svg>
        </x-ui::button-ghost>
    @else
        <x-ui::button-ghost as="link" class="icon" disabled="true">
            <svg width="24" height="24" viewBox="0 0 24 24">
                <use xlink:href="#angle-right"></use>
            </svg>
        </x-ui::button-ghost>
    @endif
</nav>
@endif