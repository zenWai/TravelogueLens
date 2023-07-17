import {
    Alert,
    Dimensions,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";
import ImageModal from "react-native-image-modal";
import React, {useEffect, useState} from "react";
import {Colors} from "../constants/colors";
import DateTimePicker, {DateTimePickerAndroid} from '@react-native-community/datetimepicker';
import OutlinedButton from "../components/UI/OutlinedButton";
import {editPlace} from "../util/database";

function EditScreen({ route, navigation }) {
    const { place } = route.params;
    const screenWidth = Dimensions.get('window').width;
    const initialDateObject = new Date(place.date);
    const [title, setTitle] = useState(place.title);
    const [date, setDate] = useState(initialDateObject);
    const [show, setShow] = useState(false);
    useEffect(() => {
        navigation.setOptions({
            title: `Edit: ${place.countryFlagEmoji} ${place.city} - ${place.title}`
        })
        console.log(date);
    }, [place, navigation]);

    const onChange = (event, selectedDate) => {
        setShow(Platform.OS === 'ios');
        if (selectedDate) {
            setDate(selectedDate);
        }
        console.log(date);
    };

    const showDatePicker = () => {
        if (Platform.OS === 'android') {
            DateTimePickerAndroid.open({
                value: date,
                onChange,
                mode: 'date',
                is24Hour: false,
            });
        } else {
            setShow(true);
        }
    };

    const saveEditedPlace = async () => {
        if (!title || title.trim().length === 0) {
            Alert.alert('To save this place we need a title', 'Is title empty?');
            return;
        }
        const formattedDate = date.toISOString().split('T')[0];
        Keyboard.dismiss();
        try {
            await editPlace(place.id, title, formattedDate);
        } catch (error) {

        } finally {
            Alert.alert('Done', `${place.title} is now ${title} with date ${formattedDate}`)
            navigation.navigate('AllPlaces')
        }
    }

    return (
        <>
            <SafeAreaView>

                <ScrollView>
                    <ImageModal
                        swipeToDismiss={true}
                        resizeMode="stretch"
                        imageBackgroundColor="#000000"
                        style={{
                            width: screenWidth,
                            minHeight: 300,
                        }}
                        source={{
                            uri: place.imageUri
                        }}
                    />

                    <KeyboardAvoidingView style={styles.container} behavior="position">
                        <View style={styles.container}>
                            <Text style={styles.label}>Edit place Title</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={(text) => {
                                    setTitle(text);
                                }}
                                value={title}
                            />
                            {date.getTime() !== initialDateObject.getTime() && Platform.OS === 'android' &&
                                <Text style={styles.label}> New Date: {date.toISOString().split('T')[0]}</Text>
                            }
                            {show && Platform.OS === 'ios' && (
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    value={date}
                                    mode='date'
                                    is24Hour={false}
                                    display="default"
                                    onChange={onChange}
                                    minimumDate={new Date(2000, 0, 1)}
                                    maximumDate={new Date(2023, 11, 31)}
                                />
                            )}
                            <OutlinedButton children={'Change Date'} onPress={showDatePicker} icon={'add'}/>
                            {(title !== place.title || date.getTime() !== initialDateObject.getTime()) && (
                                <>
                                    <OutlinedButton children='Save' icon="save-outline" onPress={saveEditedPlace}/>
                                    <View style={styles.separator}></View>
                                </>
                            )}

                        </View>
                    </KeyboardAvoidingView>

                </ScrollView>

            </SafeAreaView>
        </>
    );
}


export default EditScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.gray700,
        padding: 20,
        justifyContent: 'center',
    },
    text: {
        color: Colors.primary500,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
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