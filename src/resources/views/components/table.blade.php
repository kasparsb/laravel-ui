@inject('helpers', 'Kasparsb\Ui\Helpers')
@php
    $isAnyWidthClassPassed = $helpers->hasAnyWidthClass($attributes->get('class'))
@endphp
<table
    {{ $attributes->class([
        'table' => true,
        'w-full' => !$isAnyWidthClassPassed,
    ]) }}
    @if ($submitable)
    data-submitable
    @if ($routeCreate)
    data-route-create={{ $routeCreate }}
    @endif
    @if ($routeUpdate)
    data-route-update={{ $routeUpdate }}
    @endif
    @endif
    >
<thead>
    <tr>
        @foreach ($cols() as $col)
        <th {{ $col->attributes }}>
            @if ($col->isCheckboxCol)
            {!! $cellContentCheckbox($col) !!}
            @else
            <div>{{ $col->slot }}</div>
            @endif
        </th>
        @endforeach
    </tr>
</thead>
<tbody>
    @foreach ($rows as $row)
    <tr>
        @foreach ($cols() as $col)
        <td {{ $col->attributes }}>
            {!! $cellContent($col, $row) !!}
        </td>
        @endforeach
    </tr>
    @endforeach
</tbody>
</table>