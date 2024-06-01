<div {{ $attributes->class(['radio-buttons']) }}>
    @if ($label)
        <label>{{ $label }}</label>
    @endif
    <div>
        {{ $slot }}
    </div>
    @if ($description)
    <p>{{ $description }}</p>
    @endif
</div>