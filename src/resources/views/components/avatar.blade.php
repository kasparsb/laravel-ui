<div
    {{ $attributes->class([ 'avatar', ]) }}
    >
    <div class="avatar-image">
        <x-ui::aspect-ratio ratio="1:1" data-role="image-wrap">
            <img src="{{ $src }}" />
        </x-ui::aspect-ratio>
    </div>
    <div class="avatar-content">
        {{ $slot }}
    </div>
    @isset($actions)
    <div class="avatar-actions">
        {{ $actions }}
    </div>
    @endisset
</div>