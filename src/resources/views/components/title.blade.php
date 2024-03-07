@php
// Meklējam vai ir pielikta custom text size klase
$textSizeClassApplied = collect(explode(' ', $attributes->get('class')))->first(function($className){
    // Izvācam . jo ir klases 3.5 4.5 utt
    $className = str_replace('.', '', $className);
    preg_match('/^t-([0-9]*)$/', $className, $matches);
    return count($matches) > 0;
});
$defaultClasses = ['title'];
if (!$textSizeClassApplied) {
    $defaultClasses[] = 't-6';
}
@endphp
<h2 {{ $attributes->class($defaultClasses) }}>{{ $slot }}</h2>