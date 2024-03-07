@if ($as == 'link')
<a href="{{ $href }}" {{ $attributes->class(['button-'.$variant]) }} >{{ $slot }}</a>
@else
<button {{ $attributes->class(['button-'.$variant]) }} >{{ $slot }}</button>
@endif