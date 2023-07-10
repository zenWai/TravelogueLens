import {FlatList, Image, Modal, StyleSheet, Text, View} from "react-native";
import {Colors} from "../../constants/colors";
import IconButton from "../UI/IconButton";

function ReviewItem({ review }) {
    return (
        <View style={styles.item}>
            <Image style={styles.image} source={{ uri: review.profile_photo_url }}/>
            <View style={styles.info}>
                <Text style={styles.textHero}>{review.author_name}</Text>
                <Text style={styles.text} numberOfLines={14} ellipsizeMode='tail'>{review.text}</Text>
                <View style={styles.separator}/>
                <Text style={styles.text}>{review.relative_time_description}</Text>
                <Text style={styles.textHero}>{'⭐'.repeat(review.rating)}</Text>
            </View>
        </View>
    );
}

function ReviewsList({ reviews, isVisible, closeModal }) {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={closeModal}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <FlatList
                        style={styles.list}
                        data={reviews}
                        renderItem={({ item }) => <ReviewItem review={item}/>}
                        keyExtractor={item => item.time}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        ItemSeparatorComponent={() => <View style={styles.separator}/>}
                    />
                    <IconButton icon="close-circle" color={Colors.accent500} size={24} onPress={closeModal}/>
                </View>
            </View>
        </Modal>
    );
}

export default ReviewsList;

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",

    },
    modalView: {
        height: '75%',
        margin: 20,
        backgroundColor: Colors.primary500,
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    separator: {
        height: 3,
        backgroundColor: Colors.primary700,
        margin: 8,
    },
    list: {},
    item: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        borderRadius: 6,
        marginVertical: 12,
        backgroundColor: Colors.primary500,
        elevation: 2,
        shadowColor: 'black',
        shadowOpacity: 0.15,
        shadowOffset: { width: 1, height: 1 },
        shadowRadius: 2,
        width: 300,
    },
    image: {
        flex: 1,
        borderBottomLeftRadius: 4,
        borderTopLeftRadius: 4,
        width: 50,
        height: 200,
    },
    info: {
        width: '65%',
    },
    textHero: {
        fontWeight: 'bold',
        fontSize: 18,
        color: Colors.gray700,
        alignItems: 'center',
        textAlign: 'center',
    },
    text: {
        fontSize: 16,
        color: Colors.gray700,

    },
})