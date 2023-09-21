import axios from "axios";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import DayWeatherCard from "../components/DayWeatherCard";

export default function MainPage() {
    const [currentWeather, setCurrentWeather] = useState({});
    const [weather5Days, setWeather5Days] = useState({});

    useEffect(() => {
        axios.get("http://dataservice.accuweather.com/currentconditions/v1/2512351?apikey=5c69t6JDGErUgcvSGKElYGM5Adicsdoc&language=ru").then((resp) => {
            console.log(resp.data);
            setCurrentWeather(resp.data[0]);
        });
        axios.get("http://dataservice.accuweather.com/forecasts/v1/daily/5day/2512351?apikey=5c69t6JDGErUgcvSGKElYGM5Adicsdoc&language=ru&metric=true").then((resp) => {
            console.log(resp);
            setWeather5Days(resp.data);
        });
    }, []);

    return (
        <View style={[styles.container, { backgroundColor: currentWeather?.IsDayTime ? "#6a90eb" : "#102352" }]}>
            {/* <View style={[styles.container, {backgroundColor: currentWeather?.IsDayTime ? "#6a90eb" : "#102352"}]}> */}
            <View style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
                <Text style={[{ fontSize: "35px", fontWeight: "500" }, currentWeather?.IsDayTime ? styles.textDay : styles.textNight]}>{currentWeather?.Temperature?.Metric?.Value}</Text>
                <Text style={[{ fontSize: "35px", fontWeight: "500" }, currentWeather?.IsDayTime ? styles.textDay : styles.textNight]}>{currentWeather?.Temperature?.Metric?.Unit}</Text>
            </View>
            <Text style={[{ fontSize: "15px", fontWeight: "500" }, currentWeather?.IsDayTime ? styles.textDay : styles.textNight]}>{currentWeather?.WeatherText}</Text>

            <View>
              <DayWeatherCard maxTemp={20} minTemp={10} phrase={'облачно'} date={"2023-09-21T07:00:00+03:00"} icon={""}/>
            </View>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    textDay: {
        color: "black",
    },
    textNight: {
        color: "white",
    },
});
