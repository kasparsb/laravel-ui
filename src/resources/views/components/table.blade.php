<table {{ $attributes->class(['table', $width]) }} >

    @if (!$slot->isEmpty())
        {{ $slot }}
    @else
        @if ($head)
        <thead>
            <tr>
                {{ $head }}
            </tr>
        </thead>
        @endif
        @if ($body)
        <tbody>
            {{ $body }}
        </tbody>
        @endif
    @endif

</table>