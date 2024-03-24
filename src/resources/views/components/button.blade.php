@inject('helpers', 'Kasparsb\Ui\Helpers')

@php
    if (substr($link, 0, 6) == 'model:' && $model) {
        $link = $helpers->getModelRoute($model, substr($link, 6));
    }

    if ($as == 'delete') {
        if ($redirect !== false) {
            // skip redirect vispār, jo manuāli atsēgts
        }
        // Ja nav uzsetots redirect un ir padots model tad uztaisam automātiski
        if (!$redirect && $model) {
            $redirect = $helpers->getModelRoute($model, 'index');
        }
    }
@endphp

@if ($as == 'link')
<a
    href="{{ $link }}"
    {{ $attributes->class(['button-'.$variant]) }}
    >{{ $slot }}</a>
@elseif ($as == 'delete')
<button
    data-url="{{ $link }}"
    data-redirect="{{ $redirect }}"
    data-buttondelete
    {{ $attributes->class(['button-'.$variant]) }}
    >{{ $slot }}</button>
@else
<button
    @if ($menu)
    data-dropdown-menu="{{ $menu }}"
    @endif
    {{ $attributes->class(['button-'.$variant]) }}
    >{{ $slot }}</button>
@endif