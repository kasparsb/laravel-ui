<div
    {{ $attributes->class(['progress-bar']) }}
    data-ui-js="ProgressBar"
    >
    <div>
        <span data-r="indicator" style="width: {{ $progress }}%"></span>
    </div>
</div>
@php app('Kasparsb\\Ui\\View\\StateManager')->queueComponentScript('ProgressBar'); @endphp
