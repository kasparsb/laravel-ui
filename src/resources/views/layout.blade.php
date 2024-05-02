<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Example layout</title>
    <x-ui::style />
</head>
<body>

    <x-ui::layout>
        <x-slot:menu>
            Main menu
        </x-slot>
        <x-slot:menu-basement class="py-4">
            Basement menu
        </x-slot>
        <x-ui::page class="regular">
            Content
        </x-ui::page>
    </x-ui::layout>

    <x-ui::svgs />
    <x-ui::script />
</body>
</html>