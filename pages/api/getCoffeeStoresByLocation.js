import { fetchCoffeeStores } from "../../lib/coffee-store";

const getCoffeeStoresByLocation = async (req, res) => {
  try {
    const { latLong, limit } = req.query;
    // console.log(latLong);
    const data = await fetchCoffeeStores(latLong, limit);
    res.status(200);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500);
    res.json({ message: 'Oh no! Something went wrong!', err });
  }
}

export default getCoffeeStoresByLocation;
