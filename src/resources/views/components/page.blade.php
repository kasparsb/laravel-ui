@php
    $hasHeader = isset($header) && !$header->isEmpty();
@endphp
@if ($as == 'form')
<form {{
    $attributes
        ->class([
            'page',
        ])
        ->merge(['method' => $method, 'action' => $action])
    }}
>
@else
<div {{
    $attributes
        ->class([
            'page',
        ])
    }}>
@endif



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



@if ($as == 'form')
    @if ($redirect)
    <input type="hidden" name="_redirect" value="{{ $redirect }}" />
    @endif
    @if ($redirectRoutePrefix)
    <input type="hidden" name="_redirect_route_prefix" value="{{ $redirectRoutePrefix }}" />
    @endif
</form>
@else
</div>
@endif