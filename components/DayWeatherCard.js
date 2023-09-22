import { StyleSheet, Text, View, Image } from "react-native";

export default function DayWeatherCard({ maxTemp, minTemp, phrase, date, icon }) {
    let newDate = new Date(date);
    let day = newDate.getDate()
    console.log(newDate.getDate());
    let month = newDate.toLocaleDateString("ru-RU",{ month: 'short' })

    return (
        <View style={styles.container}>
            <Text style={{fontSize: "20px", fontWeight: "400"}}>{day} {month}</Text>
            <Image style={{width:"50px", height:"50px"}} source={require('../media/icon.svg')}/>
            <Text>Макс.t° {maxTemp}</Text>
            <Text>Мин.t° {minTemp}</Text>
            <Text style={styles.text}>{phrase}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#c2cfed",
        height: "200px",
        width: "150px",
        borderColor: "#7d7d7d",
        borderRadius: "20px",
        padding:"10px",
        marginLeft:'5px',
        marginRight:'5px',
    },
    text:{
      position:'absolute',
      bottom:'15px',
      left:'10px',
      color:'#5e5e5e'
    }
});
