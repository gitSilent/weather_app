import axios from "axios";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, RefreshControl, PermissionsAndroid } from "react-native";
import DayWeatherCard from "../components/DayWeatherCard";
import { ScrollView } from "react-native";
import { API_KEY_ACCUWEATHER } from "../VARS";
import * as Location from "expo-location";

export default function MainPage() {
    const [currentWeather, setCurrentWeather] = useState(null);
    const [weather5Days, setWeather5Days] = useState(null);
    const [coordinates, setCoordinates] = useState(null);
    const [cityData, setCityData] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const [isAccessAllowed, setIsAccessAllowed] = useState(false);
    const [statusPermission, requestPermission] = Location.useForegroundPermissions();

    async function getWeather() {
        setRefreshing(true);

        await axios
            .get(`http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${API_KEY_ACCUWEATHER}&q=${coordinates?.latitude}%2C%20${coordinates?.longitude}&language=ru`)
            .then((resp) => {
                localCityData = resp.data;
                setCityData(resp.data);
            })
            .catch((er) => {
                console.log(er);
            });

        await axios
            .get(`http://dataservice.accuweather.com/currentconditions/v1/${localCityData?.Key}?apikey=${API_KEY_ACCUWEATHER}&language=ru`)
            .then((resp) => {
                setCurrentWeather(resp.data[0]);
            })
            .catch((er) => {
                console.log(er);
            });

        await axios
            .get(`http://dataservice.accuweather.com/forecasts/v1/daily/5day/${localCityData?.Key}?apikey=${API_KEY_ACCUWEATHER}&language=ru&metric=true`)
            .then((resp) => {
                setWeather5Days(resp.data.DailyForecasts);
            })
            .catch((er) => {
                console.log(er);
            });
        setRefreshing(false);
    }

    function getCoords() {
        console.log(statusPermission);
        if (statusPermission) {
            console.log("if status permission");
            (async () => {
                if (statusPermission.granted) {
                    console.log("if granted");

                    Location.getCurrentPositionAsync().then((location) => {
                        console.log(location.coords);
                        const { latitude, longitude } = location.coords;
                        setCoordinates({ latitude, longitude });
                        setIsAccessAllowed(true);
                        console.log({ latitude, longitude });
                    });
                }else{
                    // await Location.requestForegroundPermissionsAsync()
                    // requestPermission()
                    let { status } = await Location.requestForegroundPermissionsAsync();
                    if (status !== "granted") {
                        console.log("Permission to access location was denied");
                        return;
                    }
                    requestPermission()
                }
            })();
        }
    }
    useEffect(() => {
        console.log("get coords");

        getCoords();
    }, [statusPermission]);

    useEffect(() => {
        console.log("get weather before");
        console.log(coordinates);

        if (coordinates) {
            console.log("get weather");
            getWeather();
        }
    }, [coordinates]);

    if (!isAccessAllowed) {
        return (
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={getCoords} />}>
                    <Text style={{ fontSize: 25, textAlign: "center" }}>Не удалось получить доступ к местоположению.{"\n"} Включите функции передачи геопозиции и обновите страницу</Text>
                </ScrollView>
            </View>
        );
    }
    return (
        <View style={[styles.container, { backgroundColor: currentWeather?.IsDayTime ? "#6a90eb" : "#102352" }]}>
            <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={getCoords} />}>
                <StatusBar style="auto" />
                <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                    <View style={{ marginLeft: 10 }}>
                        <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
                            <Text style={[{ fontSize: 55, fontWeight: 500 }, currentWeather?.IsDayTime ? styles.textDay : styles.textNight]}>{currentWeather ? Math.round(parseFloat(currentWeather?.Temperature?.Metric?.Value)) : ""}°</Text>
                            <Text style={[{ fontSize: 55, fontWeight: 500 }, currentWeather?.IsDayTime ? styles.textDay : styles.textNight]}>{currentWeather?.Temperature?.Metric?.Unit}</Text>
                        </View>
                        <Text style={[{ fontSize: 25, fontWeight: 500, maxWidth: 250 }, currentWeather?.IsDayTime ? styles.textDay : styles.textNight]}>{currentWeather?.WeatherText}</Text>
                    </View>

                    <View style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                        <Image
                            style={{ width: 90, height: 90, marginRight: 10 }}
                            source={{
                                uri: `https://developer.accuweather.com/sites/default/files/${currentWeather?.WeatherIcon < 10 ? "0" + currentWeather?.WeatherIcon : currentWeather?.WeatherIcon}-s.png`,
                            }}
                        />
                        <Text style={[{ marginTop: -10, fontSize: 15 }, currentWeather?.IsDayTime ? styles.textDay : styles.textNight]}>{cityData?.LocalizedName}</Text>
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

const styles = StyleSheet.create({
    container: {
        justifyContent: "center", //Centered vertically
        alignItems: "center", //Centered horizontally
        flex: 1,
        paddingTop: 45,
    },
    textDay: {
        color: "black",
    },
    textNight: {
        color: "white",
    },
});
