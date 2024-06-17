@inject('helpers', 'Kasparsb\Ui\Helpers')
@php
    $isAnyWidthClassPassed = $helpers->hasAnyWidthClass($attributes->get('class'))
@endphp
<div
    {{ $attributes->class([
        'table' => true,
        'w-full' => !$isAnyWidthClassPassed,
    ]) }}
    @if ($name)
    data-name="{{ $name }}"
    @endif
    @if ($trackDeleted)
    data-track-deleted="{{ $trackDeleted }}"
    @endif
    >
    <table>
    <thead>
        <tr>
            @foreach ($cols() as $col)
            <th {{ $col->attributes }}>
                <div>
                @if ($col->isCheckboxCol)
                {!! $cellContentCheckbox($col) !!}
                @elseif ($col->isHidden)

                @else
                {{ $col->slot }}
                @endif
                </div>
            </th>
            @endforeach
        </tr>
    </thead>
    <tbody>
        @if (!count($rows))
        <tr hidden data-table-blank-row>
            @foreach ($cols() as $col)
            <td {{ $col->attributes->merge(['data-name' => $col->name,]) }}>
                <div>{!! $cellContent($col, null, 0) !!}</div>
            </td>
            @endforeach
        </tr>
        @else
        @foreach ($rows as $row)
        <tr>
            @foreach ($cols() as $col)
            <td {{ $col->attributes->merge(['data-name' => $col->name]) }}>
                <div>{!! $cellContent($col, $row, $loop->parent->index) !!}</div>
            </td>
            @endforeach
        </tr>
        @endforeach
        @endif
    </tbody>
    </table>
</div>