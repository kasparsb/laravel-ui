@if ($as == 'form')
<form {{ $attributes->class(['page'])->merge(['method' => $method, 'action' => $action]) }}>
    {{ $slot }}
    @if ($redirect)
    <input type="hidden" name="_redirect" value="{{ $redirect }}" />
    @endif
    @if ($redirectRoutePrefix)
    <input type="hidden" name="_redirect_route_prefix" value="{{ $redirectRoutePrefix }}" />
    @endif
</form>
@else
<div {{ $attributes->class(['page']) }} >{{ $slot }}</div>
@endif