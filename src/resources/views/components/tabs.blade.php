<nav
    {{ $attributes->class(['tabs']) }}
    data-selected="{{ $selected }}"
    >
    {{ $slot }}
</nav>