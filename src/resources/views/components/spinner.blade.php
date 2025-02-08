@inject('helpers', 'Kasparsb\Ui\Helpers')

<span {{ $attributes->class([
    'spinner' => true,
    'w-4' => !$helpers->hasAnyWidthClass($attributes->get('class')),
]) }} >
    <svg width="24" height="24" viewBox="0 0 24 24">
        <use xlink:href="#loading"></use>
    </svg>
</span>