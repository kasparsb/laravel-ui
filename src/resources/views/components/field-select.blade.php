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

    $hasEmptyState = isset($emptyState) && !$emptyState->isEmpty();

    /**
     * Vai ir value preview slots
     * Value ir programmiska vērtība un vizuālā vērtības var atšķirties
     * tāpēc to, lai varētu norādīt priekš sourceUrl laukiem, tad vajag
     * sagatavot vizuālo vērtību iepriekš
     */
    $hasValueVisual = isset($valueVisual) && !$valueVisual->isEmpty();

    // As - var nospecificēt kādu funkciju veiks field-select
    $asParts = explode(':', $as);
    $as = $asParts[0];
    $asSubAction = count($asParts) > 1 ? $asParts[1] : '';
@endphp
<div
    {{ $attributesForContainer->class([
        'form-field',
        'field-select',
        'input-value-preview',
        'has-prefix' => $hasPrefix,
        'has-sufix',
    ]) }}
    @if (!$value)
    data-is-empty
    @endif
    data-placeholder="{{ $placeholder }}"
    data-state="{{ $hasError ? 'error' : '' }}"
    data-is-container=""
    @if ($hasValueVisual)
    data-has-visual-value=""
    @endif
    @if ($valueVisualUrl)
    data-value-visual-url="{{ $valueVisualUrl }}"
    @endif
    >

    @if ($label)
        <label>{{ $label }}</label>
    @endif

    <div
        tabindex="0"

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
        @if ($searchable)
        data-dropdown-menu-focus="firstFocusable"
        @endif
        >
        @if (isset($prefix) && !$prefix->isEmpty())
            {{ $prefix }}
        @endif

        <div data-input-value-preview-placeholder>
            @if ($hasValueVisual)
            {{ $valueVisual }}
            @else
            {{ $value ? '' : $placeholder }}
            @endif
        </div>

        <input
            autocomplete="off"
            {{ $attributesForInputField }}
            type="hidden"
            name="{{ $name }}"
            value="{{ $value }}"
            @if ($as)
            data-{{ $as }}="{{ $asSubAction }}"
            @endif
            @disabled($disabled)
            />

        @if (isset($sufix) && !$sufix->isEmpty())
            {{ $sufix }}
        @else
        <svg style="position:relative;top:3px">
            <use xlink:href="#select-trigger"></use>
        </svg>
        @endif
    </div>

    <x-ui::dropdown-menu data-field-select-options-menu :tabIndex="false">
        <div
            class="options"
            @if ($sourceUrl)
            data-source-url="{{ $sourceUrl }}"
            data-has-loading
            @else
            {{--
            Pazīmie, ka options jau ir ielādēti
            sourceUrl gadījumā options vēl nav ielādēti
            tāpēc nav šīs pazīmes
            --}}
            data-options-loaded
            @endif

            {{-- Neliekam kā fokusējamu, ja ir search lauks, kurš darbosies kā pirmais fokusējamais --}}
            @if (!$searchable)
            tabindex="0"
            @endif
            >
            @if ($searchable)
            <x-ui::field-text
                placeholder="{{ $searchPlaceholder }}"
                data-field-select-search-field
                class="bw-0 search-field">
                <x-slot:prefix>
                    <svg width="24" height="24" viewBox="0 0 24 24">
                        <use xlink:href="#ui-icon-search"></use>
                    </svg>
                </x-slot:prefix>
            </x-ui::field-text>
            @endif

            <div data-field-select-options-container>
                <div role="list" tabindex="-1">

                    @if (isset($slot) && !$slot->isEmpty())
                        {{ $slot }}
                    @elseif (is_iterable($options))
                        @php
                            $isEmptyChecked = !$value;
                            // ja ir kāds no options, kurš atbilst vērtībai, tad empty checked būs false
                            foreach ($options as $optionValue => $html) {
                                if ($value == $optionValue) {
                                    $isEmptyChecked = false;
                                    break;
                                }
                            }
                        @endphp
                        @if ($empty)
                            <x-ui::option value="" :checked="$isEmptyChecked">{{ is_bool($empty) ? '' : $empty }}</x-ui::option>
                        @endif
                        @foreach ($options as $optionValue => $html)
                            <x-ui::option :value="$optionValue" :checked="$value == $optionValue">{{ $html }}</x-ui::option>
                        @endforeach
                    @endif
                </div>

                <div data-field-select-loading-state>
                    <x-ui::v-stack class="skeleton-container-animation gap-0 p-0.5">
                        @for ($skeletonItemCounter = 0; $skeletonItemCounter < 12; $skeletonItemCounter++)
                        <div class="skeleton-line" style="width: {{ rand(40, 80) }}%"></div>
                        @endfor
                    </x-ui::v-stack>
                </div>
            </div>

            <div data-field-select-empty-state>
            @if ($hasEmptyState)
                {{ $emptyState }}
            @else
                <x-ui::empty-state class="bw-0 small py-5 px-1.5">
                    <x-slot:icon>
                        <x-tabler-playlist-x />
                    </x-slot:icon>
                    <x-slot:title class="t-3.5 fw-r">No records</x-slot:title>
                </x-ui::empty-state>
            @endif
            </div>

            <div data-field-select-pagination></div>

        </div>
    </x-ui::dropdown-menu>

    <p data-role="description">{{ $description }}</p>
    <p data-role="error">{{ $errorMessage }}</p>
</div>