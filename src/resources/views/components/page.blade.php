@if ($as == 'form')
<form {{ $attributes->class([
    'page',
    'px-3.5',
    'py-4',
    'md:px-6',
])->merge(['method' => $method, 'action' => $action]) }}>
    {{ $slot }}
    @if ($redirect)
    <input type="hidden" name="_redirect" value="{{ $redirect }}" />
    @endif
    @if ($redirectRoutePrefix)
    <input type="hidden" name="_redirect_route_prefix" value="{{ $redirectRoutePrefix }}" />
    @endif
</form>
@else
<div {{ $attributes->class([
    'page',
    'px-3.5',
    'py-4',
    'md:px-6',
]) }} >{{ $slot }}</div>
@endif