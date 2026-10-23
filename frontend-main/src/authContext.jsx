import React, {createContext, useState, useEffect, useContext} from 'react';

const AuthContext = createContext();

export const useAuth = ()=>{
    return useContext(AuthContext);
}

export const AuthProvider = ({children})=>{
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(()=>{
        const userId = localStorage.getItem('userId');
        if(userId && userId !== "null" && userId !== "undefined"){
            setCurrentUser(userId);
        } else {
            setCurrentUser(null);
        }
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        setCurrentUser(null);
        window.location.href = '/auth';
    };

    const value = {
        currentUser, setCurrentUser, logout
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}