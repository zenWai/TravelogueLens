import React, {createContext} from "react";
import {Alert} from "react-native";

export const SortContext = createContext({
    sort: null,
    setSort: () => {
    },
});

export function showSortOptions(onSelect) {
    const options = [
        { text: "Date (Oldest to Recent)", value: "date_asc" },
        { text: "Date (Recent to Oldest)", value: "date_desc" },
    ];

    Alert.alert(
        "Sort By",
        "",
        options.map(option => ({
            text: option.text,
            onPress: () => onSelect(option.value),
        }))
    );
}