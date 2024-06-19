@inject('helpers', 'Kasparsb\Ui\Helpers')

<h2 {{ $attributes->class([
    'title' => true,
    't-6' => !$helpers->hasAnyTextSizeClass($attributes->get('class'))
]) }}>{{ $slot }}</h2>