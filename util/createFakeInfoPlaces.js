const fakePlaces = [
    {
        title: "Eiffel Tower",
        city: "Paris",
        country: "France",
        countryCode: "FR",
        date: getFakeDate(),
        location: {
            lat: 48.8584,
            lng: 2.2945,
        },
        address: "FakeAddress: 123 Main St, Paris, 12345, France",
        interestingFact: "Completed in 1889, it is named after the engineer Gustave Eiffel."
    },
    {
        title: "Statue of Liberty",
        city: "New York",
        country: "USA",
        countryCode: "US",
        date: getFakeDate(),
        location: {
            lat: 40.6892,
            lng: -74.0445,
        },
        address: "FakeAddress: 456 Elm St, New York, 67890, USA",
        interestingFact: "A gift from France to the United States, the statue was dedicated on October 28, 1886."
    },
    {
        title: "Colosseum",
        city: "Rome",
        country: "Italy",
        countryCode: "IT",
        date: getFakeDate(),
        location: {
            lat: 41.8902,
            lng: 12.4922,
        },
        address: "FakeAddress: 789 Oak St, Rome, 13579, Italy",
        interestingFact: "It's the largest ancient amphitheater ever built, and is still the largest standing amphitheater in the world today, despite its age."
    },
    {
        title: "Machu Picchu",
        city: "Cusco Region",
        country: "Peru",
        countryCode: "PE",
        date: getFakeDate(),
        location: {
            lat: -13.1631,
            lng: -72.5450,
        },
        address: "FakeAddress: 1234 Pine St, Cusco Region, 24680, Peru",
        interestingFact: "Machu Picchu is an Incan citadel set high in the Andes Mountains in Peru, above the Urubamba River valley."
    },
    {
        title: "Pyramids of Giza",
        city: "Giza",
        country: "Egypt",
        countryCode: "EG",
        date: getFakeDate(),
        location: {
            lat: 29.9792,
            lng: 31.1342,
        },
        address: "FakeAddress: 567 Maple St, Giza, 35791, Egypt",
        interestingFact: "The Pyramids of Giza, built to endure an eternity, have done just that."
    },
    {
        title: "Great Wall of China",
        city: "Beijing",
        country: "China",
        countryCode: "CN",
        date: getFakeDate(),
        location: {
            lat: 40.4319,
            lng: 116.5704,
        },
        address: "FakeAddress: 890 Oak St, Beijing, 24680, China",
        interestingFact: "The Great Wall of China is an ancient series of walls and fortifications located in northern China, built around 500 years ago."
    },
    {
        title: "Taj Mahal",
        city: "Agra",
        country: "India",
        countryCode: "IN",
        date: getFakeDate(),
        location: {
            lat: 27.1751,
            lng: 78.0421,
        },
        address: "FakeAddress: 123 Elm St, Agra, 13579, India",
        interestingFact: "The Taj Mahal was commissioned in 1632 by the Mughal emperor, Shah Jahan, to house the tomb of his favourite wife, Mumtaz Mahal."
    },
    {
        title: "The Acropolis",
        city: "Athens",
        country: "Greece",
        countryCode: "GR",
        date: getFakeDate(),
        location: {
            lat: 37.9715,
            lng: 23.7257,
        },
        address: "FakeAddress: 456 Oak St, Athens, 35791, Greece",
        interestingFact: "The Acropolis of Athens and its monuments are universal symbols of the classical spirit and civilization."
    },
    {
        title: "Christ the Redeemer",
        city: "Rio de Janeiro",
        country: "Brazil",
        countryCode: "BR",
        date: getFakeDate(),
        location: {
            lat: -22.9519,
            lng: -43.2105,
        },
        address: "FakeAddress: 789 Pine St, Rio de Janeiro, 24680, Brazil",
        interestingFact: "Christ the Redeemer is an Art Deco statue of Jesus Christ in Rio de Janeiro, Brazil, created by French sculptor Paul Landowski."
    },
    {
        title: "Sydney Opera House",
        city: "Sydney",
        country: "Australia",
        countryCode: "AU",
        date: getFakeDate(),
        location: {
            lat: -33.8568,
            lng: 151.2153,
        },
        address: "FakeAddress: 1234 Maple St, Sydney, 13579, Australia",
        interestingFact: "The Sydney Opera House is a multi-venue performing arts centre at Sydney Harbour located in Sydney, New South Wales, Australia."
    },
    {
        title: "Sagrada Familia",
        city: "Barcelona",
        country: "Spain",
        countryCode: "ES",
        date: getFakeDate(),
        location: {
            lat: 41.4036,
            lng: 2.1744,
        },
        address: "FakeAddress: 567 Elm St, Barcelona, 35791, Spain",
        interestingFact: "The Basílica de la Sagrada Família, also known as the Sagrada Família, is a large unfinished Roman Catholic minor basilica in Barcelona, Catalonia, Spain."
    },
    {
        title: "Angkor Wat",
        city: "Siem Reap",
        country: "Cambodia",
        countryCode: "KH",
        date: getFakeDate(),
        location: {
            lat: 13.4125,
            lng: 103.8670,
        },
        address: "FakeAddress: 890 Pine St, Siem Reap, 24680, Cambodia",
        interestingFact: "Angkor Wat is a temple complex in Cambodia and the largest religious monument in the world by land area."
    },
    {
        title: "Petra",
        city: "Ma'an Governorate",
        country: "Jordan",
        countryCode: "JO",
        date: getFakeDate(),
        location: {
            lat: 30.3285,
            lng: 35.4444,
        },
        address: "FakeAddress: 123 Main St, Ma'an Governorate, 13579, Jordan",
        interestingFact: "Petra is a famous archaeological site in Jordan's southwestern desert."
    },
    {
        title: "Stonehenge",
        city: "Wiltshire",
        country: "England",
        countryCode: "GB",
        date: getFakeDate(),
        location: {
            lat: 51.1789,
            lng: -1.8262,
        },
        address: "FakeAddress: 456 Elm St, Wiltshire, 35791, England",
        interestingFact: "Stonehenge is a prehistoric monument in Wiltshire, England."
    },
    {
        title: "The Parthenon",
        city: "Athens",
        country: "Greece",
        countryCode: "GR",
        date: getFakeDate(),
        location: {
            lat: 37.9715,
            lng: 23.7267,
        },
        address: "FakeAddress: 789 Oak St, Athens, 24680, Greece",
        interestingFact: "The Parthenon is a former temple on the Athenian Acropolis, Greece, dedicated to the goddess Athena, whom the people of Athens considered their patroness."
    },
    {
        title: "Chichen Itza",
        city: "Yucatán",
        country: "Mexico",
        countryCode: "MX",
        date: getFakeDate(),
        location: {
            lat: 20.6843,
            lng: -88.5678,
        },
        address: "FakeAddress: 1234 Pine St, Yucatán, 13579, Mexico",
        interestingFact: "Chichen Itza was a large pre-Columbian city built by the Maya people of the Terminal Classic period."
    },
    {
        title: "Hagia Sophia",
        city: "Istanbul",
        country: "Turkey",
        countryCode: "TR",
        date: getFakeDate(),
        location: {
            lat: 41.0086,
            lng: 28.9802,
        },
        address: "FakeAddress: 567 Elm St, Istanbul, 35791, Turkey",
        interestingFact: "Hagia Sophia is a Late Antique place of worship in Istanbul."
    },
    {
        title: "Mount Rushmore",
        city: "South Dakota",
        country: "USA",
        countryCode: "US",
        date: getFakeDate(),
        location: {
            lat: 43.8791,
            lng: -103.4591,
        },
        address: "FakeAddress: 890 Oak St, South Dakota, 24680, USA",
        interestingFact: "Mount Rushmore National Memorial is centered on a colossal sculpture carved into the granite face of Mount Rushmore in the Black Hills in Keystone, South Dakota."
    },
    {
        title: "Buckingham Palace",
        city: "London",
        country: "England",
        countryCode: "GB",
        date: getFakeDate(),
        location: {
            lat: 51.5014,
            lng: -0.1419,
        },
        address: "FakeAddress: 123 Elm St, London, 13579, England",
        interestingFact: "Buckingham Palace has served as the official London residence of the UK’s sovereigns since 1837."
    },
    {
        title: "The Great Pyramid of Giza",
        city: "Giza",
        country: "Egypt",
        countryCode: "EG",
        date: getFakeDate(),
        location: {
            lat: 29.9792,
            lng: 31.1344,
        },
        address: "FakeAddress: 456 Maple St, Giza, 35791, Egypt",
        interestingFact: "The Great Pyramid of Giza is the oldest and largest of the three pyramids in the Giza pyramid complex."
    },
];

