import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import * as Feather from "react-native-feather";
import CarparksArray from '../../assets/carparks_01032021.json';
import axios from 'axios';
var proj4 = require('proj4');
import MapView, { Circle, Marker } from 'react-native-maps';

const CarparkInfoScreen = ({route, navigation}) => {
    const [carparkAvailability, setCarparkAvailability] = useState(false);
    proj4.defs("EPSG:3414","+proj=tmerc +lat_0=1.366666666666667 +lon_0=103.8333333333333 +k=1 +x_0=28001.642 +y_0=38744.572 +ellps=WGS84 +units=m +no_defs");
    const [carparkInfo, setCarparkInfo] = useState(route.params["info"]);
    const [lotsAvailable, setLotsAvailable] = useState(route.params["lotsAvailable"]);
    const [coords, setCoords] = useState(proj4("EPSG:3414","EPSG:4326",[carparkInfo.x_coord, carparkInfo.y_coord]));

    useEffect(async () => {
        const carparkAvailabilityApi = await axios.get("https://api.data.gov.sg/v1/transport/carpark-availability");
        setCarparkAvailability(carparkAvailabilityApi.data);
    }, [])

    return (
        <View style={{height:'100%',backgroundColor:'#fff'}}>
            <View style={{height:'30%',overflow:'hidden'}}>
                <MapView
                    initialRegion={{
                        latitude: coords[1],
                        longitude: coords[0],
                        latitudeDelta: 0.011,
                        longitudeDelta: 0.011
                    }}
                    region={{
                        latitude: coords[1],
                        longitude: coords[0],
                        latitudeDelta: 0.011,
                        longitudeDelta: 0.011
                    }}
                    style={styles.map} >
                        <Marker
                        coordinate={{latitude:coords[1],longitude:coords[0]}}>
                            <View style={{alignItems:'center'}}>
                                <View style={{backgroundColor:'#007AFF',paddingVertical:5,width:45,borderRadius:5}}>
                                    <Text style={[styles.medium,{color:'#fff',textAlign:'center'}]}>
                                        {lotsAvailable}
                                    </Text>
                                </View>
                                <View style={styles.mapPin} />
                            </View>
                        </Marker>                
                </MapView>
            </View>
            <View style={{flexDirection:'row',alignItems:'center'}}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather.ChevronLeft width={40} height={40} stroke="#404040" style={{marginLeft:10,marginTop:10}} />
                </TouchableOpacity>
                <Text style={[styles.bold, {fontSize:20,marginTop:7,marginLeft:15}]}>Car Park Information</Text>
            </View>
            <View style={{alignItems:'center',marginVertical:15,marginHorizontal:10}}>
                <Text style={[styles.bold,{fontSize:20,textAlign:'center',marginBottom:3}]}>{carparkInfo.address}</Text>
                <Text style={styles.medium}>Car Park No. {carparkInfo.car_park_no}</Text>
            </View>
            <View style={{marginLeft:20,marginTop:20}}>
                <Text style={[styles.bold]}>Car Park Type</Text>
                <Text style={styles.medium}>{carparkInfo.car_park_type}</Text>
                <Text style={[styles.bold,{marginTop:10}]}>Free Parking</Text>
                <Text style={styles.medium}>{carparkInfo.free_parking}</Text>
                <Text style={[styles.bold,{marginTop:10}]}>Gantry Height</Text>
                <Text style={styles.medium}>{carparkInfo.gantry_height} m</Text>
                <Text style={[styles.bold,{marginTop:10}]}>Night Parking</Text>
                <Text style={styles.medium}>{carparkInfo.night_parking}</Text>
            </View>
            <View style={{width:'100%',alignItems:'center',position:'absolute', bottom:20}}>
                <TouchableOpacity style={{width:'90%',height:50,backgroundColor:'#007AFF',justifyContent:'center'}}>
                    <Text style={[styles.bold,{fontSize:20,textAlign:'center',color:'#fff'}]}>View Historical Data</Text>
                </TouchableOpacity>
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
        borderBottomColor: "#007AFF",
        transform: [{ rotate: "180deg" }]
      }
})

export default CarparkInfoScreen;