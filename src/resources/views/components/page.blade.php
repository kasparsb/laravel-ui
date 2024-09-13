@php
    $hasHeader = isset($header) && !$header->isEmpty();
@endphp
@if ($as == 'form')
<form {{ $attributes->class([
    'page',
    'px-3.5',
    'py-4' => !$hasHeader,
    'py-10' => $hasHeader,
    'md:px-6',
])->merge(['method' => $method, 'action' => $action]) }}
>
    @if ($hasHeader)
    <div data-page-sticky-header>{{ $header }}</div>
    @endif

    <div data-page-content>
        {{ $slot }}
    </div>

    @if ($redirect)
    <input type="hidden" name="_redirect" value="{{ $redirect }}" />
    @endif
    @if ($redirectRoutePrefix)
    <input type="hidden" name="_redirect_route_prefix" value="{{ $redirectRoutePrefix }}" />
    @endif
</form>
@else
<div class="page">
    @if ($hasHeader)
    <div
        {{ $attributes->class([
            'px-3.5',
            'py-4',
            'md:px-6',
        ]) }}
        data-page-sticky-header
        >
        {{ $header }}
    </div>
    @endif

    <div
        {{ $attributes->class([
            'px-3.5',
            'py-4' => !$hasHeader,
            'py-10' => $hasHeader,
            'md:px-6',
        ]) }}
        data-page-content
        >
        {{ $slot }}
    </div>
</div>
@endif