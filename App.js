import {StatusBar} from 'expo-status-bar';
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import AllPlaces from "./screens/AllPlaces";
import AddPlace from "./screens/AddPlace";
import IconButton from "./components/UI/IconButton";
import {Colors} from "./constants/colors";
import Map from "./screens/Map";
import {useEffect, useState} from "react";
import {init} from "./util/database";
import PlaceDetails from "./screens/PlaceDetails";

const Stack = createNativeStackNavigator();
export default function App() {
    const [dbInitialized, setDbInitialized] = useState(false);
    useEffect(() => {
        init()
            .then(() => {
                setDbInitialized(true);
                console.log('db Init')
            }).catch((err) => {
            console.log(err);
        });
    }, []);

    if (!dbInitialized) {
        //return app loading
        //expo Slashscreen
    }

    return (
        <>
            <StatusBar style={'dark'}/>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{
                    headerStyle: { backgroundColor: Colors.primary500 },
                    headerTintColor: Colors.gray700,
                    contentStyle: { backgroundColor: Colors.gray700 },
                }}
                >
                    <Stack.Screen
                        name="AllPlaces"
                        component={AllPlaces}
                        options={({ navigation }) => ({
                            title: 'Your Favorite Places',
                            headerRight: ({ tintColor }) => (
                                <IconButton
                                    icon="add"
                                    size={24}
                                    color={tintColor}
                                    onPress={() => navigation.navigate('AddPlace')}
                                />
                            ),
                        })}
                    />
                    <Stack.Screen
                        name='AddPlace'
                        component={AddPlace}
                        options={{
                            title: 'Add a new Place',
                        }}
                    />
                    <Stack.Screen name="Map" component={Map}/>
                    <Stack.Screen name="PlaceDetails" component={PlaceDetails}/>
                </Stack.Navigator>
            </NavigationContainer>
        </>
    );
}
