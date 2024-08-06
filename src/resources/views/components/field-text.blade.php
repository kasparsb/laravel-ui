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
@endphp
<div
    {{ $attributesForContainer->class([
        'form-field',
        'field-text',
    ]) }}
    data-state="{{ $hasError ? 'error' : '' }}"
    >
    @if ($label)
        <label>{{ $label }}</label>
    @endif

    <div>
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
            data-dropdown-menu-trigger="{{ $menu }}"
            data-dropdown-menu-show="{{ $menuShow }}"
            data-dropdown-menu-position-at="div"
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

            />
        @if (isset($sufix) && !$sufix->isEmpty())
            {{ $sufix }}
        @endif
    </div>
    <p data-role="description">{{ $description }}</p>
    <p data-role="error">{{ $errorMessage }}</p>
</div>