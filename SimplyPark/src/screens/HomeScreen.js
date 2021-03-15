import React, { Component, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput,  } from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';
import * as Feather from "react-native-feather";
import Geolocation from '@react-native-community/geolocation';
import CarparksArray from '../../assets/carparks_01032021.json';
import CarparksTest from '../../assets/carparks_test.json';
import axios from 'axios';

var proj4 = require('proj4');

const homeScreen = ({navigation}) => {
    const [locationInfo, setLocationInfo] = useState({"coords":{"longitude":1.3521,"latitude":103.8198}});
    const [refreshLocation, setRefreshLocation] = useState('');
    const [carparkAvailability, setCarparkAvailability] = useState();

    useEffect(async () => {
        Geolocation.getCurrentPosition(info => setLocationInfo(info))
        const carparkAvailabilityApi = await axios.get("https://api.data.gov.sg/v1/transport/carpark-availability");
        setCarparkAvailability(carparkAvailabilityApi);
    }, [refreshLocation])

    Geolocation.watchPosition(info => setLocationInfo(info), () => {}, {distanceFilter:50, maximumAge:0, timeout:1000, enableHighAccuracy:true})
    proj4.defs("EPSG:3414","+proj=tmerc +lat_0=1.366666666666667 +lon_0=103.8333333333333 +k=1 +x_0=28001.642 +y_0=38744.572 +ellps=WGS84 +units=m +no_defs");

    function distance(lat1,lon1,lat2,lon2){
        var R = 6371; // km
        return Math.acos(Math.sin(lat1)*Math.sin(lat2) + 
                        Math.cos(lat1)*Math.cos(lat2) *
                        Math.cos(lon2-lon1)) * R;
      }

    const getLotsAvailable = carparkNo => {
        // carparkAvailability.items[0].carpark_data.map(cp => {
                                    //     if (cp.carpark_number == item.car_park_no) {
                                    //         return cp.carpark_info[0].lots_available
                                    //     }
                                    // })
        try {
            for (var item in carparkAvailability.items[0].carpark_data) {
                console.log(item);
            }
        } catch {}
    }

    const renderCarparks = cpArray => (
        cpArray.map((item) => {
            var coords = proj4("EPSG:3414","EPSG:4326",[item.x_coord,item.y_coord]);
            if (distance(locationInfo.coords.latitude,locationInfo.coords.longitude,coords[1],coords[0]) <= 20) {
                return <Marker
                key={item.x_coord.toString() + "_" + item.y_coord.toString()}
                coordinate={{latitude:coords[1],longitude:coords[0]}}
                >
                    <View style={{alignItems:'center'}}>
                        <View style={{backgroundColor:'#3e3e3e',paddingVertical:5,paddingHorizontal:8,borderRadius:5}}>
                            <Text style={[styles.medium,{color:'#fff'}]}>
                                {getLotsAvailable()}
                            </Text>
                        </View>
                        <View style={styles.mapPin} />
                    </View>
                </Marker>
        }})
    )

    return (
        <View style={{height:'100%',backgroundColor:'#fff'}}>
            <TouchableOpacity style={{position:'absolute',zIndex:2,backgroundColor:'#fff',margin:10,padding:10,shadowColor:"#000",shadowOffset:{width:0,height:4},shadowOpacity:0.25,shadowRadius:8,elevation:8,marginVertical:7.5,borderRadius:10}}>
                <Feather.Menu width={25} height={25} stroke="#404040" />
            </TouchableOpacity>
            <View style={{height:'60%',overflow:'hidden'}}>
                <MapView
                    initialRegion={{
                        latitude: locationInfo.coords.latitude,
                        longitude: locationInfo.coords.longitude,
                        latitudeDelta: 0.011,
                        longitudeDelta: 0.011
                    }}
                    region={{
                        latitude: locationInfo.coords.latitude,
                        longitude: locationInfo.coords.longitude,
                        latitudeDelta: 0.011,
                        longitudeDelta: 0.011
                    }} 
                    style={styles.map} >
                    <Circle center={{latitude:locationInfo.coords.latitude,longitude:locationInfo.coords.longitude}} radius={20} strokeWidth={2} strokeColor="#fff" fillColor="#0073f0" />
                    { carparkAvailability ? renderCarparks(CarparksArray) : <></> }
                    
                </MapView>
                <TouchableOpacity onPress={() => setRefreshLocation(Math.random())} style={{position:'absolute',zIndex:2,backgroundColor:'#fff',bottom:5,right:15,padding:10,paddingLeft:8,paddingBottom:8,shadowColor:"#000",shadowOffset:{width:0,height:4},shadowOpacity:0.25,shadowRadius:8,elevation:8,marginVertical:7.5,borderRadius:10}}>
                    <Feather.Navigation width={20} height={20} stroke="#404040" fill="#404040" />
                </TouchableOpacity>
            </View>
            <View style={{alignItems:'center'}}>
                <View style={{backgroundColor:'#f0f0f0',width:'92%',height:50,margin:15,borderRadius:5,alignItems:'center',flexDirection:'row'}}>
                    <Feather.Search width={30} height={30} stroke="#404040" style={{marginLeft:10}} />
                    <TextInput style={[styles.medium,{fontSize:12,width:'90%',height:50,marginLeft:10}]} placeholder="Search by Address, Postal Code, or Carpark No." placeholderTextColor="#a0a0a0" />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    regular: {
        fontFamily: "Montserrat-Regular"
    },
    medium: {
        fontFamily: "Montserrat-Medium"
    }, 
    bold: {
        fontFamily: "Montserrat-Bold"
    },
    map: {
        ...StyleSheet.absoluteFillObject
    },
    mapPin: {
        width: 0,
        height: 0,
        backgroundColor: "transparent",
        borderStyle: "solid",
        borderLeftWidth: 5,
        borderRightWidth: 5,
        borderBottomWidth: 10,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderBottomColor: "#3e3e3e",
        transform: [{ rotate: "180deg" }]
      }
})

export default homeScreen;