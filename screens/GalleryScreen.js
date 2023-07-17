import * as React from 'react';
import {useState} from 'react';
import {Dimensions, Text, View} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import {GestureHandlerRootView} from "react-native-gesture-handler";
import ImageModal from "react-native-image-modal";
import {Colors} from "../constants/colors";

function GalleryScreen({ navigation, route }) {
    const { places } = route.params;
    const [activeIndex, setActiveIndex] = useState(0);
    React.useEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <View style={{ flex: 1, paddingHorizontal: 10 }}>
                    <Text
                        style={{ fontSize: 18 }}>{`${places[0].countryFlagEmoji} ${places[0].city} - ${places[0].title}`}</Text>
                </View>
            ),
        });
    }, []);
    const width = Dimensions.get('window').width;

    return (
        <GestureHandlerRootView>
            <Carousel
                keyExtractor={(item) => item.id}
                loop
                width={width}
                autoPlay={false}
                data={places}
                scrollAnimationDuration={1000}
                onSnapToItem={(index) => {
                    setActiveIndex(index);
                    navigation.setOptions({
                        headerTitle: () => (
                            <View style={{ flex: 1, marginHorizontal: 10 }}>
                                <Text
                                    style={{ fontSize: 18 }}>{`${places[index].countryFlagEmoji} ${places[index].city} - ${places[index].title}`}</Text>
                            </View>
                        ),
                    });
                }}
                renderItem={({ item, index }) => (
                    <View>
                        <ImageModal
                            swipeToDismiss={true}
                            resizeMode="stretch"
                            imageBackgroundColor={Colors.primary200}
                            style={{
                                flex: 1,
                                width: width,
                                resizeMode: 'contain',
                            }}
                            source={{ uri: item.imageUri }}
                        />
                        {index === activeIndex && (
                            <View style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                backgroundColor: 'rgba(26, 172, 240,0.6)', // semi-transparent black background
                                zIndex: 1,
                                padding: 10,
                                alignItems: 'center',
                            }}
                            >
                                <Text style={{
                                    fontSize: 12,
                                    color: 'white',
                                    textAlign: 'justify'
                                }}>{item.interestingFact}</Text>
                            </View>
                        )}
                    </View>
                )}
            />
        </GestureHandlerRootView>
    );
}

export default GalleryScreen;
