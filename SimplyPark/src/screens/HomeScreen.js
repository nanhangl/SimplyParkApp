import React, { Component, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, RefreshControl } from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';
import * as Feather from "react-native-feather";
import Geolocation from '@react-native-community/geolocation';
import CarparksArray from '../../assets/carparks_01032021.json';
import CarparksTest from '../../assets/carparks_test.json';
import axios from 'axios';
// import _ from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faParking } from '@fortawesome/free-solid-svg-icons'

var proj4 = require('proj4');

const homeScreen = ({navigation}) => {
    const [locationInfo, setLocationInfo] = useState({"coords":{"longitude":1.3521,"latitude":103.8198}});
    const [refreshLocation, setRefreshLocation] = useState('');
    const [carparkAvailability, setCarparkAvailability] = useState(false);
    const [cpRadius, setCpRadius] = useState(20);
    const [lastUpdated, setLastUpdated] = useState('');

    useEffect(async () => {
        Geolocation.getCurrentPosition(info => setLocationInfo(info))
        const carparkAvailabilityApi = await axios.get("https://api.data.gov.sg/v1/transport/carpark-availability");
        setCarparkAvailability(carparkAvailabilityApi.data);
        const updatedDateTime = new Date(carparkAvailabilityApi.data.items[0].timestamp);
        setLastUpdated(`Last Updated at ${updatedDateTime.getHours().toString().padStart(2,'0')}:${updatedDateTime.getMinutes().toString().padStart(2,'0')}`)
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
        try {
            var cpInfo = carparkAvailability.items[0].carpark_data;
            for (var item in cpInfo) {
                if (cpInfo[item].carpark_number == carparkNo) {
                    return cpInfo[item].carpark_info[0].lots_available;
                }
            }
        } catch {}
    }

    const renderCarparks = cpArray => {
        const cpMarkers = cpArray.map((item) => {
            var coords = proj4("EPSG:3414","EPSG:4326",[item.x_coord,item.y_coord]);
            var cpDist = distance(locationInfo.coords.latitude,locationInfo.coords.longitude,coords[1],coords[0]);
            if (cpDist <= cpRadius) {
                const lotsAvailable = getLotsAvailable(item.car_park_no);
                return <Marker
                key={item.x_coord.toString() + "_" + item.y_coord.toString()}
                coordinate={{latitude:coords[1],longitude:coords[0]}}
                onPress={() => navigation.navigate("Carpark Info", {"info":item,"lotsAvailable":lotsAvailable || 'NA'})} >
                    <View style={{alignItems:'center'}}>
                        <View style={{backgroundColor:'#3e3e3e',paddingVertical:5,width:45,borderRadius:5}}>
                            <Text style={[styles.medium,{color:'#fff',textAlign:'center'}]}>
                                {lotsAvailable || "NA"}
                            </Text>
                        </View>
                        <View style={styles.mapPin} />
                    </View>
                </Marker>
        }})
        return cpMarkers;
    }

    const renderNearestCarparks = cpArray => {
        var nearestCarparksArray = [];
        var nearestCarparksComponentArray = [];
        
        for (var item in cpArray) {
            var coords = proj4("EPSG:3414","EPSG:4326",[cpArray[item].x_coord,cpArray[item].y_coord]);
            var cpDist = distance(locationInfo.coords.latitude,locationInfo.coords.longitude,coords[1],coords[0]);
            if (cpDist <= cpRadius) {
                nearestCarparksArray.push([cpArray[item], cpDist]);
            }
        }

        nearestCarparksArray.sort((a,b) => a[1] - b[1])

        for (var item in nearestCarparksArray) {
            const cpItem = nearestCarparksArray[item][0];
            const lotsAvailable = parseInt(getLotsAvailable(cpItem.car_park_no));
            if (lotsAvailable == 0) {
                nearestCarparksComponentArray.push(
                    <TouchableOpacity key={nearestCarparksArray[item][0].address} onPress={() => navigation.navigate("Carpark Info", {"info":cpItem,"lotsAvailable":lotsAvailable})}>
                        <View style={{flexDirection:'row',alignItems:'center',borderBottomColor:'#d0d0d0',borderBottomWidth:1,paddingVertical:10}}>
                            <FontAwesomeIcon icon={faParking} color="#086EB5" size={25} />
                            <View style={{marginLeft:15,marginRight:15}}>
                                <Text style={styles.medium}>{nearestCarparksArray[item][0].address}</Text>
                                <Text style={[styles.regular,{marginTop:5,color:'#888'}]}>No lots | {Math.round(nearestCarparksArray[item][1] * 10) / 10} km away</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                );
            } else if (isNaN(lotsAvailable)) {
                nearestCarparksComponentArray.push(
                    <TouchableOpacity key={nearestCarparksArray[item][0].address} onPress={() => navigation.navigate("Carpark Info", {"info":cpItem,"lotsAvailable":lotsAvailable})}>
                        <View style={{flexDirection:'row',alignItems:'center',borderBottomColor:'#d0d0d0',borderBottomWidth:1,paddingVertical:10}}>
                            <FontAwesomeIcon icon={faParking} color="#086EB5" size={25} />
                            <View style={{marginLeft:15,marginRight:15}}>
                                <Text style={styles.medium}>{nearestCarparksArray[item][0].address}</Text>
                                <Text style={[styles.regular,{marginTop:5,color:'#888'}]}>No Data | {Math.round(nearestCarparksArray[item][1] * 10) / 10} km away</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                );
            } else {
                nearestCarparksComponentArray.push(
                    <TouchableOpacity key={nearestCarparksArray[item][0].address} onPress={() => navigation.navigate("Carpark Info", {"info":cpItem,"lotsAvailable":lotsAvailable})}>
                        <View style={{flexDirection:'row',alignItems:'center',borderBottomColor:'#d0d0d0',borderBottomWidth:1,paddingVertical:10}} onPress={() => console.log("You clicked on " + nearestCarparksArray[item][0].address)}>
                            <FontAwesomeIcon icon={faParking} color="#086EB5" size={25} />
                            <View style={{marginLeft:15,marginRight:40}}>
                                <Text style={styles.medium}>{nearestCarparksArray[item][0].address}</Text>
                                <Text style={[styles.regular,{marginTop:5,color:'#888'}]}>{ lotsAvailable } {lotsAvailable == 1 ? 'lot' : 'lots' } | {Math.round(nearestCarparksArray[item][1] * 10) / 10} km away</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                );
            }
        }
        return nearestCarparksComponentArray;
    }

    return (
        <View style={{height:'100%',backgroundColor:'#fff'}}>
            {/* <TouchableOpacity style={{position:'absolute',zIndex:2,backgroundColor:'#fff',margin:10,padding:10,shadowColor:"#000",shadowOffset:{width:0,height:4},shadowOpacity:0.25,shadowRadius:8,elevation:8,marginVertical:7.5,borderRadius:10}}>
                <Feather.Menu width={25} height={25} stroke="#404040" />
            </TouchableOpacity> */}
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
                <TouchableOpacity onPress={() => setRefreshLocation(Math.random())} style={{position:'absolute',zIndex:2,backgroundColor:'#fff',bottom:5,right:15,padding:10,paddingLeft:8.5,paddingBottom:8,shadowColor:"#000",shadowOffset:{width:0,height:4},shadowOpacity:0.25,shadowRadius:8,elevation:8,marginVertical:7.5,borderRadius:10}}>
                    <Feather.Navigation width={20} height={20} stroke="#404040" fill="#404040" />
                </TouchableOpacity>
            </View>
            <View>
                <TouchableOpacity onPress={() => navigation.navigate('Search')} style={{alignItems:'center'}}>
                    <View style={{backgroundColor:'#f0f0f0',width:'92%',height:50,margin:15,marginBottom:5,borderRadius:5,alignItems:'center',flexDirection:'row'}}>
                        <Feather.Search width={30} height={30} stroke="#404040" style={{marginLeft:10}} />
                        <Text style={[styles.medium,{fontSize:17,width:'90%',marginLeft:10,color:'#777'}]}>Search by Address or Carpark No.</Text>
                    </View>
                </TouchableOpacity>
                <View style={{marginHorizontal:15,maxHeight:'50%'}}>
                    <ScrollView style={{flexGrow:0}}>
                        {carparkAvailability ? renderNearestCarparks(CarparksArray).map(item => item) : <></>}
                    </ScrollView>
                </View>
                {/* <View style={{flex:1}}><Text style={[styles.medium,{textAlign:'center'}]}>{lastUpdated}</Text></View> */}
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