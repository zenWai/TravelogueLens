import {Pressable, StyleSheet, Text, View} from "react-native";
import {Colors} from "../../constants/colors";

function Button({ onPress, children }) {
    return (
        <View style={styles.buttonContainer}>
            <Pressable style={({ pressed }) => [styles.button, pressed && styles.pressed]} onPress={onPress}>
                <Text style={styles.text}>{children}</Text>
            </Pressable>
        </View>
    );
}

export default Button;

const styles = StyleSheet.create({
    buttonContainer: {
        marginTop: 4,
        marginBottom: 24,
    },
    button: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        margin: 4,
        backgroundColor: Colors.primary800,
        elevation: 2,
        shadowColor: 'black',
        shadowOpacity: 0.15,
        shadowOffset: { width: 1, height: 1 },
        shadowRadius: 2,
        borderRadius: 4,
    },
    pressed: {
        opacity: 0.7,
    },
    text: {
        textAlign: 'center',
        fontSize: 16,
        color: Colors.primary50,
    },
});