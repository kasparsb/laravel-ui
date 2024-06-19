@inject('helpers', 'Kasparsb\Ui\Helpers')

<p {{ $attributes->class([
    'text' => true,
    't-4' => !$helpers->hasAnyTextSizeClass($attributes->get('class'))
]) }}>{{ $slot }}</p>