import React from 'react';

export default function ChristmasTree() {
    return (
        <div className="relative flex h-full w-full items-center justify-center p-10">
            {/* Tree Container */}
            <div className="relative flex flex-col items-center">

                {/* Star */}
                <div className="relative z-20 mb-[-10px] animate-pulse">
                    <div className="h-12 w-12 text-yellow-300 drop-shadow-[0_0_15px_rgba(253,224,71,0.8)]">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full">
                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                        </svg>
                    </div>
                </div>

                {/* Tree Layers */}
                <div className="flex flex-col items-center drop-shadow-2xl filter">
                    {/* Top Layer */}
                    <div className="z-10 h-0 w-0 border-b-[60px] border-l-[40px] border-r-[40px] border-b-[#0F5132] border-l-transparent border-r-transparent filter drop-shadow-lg" />

                    {/* Middle Layer */}
                    <div className="-mt-8 z-0 h-0 w-0 border-b-[80px] border-l-[60px] border-r-[60px] border-b-[#146c43] border-l-transparent border-r-transparent filter drop-shadow-lg" />

                    {/* Bottom Layer */}
                    <div className="-mt-8 z-0 h-0 w-0 border-b-[100px] border-l-[80px] border-r-[80px] border-b-[#198754] border-l-transparent border-r-transparent filter drop-shadow-lg" />

                    {/* Trunk */}
                    <div className="h-16 w-12 bg-[#3E2723] rounded-sm" />
                </div>

                {/* Decorations / Baubles */}
                <div className="absolute top-[60px] left-[calc(50%-10px)] h-4 w-4 rounded-full bg-red-500 shadow-lg animate-bounce duration-[2000ms]" />
                <div className="absolute top-[100px] right-[calc(50%-20px)] h-5 w-5 rounded-full bg-blue-400 shadow-lg animate-bounce delay-75 duration-[2200ms]" />
                <div className="absolute top-[140px] left-[calc(50%-30px)] h-5 w-5 rounded-full bg-yellow-400 shadow-lg animate-bounce delay-150 duration-[2500ms]" />
                <div className="absolute top-[80px] right-[calc(50%-15px)] h-3 w-3 rounded-full bg-purple-400 shadow-lg animate-bounce delay-300 duration-[1800ms]" />
                <div className="absolute top-[170px] right-[calc(50%-30px)] h-6 w-6 rounded-full bg-red-600 shadow-lg animate-bounce delay-500 duration-[2300ms]" />
                <div className="absolute top-[120px] left-[calc(50%+10px)] h-4 w-4 rounded-full bg-white shadow-lg animate-bounce delay-200 duration-[2100ms]" />


                {/* Gifts */}
                <div className="absolute bottom-0 flex w-[140%] justify-between px-4 translate-y-4">
                    <div className="relative h-12 w-14 bg-red-600 shadow-md">
                        <div className="absolute left-[40%] h-full w-[20%] bg-yellow-400"></div>
                        <div className="absolute top-[40%] h-[20%] w-full bg-yellow-400"></div>
                    </div>
                    <div className="relative h-16 w-16 bg-blue-600 shadow-md -ml-6 z-10">
                        <div className="absolute left-[40%] h-full w-[20%] bg-white"></div>
                        <div className="absolute top-[40%] h-[20%] w-full bg-white"></div>
                    </div>
                    <div className="relative h-10 w-12 bg-green-600 shadow-md">
                        <div className="absolute left-[40%] h-full w-[20%] bg-red-400"></div>
                        <div className="absolute top-[40%] h-[20%] w-full bg-red-400"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
