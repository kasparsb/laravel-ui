@php
// app('router')->getRoutes()->getByName($routeUpdate)->uri
@endphp
<table
    {{ $attributes->class(['table']) }}
    @if ($submitable)
    data-submitable
    @if ($routeCreate)
    data-link-create={{ $routeCreate }}
    @endif
    @if ($routeUpdate)
    data-link-update={{ $routeUpdate }}
    @endif
    @endif
    >
<thead>
    <tr>
        @foreach ($cols() as $col)
        <th {{ $col->attributes }}>
            <div>{{ $col->slot }}</div>
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