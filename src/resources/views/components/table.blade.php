<table {{ $attributes->class(['table']) }}>
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
        <td {{ $col->attributes }}>{!! $cellContent($col, $row) !!}</td>
        @endforeach
    </tr>
    @endforeach
</tbody>
</table>