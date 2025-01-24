@props([
    'menu',
    'content',
])

@php
if (!isset($menu)) {
    $menu = false;
}
if (!isset($content)) {
    $content = false;
}

/**
 * Menu container class vienmēr liekam row-items
 * TODO kaut gan tā nav laba doma, jo nevarēs override
 * bet nu paliekam, tad taisi savu layout
 */
$menuContainerClass = explode(' ', $menu->attributes->get('class'));
$menuContainerClass[] = 'row-items';
$menuContainerClass = implode(' ', array_unique($menuContainerClass));

@endphp

<header {{ $attributes->merge(['class' => 'layout-top-menu-header'],) }}>
    <div
        data-menu-container
        class="{{ $menuContainerClass }}"
        {{ $menu ? $menu->attributes->except('class') : '' }}
        >
        @if ($menu)
        {{ $menu }}
        @endif
    </div>
</header>

<section
    {{ $content ? $content->attributes->merge(['class' => 'layout-top-menu-content',]) : '' }}
    >
    {{ $content }}
</section>