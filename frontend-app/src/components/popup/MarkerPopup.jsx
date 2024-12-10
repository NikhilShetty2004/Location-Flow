import React, {useContext}from 'react'
import { Popup } from 'react-map-gl'
import StarIcon from '@mui/icons-material/Star'
import { format } from 'timeago.js'
import { LocationContext } from '../../context/LocationContext'

const MarkerPopup = ({p}) => {
    const { currentPlaceId,SetCurrentPlaceId} = useContext(LocationContext)

    return (
        <>
            {p._id === currentPlaceId && (
                <Popup
                    latitude={p.lat}
                    longitude={p.long}
                    key={p._id}
                    anchor="left"
                    closeOnClick={false}
                    onClose={() => SetCurrentPlaceId(null)}
                >
                    <div className="card">
                        <label>Place</label>
                        <h4 className="place">{p.title}</h4>
                        <label>Review</label>
                        <p className="desc">{p.desc}</p>
                        <label>Rating</label>
                        <div className="stars">
                            {Array(p.rating).fill(<StarIcon className="star" />)}
                        </div>
                        <label>Information</label>
                        <span className="username">
                            Created by <b>{p.username}</b>
                        </span>
                        <span className="date">{format(p.createdAt)}</span>
                    </div>
                </Popup>
            )}
        </>
    )
}

export default MarkerPopup
