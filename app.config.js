import {config} from 'dotenv';

config();

export default {
    "expo": {
        "name": "TravelogueLens: Your Journey Travel Diary",
        "slug": "RN-TravelogueLens",
        "version": "1.0.6",
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
            "buildNumber": "1.0.6",
            "infoPlist": {
                "NSLocationWhenInUseUsageDescription": "This app uses the location to show where you are on the map",
                "NSLocationAlwaysUsageDescription": "This app uses the location to show where you are on the map"
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
                    "cameraPermission": "Need Camera Permission to be able to Take Photos",
                    "photosPermission": "The app accesses your photos to add to app."
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