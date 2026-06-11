<script>
window.webit = window.webit || {};
window.webit.ui = window.webit.ui || {};
window.webit.ui.scriptLoaderConfig = {
    componentBaseUrl: @json(asset('/vendor/ui/dist/components/')),
    packageVersion: @json($ui_package_version),
    cacheBuster: @json($ui_cache_buster),
    svgsUrl: @json(route('ui::svgs'))
};

@if (is_file($ui_script_loader_file))
{!! file_get_contents($ui_script_loader_file) !!}
@else
console.error('UI script loader build file is missing: '+@json($ui_script_loader_file));
@endif
</script>
