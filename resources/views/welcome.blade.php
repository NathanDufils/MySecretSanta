<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Secret Santa</title>
        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,600&display=swap" rel="stylesheet" />
        
        @if (file_exists(public_path('build/manifest.json')) || file_exists(public_path('hot')))
            @vite(['resources/css/app.css', 'resources/js/app.js'])
        @else
            <script src="https://cdn.tailwindcss.com"></script>
        @endif
    </head>
    <body class="antialiased bg-gray-100 dark:bg-gray-900 min-h-screen relative flex items-center justify-center">
        <div class="absolute top-0 right-0 p-6 text-right z-10">
            @if (Route::has('login'))
                <div class="space-x-4">
                    @auth
                        <a href="{{ url('/dashboard') }}" class="font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500">Dashboard</a>
                    @else
                        <a href="{{ route('login') }}" class="font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500">Log in</a>

                        @if (Route::has('register'))
                            <a href="{{ route('register') }}" class="font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-red-500">Register</a>
                        @endif
                    @endauth
                </div>
            @endif
        </div>
        <div class="max-w-4xl mx-auto p-6 lg:p-8 text-center">
            <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-8">
                🎅 Mon Secret Santa
            </h1>
            <p class="text-lg text-gray-600 dark:text-gray-400 mb-8">
                Bienvenue sur ton application de Secret Santa !
            </p>
            <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <p class="text-gray-500 dark:text-gray-300">
                    Ceci est ta nouvelle page d'accueil. Tu peux maintenant commencer à développer ton projet.
                </p>
            </div>
        </div>
    </body>
</html>
