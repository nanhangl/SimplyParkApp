import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
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

  const HistoricalDataScreen = () => {
    return (
        <View style={{height:'100%',backgroundColor:'#fff'}}>
            
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