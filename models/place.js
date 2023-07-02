class Place {
    constructor(title, imageUri, address, location) {
        this.title = title;
        this.imageUri = imageUri;
        this.address = address;
        this.location = location; //lat and long
        //no backend - creating random id
        this.id = new Date().toString() + Math.random().toString();
    }
}