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
    >
    <table>
    <thead>
        <tr>
            @foreach ($cols() as $col)
            <th {{ $col->attributes }}>
                <div>
                @if ($col->isCheckboxCol)
                {!! $cellContentCheckbox($col) !!}
                @else
                {{ $col->slot }}
                @endif
                </div>
            </th>
            @endforeach
        </tr>
    </thead>
    <tbody>
        @foreach ($rows as $row)
        <tr>
            @foreach ($cols() as $col)
            <td {{ $col->attributes }}>
                <div>{!! $cellContent($col, $row) !!}</div>
            </td>
            @endforeach
        </tr>
        @endforeach
    </tbody>
    </table>
</div>