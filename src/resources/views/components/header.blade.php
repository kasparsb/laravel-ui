@props([
    'title',
])
<header class="header">
    <div>
        <x-ui::title class="{{ $title->attributes->get('class') }}">{{ $title }}</x-ui::title>
        <x-ui::title-description>{{ $description }}</x-ui::title-description>
    </div>
    @if (isset($aside) && !$aside->isEmpty())
    <aside>
        {{ $aside }}
    </aside>
    @endif
</header>