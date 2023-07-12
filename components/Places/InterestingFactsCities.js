import {InterestingFacts} from "../../util/InterestingFacts";
import {StyleSheet, Text, View} from "react-native";
import {useEffect, useState} from "react";
import {Colors} from "../../constants/colors";

function InterestingFactsCities({ city }) {
    const [facts, setFacts] = useState('');

    useEffect(() => {
        InterestingFacts(city)
            .then(fact => {
                console.log('Fact:', fact);
                // if fact.choices and fact.choices[0].text exist, update state
                if (fact) {
                    setFacts(fact.trim());
                }
            })
            .catch(error => console.error('Error:', error));
    }, [city]);

    return (
        <>
        <View style={styles.ContainerSeparator}></View>
        <View>
            <Text style={styles.address}>{facts}</Text>
        </View>
        </>
    );
}

export default InterestingFactsCities;

const styles = StyleSheet.create({
    address: {
        color: Colors.primary500,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
    },
    ContainerSeparator: {
        paddingVertical: 4,
        marginVertical: 8,
        height: 3,
        backgroundColor: Colors.primary800,
    },
})