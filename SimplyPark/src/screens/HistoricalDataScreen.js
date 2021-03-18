import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import * as Feather from "react-native-feather";
import CarparksArray from '../../assets/carparks_01032021.json';
import axios from 'axios';
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
    const [lastHourLoader, setLastHourLoader] = useState(['flex','none','none']);
    const [last24HoursLoader, setLast24HoursLoader] = useState(['flex','none','none']);
    const [lastHourChart, setLastHourChart] = useState([[0,0,0,0,0,0],[0,0,0,0,0,0]]);
    const [last24HoursChart, setLast24HoursChart] = useState([[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],[0,0,0,0,0,0]]);

    useEffect(() => {
        axios.post(`https://nzgst25pi2.execute-api.ap-southeast-1.amazonaws.com/v1`,{"carparkno":route.params["car_park_no"],"type":"last_hour"}).then(res => {
            if (res.data.status == "ok") {
                const carparkData = res.data.data;
                setLastHourChart([
                    [
                        carparkData[5].timestamp.substr(11,5),
                        carparkData[4].timestamp.substr(11,5),
                        carparkData[3].timestamp.substr(11,5),
                        carparkData[2].timestamp.substr(11,5),
                        carparkData[1].timestamp.substr(11,5),
                        carparkData[0].timestamp.substr(11,5)
                    ], 
                        [
                            carparkData[5].item.carpark_info[0].lots_available,
                            carparkData[4].item.carpark_info[0].lots_available,
                            carparkData[3].item.carpark_info[0].lots_available,
                            carparkData[2].item.carpark_info[0].lots_available,
                            carparkData[1].item.carpark_info[0].lots_available,
                            carparkData[0].item.carpark_info[0].lots_available
                        ]
                    ])
                setLastHourLoader(['none','none','flex']);
            } else {
                setLastHourLoader(['none','flex','none']);
            }
        })

        axios.post(`https://gghurro2n4.execute-api.ap-southeast-1.amazonaws.com/v1`,{"carparkno":route.params["car_park_no"],"type":"last_24hours"}).then(res => {
            if (res.data.status == "ok") {
                const carparkData = res.data.data;
                console.log(carparkData[23])
                setLast24HoursChart([
                    [ 
                        carparkData[23].timestamp.substr(11,5), 
                        carparkData[22].timestamp.substr(11,5), 
                        carparkData[21].timestamp.substr(11,5), 
                        carparkData[20].timestamp.substr(11,5), 
                        carparkData[19].timestamp.substr(11,5), 
                        carparkData[18].timestamp.substr(11,5), 
                        carparkData[17].timestamp.substr(11,5), 
                        carparkData[16].timestamp.substr(11,5), 
                        carparkData[15].timestamp.substr(11,5), 
                        carparkData[14].timestamp.substr(11,5), 
                        carparkData[13].timestamp.substr(11,5), 
                        carparkData[12].timestamp.substr(11,5), 
                        carparkData[11].timestamp.substr(11,5), 
                        carparkData[10].timestamp.substr(11,5), 
                        carparkData[9].timestamp.substr(11,5), 
                        carparkData[8].timestamp.substr(11,5), 
                        carparkData[7].timestamp.substr(11,5), 
                        carparkData[6].timestamp.substr(11,5), 
                        carparkData[5].timestamp.substr(11,5), 
                        carparkData[4].timestamp.substr(11,5), 
                        carparkData[3].timestamp.substr(11,5), 
                        carparkData[2].timestamp.substr(11,5), 
                        carparkData[1].timestamp.substr(11,5),
                        carparkData[0].timestamp.substr(11,5)
                    ],
                        [
                            carparkData[23].item.carpark_info[0].lots_available,
                            carparkData[22].item.carpark_info[0].lots_available,
                            carparkData[21].item.carpark_info[0].lots_available,
                            carparkData[20].item.carpark_info[0].lots_available,
                            carparkData[19].item.carpark_info[0].lots_available,
                            carparkData[18].item.carpark_info[0].lots_available,
                            carparkData[17].item.carpark_info[0].lots_available,
                            carparkData[16].item.carpark_info[0].lots_available,
                            carparkData[15].item.carpark_info[0].lots_available,
                            carparkData[14].item.carpark_info[0].lots_available,
                            carparkData[13].item.carpark_info[0].lots_available,
                            carparkData[12].item.carpark_info[0].lots_available,
                            carparkData[11].item.carpark_info[0].lots_available,
                            carparkData[10].item.carpark_info[0].lots_available,
                            carparkData[9].item.carpark_info[0].lots_available,
                            carparkData[8].item.carpark_info[0].lots_available,
                            carparkData[7].item.carpark_info[0].lots_available,
                            carparkData[6].item.carpark_info[0].lots_available,
                            carparkData[5].item.carpark_info[0].lots_available,
                            carparkData[4].item.carpark_info[0].lots_available,
                            carparkData[3].item.carpark_info[0].lots_available,
                            carparkData[2].item.carpark_info[0].lots_available,
                            carparkData[1].item.carpark_info[0].lots_available,
                            carparkData[0].item.carpark_info[0].lots_available
                        ]
                    ])
                setLast24HoursLoader(['none','none','flex']);
            } else {
                setLast24HoursLoader(['none','flex','none']);
            }
        })
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
                <LineChart 
                    data={{
                        labels: lastHourChart[0],
                        datasets: [
                            {
                                data: lastHourChart[1]
                            }
                        ]
                    }}
                    width={Dimensions.get('window').width-50}
                    height={200}
                    yAxisSuffix=" lots"
                    yAxisInterval={10}
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
                        borderRadius: 16,
                        display: lastHourLoader[2]
                      }} />
            </View>
            <View style={{marginHorizontal:25, marginTop:15,height:'30%'}}>
                <Text style={[styles.bold, {fontSize:20}]}>Last 24 Hours</Text>
                <Text style={[styles.medium, {marginTop:15,display:last24HoursLoader[1]}]}>Cannot Retrieve Data</Text>
                <View style={{justifyContent:'center',height:'80%',display:last24HoursLoader[0]}}>
                    <ActivityIndicator size='large' color="#007AFF" />
                </View>
                <LineChart 
                    data={{
                        labels: last24HoursChart[0],
                        datasets: [
                            {
                                data: last24HoursChart[1]
                            }
                        ]
                    }}
                    width={Dimensions.get('window').width-50}
                    height={200}
                    yAxisSuffix=" lots"
                    yAxisInterval={10}
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
                        borderRadius: 16,
                        display: last24HoursLoader[2]
                      }} />
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