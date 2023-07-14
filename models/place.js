export class Place {
    constructor(title, imageUri, location, id, date, poiPhotoPaths, interestingFact) {
        this.title = title;
        this.imageUri = imageUri;
        this.address = location.address;
        this.location = { lat: location.lat, lng: location.lng }; //lat and long
        this.id = id;
        this.date = date;
        this.nearbyPOIS = location.nearbyPOIS;
        this.country = location.country;
        this.countryFlagEmoji = location.countryFlagEmoji;
        this.city = location.city;
        this.poiPhotoPaths = poiPhotoPaths;
        this.interestingFact = interestingFact;
    }
}