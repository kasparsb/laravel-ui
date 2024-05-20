@inject('helpers', 'Kasparsb\Ui\Helpers')

@php
    if (substr($link, 0, 6) == 'model:' && $model) {
        $link = $helpers->getModelRoute($model, substr($link, 6));
    }

    if ($as == 'delete') {
        if ($redirect !== false) {
            // skip redirect vispār, jo manuāli atsēgts
        }
        // Ja nav uzsetots redirect un ir padots model tad uztaisām automātiski
        if (!$redirect && $model) {
            $redirect = $helpers->getModelRoute($model, 'index');
        }
    }

    /**
     * Loading var būt vairāki state
     * onsubmit - būs loading, kad notiks formas submit
     * onclick - kad click, tad loading
     * toggleclick - toggle loading state uz click
     */

    // Ja ir loading state, tad ir disabled
    if ($loading === true) {
        $disabled = true;
    }
@endphp

@if ($as == 'link')
<a
    href="{{ $link }}"
    {{ $attributes->class(['button-'.$variant,]) }}
    @if ($disabled)
    disabled="disabled"
    @endif
    @if ($loading)
    data-loading="{{ $loading === true ? 'loading' : $loading }}"
    @endif
    >
    <svg class="spinner" width="24" height="24" viewBox="0 0 24 24">
        <use xlink:href="#loading"></use>
    </svg>
    {{ $slot }}
</a>
@elseif (in_array($as, ['delete', 'post',]))
<button
    data-url="{{ $link }}"
    data-redirect="{{ $redirect }}"
    data-button{{ $as }}
    {{ $attributes->class(['button-'.$variant]) }}
    @if ($disabled)
    disabled="disabled"
    @endif
    @if ($loading)
    data-loading="{{ $loading === true ? 'loading' : $loading }}"
    @endif
    >
    <svg class="spinner" width="24" height="24" viewBox="0 0 24 24">
        <use xlink:href="#loading"></use>
    </svg>
    {{ $slot }}
</button>
@else
<button
    @if ($menu)
    data-dropdown-menu="{{ $menu }}"
    type="button"
    @endif
    @if ($disabled)
    disabled="disabled"
    @endif
    @if ($loading)
    data-loading="{{ $loading === true ? 'loading' : $loading }}"
    @endif
    {{ $attributes->class(['button-'.$variant]) }}
    >
    <svg class="spinner" width="24" height="24" viewBox="0 0 24 24">
        <use xlink:href="#loading"></use>
    </svg>
    {{ $slot }}
</button>
@endif