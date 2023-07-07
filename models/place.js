export class Place {
    constructor(title, imageUri, location, id, date) {
        this.title = title;
        this.imageUri = imageUri;
        this.address = location.address;
        this.location = { lat: location.lat, lng: location.lng }; //lat and long
        //sometimes undefined?
        this.id = id;
        this.date = date;
    }
}