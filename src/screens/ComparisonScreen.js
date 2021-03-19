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

  const ComparisonScreen = ({ route, navigation }) => {
    const [dataLoader, setDataLoader] = useState(['none','none']);
    const [graphData, setGraphData] = useState([[],[]]);
    const base_url = "https://api.data.gov.sg/v1/transport/carpark-availability";
    const [showDate, setShowDate] = useState(false);
    const [showResultLoader, setShowResultLoader] = useState(['none','none']);
    const currentEpoch = Date.now();
    const requestDate = moment(new Date(route.params["requestEpoch"]).toISOString()).tz("Asia/Singapore").format();
    const [date, setDate] = useState(new Date(parseInt(route.params["requestEpoch"])-86400000));

    const changeDate = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDate(false);
        setDate(currentDate);
    };

    const getGraph = () => {
        console.log(date);
    }

    return (
        <View style={{height:'100%',backgroundColor:'#fff'}}>
            <View style={{flexDirection:'row',alignItems:'center'}}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather.ChevronLeft width={40} height={40} stroke="#404040" style={{marginLeft:10,marginTop:10}} />
                </TouchableOpacity>
                <Text style={[styles.bold, {fontSize:20,marginTop:7,marginLeft:15}]}>Compare Data</Text>
            </View>
            <Text style={[styles.medium, {marginLeft:25, marginTop:15}]}>Car Park {route.params["car_park_no"]}</Text>

            <View style={{marginHorizontal:25, marginTop:15,height:'35%'}}>
                <View style={{flexDirection:'row',alignItems:'center'}}><Text style={[styles.bold, {fontSize:20}]}>{route.params["type"]} Comparison</Text></View>
                <Text style={[styles.medium]}>Data for {requestDate.substr(0,10)} {route.params["data"][0][0]} to {route.params["data"][0][route.params["data"][0].length-1]}</Text>
                <LineChart 
                 data={{
                     labels: route.params["data"][0],
                     datasets: [
                         {
                             data: route.params["data"][1]
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
            </View>
            <View style={{marginHorizontal:25, marginTop:15,height:'35%'}}>
                <View style={{flexDirection:'row',alignItems:'center'}}><Text style={[styles.bold, {fontSize:20}]}>Another Day to Compare</Text></View>
                <View style={{flexDirection:'row',alignItems:'center',marginVertical:5}}>
                    <Text style={[styles.medium]}>Data for <Text style={[styles.medium,{color:'#007AFF'}]}>{date.toISOString().substr(0,10)}</Text> {route.params["data"][0][0]} to {route.params["data"][0][route.params["data"][0].length-1]}</Text>
                    <TouchableOpacity onPress={() => getGraph()} style={{backgroundColor:'#007AFF',paddingVertical:5,paddingHorizontal:10,borderRadius:5,marginLeft:'auto'}}><Text style={[styles.bold,{color:'#fff'}]}>Get Chart</Text></TouchableOpacity>
                </View>
                <Text style={[styles.medium, {marginTop:15,display:dataLoader[1]}]}>Cannot Retrieve Data</Text>
                <View style={{justifyContent:'center',height:'80%',display:dataLoader[0],alignItems:'center'}}>
                    <ActivityIndicator size='large' color="#007AFF" />
                    <Text style={[styles.medium,{marginTop:5}]}>This will take approx. {route.params["type"] == "Hourly" ? "10 secs" : "a min."}</Text>
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

  export default ComparisonScreen;