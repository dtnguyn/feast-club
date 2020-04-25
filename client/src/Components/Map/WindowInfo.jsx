import React, { useState } from "react";
import {useHistory} from 'react-router-dom';
import '../../styles/Map.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobeAsia } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faCompass } from '@fortawesome/free-solid-svg-icons';
import SearchBar from "./WindowInfoSearchBar"
import InfoBox from "./InfoBox"
import UpdateLocationForm from "./UpdateLocationForm";
import AlertDialog from '../SharedComponents/AlertDialog'
import axios from 'axios';


function WindowInfo(props){

  const history = useHistory();

  const [invalidSearch, setInvalidSearch] = useState(false);

  const [open, setOpen] = useState(false);

  function openLocationDialog(){  
    setOpen(true);
  }

  function closeLocationDialog(){
    console.log("closed");
    setOpen(false);
  }

  function findSpecificRestaurant(info){
      console.log(info);
      axios.get("http://localhost:5000/findrestaurant", {
        withCredentials: true,
        params: {
          id: info.id,
          lat: info.latLng.lat,
          lng: info.latLng.lng
        }
      })
      .then((response) => {
          console.log("Found it!!!");
          const result = response.data.result;
          console.log(response.data);
          
          if(result != undefined){
              console.log("Restaurant is valid");
              history.push("/info", {
                  restaurant: result,
                  origin: {lat: props.lat, lng: props.lng}, 
                  destination: {lat: info.latLng.lat, lng: info.latLng.lng}
                  
              });
          } else {
              console.log("Restaurant is valid");
              setInvalidSearch(true);
          }
      })
      .catch(err => {
          console.log(err);
      })
  }

    return(
      <div>
        <FontAwesomeIcon className="window-info-icon" icon={faGlobeAsia}/>
        <FontAwesomeIcon className="window-info-icon" icon={faUser}/>
        <FontAwesomeIcon id="compass" className="window-info-icon" icon={faCompass} onClick={openLocationDialog}/>
        <SearchBar 
          lat={props.lat} 
          lng ={props.lng} 
          findSpecificRestaurant={findSpecificRestaurant}
          setInvalidSearch={setInvalidSearch}
        />
        <p className="window-info-title">Check out {props.restaurants.data.length} restaurants near you!</p>
        {props.restaurants.data.map((restaurant) => (
          <InfoBox 
          findSpecificRestaurant={findSpecificRestaurant}
          lat={restaurant.latitude}
          lng={restaurant.longitude}
          restaurantName={restaurant.name}
          priceLevel={restaurant.price_level}
          address={restaurant.address} 
          cuisine={restaurant.cuisine != undefined && restaurant.cuisine[0] != undefined
                  ? restaurant.cuisine.map(type => {

                    return type.name + (restaurant.cuisine.indexOf(type) != restaurant.cuisine.length - 1 ? ", " : "");
                  })
                  : ""} 
          rating={restaurant.rating}/>
        ))}
          {open && <UpdateLocationForm
            open={open}
            getNearbyRestaurants={props.getNearbyRestaurants}
          />}
        {invalidSearch 
          ? <AlertDialog
              open={invalidSearch}
              close={closeLocationDialog}
              alertTitle="Cannot find Restaurants!"
              alertMessage="Sorry! We are unable to find the restaurants that you requested. Please try again!"
              
            />
          : null}
      </div>

    );
    
}

export default WindowInfo