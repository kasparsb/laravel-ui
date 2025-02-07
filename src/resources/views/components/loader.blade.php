@inject('helpers', 'Kasparsb\Ui\Helpers')

<span {{ $attributes->class([
    'loader' => true,
    'w-4' => !$helpers->hasAnyWidthClass($attributes->get('class')),
]) }} >
    <svg class="spinner" width="24" height="24" viewBox="0 0 24 24">
        <use xlink:href="#loading"></use>
    </svg>
</span>