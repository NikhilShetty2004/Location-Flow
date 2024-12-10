import React, { useContext, useEffect, useState } from "react";
import { LocationContext } from "../context/LocationContext";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
function MyPins() {
  const { pins, setPins } = useContext(LocationContext);
  const { currentUser } = useContext(AuthContext);

  const [localData, setLocalData] = useState();
  
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/pins`, {
        withCredentials: true,
      })
      .then(({ data }) => {
        setLocalData(data);
      });
  }, [pins, setPins]);
  return (
    <div>
      {localData?.map((item, index) => (
        <h1 key={index}>{item.title}</h1>
      ))}
    </div>
  );
}

export default MyPins;
