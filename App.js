import {StatusBar} from 'expo-status-bar';
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import AllPlaces from "./screens/AllPlaces";
import AddPlace from "./screens/AddPlace";
import IconButton from "./components/UI/IconButton";
import {Colors} from "./constants/colors";
import Map from "./screens/Map";
import PlaceDetails from "./screens/PlaceDetails";
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import SettingsScreen from "./screens/SettingsScreen";
import {Ionicons} from "@expo/vector-icons";
import {showSortOptions, SortContext} from "./util/SortContext";
import {View} from "react-native";
import React, {useContext, useState} from "react";
import GalleryScreen from "./screens/GalleryScreen";
import {SafeAreaProvider} from "react-native-safe-area-context";
import EditScreen from "./screens/EditScreen";

const Stack = createNativeStackNavigator();
const BottomTabs = createBottomTabNavigator();


function HomeTabs() {
    const { setSort } = useContext(SortContext);
    return (
        <BottomTabs.Navigator screenOptions={{
            headerStyle: { backgroundColor: Colors.primary500 },
            tabBarStyle: { backgroundColor: Colors.primary500 },
            headerTintColor: Colors.gray700,
            tabBarActiveTintColor: Colors.accent500,
            tabBarActiveBackgroundColor: Colors.primary800,
            tabBarInactiveTintColor: Colors.gray700,

        }}
        >
            <BottomTabs.Screen
                name="AllPlaces"
                component={AllPlaces}
                options={({ navigation }) => ({
                    title: 'Your Favorite Places',
                    tabBarLabel: 'Places',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="earth-outline" size={size} color={color}/>
                    ),
                    headerRight: ({ tintColor }) => (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <IconButton
                                icon="funnel-outline"
                                size={24}
                                color={tintColor}
                                onPress={() => showSortOptions(setSort)}
                            />
                            <IconButton
                                icon="add"
                                size={24}
                                color={tintColor}
                                onPress={() => navigation.navigate('AddPlace')}
                            />
                        </View>
                    ),
                })}
            />
            <BottomTabs.Screen
                name="SettingsScreen"
                component={SettingsScreen}
                options={{
                    title: 'Settings',
                    tabBarLabel: 'Settings',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="settings-outline" size={size} color={color}/>
                    ),
                }}
            />
        </BottomTabs.Navigator>
    );
}

export default function App() {

    const [sort, setSort] = useState(null);
    return (
        <SafeAreaProvider>
            <StatusBar style={'dark'}/>
            <SortContext.Provider value={{ sort, setSort }}>
                <NavigationContainer>
                    <Stack.Navigator screenOptions={{
                        headerStyle: { backgroundColor: Colors.primary500 },
                        headerTintColor: Colors.gray700,
                        contentStyle: { backgroundColor: Colors.gray700 },
                    }}
                    >
                        <Stack.Screen
                            name="Home"
                            component={HomeTabs}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name='AddPlace'
                            component={AddPlace}
                            options={{
                                title: 'Add a new Place',
                            }}
                        />
                        <Stack.Screen name="Map" component={Map}/>
                        <Stack.Screen
                            name="PlaceDetails"
                            component={PlaceDetails}
                            options={{
                                title: 'Loading Place...'
                            }}
                        />
                        <Stack.Screen name="GalleryScreen" component={GalleryScreen}/>
                        <Stack.Screen name="EditScreen" component={EditScreen}/>
                    </Stack.Navigator>
                </NavigationContainer>
            </SortContext.Provider>
        </SafeAreaProvider>
    );
}
