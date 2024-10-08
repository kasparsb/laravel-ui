@props([
    'menu',
    'menuBasement',
    'bottomMenu',
])

<div class="layout">
    <aside>
        <div data-app-identity></div>

        <x-ui::button-ghost class="icon" data-expand-menu>
            <x-tabler-arrow-right />
        </x-ui::button-ghost>

        <x-ui::button-ghost class="icon" data-contract-menu>
            <x-tabler-arrow-left />
        </x-ui::button-ghost>

        <div data-menu>
            <div {{ $menu->attributes->class([
                'layout-menu',
            ]) }}>
                {{ $menu }}
            </div>
            <div {{ $menuBasement->attributes->class([
                'layout-aside-menubasement',
            ]) }}>
                {{ $menuBasement }}
            </div>
        </div>
    </aside>
    <section>
        {{ $slot }}
    </section>
</div>

@if (isset($bottomMenu))
<div {{ $bottomMenu->attributes->class([
    'layout-bottom-menu',
]) }}>
@if (isset($bottomMenu) && !$bottomMenu->isEmpty())
{{ $bottomMenu }}
@endif
</div>
@endif

<x-ui::dropdown-menu-blank
    class="layout-modal-menu w-full p-4 bg-c-background"
    name="layout-modal-menu">
    {{ $menu }}
</x-ui::dropdown-menu-blank>