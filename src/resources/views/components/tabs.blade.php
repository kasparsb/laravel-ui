<div
    {{ $attributes->class(['tabs']) }}
    data-selected="{{ $selected }}"
    >
    <nav>{{ $slot }}</nav>

    <div data-role="tabs-contents">
    @if (isset($content))
    {{ $content }}
    @endif
    </div>
</div>