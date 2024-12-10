import React, { lazy, useContext } from 'react'
import { Marker, Popup } from 'react-map-gl'
import LocationOnIcon from '@mui/icons-material/LocationOn'

import {LocationContext} from "../../context/LocationContext"
import { AuthContext } from "../../context/AuthContext"
const NewPopupForm = lazy(() => import('../forms/newPopup/NewPopupForm'))

const UserMarkerPopup = () => {

    const { newPlace, SetNewPlace } = useContext(LocationContext)
    const { currentUser } = useContext(AuthContext)

    return (
        <div>
            {newPlace && currentUser && (
                <>
                    <Marker latitude={newPlace.lat} longitude={newPlace.long}>
                        <LocationOnIcon
                            style={{
                                fontSize: 40,
                                color: "tomato",
                                cursor: "pointer",
                            }}
                        />
                    </Marker>
                    <Popup
                        latitude={newPlace.lat}
                        longitude={newPlace.long}
                        anchor="left"
                        closeOnClick={false}
                        onClose={() => SetNewPlace(null)}
                    >
                        {/* New popup creation Form */}
                        <NewPopupForm />
                    </Popup>

                </>
            )}
        </div>
    )
}

export default UserMarkerPopup
