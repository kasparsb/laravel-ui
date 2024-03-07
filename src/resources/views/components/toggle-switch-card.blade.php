<div class="toggle-switch-card">
    <div>
        <h4>{{ $title }}</h4>
        @if ($description)
        <p>{{ $description }}</p>
        @endif
    </div>
    <x-ui::toggle-switch :name="$name" :checked="$checked" value="1" />
</div>