export const placeImages = {
    'Angkor Wat': require('../assets/fakePlaces/Angkor_Wat.jpg'),
    'Buckingham Palace': require('../assets/fakePlaces/Buckingham_Palace.jpeg'),
    'Chichen Itza': require('../assets/fakePlaces/Chichen_Itza.jpeg'),
    'Christ the Redeemer': require('../assets/fakePlaces/Christ_the_Redeemer.jpg'),
    'Colosseum': require('../assets/fakePlaces/Colosseum.jpg'),
    'Eiffel Tower': require('../assets/fakePlaces/Eiffel_Tower.jpg'),
    'Great Wall of China': require('../assets/fakePlaces/Great_Wall_of_China.jpg'),
    'Hagia Sophia': require('../assets/fakePlaces/Hagia_Sophia.jpg'),
    'Machu Picchu': require('../assets/fakePlaces/Machu_Picchu.jpg'),
    'Mount Rushmore': require('../assets/fakePlaces/Mount_Rushmore.jpg'),
    'Petra': require('../assets/fakePlaces/Petra.jpg'),
    'Sagrada Familia': require('../assets/fakePlaces/Sagrada_Familia.jpg'),
    'Statue of Liberty': require('../assets/fakePlaces/Statue_of_Liberty.jpg'),
    'Stonehenge': require('../assets/fakePlaces/Stonehenge.jpg'),
    'Sydney Opera House': require('../assets/fakePlaces/Sydney_Opera_House.jpg'),
    'Taj Mahal': require('../assets/fakePlaces/Taj_Mahal.jpg'),
    'The Acropolis': require('../assets/fakePlaces/The_Acropolis.jpg'),
    'The Great Pyramid of Giza': require('../assets/fakePlaces/The_Great_Pyramid_of_Giza.jpg'),
    'The Parthenon': require('../assets/fakePlaces/The_Parthenon.jpg'),
    'Pyramids of Giza': require('../assets/fakePlaces/Pyramids_of_Giza.png'),
};

function getFakeDate() {
    const start = new Date(2000, 0, 1);
    const end = new Date(2023, 11, 31);
    const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return randomDate.toISOString().split('T')[0];
}

export default fakePlaces;