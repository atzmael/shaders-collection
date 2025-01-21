import { useState, useEffect } from 'react';

const useScrollActivity = () => {
    const [isScrolling, setIsScrolling] = useState(false);
    let scrollTimeout: NodeJS.Timeout;

    useEffect(() => {
        const handleScroll = () => {
            // Set scrolling state to true when scrolling starts
            setIsScrolling(true);

            // Clear any existing timeout
            if (scrollTimeout) clearTimeout(scrollTimeout);

            // Set a timeout to detect when scrolling stops
            scrollTimeout = setTimeout(() => {
                setIsScrolling(false);
            }, 150); // Adjust this timeout duration to fit your needs
        };

        // Attach scroll listener
        window.addEventListener('scroll', handleScroll);

        return () => {
            // Cleanup on unmount
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(scrollTimeout);
        };
    }, []);

    return isScrolling;
};

export default useScrollActivity;