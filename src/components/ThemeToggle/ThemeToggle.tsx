import React, { useState, useEffect } from "react";
import Sun from '@/svg/sun.svg';
import Moon from '@/svg/moon.svg';

const ThemeToggle = () => {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

    const toggleTheme = () => {
        setIsDarkMode((prevMode) => {
            const newMode = !prevMode;
            localStorage.setItem("darkMode", newMode.toString());
            return newMode;
        });
    };

    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add("dark-mode");
        } else {
            document.body.classList.remove("dark-mode");
        }
    }, [isDarkMode]);

    useEffect(() => {
        setIsDarkMode(localStorage.getItem("darkMode") === "true" || window.matchMedia("(prefers-color-scheme: dark)").matches)
    }, [])

    return (
        <button onClick={toggleTheme} className={`absolute right-2 top-2 size-[40px] overflow-hidden rounded-full ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
            <span className={`absolute -bottom-1/2 left-0 size-full transition-all duration-300 ${isDarkMode ? 'rotate-0 hover:rotate-6' : 'rotate-180 hover:rotate-[186deg]'}`}>
                <span className={`absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 text-white`}>
                    <Moon width={24} height={24} />
                </span>
                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-180 text-slate-900`}>
                    <Sun width={24} height={24} />
                </span>
            </span>
        </button>
    );
};

export default ThemeToggle;
