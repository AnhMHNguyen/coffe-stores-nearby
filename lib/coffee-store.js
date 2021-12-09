import { createApi } from 'unsplash-js';
import coffeeStoresData from '../data/coffee-foursquare.json';

const unsplashApi = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY
});

const getCoffeeStores = async (latLong, limit) => {
  const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY,
    },
  };

  const response = await fetch(`https://api.foursquare.com/v3/places/search?ll=${latLong}&radius=10000&categories=13035&limit=${limit}`, options);
  // const response = await fetch('https://api.foursquare.com/v2/venues/search?ll=43.65267326999575,-79.39545615725015&query=coffee%20stores&client_secret=BZ2B0ZICCYYERTWWXOAGLWVFJRROSP3HGW4NHDZGOFUUSOS2&client_id=5CPYECJR5STLQ1IKGCQGFOOHS5TB3JUR5X4O1AL15I1VCJEV&v=20211206', options);
  const data = await response.json();
  // console.log(data);
  // console.log('getCoffeeStore',latLong);
  return data ? data : [];
};

const getListOfCoffeeStorePhotos = async () => {
  const photos = await unsplashApi.search.getPhotos({
    query: "coffee shop",
    perPage: 40,
  });
  const unsplashResults = photos.response.results;
  return unsplashResults.map((result) => result.urls["small"]);
};

export const fetchCoffeeStores = async (latLong = "43.65267326999575,-79.39545615725015", limit=10) => {
  const photos = await getListOfCoffeeStorePhotos();
  // console.log('fetchCoffeStores', latLong)
  const data = await getCoffeeStores(latLong, limit);
  if (!data.results) {
    return coffeeStoresData.response.venues.map((venue, idx) => {
      return {
        // ...venue,
        id: venue.id,
        address: venue.location.address || "",
        name: venue.name,
        neighbourhood:
          venue.location.neighborhood|| venue.location.crossStreet || "",
        imgUrl: photos[idx] ? photos[idx] : "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80",
      };
    });
  }
  return data.results.map((place, idx) => {
    return {
      id: place.fsq_id,
      address: place.location.address,
      name: place.name,
      neighbourhood: (place.location.neighborhood && place.location.neighborhood[0]) || place.location.cross_street || "",
      imgUrl: photos[idx] ? photos[idx] : "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80",
    }
  });
}