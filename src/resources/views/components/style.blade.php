@php
$styleLink = 'https://fonts.googleapis.com/css2?family=Inter:wght@400..600&display=swap';
@endphp
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
@if ($deferFont)
<link onload="this.onload=null;this.rel='stylesheet'" rel="preload" as="style" href="{{ $styleLink }}" />
<noscript>
    <link href="{{ $styleLink }}" rel="stylesheet" />
</noscript>
@else
<link href="{{ $styleLink }}" rel="stylesheet">
@endif
<link href="{{ $ui_dist_css }}" rel="stylesheet">