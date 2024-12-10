import React, { useContext, useEffect, useState } from "react";
import { LocationContext } from "../context/LocationContext";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./MyPins.css";

function MyPins() {
  const { pins } = useContext(LocationContext);
  const { currentUser } = useContext(AuthContext);
  const [localData, setLocalData] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/pins`, {
        withCredentials: true,
      })
      .then(({ data }) => {
        setLocalData(data.filter((item) => item.username === currentUser));
      });
  }, [pins, currentUser]);

  return (
    <div className="mypins-container">
      {localData?.length ? (
        <div className="mypins-content">
          {localData.map((item, index) => (
            <div key={index} className="mypins-card">
              <h2 className="mypins-title">{item.title}</h2>
              <p className="mypins-desc">{item.desc}</p>
              <p className="mypins-rating">Rating: {item.rating}/5</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="mypins-content">
          <p className="mypins-empty">No pins available for the current user.</p>
        </div>
      )}
      <button className="mypins-back-button" onClick={() => navigate(-1)}>
        Back
      </button>
    </div>
  );
}

export default MyPins;
