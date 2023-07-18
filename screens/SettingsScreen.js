import {ActivityIndicator, Keyboard, KeyboardAvoidingView, StyleSheet, Text, TextInput, View} from "react-native";
import {useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {getMaxPOIResultsSetting} from "../util/database";
import {Colors} from "../constants/colors";
import fakePlaces from "../util/createFakeInfoPlaces";
import {createFakeInfo} from "../util/createFakeInfo";
import OutlinedButton from "../components/UI/OutlinedButton";
import {showMessage} from "react-native-flash-message";

function SettingsScreen() {
    const [maxResults, setMaxResults] = useState(5);
    const [isLoading, setLoading] = useState(false);
    const [currentProgress, setCurrentProgress] = useState(0);

    useEffect(() => {
        getMaxPOIResultsSetting().then(setMaxResults);
    }, []);

    const saveMaxResultsSetting = async () => {
        if (maxResults === "") {
            alert('Please enter a valid number to set the maximum results.');
            return;
        }
        Keyboard.dismiss();
        await AsyncStorage.setItem('maxResults', maxResults.toString());
        showMessage({
            message: "Settings updated successfully!",
            description: `Your places will now display up to ${maxResults} Points of Interest.`,
            type: "success",
            icon: 'auto',
            floating: true,
            position: "center",
        });
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

    const insertFakePlaces = async () => {
        try {
            setLoading(true);
            for (let i = 0; i < fakePlaces.length; i++) {
                await createFakeInfo(fakePlaces[i]);
                setCurrentProgress(i + 1);
            }
        } catch (error) {
            showMessage({
                message: `An error occurred while creating the fake places: ${error}`,
                description: `Please try again.`,
                type: "warning",
                icon: 'auto',
                floating: true,
                position: "top",
            });
        } finally {
            setLoading(false);
            showMessage({
                message: `Success!`,
                description: `You've successfully created 20 fake places for demonstration purposes.`,
                type: "success",
                icon: 'auto',
                floating: true,
                position: "top",
                autoHide: false,
            });
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <Text style={styles.label}>Set the limit for displayed nearby Points of Interest (maximum is 10):</Text>
            <TextInput
                style={styles.input}
                value={maxResults.toString()}
                onChangeText={handleMaxResultsChange}
                keyboardType="numeric"
            />
            <OutlinedButton children='Save' icon="save-outline" onPress={saveMaxResultsSetting}/>
            <View style={styles.separator}></View>
            <OutlinedButton children='Insert Fake Places' icon="globe-outline" onPress={insertFakePlaces}/>
            {isLoading && (
                <>
                    <ActivityIndicator size="large" color="#0000ff"/>
                    <Text style={{ color: 'white' }}>{`${currentProgress} / ${fakePlaces.length}`}</Text>
                </>
            )}
        </KeyboardAvoidingView>
    );
}

export default SettingsScreen;

const styles = StyleSheet.create({
    separator: {
        height: 1,
        backgroundColor: Colors.primary200,
        marginTop: 12,
    },
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