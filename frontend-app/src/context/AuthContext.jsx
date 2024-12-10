import { createContext, useEffect, useState } from "react"

export const AuthContext = createContext()

export const AuthContextProvider = ({ children }) => {
    const myStorage = window.localStorage
    let initialUser = null

    try {
        const storedUser = myStorage.getItem("user")
        if (storedUser) {
            initialUser = JSON.parse(storedUser)
        }
    } catch (error) {
        myStorage.removeItem("user")
    }

    const [currentUser, setCurrentUser] = useState(initialUser)

    const updateUser = (data) => {
        setCurrentUser(data)
    }

    useEffect(() => {
        if (currentUser) {
            myStorage.setItem("user", JSON.stringify(currentUser))
        } else {
            myStorage.removeItem("user")
        }
    }, [currentUser])

    return (
        <AuthContext.Provider value={{ currentUser, updateUser, myStorage }}>
            {children}
        </AuthContext.Provider>
    )
}
