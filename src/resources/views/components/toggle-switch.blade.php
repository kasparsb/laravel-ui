<label class="toggle-switch">

    @if ($labelPosition == 'left')
        @if ($label)
        <span>{{ $label }}</span>
        @endif
    @endif


    <span>
        <input type="checkbox" name="{{ $name }}" @checked($checked) value="1" />
    </span>

    @if ($labelPosition == 'right')
        @if ($label)
        <span>{{ $label }}</span>
        @endif
    @endif

</label>