<div
    class="calendar size-{{ $size }}"
    @if ($statusUrl)
    data-status-url="{{ $statusUrl }}"
    @endif
    @if ($name)
    data-name="{{ $name }}"
    @endif
>

    <input
        type="hidden"
        data-role="date"
        @if ($name)
        name="{{ $name }}"
        @endif
        value="{{ $value }}" />

</div>