@inject('helpers', 'Kasparsb\Ui\Helpers')

<nav {{ $attributes->class([
    'nav-menu',
    'nav-menu-vertical' => !$helpers->hasAnyNavMenuLayoutClass($attributes->get('class')),
    'menu-item-background' => !$helpers->hasAnyMenuItemVisualClass($attributes->get('class')),
]) }}>
    {{ $slot }}
</nav>