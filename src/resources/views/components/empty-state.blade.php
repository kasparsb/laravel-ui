@inject('helpers', 'Kasparsb\Ui\Helpers')
@props([
    'title',
])
<div {{ $attributes->class([
    'empty-state',
    'bw-1' => !$helpers->hasAnyBorderWidthClass($attributes->get('class')),
    'b-s-solid' => !$helpers->hasAnyBorderStyleClass($attributes->get('class')),
    'b-c-200' => !$helpers->hasAnyBorderColorClass($attributes->get('class'))
]) }} >

    @if (isset($icon))
    <div class="top">
        {{ $icon }}
    </div>
    @endif

    @if (isset($title))
    <x-ui::title class="{{ $title->attributes->get('class') }}">{{ $title }}</x-ui::title>
    @endif
    @if (isset($titleDescription))
    <x-ui::title-description>{{ $titleDescription }}</x-ui::title-description>
    @endif

    @if (isset($button))
    <div class="bottom">
        {{ $button }}
    </div>
    @endif
</div>