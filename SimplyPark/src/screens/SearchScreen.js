import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import * as Feather from "react-native-feather";
import Geolocation from '@react-native-community/geolocation';
import CarparksArray from '../../assets/carparks_01032021.json';
import CarparksTest from '../../assets/carparks_test.json';
import axios from 'axios';
var proj4 = require('proj4');
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faParking } from '@fortawesome/free-solid-svg-icons'

const searchScreen = ({navigation}) => {
    const [locationInfo, setLocationInfo] = useState({"coords":{"longitude":1.3521,"latitude":103.8198}});
    const [refreshLocation, setRefreshLocation] = useState('');
    const [carparkAvailability, setCarparkAvailability] = useState(false);
    const [searchedCarparks, setSearchedCarparks] = useState(<></>);

    useEffect(async () => {
        //Geolocation.getCurrentPosition(info => setLocationInfo(info))
        const carparkAvailabilityApi = await axios.get("https://api.data.gov.sg/v1/transport/carpark-availability");
        setCarparkAvailability(carparkAvailabilityApi.data);
    }, [refreshLocation])

    //Geolocation.watchPosition(info => setLocationInfo(info), () => {}, {distanceFilter:50, maximumAge:0, timeout:1000, enableHighAccuracy:true})
    //proj4.defs("EPSG:3414","+proj=tmerc +lat_0=1.366666666666667 +lon_0=103.8333333333333 +k=1 +x_0=28001.642 +y_0=38744.572 +ellps=WGS84 +units=m +no_defs");

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

    const renderSearchedCarparks = (cpArray, searchTerm) => {
        var nearestCarparksArray = [];
        var nearestCarparksComponentArray = [];

        if (searchTerm.length >= 3) {
        
        for (var item in cpArray) {
            if (cpArray[item].address.toLowerCase().includes(searchTerm) || cpArray[item].car_park_no.toLowerCase().includes(searchTerm)) {
                nearestCarparksArray.push([cpArray[item]]);
            }
        }

        for (var item in nearestCarparksArray) {
            var lotsAvailable = parseInt(getLotsAvailable(nearestCarparksArray[item][0].car_park_no));

            if (lotsAvailable == 0) {
                nearestCarparksComponentArray.push(
                    <TouchableOpacity key={nearestCarparksArray[item][0].address + "_" + Math.random()}>
                        <View style={{flexDirection:'row',alignItems:'center',borderBottomColor:'#d0d0d0',borderBottomWidth:1,paddingVertical:10}}>
                            <FontAwesomeIcon icon={faParking} color="#086EB5" size={25} />
                            <View style={{marginLeft:15,marginRight:15}}>
                                <Text style={styles.medium}>{nearestCarparksArray[item][0].address}</Text>
                                <Text style={[styles.regular,{marginTop:5,color:'#888'}]}>No lots</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                );
            } else if (isNaN(lotsAvailable)) {
                nearestCarparksComponentArray.push(
                    <TouchableOpacity key={nearestCarparksArray[item][0].address + "_" + Math.random()}>
                        <View style={{flexDirection:'row',alignItems:'center',borderBottomColor:'#d0d0d0',borderBottomWidth:1,paddingVertical:10}}>
                            <FontAwesomeIcon icon={faParking} color="#086EB5" size={25} />
                            <View style={{marginLeft:15,marginRight:15}}>
                                <Text style={styles.medium}>{nearestCarparksArray[item][0].address}</Text>
                                <Text style={[styles.regular,{marginTop:5,color:'#888'}]}>No Data</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                );
            } else {
                nearestCarparksComponentArray.push(
                    <TouchableOpacity key={nearestCarparksArray[item][0].address + "_" + Math.random()}>
                        <View style={{flexDirection:'row',alignItems:'center',borderBottomColor:'#d0d0d0',borderBottomWidth:1,paddingVertical:10}}>
                            <FontAwesomeIcon icon={faParking} color="#086EB5" size={25} />
                            <View style={{marginLeft:15,marginRight:40}}>
                                <Text style={styles.medium}>{nearestCarparksArray[item][0].address}</Text>
                                <Text style={[styles.regular,{marginTop:5,color:'#888'}]}>{ lotsAvailable } {lotsAvailable == 1 ? 'lot' : 'lots' }</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                );
            }
        }
        setSearchedCarparks(nearestCarparksComponentArray);
    }
    }

    return (
        <View style={{height:'100%',backgroundColor:'#fff'}}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Feather.ChevronLeft width={40} height={40} stroke="#404040" style={{marginLeft:10,marginTop:10}} />
            </TouchableOpacity>
            <View style={{backgroundColor:'#f0f0f0',width:'92%',height:50,margin:15,marginBottom:5,borderRadius:5,alignItems:'center',flexDirection:'row'}}>
                <Feather.Search width={30} height={30} stroke="#404040" style={{marginLeft:10}} />
                <TextInput onChangeText={searchTerm => searchTerm.length >= 3 ? renderSearchedCarparks(CarparksArray,searchTerm.toLowerCase()) : setSearchedCarparks(<></>)} style={[styles.medium,{fontSize:17,width:'90%',height:50,marginLeft:10,color:'#404040'}]} placeholder="Search by Address or Carpark No." placeholderTextColor="#777" />
            </View>
            <View style={{marginHorizontal:15}}>
                <ScrollView>
                    {searchedCarparks}
                </ScrollView>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    regular: {
        fontFamily: "Montserrat-Regular"
    },
    medium: {
        fontFamily: "Montserrat-Medium"
    }, 
    bold: {
        fontFamily: "Montserrat-Bold"
    }
})

export default searchScreen;