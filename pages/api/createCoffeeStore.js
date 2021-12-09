import { table, getMinifiedRecords, findRecordByFilter } from '../../lib/airtable';

const createCoffeeStore = async (req, res) => {
  if (req.method === 'POST') {
    const { id, name, neighbourhood, address, imgUrl, voting } = req.body;
    //find a record
    try {
      if (id) {
        const records = await findRecordByFilter(id);
        if (records.length > 0) {
          res.json(records);
        } else {
          //create a record
          if (name && address) {
            const createRecords = await table.create([
              {
                fields: {
                  id,
                  name,
                  address,
                  neighbourhood,
                  voting,
                  imgUrl,
                },
              },
            ]);
            res.json(getMinifiedRecords(createRecords));
          } else {
            res.status(400).json({ message: 'Name or address is missing' });
          }
        }
      } else {
        res.status(400).json({ message: 'Id is missing' });
      }
    } catch (err) {
      console.error('Error creating or finding a store', err);
      res.status(500).json({ message: 'Error creating or finding a store', err })
    }
  }
}

export default createCoffeeStore;