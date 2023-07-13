import ImageModal from 'react-native-image-modal';

function ImageZoomModal({ imageUri }) {
    return (
        <ImageModal
            resizeMode="contain"
            imageBackgroundColor="#000000"
            style={{
                width: '200',
                height: '200',
            }}
            source={{
                uri: imageUri,
            }}
        />
    );
}

export default ImageZoomModal;