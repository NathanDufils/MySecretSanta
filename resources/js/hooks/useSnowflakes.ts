import { useEffect, useState } from 'react';

export function useSnowflakes(count: number, minDuration = 5, extraDuration = 3) {
    const [snowflakes, setSnowflakes] = useState<React.CSSProperties[]>([]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setSnowflakes(
                [...Array(count)].map(() => ({
                    left: `${Math.random() * 100}vw`,
                    animationDuration: `${Math.random() * extraDuration + minDuration}s`,
                    animationDelay: `${Math.random() * 5}s`,
                    opacity: Math.random() * 0.5 + 0.3,
                })),
            );
        }, 0);

        return () => clearTimeout(timeout);
    }, [count, minDuration, extraDuration]);

    return snowflakes;
}
