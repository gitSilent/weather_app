import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

export default function DayWeatherCard({ maxTemp, minTemp, phrase, date, icon }) {
    let newDate = new Date(date);
    console.log(newDate.toDateString());
    console.log(newDate.toISOString());
    console.log(newDate.toLocaleDateString("ru-RU"));
    return (
        <View style={styles.container}>
            <Text>{newDate.toDateString()}</Text>
            <Text>Макс.t°{maxTemp}</Text>
            <Text>Мин.t°{minTemp}</Text>
            <Text>{phrase}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#c2cfed",
        alignItems: "center",
        justifyContent: "center",
        height: "fit-content",
        width: "fit-content",
        maxHeight: "250px",
        maxWidth: "250px",
        borderColor: "#7d7d7d",
        borderRadius: "20px",
    },
});
