import axios from "axios";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, RefreshControl, PermissionsAndroid } from "react-native";
import DayWeatherCard from "../components/DayWeatherCard";
import { ScrollView } from "react-native";

import * as Location from "expo-location";

export default function MainPage1() {
    const [currentWeather, setCurrentWeather] = useState({});
    const [weather5Days, setWeather5Days] = useState([]);
    const [coordinates, setCoordinates] = useState({});
    const [cityData, setCityData] = useState({});

    const [refreshing, setRefreshing] = useState(false);
    const [errorLocationPermission, setErrorLocationPermission] = useState(false);

    function getWeather() {
        setRefreshing(true);

        if (errorLocationPermission) {
            console.log("12313131231");
            return;
        }

        axios
            .get(`http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=5c69t6JDGErUgcvSGKElYGM5Adicsdoc&q=${coordinates?.coords?.latitude}%2C%20${coordinates?.coords?.longitude}&language=ru`)
            .then((resp) => {
                console.log(resp.data);
                setCityData(resp.data);
            })
            .catch((er) => {
                console.log(er);
            });

        axios
            .get(`http://dataservice.accuweather.com/currentconditions/v1/${cityData.Key}?apikey=enYAo4SMgjM8L4xlSOi17WLtneiI2qqJ&language=ru`)
            .then((resp) => {
                setCurrentWeather(resp.data[0]);
            })
            .catch((er) => {
                console.log(er);
            });

        axios
            .get(`http://dataservice.accuweather.com/forecasts/v1/daily/5day/${cityData.Key}?apikey=enYAo4SMgjM8L4xlSOi17WLtneiI2qqJ&language=ru&metric=true`)
            .then((resp) => {
                setWeather5Days(resp.data.DailyForecasts);
            })
            .catch((er) => {
                console.log(er);
            });
        setRefreshing(false);
    }

    async function requestLocationAccess() {
        setRefreshing(true);
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            setErrorLocationPermission(true);
            console.log("Permission to access location was denied");
            return;
        }
        let location = await Location.getCurrentPositionAsync({});
        setCoordinates(location);
        setRefreshing(false);
        console.log("location ", location);
    }

    useEffect(() => {
        console.log("anot00000n4ik");
        requestLocationAccess();
    }, []);

    useEffect(() => {
        console.log("TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT");
        console.log(coordinates);
        
        if (coordinates.coords) {
            console.log(coordinates);
            console.log("RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR");
            getWeather();
        }
    }, [coordinates]);

    if (!errorLocationPermission) {
        console.log("ошибка геодоступа", errorLocationPermission);
        return (
            <View>
                <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={requestLocationAccess} />}>
                    <Text style={{ marginTop: 50 }}>Не удалось получить доступ к геопозиции</Text>
                </ScrollView>
            </View>
        );
    } else {
        return (
            <View style={[styles.container, { backgroundColor: currentWeather?.IsDayTime ? "#6a90eb" : "#102352" }]}>
                <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={getWeather} />}>
                    <StatusBar style="auto" />
                    <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                        <View style={{ marginLeft: 10 }}>
                            <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
                                <Text style={[{ fontSize: 55, fontWeight: 500 }, currentWeather?.IsDayTime ? styles.textDay : styles.textNight]}>{currentWeather ? Math.round(parseFloat(currentWeather?.Temperature?.Metric?.Value)) : ""}°</Text>
                                <Text style={[{ fontSize: 55, fontWeight: 500 }, currentWeather?.IsDayTime ? styles.textDay : styles.textNight]}>{currentWeather?.Temperature?.Metric?.Unit}</Text>
                            </View>
                            <Text style={[{ fontSize: 25, fontWeight: 500 }, currentWeather?.IsDayTime ? styles.textDay : styles.textNight]}>{currentWeather?.WeatherText}</Text>
                        </View>

                        <View style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                            <Image
                                style={{ width: 90, height: 90, marginRight: 10 }}
                                source={{
                                    uri: `https://developer.accuweather.com/sites/default/files/${currentWeather.WeatherIcon < 10 ? "0" + currentWeather.WeatherIcon : currentWeather.WeatherIcon}-s.png`,
                                }}
                            />
                            <Text style={{ marginTop: -10, fontSize: 15 }}>{cityData.LocalizedName}</Text>
                        </View>
                    </View>

                    <ScrollView horizontal={true} style={{ maxWidth: "100%", marginTop: 50 }} showsHorizontalScrollIndicator={false}>
                        {weather5Days?.map((item, idx) => {
                            return (
                                <DayWeatherCard
                                    key={idx}
                                    maxTemp={Math.round(parseFloat(item.Temperature.Maximum.Value))}
                                    minTemp={Math.round(parseFloat(item.Temperature.Minimum.Value))}
                                    phrase={item.Day.IconPhrase}
                                    date={item.Date}
                                    icon={item.Day.Icon}
                                />
                            );
                        })}
                    </ScrollView>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent:'center',
        // alignContent:'center',
        paddingTop: 45,
    },
    textDay: {
        color: "black",
    },
    textNight: {
        color: "white",
    },
});
