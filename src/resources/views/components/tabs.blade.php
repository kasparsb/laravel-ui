@inject('helpers', 'Kasparsb\Ui\Helpers')

<div
    {{ $attributes->class(['tabs']) }}
    data-selected="{{ $selected }}"
    >
    <nav>{{ $slot }}</nav>

    @if (isset($content))
        @php
            /**
             * Ir problēma, ja uzliek tabs-contents default margin no css,
             * tad to nevar overraidot ar mt-{number} klasēm, jo css
             * rakstītais būs too specific un mt-{number} klase to nepārrakstīs
             * Tāpēc šeit, pārbaudām vai ir uzlikta kaut viena mt-{number} klase,
             * ja nav, tad uzliekam default mt-3 top margin
             */
            $isAnyMarginTopClassPassed = $helpers->hasAnyMarginTopClass($content->attributes->get('class'))
        @endphp
        <div
            data-role="tabs-contents"
            {{ $content->attributes->class(['mt-3' => !$isAnyMarginTopClassPassed]) }}
            >
        {{ $content }}
        </div>
    @endif
</div>