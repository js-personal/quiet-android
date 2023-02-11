import { createContext, useState } from 'react';

const ThemeContext = createContext({
    theme: 'dark',
    setTheme: (name: string) => {}
});

const ThemeContextProvider = ({ children }: any) => {
    // the value that will be given to the context
    const [theme, setTheme] = useState('dark');
    return (
        // the Provider gives access to the context to its children
        <ThemeContext.Provider value={{
            theme: theme,
            setTheme: setTheme,
        }}>
            {children}
        </ThemeContext.Provider>
    );
};


export { ThemeContext, ThemeContextProvider };

