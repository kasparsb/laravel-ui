@inject('stateManager', 'Kasparsb\Ui\View\StateManager')

@if (!$stateManager->isTimePickerMenu)
@php
    $stateManager->isTimePickerMenu = true
@endphp
<x-ui::dropdown-menu
    name="ui:timepicker-menu"
    data-timepicker-menu>

    <x-ui::v-stack class="p-4">
        <x-ui::field-hours-minutes
            labelHours="Hours"
            labelMinutes="Minutes"
            data-r="hoursMinutes"
            />

        <x-ui::h-stack class="h-right">
            <x-ui::button data-r="apply">Apply</x-ui::button>
        </x-ui::h-stack>

        <x-ui::delimiter dir="horizontal" />

        <div class="grid gap-2">
            @for ($hour = 0; $hour < 24; $hour++)
            <x-ui::button-outline
                class="compact"
                data-r="predefinedhour"
                data-hours="{{ str_pad($hour, 2, '0', STR_PAD_LEFT) }}"
                data-minutes="00"
                data-value="{{ str_pad($hour, 2, '0', STR_PAD_LEFT) }}:00"
                >{{ str_pad($hour, 2, '0', STR_PAD_LEFT) }}:00</x-ui::button-outline>
            @endfor
        </div>
    </x-ui::v-stack>
</x-ui::dropdown-menu>
@endif