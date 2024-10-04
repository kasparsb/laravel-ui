<form
    {{ $attributes->merge([
        'method' => $method,
        'action' => $action,
    ]) }}

    @if ($fetchSubmit)
    data-fetch-submit
    @endif

    @if ($replaceHtml)
    data-replace-html
    @endif
    >
    {{ $slot }}

    @if ($redirect)
    <input type="hidden" name="_redirect" value="{{ $redirect }}" />
    @endif
    @if ($redirectRoutePrefix)
    <input type="hidden" name="_redirect_route_prefix" value="{{ $redirectRoutePrefix }}" />
    @endif
</form>
