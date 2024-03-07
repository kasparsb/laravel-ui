@props([
    'menu',
    'menuBasement',
])

<div class="layout">
    <aside>
        <div {{ $menu->attributes->class(['layout-menu']) }}>
            {{ $menu }}
        </div>
        <div {{ $menuBasement->attributes->class(['layout-aside-menubasement']) }}>
            {{ $menuBasement }}
        </div>
    </aside>
    <section>
        {{ $slot }}
    </section>
</div>