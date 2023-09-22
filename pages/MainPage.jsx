import axios from "axios";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image,RefreshControl, PermissionsAndroid } from "react-native";
import DayWeatherCard from "../components/DayWeatherCard";
import { ScrollView } from "react-native";



export default function MainPage() {
    const [currentWeather, setCurrentWeather] = useState({});
    const [weather5Days, setWeather5Days] = useState([]);

    const [location, setLocation] = useState(false);
    const [refreshing, setRefreshing] = useState(false)

    function getWeather(){
      setRefreshing(true)
      axios.get("http://dataservice.accuweather.com/currentconditions/v1/2512351?apikey=enYAo4SMgjM8L4xlSOi17WLtneiI2qqJ&language=ru").then((resp) => {
        setCurrentWeather(resp.data[0]);
      }).catch((er)=>{
      })

      axios.get("http://dataservice.accuweather.com/forecasts/v1/daily/5day/2512351?apikey=enYAo4SMgjM8L4xlSOi17WLtneiI2qqJ&language=ru&metric=true").then((resp) => {
          setWeather5Days(resp.data.DailyForecasts);
          setRefreshing(false)

      });
    }

    useEffect(() => {


       getWeather()
        console.log(); //вывести текущую широту и долготу устройства
    }, []);



    return (
      <View style={[styles.container, { backgroundColor: currentWeather?.IsDayTime ? "#6a90eb" : "#102352" }]}>
        <ScrollView refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={getWeather} />
        }>

            <StatusBar style="auto" />
              <View style={{display:'flex',flexDirection:'row', justifyContent:'space-between'}}>
                <View style={{marginLeft:10}}>
                  <View style={{ display: "flex", flexDirection: "row", gap: 5 }}>
                      <Text style={[{ fontSize: 55, fontWeight: 500 }, currentWeather?.IsDayTime ? styles.textDay : styles.textNight]}>{Math.round(parseFloat(currentWeather?.Temperature?.Metric?.Value))}°</Text>
                      <Text style={[{ fontSize: 55, fontWeight: 500 }, currentWeather?.IsDayTime ? styles.textDay : styles.textNight]}>{currentWeather?.Temperature?.Metric?.Unit}</Text>
                  </View>
                  <Text style={[{ fontSize: 25, fontWeight: 500 }, currentWeather?.IsDayTime ? styles.textDay : styles.textNight]}>{currentWeather?.WeatherText}</Text>
                </View>

                <Image
                  style={{width:100, height:100, marginRight:10}}
                    source={{
                      uri: `https://developer.accuweather.com/sites/default/files/${currentWeather.WeatherIcon < 10 ? "0"+currentWeather.WeatherIcon : currentWeather.WeatherIcon}-s.png`,
                    }}
                  />
              </View>

              <ScrollView horizontal={true} style={{maxWidth:'100%', marginTop:50}} showsHorizontalScrollIndicator={false}  >
                {weather5Days?.map((item)=>{
                  return <DayWeatherCard maxTemp={Math.round(parseFloat(item.Temperature.Maximum.Value))} minTemp={Math.round(parseFloat(item.Temperature.Minimum.Value))} phrase={item.Day.IconPhrase} date={item.Date} icon={item.Day.Icon}/>
                })}
              </ScrollView>

                <Text>{location}</Text>
        </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent:'center',
        // alignContent:'center',
        paddingTop:45,

    },
    textDay: {
        color: "black",
    },
    textNight: {
        color: "white",
    },
});
