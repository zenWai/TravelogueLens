function countryCodeToEmoji(countryCode) {
    const OFFSET = 127397; // offset to convert ASCII to Regional Indicator Symbol
    const codePoints = [...countryCode.toUpperCase()].map(char => char.charCodeAt() + OFFSET);
    return String.fromCodePoint(...codePoints);
}

export default countryCodeToEmoji;