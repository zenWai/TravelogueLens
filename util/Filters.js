import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {useRef} from "react";
import {Colors} from "../constants/colors";

const Filters = ({ onChange, selections, filters }) => {
    const scrollViewRef = useRef();  // Create a reference

    const handlePress = (index, filter) => {
        onChange(index, filter);
        // Using the reference to scroll to the beginning of the ScrollView
        scrollViewRef.current?.scrollTo({ x: 0, animated: false });
    };

    return (
        <ScrollView
            ref={scrollViewRef}
            horizontal
            contentContainerStyle={styles.filtersContainer}
        >
            {filters.map((filterList, index) => (
                <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 0 }}>
                    {filterList.map((filter, filterIndex) => (
                        <TouchableOpacity
                            key={filterIndex}
                            onPress={() => handlePress(index, filter)}
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: 8,
                                backgroundColor: selections[index].includes(index === 0 ? filter.split(" ").slice(1).join(" ") : filter) ? '#EE9972' : Colors.primary800,
                                borderWidth: 1,
                                borderColor: Colors.primary500,
                                borderRadius: 17,
                            }}>
                            <View>
                                <Text
                                    style={{ color: selections[index].includes(index === 0 ? filter.split(" ").slice(1).join(" ") : filter) ? 'black' : 'white' }}>
                                    {filter}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            ))}
        </ScrollView>
    );
};

export default Filters;

const styles = StyleSheet.create({
    filtersContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
});