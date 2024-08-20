@php
    // without data-* attributes
    $attributesForContainer = $attributes->filter(function($value, $key){
        return substr($key, 0, 5) != 'data-';
    });
    // only data-* attributes
    $attributesForInputField = $attributes->filter(function($value, $key){
        return substr($key, 0, 5) == 'data-';
    });

    // Ja tukšs string
    if (is_string($menuFocus) && !$menuFocus) {
        $menuFocus = true;
    }

    $hasPrefix = isset($prefix) && !$prefix->isEmpty();
    $hasSufix = isset($sufix) && !$sufix->isEmpty();
@endphp
<div
    {{ $attributesForContainer->class([
        'form-field',
        'field-text',
        'has-prefix' => $hasPrefix,
        'has-sufix' => $hasSufix,
    ]) }}
    data-state="{{ $hasError ? 'error' : '' }}"
    >
    @if ($label)
        <label>{{ $label }}</label>
    @endif

    <div
        @if ($menu)
        data-dropdown-menu-trigger="{{ $menu }}"
        data-dropdown-menu-show="{{ $menuShow }}"
        data-dropdown-menu-target-el="child:input"
        {{-- data-dropdown-menu-position-at="(parent|child):div" --}}
            @if ($menuFocus)
            data-dropdown-menu-focus="{{ is_bool($menuFocus) ? '' : $menuFocus }}"
            @endif
            @if ($menuResetForm)
            data-dropdown-menu-reset-form
            @endif
        @endif
        @if ($menuHide)
            data-dropdown-menu-hide="{{ $menuHide }}"
        @endif
        >
        @if (isset($prefix) && !$prefix->isEmpty())
            {{ $prefix }}
        @endif
        <input
            {{ $attributesForInputField }}
            type="text"
            name="{{ $name }}"
            value="{{ $value }}"
            placeholder="{{ $placeholder }}"
            @disabled($disabled)

            @if ($menu)
                autocomplete="off"
            @endif

            />
        @if (isset($sufix) && !$sufix->isEmpty())
            {{ $sufix }}
        @endif
    </div>
    <p data-role="description">{{ $description }}</p>
    <p data-role="error">{{ $errorMessage }}</p>
</div>