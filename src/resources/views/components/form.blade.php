<{{ $asForm ? 'form' : 'div' }}
    {{ $attributes->merge(
        $asForm ? [
            'method' => $method,
            'action' => $action,
        ]
        :
        [
            'data-form-substitute' => '',
            'data-method' => $method,
            'data-action' => $action,
        ]
    )
    }}

    @if ($fetchSubmit)
    data-fetch-submit
    @endif

    @if ($replaceHtml)
    data-replace-html="{{ is_bool($replaceHtml) ? '' : $replaceHtml }}"
    @endif
    @if ($replaceHtmlTarget)
    data-replace-html-target="{{ $replaceHtmlTarget }}"
    @endif

    @if ($resetFormAfterSubmit)
    data-reset-form-after-submit
    @endif

    @if ($submitAfterMs)
    data-submit-form-after-ms="{{ $submitAfterMs }}"
    @endif

    @if ($actionSource)
    data-action-source="{{ $actionSource }}"
    @endif

    @if ($methodSource)
    data-method-source="{{ $methodSource }}"
    @endif

    @if ($menuHide)
    data-dropdown-menu-hide="{{ $menuHide }}"
    @endif
    >
    {{ $slot }}

    @if ($redirect)
    <input type="hidden" name="_redirect" value="{{ $redirect }}" />
    @endif
    @if ($redirectRoutePrefix)
    <input type="hidden" name="_redirect_route_prefix" value="{{ $redirectRoutePrefix }}" />
    @endif
</{{ $asForm ? 'form' : 'div' }}>
