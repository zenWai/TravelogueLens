import React, { createContext } from "react";
import {Alert} from "react-native";

export const SortContext = createContext({
    sort: null,
    setSort: () => {},
});

export function showSortOptions(onSelect) {
    const options = [
        { text: "Date Ascending (Oldest - Recent)", value: "date_asc" },
        { text: "Date Descending (Recent - Oldest", value: "date_desc" },
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