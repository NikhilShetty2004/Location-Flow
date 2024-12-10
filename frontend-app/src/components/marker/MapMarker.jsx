import React, {useContext} from 'react'
import { Marker } from 'react-map-gl'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { LocationContext } from '../../context/LocationContext'
import { AuthContext } from '../../context/AuthContext'

const MapMarker = () => {
    const { currentUser } = useContext(AuthContext)
    const { SetCurrentPlaceId , pins} = useContext(LocationContext)

    const handleMarkerClick = (id) => {
        SetCurrentPlaceId(id)
        console.log(`${id}`)
    }

    return (
        <>
            {pins.map((p) => (
                <Marker
                    key={p._id}
                    latitude={p.lat}
                    longitude={p.long}
                    anchor="bottom"
                    onClick={() => handleMarkerClick(p._id)}
                >
                    <LocationOnIcon
                        style={{
                            fontSize: 40,
                            color: p.username === currentUser ? 'tomato' : 'slateblue',
                            cursor: 'pointer',
                        }}
                    />
                </Marker>
            ))}
            
        </>
    )
}

export default MapMarker
