<div
    {{ $attributes->class([
        'dropdown-menu',
        'static' => $isStatic,
        'floating' => !$isStatic,
        'hidden' => !$isStatic,
    ]) }}
    data-dropdown-menu-name="{{ $name }}"
    data-side="{{ $side }}"
    data-align="{{ $align }}"
    >
    {{ $slot }}
</div>