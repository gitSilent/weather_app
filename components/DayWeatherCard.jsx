import { StyleSheet, Text, View, Image } from "react-native";
import { SvgXml } from "react-native-svg";
import { iconSvg } from "../media/icon";

export default function DayWeatherCard({ maxTemp, minTemp, phrase, date, icon }) {
    let newDate = new Date(date);
    let day = newDate.getDate()
    // console.log(newDate.getDate());
    let month = newDate.toLocaleDateString("ru-RU",{ month: 'short' })


    return (
        <View style={styles.container}>
            <Text style={{fontSize: 20, fontWeight: 400}}>{day} {month}</Text>
            <Image
            style={{width:50, height:50}}
              source={{
                uri: `https://developer.accuweather.com/sites/default/files/${icon < 10 ? "0"+icon : icon}-s.png`,
              }}
            />
            <Text>Макс.t° {maxTemp}°</Text>
            <Text>Мин.t° {minTemp}°</Text>
            <Text style={styles.text}>{phrase}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#c2cfed",
        height: 200,
        width: 150,
        borderColor: "#7d7d7d",
        borderRadius: 20,
        padding:10,
        marginLeft:5,
        marginRight:5,
    },
    text:{
      position:'absolute',
      bottom:15,
      left:10,
      color:'#5e5e5e'
    }
});
