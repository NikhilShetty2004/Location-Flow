import { createContext, useState } from "react"

export const LocationContext = createContext()

export const LocationContextProvider = ({ children }) => {

    const [pins, setPins] = useState([])
    const [currentPlaceId, setCurrentPlaceId] = useState(null)
    const [newPlace, setNewPlace] = useState(null)

    const SetPins = (data) => {
        setPins(data)
    }
    const SetCurrentPlaceId = (data) => {
        setCurrentPlaceId(data)
    }
    const SetNewPlace = (data) => {
        setNewPlace(data)
    }

    return (
        <LocationContext.Provider value={{ pins,newPlace,currentPlaceId,SetPins , SetCurrentPlaceId, SetNewPlace }}>
            {children}
        </LocationContext.Provider>
    )
}
