@php
    // without data-* attributes un autocomplete
    $attributesForContainer = $attributes->filter(function($value, $key){
        if (substr($key, 0, 5) == 'data-') {
            return false;
        }
        if ($key == 'autocomplete') {
            return false;
        }
        return true;
    });
    // only data-* attributes un autocomplete
    $attributesForInputField = $attributes->filter(function($value, $key){
        if (substr($key, 0, 5) == 'data-') {
            return true;
        }
        if ($key == 'autocomplete') {
            return true;
        }
        return false;
    });

    // Menu gadījumā uzreiz liekam autocomplete off
    if ($menu) {
        $attributesForInputField = $attributesForInputField->merge([
            'autocomplete' => 'off',
        ]);
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
        @if ($menuFocus)
        data-dropdown-menu-focus="{{ is_bool($menuFocus) ? '' : $menuFocus }}"
        @endif
        @if ($menuResetForm)
        data-dropdown-menu-reset-form
        @endif

        @if (!(is_bool($menuPositionAt) && !$menuPositionAt))
        data-dropdown-menu-position-at="{{ $menuPositionAt }}"
        @endif
        @if (!(is_bool($menuPositionAtDir) && !$menuPositionAtDir))
        data-dropdown-menu-position-at-dir="{{ $menuPositionAtDir }}"
        @endif

        @if (!(is_bool($menuPositionX) && !$menuPositionX))
        data-dropdown-menu-position-x="{{ $menuPositionX }}"
        @endif
        @if (!(is_bool($menuPositionY) && !$menuPositionY))
        data-dropdown-menu-position-y="{{ $menuPositionY }}"
        @endif
        @if (!(is_bool($menuPositionDir) && !$menuPositionDir))
        data-dropdown-menu-position-dir="{{ $menuPositionDir }}"
        @endif
        @if (!(is_bool($menuPositionXOffset) && !$menuPositionXOffset))
        data-dropdown-menu-position-x-offset="{{ $menuPositionXOffset }}"
        @endif
        @if (!(is_bool($menuPositionYOffset) && !$menuPositionYOffset))
        data-dropdown-menu-position-y-offset="{{ $menuPositionYOffset }}"
        @endif

        @endif
        @if (!(is_bool($menuHide) && !$menuHide))
        data-dropdown-menu-hide="{{ $menuHide }}"
        @endif
        >
        @if (isset($prefix) && !$prefix->isEmpty())
            {{ $prefix }}
        @endif
        <input
            {{ $attributesForInputField }}
            type="password"
            name="{{ $name }}"
            value="{{ $value }}"
            placeholder="{{ $placeholder }}"
            @disabled($disabled)
            @readonly($readonly)
            />
        @if (isset($sufix) && !$sufix->isEmpty())
            {{ $sufix }}
        @endif
    </div>
    <p data-role="description">{{ $description }}</p>
    <p data-role="error">{{ $errorMessage }}</p>
</div>