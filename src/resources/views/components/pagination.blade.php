@if ($hasPages)
<nav {{ $attributes->class(['pagination']) }}>
    @if (!$hideNavPrev)
        @if ($onFirstPage)
            <x-ui::button
                variant="{{ $navPrevVariant }}"
                data-pagination-button-name="page-prev"
                as="link"
                class="icon"
                disabled="true">
                <svg width="24" height="24" viewBox="0 0 24 24">
                    <use xlink:href="#angle-left"></use>
                </svg>
            </x-ui::button>
        @else
            <x-ui::button
                variant="{{ $navPrevVariant }}"
                data-pagination-button-name="page-prev"
                as="link"
                class="icon"
                :link="$previousPageUrl">
                <svg width="24" height="24" viewBox="0 0 24 24">
                    <use xlink:href="#angle-left"></use>
                </svg>
            </x-ui::button>
        @endif
    @endif


    {{-- Pagination Elements --}}
    @foreach ($elements as $element)
    {{-- "Three Dots" Separator --}}
    @if (is_string($element))
        <x-ui::button
            variant="{{ $dotsVariant }}"
            class="icon"
            data-role="placeholder"
            :disabled="true"
            :tabindex="false"
            >{{ $element }}</x-ui::button>
    @endif

    {{-- Array Of Links --}}
    @if (is_array($element))
        @foreach ($element as $page => $url)
            @if ($page == $currentPage)
                <x-ui::button
                    variant="{{ $currentPageVariant }}"
                    data-pagination-button-name="page-{{ $page }}"
                    class="icon"
                    data-role="currentpage"
                    :tabindex="false"
                    >{{ $page }}</x-ui::button>
            @else
                <x-ui::button
                    variant="{{ $pageVariant }}"
                    data-pagination-button-name="page-{{ $page }}"
                    class="icon"
                    as="link"
                    :link="$url"
                    >{{ $page }}</x-ui::button>
            @endif
        @endforeach
    @endif
    @endforeach



    @if (!$hideNavNext)
        @if ($hasMorePages)
            <x-ui::button
                variant="{{ $navNextVariant }}"
                data-pagination-button-name="page-next"
                as="link"
                class="icon"
                :link="$nextPageUrl"
                >
                <svg width="24" height="24" viewBox="0 0 24 24">
                    <use xlink:href="#angle-right"></use>
                </svg>
            </x-ui::button>
        @else
            <x-ui::button
                variant="{{ $navNextVariant }}"
                data-pagination-button-name="page-next"
                as="link"
                class="icon"
                disabled="true">
                <svg width="24" height="24" viewBox="0 0 24 24">
                    <use xlink:href="#angle-right"></use>
                </svg>
            </x-ui::button>
        @endif
    @endif
</nav>
@endif