@php
    // without data-* attributes
    $attributesForContainer = $attributes->filter(function($value, $key){
        return substr($key, 0, 5) != 'data-';
    });
    // only data-* attributes
    $attributesForInputField = $attributes->filter(function($value, $key){
        return substr($key, 0, 5) == 'data-';
    });

    $hasPrefix = isset($prefix) && !$prefix->isEmpty();
    $hasSufix = isset($sufix) && !$sufix->isEmpty();
@endphp
<div
    {{ $attributesForContainer->class([
        'form-field' => true,
        'input-value-preview' => true,
        'has-prefix' => $hasPrefix,
        'has-sufix' => $hasSufix,
    ]) }}
    {{-- šo kontrolē js, lai var zināt, kad value ir empty un nostilot attiecīgi --}}
    @if (!$value)
    data-is-empty
    @endif
    data-placeholder="{{ $placeholder }}"
    data-state="{{ $hasError ? 'error' : '' }}"
    data-is-container=""

    @if (is_numeric($tabindex))
    tabindex="{{ $tabindex }}"
    @endif
    >

    @if ($label)
        <label>{{ $label }}</label>
    @endif

    <div>
        @if (isset($prefix) && !$prefix->isEmpty())
            {{ $prefix }}
        @endif

        {{-- Placeholder uzliks js, tur arī veiks formatēšanu. Tāpēc šeit value gadījumā tiek uzlikts tukšums --}}
        <div data-input-value-preview-placeholder>{{ $value ? '' : $placeholder }}</div>

        <input
            autocomplete="off"
            {{ $attributesForInputField }}
            type="hidden"
            name="{{ $name }}"
            value="{{ $value }}"
            {{-- Pasaka, ka dropdownMenuEl ir nākošais siblings --}}
            data-dropdown-menu-trigger="dom.nextSibling"
            data-dropdown-menu-show="onclick"
            data-dropdown-menu-hide="_auto"
            {{--
            data-dropdown-menu-position-at nozīmē, ka pozicionēsies pret button elementu
            var arī likt query selector
            ja nebūs attribūta vispār, tad ņems no paša DropdownMenu elementa
            --}}
            data-dropdown-menu-position-at
            data-dropdown-menu-position-at-dir="left bottom"
            data-dropdown-menu-position-dir="right bottom"
            data-dropdown-menu-position-y-offset="4"

            @disabled($disabled)
            />

        @if (isset($sufix) && !$sufix->isEmpty())
            {{ $sufix }}
        @endif
    </div>

    <p data-role="description">{{ $description }}</p>
    <p data-role="error">{{ $errorMessage }}</p>
</div>