import * as React from 'react';
import { Dimensions, Text, View, Image } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {Ionicons} from "@expo/vector-icons";

function GalleryScreen({ navigation, route }) {
    const { places } = route.params;
    React.useEffect(() => {
        navigation.setOptions({
            title: `${places[0].countryFlagEmoji} ${places[0].city} - ${places[0].title}`,
            headerShown: false

        });
    }, []);
    const width = Dimensions.get('window').width;
    console.log(places)
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Carousel
                keyExtractor={(item) => item.id}
                loop
                width={width}
                autoPlay={false}
                data={places}
                scrollAnimationDuration={1000}
                onSnapToItem={(index) => {
                    console.log('current index:', index);
                    navigation.setOptions({ title: `${places[index].countryFlagEmoji} ${places[index].city} - ${places[index].title}`  });
                }}
                renderItem={({ item } ) => (
                    <View style={{
                            flex: 1,
                            width: '100%',
                            height: '100%',
                        }}
                    >
                        <Image source={{ uri: item.imageUri }} style={{ width: '100%', height: '100%' }}/>

                        <View style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                width: '100%',
                                backgroundColor: 'rgba(0,0,0,0.5)', // semi-transparent black background
                                zIndex: 1,
                                padding: 10,
                                alignItems: 'center',
                            }}
                        >
                            <Text style={{ color: 'white', fontSize: 20 }}>{`${item.countryFlagEmoji} ${item.city} - ${item.title}`}</Text>
                        </View>
                    </View>
                )}
            />
            <View style={{
                position: 'absolute',
                top: 20,
                left: 0,
                zIndex: 1,
                padding: 10,
            }}
            >
                <Ionicons name="backspace-outline" size={34} onPress={() => {
                    navigation.goBack()
                }}/>
            </View>
</GestureHandlerRootView>
    );
}

export default GalleryScreen;