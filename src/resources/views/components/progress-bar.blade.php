<div {{ $attributes->class(['progress-bar']) }}>
    <div>
        <span data-r="indicator" style="width: {{ $progress }}%"></span>
    </div>
    <div data-r="progress">
        @if ($progress)
        {{ $progress }}%
        @else
        &nbsp;
        @endif
    </div>
</div>