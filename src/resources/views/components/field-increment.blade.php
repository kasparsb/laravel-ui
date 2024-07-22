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
    >
    @if ($label)
        <label>{{ $label }}</label>
    @endif

    <div>
        <x-ui::button-ghost class="icon" data-r="dec">
            <x-tabler-minus />
        </x-ui::button-ghost>
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
                @if ($menuResetForm)
                data-dropdown-menu-reset-form
                @endif
            @endif

            @if ($menuHide)
            data-dropdown-menu-hide="{{ $menuHide }}"
            @endif

            />
        <x-ui::button-ghost class="icon" data-r="inc">
            <x-tabler-plus />
        </x-ui::button-ghost>
    </div>
    <p data-role="description">{{ $description }}</p>
    <p data-role="error">{{ $errorMessage }}</p>
</div>