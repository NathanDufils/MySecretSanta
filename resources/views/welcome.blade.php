<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Secret Santa</title>
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=mountains-of-christmas:400,700|figtree:400,600&display=swap" rel="stylesheet" />
    
    @if (file_exists(public_path('build/manifest.json')) || file_exists(public_path('hot')))
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    @else
        <script src="https://cdn.tailwindcss.com"></script>
    @endif

    <style>
        .font-christmas {
            font-family: 'Mountains of Christmas', cursive;
        }
        .snow-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            pointer-events: none;
            z-index: 1;
        }
        .snowflake {
            position: absolute;
            top: -10px;
            color: rgba(255, 255, 255, 0.8);
            font-size: 1.5rem;
            animation: fall linear infinite;
        }
        @keyframes fall {
            0% { transform: translateY(-10px) translateX(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) translateX(20px) rotate(360deg); opacity: 0; }
        }
    </style>
</head>
<body class="antialiased bg-gradient-to-br from-white via-red-50 to-red-100 min-h-screen relative flex flex-col items-center justify-center overflow-hidden">

    <!-- Snow Effect -->
    <div class="snow-container" id="snow-container"></div>

    <!-- Auth Navigation (Top Right) -->
    <div class="absolute top-0 right-0 p-6 z-50">
        @if (Route::has('login'))
            <div class="space-x-4">
                @auth
                    <a href="{{ url('/dashboard') }}" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition font-medium shadow-md">Dashboard</a>
                @else
                    <a href="{{ route('login') }}" class="px-4 py-2 text-red-700 hover:text-red-900 transition font-medium">Connexion</a>

                    @if (Route::has('register'))
                        <a href="{{ route('register') }}" class="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-full font-bold shadow-lg transition transform hover:scale-105">S'inscrire</a>
                    @endif
                @endauth
            </div>
        @endif
    </div>

    <!-- Main Content -->
    <div class="relative z-10 max-w-2xl mx-auto p-6 text-center">
        <!-- Icon -->
        <div class="mb-8 animate-bounce">
            <img src="{{ asset('images/logo.png') }}" alt="Secret Santa Logo" class="w-48 mx-auto drop-shadow-xl hover:scale-110 transition duration-300">
        </div>
        
        <p class="text-xl md:text-2xl text-gray-600 mb-10 font-light max-w-lg mx-auto leading-relaxed">
            Organisez votre échange de cadeaux en toute simplicité. <br>
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            @auth
                <a href="{{ url('/dashboard') }}" class="px-8 py-4 bg-red-600 text-white hover:bg-red-700 rounded-full font-bold text-lg shadow-xl shadow-red-200 transition transform hover:-translate-y-1 hover:scale-105 flex items-center gap-2">
                    <span>Accéder à mon espace</span>
                </a>
            @else
                <a href="{{ route('register') }}" class="px-8 py-4 bg-red-600 text-white hover:bg-red-700 rounded-full font-bold text-lg shadow-xl shadow-red-200 transition transform hover:-translate-y-1 hover:scale-105 flex items-center gap-2">
                    <span>Commencer l'aventure</span>
                </a>
            @endauth
            
            <a href="#more" class="px-8 py-4 bg-transparent border-2 border-red-600 text-red-600 hover:bg-red-50 rounded-full font-semibold text-lg transition">
                En savoir plus
            </a>
        </div>
    </div>

    <script>
        // Simple script to generate snowflakes
        const container = document.getElementById('snow-container');
        const snowflakeCount = 50;

        for (let i = 0; i < snowflakeCount; i++) {
            const snowflake = document.createElement('div');
            snowflake.innerHTML = '❄';
            snowflake.classList.add('snowflake');
            // Change snowflake color to light red/gray for visibility on white
            snowflake.style.color = 'rgba(239, 68, 68, 0.5)'; // Red-500 with low opacity
            snowflake.style.left = Math.random() * 100 + 'vw';
            snowflake.style.animationDuration = Math.random() * 3 + 4 + 's'; // 2-5s
            snowflake.style.opacity = Math.random();
            snowflake.style.fontSize = Math.random() * 1 + 0.5 + 'rem';
            snowflake.style.animationDelay = Math.random() * 5 + 's';
            container.appendChild(snowflake);
        }
    </script>
</body>
</html>
