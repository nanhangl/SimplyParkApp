import React, { Component, useState } from 'react';
import { View, Text, StyleSheet, PermissionsAndroid, Button, Alert } from 'react-native';
import { CommonActions } from '@react-navigation/native';

const locationPermissionsScreen = ({navigation}) => {
    const [viewVisible, setViewVisible] = useState('none');

    const requestLocationPermission = async () => {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: "SimplyPark Location Permission",
              message:
                "SimplyPark needs access to your location " +
                "to find the nearest carpark.",
              buttonNegative: "Cancel",
              buttonPositive: "OK"
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("You can use the location");
            navigation.dispatch(CommonActions.reset({
                index: 0,
                routes: [
                    {name:'Home'}
                ]
            }))
          } else {
            console.log("Location Permissions Denied");
            Alert.alert("Location Permission Denied", "You must grant location permissions to SimplyPark to use this app.")
          }
        } catch (err) {
          console.warn(err);
        }
      };

    PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
        if (result == true) {
            navigation.dispatch(CommonActions.reset({
                index: 0,
                routes: [
                    {name:'Home'}
                ]
            }))
        } else {
            setViewVisible('flex');
        }
    })

    return (
        <View style={{margin:15, display:viewVisible}}>
            <Text style={[styles.bold,{fontSize:25,marginBottom:15}]}>SimplyPark needs your location to find the nearest carpark.</Text>
            <Text style={[styles.medium, {marginBottom:15}]}>Please enable location and allow SimplyPark to access your device's location.</Text>
            <Button title="Allow Location" onPress={requestLocationPermission} />
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

export default locationPermissionsScreen;