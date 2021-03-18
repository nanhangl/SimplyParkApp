import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import * as Feather from "react-native-feather";
import CarparksArray from '../../assets/carparks_01032021.json';
import axios from 'axios';
var moment = require('moment-timezone');
var proj4 = require('proj4');
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
  } from "react-native-chart-kit";
import { resolvePlugin, resolvePreset } from '@babel/core';

  const HistoricalDataScreen = ({ route, navigation }) => {
    const [lastHourLoader, setLastHourLoader] = useState(['flex','none',]);
    const [last24HoursLoader, setLast24HoursLoader] = useState(['flex','none']);
    const [lastHourData, setLastHourData] = useState([[],[]]);
    const [last24HoursData, setLast24HoursData] = useState([[],[]]);
    const base_url = "https://api.data.gov.sg/v1/transport/carpark-availability";
    const currentEpoch = Date.now();

    useEffect(async () => {
        var lastHourTimes = [];
        var lastHourLots = [];
        var last24HoursTimes = [];
        var last24HoursLots = [];
        for (var interval = 0; interval < 6; interval++) {
            const intervalTime = parseInt((currentEpoch - (600000*interval)).toFixed());
            const intervalDateTime = moment(new Date(intervalTime).toISOString()).tz("Asia/Singapore").format().substring(0,19);
            var response = await axios.get(`${base_url}?date_time=${intervalDateTime}`);
            const carpark_data = response.data.items[0].carpark_data;
            for (var item in carpark_data) {
              if (carpark_data[item].carpark_number == route.params["car_park_no"]) {
                lastHourTimes.unshift(intervalDateTime);
                lastHourLots.unshift(carpark_data[item].carpark_info[0].lots_available);
              }
            }
        }
          setLastHourLoader(['none','none']);
          setLastHourData([
              [lastHourTimes[1].substr(11,5),lastHourTimes[3].substr(11,5),lastHourTimes[5].substr(11,5),lastHourTimes[7].substr(11,5),lastHourTimes[9].substr(11,5),lastHourTimes[11].substr(11,5)],
              [lastHourLots[1],lastHourLots[3],lastHourLots[5],lastHourLots[7],lastHourLots[9],lastHourLots[11]]
          ])
          
          for (var interval = 0; interval < 24; interval++) {
            const intervalTime = parseInt((currentEpoch - (3600000*interval)).toFixed());
            const intervalDateTime = moment(new Date(intervalTime).toISOString()).tz("Asia/Singapore").format().substring(0,19);
            var response = await axios.get(`${base_url}?date_time=${intervalDateTime}`);
            const carpark_data = response.data.items[0].carpark_data;
            for (var item in carpark_data) {
              if (carpark_data[item].carpark_number == route.params["car_park_no"]) {
                last24HoursTimes.unshift(intervalDateTime);
                last24HoursLots.unshift(carpark_data[item].carpark_info[0].lots_available);
              }
            }
        }
          setLast24HoursLoader(['none','none']);
          console.log(last24HoursTimes);
          console.log(last24HoursLots);
    }, [])

    return (
        <View style={{height:'100%',backgroundColor:'#fff'}}>
            <View style={{flexDirection:'row',alignItems:'center'}}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather.ChevronLeft width={40} height={40} stroke="#404040" style={{marginLeft:10,marginTop:10}} />
                </TouchableOpacity>
                <Text style={[styles.bold, {fontSize:20,marginTop:7,marginLeft:15}]}>Historical Data</Text>
            </View>
            <Text style={[styles.medium, {marginLeft:25, marginTop:15}]}>Car Park {route.params["car_park_no"]}</Text>

            <View style={{marginHorizontal:25, marginTop:15,height:'30%'}}>
                <Text style={[styles.bold, {fontSize:20}]}>Last Hour</Text>
                <Text style={[styles.medium, {marginTop:15,display:lastHourLoader[1]}]}>Cannot Retrieve Data</Text>
                <View style={{justifyContent:'center',height:'80%',display:lastHourLoader[0]}}>
                    <ActivityIndicator size='large' color="#007AFF" />
                </View>
                { lastHourData[0].length == 6 ? 
                 <LineChart 
                 data={{
                     labels: lastHourData[0],
                     datasets: [
                         {
                             data: lastHourData[1]
                         }
                     ]
                 }}
                 width={Dimensions.get('window').width-50}
                 height={200}
                 yAxisSuffix=" lots"
                 chartConfig={{
                     backgroundColor: "#007AFF",
                     backgroundGradientFrom: "#007AFF",
                     backgroundGradientTo: "#007AFF",
                     decimalPlaces: 0, // optional, defaults to 2dp
                     color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                     labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                     style: {
                       borderRadius: 16
                     },
                     propsForDots: {
                       r: "6",
                       strokeWidth: "2",
                       stroke: "#007AFF"
                     }
                   }}
                   bezier
                   style={{
                     marginVertical: 8,
                     borderRadius: 16
                   }} />
                 : 
                 <></> 
                 }
            </View>
            <View style={{marginHorizontal:25, marginTop:15,height:'30%'}}>
                <Text style={[styles.bold, {fontSize:20}]}>Last 24 Hours</Text>
                <Text style={[styles.medium, {marginTop:15,display:last24HoursLoader[1]}]}>Cannot Retrieve Data</Text>
                <View style={{justifyContent:'center',height:'80%',display:last24HoursLoader[0]}}>
                    <ActivityIndicator size='large' color="#007AFF" />
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
    }
})

  export default HistoricalDataScreen;