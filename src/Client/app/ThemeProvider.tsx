import React, { createContext, useState, useContext } from "react";

const ThemeContext = createContext({
    theme: true,
    toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState(true);

    const toggleTheme = () => {
        setTheme((prevTheme) => !prevTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
           <div className={`${theme ? "bg-gray-900 text-white" : "bg-white text-black"} min-h-screen`}>
           {children}
           </div>
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
