@inject('stateManager', 'Kasparsb\Ui\View\StateManager')
@php
$uiComponentScripts = $stateManager->flushQueuedComponentScripts();
@endphp
@foreach ($uiComponentScripts as $component)
<script
    src="{{ asset('/vendor/ui/dist/components/'.$component.'.min-'.$ui_package_version.'.js'.$ui_cache_buster) }}"
    @if ($defer)
    defer
    @endif
    ></script>
@endforeach
