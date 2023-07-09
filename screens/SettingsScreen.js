import {Alert, Button, StyleSheet, Text, TextInput, View} from "react-native";
import {useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {getMaxPOIResultsSetting} from "../util/database";
import {Colors} from "../constants/colors";

function SettingsScreen() {
    const [maxResults, setMaxResults] = useState(5);

    useEffect(() => {
        getMaxPOIResultsSetting().then(setMaxResults);
    }, []);

    const saveMaxResultsSetting = async () => {
        if (maxResults === "") {
            alert('Please enter a number.');
            return;
        }
        await AsyncStorage.setItem('maxResults', maxResults.toString());
        Alert.alert(
            `Setting saved.`,
            `Will now show ${maxResults} Points of Interests on your Places`
        );
    }

    const handleMaxResultsChange = (value) => {
        // numeric values only
        if (value === "" || !/^\d+$/.test(value)) {
            setMaxResults("");
        } else {
            const parsedValue = parseInt(value, 10);
            if (parsedValue > 10) {
                setMaxResults(10);
            } else if (parsedValue < 0) {
                setMaxResults(0);
            } else {
                setMaxResults(parsedValue);
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Max nearby Points of Interest to show:</Text>
            <TextInput
                style={styles.input}
                value={maxResults.toString()}
                onChangeText={handleMaxResultsChange}
                keyboardType="numeric"
            />
            <Button title="Save" onPress={saveMaxResultsSetting}/>
        </View>
    );
}

export default SettingsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.gray700,
        padding: 20,
        justifyContent: 'center',
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.primary200,
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.primary200,
        borderRadius: 5,
        padding: 10,
        color: Colors.primary200,
        marginBottom: 20,
    },
})