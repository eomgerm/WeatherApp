import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import { Fontisto } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const API_KEY = 'd30355b9c6b44ce0c7bea3fd9bbb6c98';
const icons = {
  Cloud: 'cloudy',
  Clear: 'day-sunny',
  Atmosphere: 'fog',
  Snow: 'snow',
  Rain: 'rains',
  Drizzle: 'rain',
  Thunderstorm: 'lightning',
};

export default function App() {
  const [city, setCity] = useState('Loading...');
  const [ok, setOK] = useState(true);
  const [days, setDays] = useState([]);
  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOK(false);
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    setCity(location[0].city);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`
    );
    const json = await response.json();
    setDays(json.daily);
  };
  useEffect(() => {
    getWeather();
  });
  return (
    <View style={styles.container}>
      <StatusBar style="auto"></StatusBar>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        pagingEnabled
        horizontal
        contentContainerStyle={styles.weather}
        showsHorizontalScrollIndicator={false}>
        {days.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator color="dark" size="large" />
          </View>
        ) : (
          days.map((day, index) => (
            <View key={index} style={styles.day}>
              <Text style={styles.date}>
                {new Date(day.dt * 1000).toString().substring(0, 10)}
              </Text>
              <Text style={styles.temperature}>
                {parseFloat(day.temp.day).toFixed(0)}°
              </Text>
              <View style={styles.wcontainer}>
                <Fontisto style={styles.icon} name={icons[day.weather[0].main]} size={28} color="black" />
                <Text style={styles.description}>{day.weather[0].main}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'pink' },
  city: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  cityName: { fontSize: 48, fontWeight: '500' },
  weather: {},
  day: { alignItems: 'center', width: SCREEN_WIDTH },
  date: { fontSize: 30, marginTop: 50 },
  temperature: { fontSize: 180, fontWeight: '700' },
  description: { fontSize: 40, marginTop: -10 },
  wcontainer: {flexDirection: "row"},
  icon: {marginRight: 10, marginTop: -5}
});
