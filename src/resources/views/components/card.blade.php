@inject('helpers', 'Kasparsb\Ui\Helpers')
@props([
    'title',
])
<div
    {{ $attributes->class([
        'card' => true,
        'b-c-200' => !$helpers->hasAnyBorderColorClass($attributes->get('class')),
        'bw-1' => !$helpers->hasAnyBorderWidthClass($attributes->get('class')),
    ]) }}

    @if ($loadingStyle)
    data-loading-style="{{ $loadingStyle }}"
    @endif
    @if ($loading)
    data-loading="{{ $loading === true ? 'loading' : $loading }}"
    @endif
    >
    @if (isset($header) || isset($title) || isset($titleDescription) || isset($headerAside))
    <div class="card-header">
        @if (isset($header))
        {{ $header }}
        @else
        <header class="header">
            <div>
                @if (isset($title))
                <x-ui::title class="{{ $title->attributes->get('class') }}">{{ $title }}</x-ui::title>
                @endif
                @if (isset($titleDescription))
                <x-ui::title-description>{{ $titleDescription }}</x-ui::title-description>
                @endif
            </div>
            @if (isset($headerAside))
            <aside>
                {{ $headerAside }}
            </aside>
            @endif
        </header>
        @endif
    </div>
    @endif
    @if (!$slot->isEmpty())
    <div class="card-content">
        {{ $slot }}
    </div>
    @endif
    @isset($footer)
    <div class="card-footer">
        {{ $footer }}
    </div>
    @endisset
</div>