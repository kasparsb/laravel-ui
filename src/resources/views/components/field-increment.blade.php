@php
    // without data-* attributes
    $attributesForContainer = $attributes->filter(function($value, $key){
        return substr($key, 0, 5) != 'data-';
    });
    // only data-* attributes
    $attributesForInputField = $attributes->filter(function($value, $key){
        return substr($key, 0, 5) == 'data-';
    });
@endphp
<div
    {{ $attributesForContainer->class([
        'form-field',
        'field-increment',
    ]) }}
    data-state="{{ $hasError ? 'error' : '' }}"
    data-is-container

    data-format="{{ $format }}"
    data-step="{{ $step }}"
    @if (!is_null($min))
    data-min="{{ $min }}"
    @endif
    @if (!is_null($max))
    data-max="{{ $max }}"
    @endif
    @if (!is_null($padLeft))
    data-pad-left="{{ $padLeft }}"
    data-pad-left-length="{{ $padLeftLength }}"
    @endif
    >
    @if ($label)
        <label>{{ $label }}</label>
    @endif

    <div>
        <x-ui::button-ghost class="icon" data-r="dec" tabindex="-1">
            <x-tabler-minus />
        </x-ui::button-ghost>
        @if (isset($prefix) && !$prefix->isEmpty())
            {{ $prefix }}
        @endif
        <input
            {{ $attributesForInputField }}
            type="text"
            @if ($name)
            name="{{ $name }}"
            @endif
            value="{{ $value }}"
            placeholder="{{ $placeholder }}"
            @disabled($disabled)

            @if ($menu)
            data-dropdown-menu-trigger="{{ $menu }}"
            data-dropdown-menu-show="{{ $menuShow }}"
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
            />
        @if (isset($sufix) && !$sufix->isEmpty())
            {{ $sufix }}
        @endif
        <x-ui::button-ghost class="icon" data-r="inc" tabindex="-1">
            <x-tabler-plus />
        </x-ui::button-ghost>
    </div>
    <p data-role="description">{{ $description }}</p>
    <p data-role="error">{{ $errorMessage }}</p>
</div>