import React, { useState, useEffect, lazy, Suspense, useContext } from "react";
import Map, { NavigationControl, GeolocateControl } from "react-map-gl";
import axios from "axios";
import "mapbox-gl/dist/mapbox-gl.css";
import "./mappage.css";
import Loader from "../components/ui/Loader";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import MapMarker from "../components/marker/MapMarker";
import debounce from "lodash.debounce";
import apiRequest from "../lib/ApiReqest";

import { AuthContext } from "../context/AuthContext";
import { LocationContext } from "../context/LocationContext";
import { useNavigate } from "react-router-dom";

const MarkerPopup = lazy(() => import("../components/popup/MarkerPopup"));
const UserMarkerPopup = lazy(() =>
  import("../components/popup/UserMarkerPopup")
);
const UserAuthentication = lazy(() =>
  import("../components/authentication/UserAuthentication")
);

const MapPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const { pins, SetPins, SetNewPlace } = useContext(LocationContext);
  
  const [viewport, setViewport] = useState({
    latitude: 6.927079,
    longitude: 79.861244,
    zoom: 2,
  });
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [locationPermission, setLocationPermission] = useState(null);

  useEffect(() => {
    const getPins = async () => {
      try {
        const allPins = await apiRequest.get("/api/pins");
        SetPins(allPins.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins();

    // Check location permission status
    if (currentUser) {
      checkLocationPermission();
    }
  }, [currentUser]);

  const checkLocationPermission = () => {
    if ("geolocation" in navigator) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setLocationPermission(result.state);
        
        if (result.state === 'granted') {
          navigator.geolocation.getCurrentPosition((position) => {
            setViewport({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              zoom: 14,
            });
          });
        }
      });
    }
  };

  const handleGeocodingSearch = async (query) => {
    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json`,
        {
          params: {
            access_token: process.env.REACT_APP_MAPBOX,
            autocomplete: true,
            limit: 5,
          },
        }
      );
      setSuggestions(response.data.features);
    } catch (err) {
      console.log(err);
    }
  };

  const debouncedGeocodingSearch = debounce(handleGeocodingSearch, 300);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    if (value) {
      debouncedGeocodingSearch(value);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const [longitude, latitude] = suggestion.center;
    setViewport({ ...viewport, latitude, longitude, zoom: 12 });
    setSearchInput(suggestion.place_name);
    setSuggestions([]);
  };

  const handleAddReview = () => {
    SetNewPlace({
      lat: viewport.latitude,
      long: viewport.longitude,
    });
  };

  return (
    <div className="map-page-container">
      {/* Location Permission Prompt */}
      {currentUser && locationPermission === 'prompt' && (
        <div className="location-permission-banner">
          <p>
            Enable location access to get personalized map experience. 
            <button onClick={checkLocationPermission}>
              Enable Location
            </button>
          </p>
        </div>
      )}

      {/* Navbar with search and action buttons */}
      <div className="navbar">
        <div className="search-container">
          <div className="search-box">
            <input
              type="text"
              value={searchInput}
              placeholder="Search for location"
              onChange={handleInputChange}
            />
            {suggestions.length > 0 && (
              <ul className="suggestions-list">
                {suggestions.map((suggestion) => (
                  <li
                    key={suggestion.id}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion.place_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="map-action-buttons">
          {currentUser && (
            <>
              <button onClick={handleAddReview} className="add-review-button">
                Add Review
              </button>
              <button
                onClick={() => navigate("/pins")}
                className="view-pins-button"
              >
                View My Pins
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mapbox map */}
      <div className="map-container">
        <Map
          mapboxAccessToken={process.env.REACT_APP_MAPBOX}
          {...viewport}
          onMove={(evt) => setViewport(evt.viewState)}
          mapStyle="mapbox://styles/mapbox/streets-v9"
          style={{ width: '100%', height: '100%' }}
        >
          <NavigationControl position="top-left" />
          {currentUser && (
            <GeolocateControl
              position="top-left"
              trackUserLocation
              showUserHeading
              onGeolocate={(e) => {
                setViewport({
                  latitude: e.coords.latitude,
                  longitude: e.coords.longitude,
                  zoom: 14,
                });
              }}
            />
          )}

          {pins.map((p) => (
            <React.Fragment key={p._id}>
              <MapMarker />
              <Suspense fallback={<Loader />}>
                <MarkerPopup p={p} />
              </Suspense>
            </React.Fragment>
          ))}

          <Suspense fallback={<Loader />}>
            <UserMarkerPopup />
            <UserAuthentication />
          </Suspense>
        </Map>

        {/* Conditionally render Fixed Marker at the center of the screen */}
        {currentUser && (
          <div className="center-marker">
            <MyLocationIcon style={{ fontSize: 20, color: "black" }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MapPage;