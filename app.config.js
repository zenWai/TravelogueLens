import {config} from 'dotenv';

config();

export default {
    "expo": {
        "name": "TravelogueLens: Your Journey Travel Diary",
        "slug": "RN-TravelogueLens",
        "version": "1.0.9",
        "orientation": "portrait",
        "icon": "./assets/icon.png",
        "userInterfaceStyle": "light",
        "splash": {
            "image": "./assets/splash.png",
            "resizeMode": "cover",
            "backgroundColor": "#25292e"
        },
        "assetBundlePatterns": [
            "**/*"
        ],
        "ios": {
            "buildNumber": "1.0.0",
            "infoPlist": {
                "NSLocationWhenInUseUsageDescription": "To add a place and accurately show you on the map, this app needs to access your location. Please allow location access while using the app.",
            },
            "supportsTablet": true,
            "bundleIdentifier": "com.zenwai.traveloguelens"
        },
        "android": {
            "versionCode": 1,
            "adaptiveIcon": {
                "foregroundImage": "./assets/adaptive-icon.png",
                "backgroundColor": "#ffffff"
            },
            "package": "com.zenwai.traveloguelens",
            "config": {
                "googleMaps": {
                    "apiKey": process.env.GOOGLE || ''
                }
            },
            "permissions": [
                "android.permission.RECORD_AUDIO",
                "android.permission.ACCESS_FINE_LOCATION",
                "android.permission.ACCESS_COARSE_LOCATION"
            ]
        },
        "web": {
            "favicon": "./assets/favicon.png"
        },
        "plugins": [
            [
                "expo-image-picker",
                {
                    "cameraPermission": "We need your permission to access the camera. This allows you to take photos directly from the app and add them to your favorite places.",
                    "photosPermission": "We require access to your photos. This lets you choose images from your gallery to add them to your favorite places."
                }
            ]
        ],
        "runtimeVersion": {
            "policy": "sdkVersion"
        },
        "extra": {
            "eas": {
                "projectId": "327b1601-a05a-4367-bd11-89d1e0e613fa"
            },
            "GOOGLE": process.env.GOOGLE,
        },
        "updates": {
            "url": "https://u.expo.dev/327b1601-a05a-4367-bd11-89d1e0e613fa"
        }
    }
}