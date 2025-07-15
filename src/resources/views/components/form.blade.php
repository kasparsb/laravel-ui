<{{ $asForm ? 'form' : 'div' }}
    {{ $attributes->class([
        'container' => $loadingStyle ? true : false,
    ])->merge(
        $asForm ? [
            'method' => in_array($method, ['get', 'post']) ? $method : 'post',
            'action' => $action,
            /**
             * lai varētu nodefinēt custom method
             * html forma atļauj tikai get vai post
             */
            'data-method' => $method,
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

    @if ($submit)
    data-submit-form-condition="{{ $submit }}"
    @endif

    @if ($loadingStyle)
    data-loading-style="{{ $loadingStyle }}"
    @endif
    @if ($loading)
    data-loading="{{ $loading === true ? 'loading' : $loading }}"
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
    @if (!in_array($method, ['get', 'post']))
        @method($method)
    @endif
</{{ $asForm ? 'form' : 'div' }}>
