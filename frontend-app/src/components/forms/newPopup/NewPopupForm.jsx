import React, { useState, useContext} from 'react'
import './newpopupform.css'
import apiRequest from '../../../lib/ApiReqest'

import {LocationContext} from "../../../context/LocationContext"
import { AuthContext } from "../../../context/AuthContext"

const NewPopupForm = () => {

    const { pins, SetPins,newPlace,SetNewPlace} = useContext(LocationContext)
    const { currentUser} = useContext(AuthContext)

    const [title, setTitle] = useState(null)
    const [desc, setDesc] = useState(null)
    const [star, setStar] = useState(0)

    const handleSubmit = async (e) => {
        e.preventDefault()
        const newPin = {
            username: currentUser,
            title,
            desc,
            rating: star,
            lat: newPlace.lat,
            long: newPlace.long,
        }

        try {
            const res = await apiRequest.post("/api/pins", newPin)
            SetPins([...pins, res.data])
            SetNewPlace(null)
        } catch (err) {
            console.log("an error Occured")
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input
                    placeholder="Enter a title"
                    autoFocus
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <label>Description</label>
                <textarea
                    placeholder="Say us something about this place."
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                />
                <label>Rating</label>
                <select value={star} onChange={(e) => setStar(e.target.value)}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
                <button type="submit" className="submitButton">
                    Add Pin
                </button>
            </form>
        </div>
    )
}

export default NewPopupForm
