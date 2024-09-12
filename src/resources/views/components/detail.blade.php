@inject('helpers', 'Kasparsb\Ui\Helpers')
@props([
    'term',
    'description',
])

@if ($term instanceof \Illuminate\View\ComponentSlot)
<dt {{ $term->attributes->class([
    'c-muted' => !$helpers->hasAnyColorClass($term->attributes->get('class')),
    't-3.5' => !$helpers->hasAnyTextSizeClass($term->attributes->get('class')),
]) }} >
    {{ $term }}
</dt>
@else
<dt class="c-muted t-3.5">{{ $term }}</dt>
@endif

@if ($description instanceof \Illuminate\View\ComponentSlot)
<dd {{ $description->attributes->class([
    'c-950' => !$helpers->hasAnyColorClass($term->attributes->get('class')),
    't-3.5' => !$helpers->hasAnyTextSizeClass($term->attributes->get('class')),
    'ta-right' => !$helpers->hasAnyTextAlignClass($term->attributes->get('class')),
]) }} >
    {{ $description }}
</dd>
@else
<dd class="c-950 t-3.5">{{ $description }}</dd>
@endif
