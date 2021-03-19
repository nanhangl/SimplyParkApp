import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import * as Feather from "react-native-feather";
import CarparksArray from '../../assets/carparks_01032021.json';
import DateTimePicker from '@react-native-community/datetimepicker';
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
    const [lastHourLoader, setLastHourLoader] = useState(['flex','none']);
    const [last24HoursLoader, setLast24HoursLoader] = useState(['flex','none']);
    const [lastHourData, setLastHourData] = useState([[],[]]);
    const [last24HoursData, setLast24HoursData] = useState([[],[]]);
    const base_url = "https://api.data.gov.sg/v1/transport/carpark-availability";
    const [showDate, setShowDate] = useState(false);
    const [showTime, setShowTime] = useState(false);
    const [showResultLoader, setShowResultLoader] = useState(['none','none']);
    const [searchLots, setSearchLots] = useState(0);
    const currentEpoch = Date.now();
    const [date, setDate] = useState(new Date(currentEpoch));

    useEffect(async () => {
        var lastHourTimes = [];
        var lastHourLots = [];
        var last24HoursTimes = [];
        var last24HoursLots = [];
        try {
            for (var interval = 0; interval < 6; interval++) {
                const intervalTime = parseInt((currentEpoch - (600000*interval)).toFixed());
                const intervalDateTime = moment(new Date(intervalTime).toISOString()).tz("Asia/Singapore").format().substring(0,19);
                var response = await axios.get(`${base_url}?date_time=${intervalDateTime}`);
                const carpark_data = response.data.items[0].carpark_data;
                for (var item in carpark_data) {
                if (carpark_data[item].carpark_number == route.params["car_park_no"]) {
                    lastHourTimes.unshift(intervalDateTime);
                    lastHourLots.unshift(parseInt(carpark_data[item].carpark_info[0].lots_available));
                    break;
                }
                }
            }
            setLastHourLoader(['none','none']);
            setLastHourData([
                [lastHourTimes[0].substr(11,5),lastHourTimes[1].substr(11,5),lastHourTimes[2].substr(11,5),lastHourTimes[3].substr(11,5),lastHourTimes[4].substr(11,5),lastHourTimes[5].substr(11,5)],
                lastHourLots
            ])
        } catch {
            setLastHourLoader(['none','flex']);
        }
        
        try {
            for (var interval = 0; interval < 24; interval++) {
                const intervalTime = parseInt((currentEpoch - (3600000*interval)).toFixed());
                const intervalDateTime = moment(new Date(intervalTime).toISOString()).tz("Asia/Singapore").format().substring(0,19);
                var response = await axios.get(`${base_url}?date_time=${intervalDateTime}`);
                const carpark_data = response.data.items[0].carpark_data;
                for (var item in carpark_data) {
                if (carpark_data[item].carpark_number == route.params["car_park_no"]) {
                    last24HoursTimes.unshift(intervalDateTime);
                    last24HoursLots.unshift(parseInt(carpark_data[item].carpark_info[0].lots_available));
                    break;
                }
                }
            }
            setLast24HoursLoader(['none','none']);
            setLast24HoursData([
                [last24HoursTimes[0].substr(11,2),last24HoursTimes[1].substr(11,2),last24HoursTimes[2].substr(11,2),last24HoursTimes[3].substr(11,2),last24HoursTimes[4].substr(11,2),last24HoursTimes[5].substr(11,2),last24HoursTimes[6].substr(11,2),last24HoursTimes[7].substr(11,2),last24HoursTimes[8].substr(11,2),last24HoursTimes[9].substr(11,2),last24HoursTimes[10].substr(11,2),last24HoursTimes[11].substr(11,2),last24HoursTimes[12].substr(11,2),last24HoursTimes[13].substr(11,2),last24HoursTimes[14].substr(11,2),last24HoursTimes[15].substr(11,2),last24HoursTimes[16].substr(11,2),last24HoursTimes[17].substr(11,2),last24HoursTimes[18].substr(11,2),last24HoursTimes[19].substr(11,2),last24HoursTimes[20].substr(11,2),last24HoursTimes[21].substr(11,2),last24HoursTimes[22].substr(11,2),last24HoursTimes[23].substr(11,2)],
                last24HoursLots
            ])
        } catch {
            setLast24HoursLoader(['none','flex']);
        }
    }, [])

    const changeDate = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDate(false);
        setShowTime(false);
        setDate(currentDate);
      };

    const goSearch = async () => {
        setShowResultLoader(['flex','none']);
        var response = await axios.get(`${base_url}?date_time=${moment(date.toISOString()).tz("Asia/Singapore").format().substr(0,19)}`);
        const carpark_data = response.data.items[0].carpark_data;
        for (var item in carpark_data) {
          if (carpark_data[item].carpark_number == route.params["car_park_no"]) {
            setShowResultLoader(['none','flex']);
            setSearchLots(carpark_data[item].carpark_info[0].lots_available);
            break;
          }
        }
    }

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
                <View style={{flexDirection:'row',alignItems:'center'}}><Text style={[styles.bold, {fontSize:20}]}>Last Hour</Text>{ lastHourData[0].length == 6 ?<Text style={[styles.medium,{marginLeft:'auto',color:'#007AFF'}]} onPress={() => navigation.navigate("Comparison", {"car_park_no":route.params["car_park_no"],"type":"Hourly","data":lastHourData,"requestEpoch":currentEpoch})}>Compare</Text> : <></> }</View>
                <Text style={[styles.medium, {marginTop:15,display:lastHourLoader[1]}]}>Cannot Retrieve Data</Text>
                <View style={{justifyContent:'center',height:'80%',display:lastHourLoader[0],alignItems:'center'}}>
                    <ActivityIndicator size='large' color="#007AFF" />
                    <Text style={[styles.medium,{marginTop:5}]}>This will take approx. 10 secs</Text>
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
            <View style={{flexDirection:'row',alignItems:'center'}}><Text style={[styles.bold, {fontSize:20}]}>Last 24 Hours</Text>{ last24HoursData[0].length == 24 ?<Text style={[styles.medium,{marginLeft:'auto',color:'#007AFF'}]} onPress={() => navigation.navigate("Comparison", {"car_park_no":route.params["car_park_no"],"type":"Last 24 Hours"})}>Compare</Text> : <></> }</View>
                <Text style={[styles.medium, {marginTop:15,display:last24HoursLoader[1]}]}>Cannot Retrieve Data</Text>
                <View style={{justifyContent:'center',height:'80%',display:last24HoursLoader[0],alignItems:'center'}}>
                    <ActivityIndicator size='large' color="#007AFF" />
                    <Text style={[styles.medium,{marginTop:5}]}>This will take approx. a min</Text>
                </View>
                { last24HoursData[0].length == 24 ? 
                 <LineChart 
                 data={{
                     labels: last24HoursData[0],
                     datasets: [
                         {
                             data: last24HoursData[1]
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
                <Text style={[styles.bold, {fontSize:20}]}>Search at That Moment in Time</Text>
                <View style={{flexDirection:'row',marginTop:5,alignItems:'center'}}>
                    <View style={{width:'35%'}}>
                        <Text style={[styles.bold]}>Date</Text>
                        <Text style={[styles.medium,{color:'#007AFF',fontSize:15}]} onPress={() => setShowDate(true)}>{moment(date.toISOString()).tz("Asia/Singapore").format().substr(0,10)}</Text>
                    </View>
                    <View style={{width:'35%'}}>
                        <Text style={[styles.bold]}>Time</Text>
                        <Text style={[styles.medium,{color:'#007AFF',fontSize:15}]} onPress={() => setShowTime(true)}>{moment(date.toISOString()).tz("Asia/Singapore").format().substr(11,5)}</Text>
                    </View>
                    <TouchableOpacity style={{backgroundColor:'#007AFF',paddingHorizontal:20,paddingVertical:10,borderRadius:5}} onPress={() => goSearch()}>
                        <Text style={[styles.bold,{color:'#fff'}]}>Search</Text>
                    </TouchableOpacity>
                </View>
                <ActivityIndicator size='large' color="#007AFF" style={{display:showResultLoader[0],marginTop:20}} />
                <Text style={[styles.medium,{fontSize:20,marginTop:20,display:showResultLoader[1]}]}>Lots Available: {searchLots}</Text>
                {showDate ?
                    <DateTimePicker
                    testID="datePicker"
                    value={date}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    maximumDate={new Date(currentEpoch)}
                    onChange={changeDate}
                    />
                : <></>}
                {showTime ?
                    <DateTimePicker
                    testID="datePicker"
                    value={date}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={changeDate}
                    />
                : <></>}
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