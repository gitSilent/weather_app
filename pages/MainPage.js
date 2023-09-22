import axios from "axios";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import DayWeatherCard from "../components/DayWeatherCard";
import { ScrollView } from "react-native";

export default function MainPage() {
    const [currentWeather, setCurrentWeather] = useState({});
    const [weather5Days, setWeather5Days] = useState([]);

    useEffect(() => {
        axios.get("http://dataservice.accuweather.com/currentconditions/v1/2512351?apikey=5c69t6JDGErUgcvSGKElYGM5Adicsdoc&language=ru").then((resp) => {
            console.log(resp.data);
            setCurrentWeather(resp.data[0]);
        });
        axios.get("http://dataservice.accuweather.com/forecasts/v1/daily/5day/2512351?apikey=5c69t6JDGErUgcvSGKElYGM5Adicsdoc&language=ru&metric=true").then((resp) => {
            console.log(resp);
            setWeather5Days(resp.data.DailyForecasts);
        });
    }, []);

    return (
        <View style={[styles.container, { backgroundColor: currentWeather?.IsDayTime ? "#6a90eb" : "#102352" }]}>
            {/* <View style={[styles.container, {backgroundColor: currentWeather?.IsDayTime ? "#6a90eb" : "#102352"}]}> */}
            <View style={{marginLeft:'10px'}}>
              <View style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
                  <Text style={[{ fontSize: "55px", fontWeight: "500" }, currentWeather?.IsDayTime ? styles.textDay : styles.textNight]}>{currentWeather?.Temperature?.Metric?.Value}</Text>
                  <Text style={[{ fontSize: "55px", fontWeight: "500" }, currentWeather?.IsDayTime ? styles.textDay : styles.textNight]}>{currentWeather?.Temperature?.Metric?.Unit}</Text>
              </View>
              <Text style={[{ fontSize: "25px", fontWeight: "500" }, currentWeather?.IsDayTime ? styles.textDay : styles.textNight]}>{currentWeather?.WeatherText}</Text>
            </View>

            <ScrollView horizontal={true} style={{maxWidth:'100%', marginTop:'50px'}}  >
              {weather5Days?.map((item)=>{
                return <DayWeatherCard maxTemp={item.Temperature.Maximum.Value} minTemp={item.Temperature.Minimum.Value} phrase={item.Day.IconPhrase} date={item.Date} icon={""}/>
              })}

            </ScrollView>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent:'center',
        // alignContent:'center',
        paddingTop:'50px',

    },
    textDay: {
        color: "black",
    },
    textNight: {
        color: "white",
    },
});
