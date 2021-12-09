import { table, findRecordByFilter, getMinifiedRecords } from "../../lib/airtable";

const favouriteCoffeeStoreById = async (req, res) => {
  if (req.method === 'PUT') {
    try {
      const { id } = req.body;
      if (id) {
        const records = await findRecordByFilter(id);
        if (records.length > 0) {
          const record = records[0];
          const updatedRecord = await table.update([
            {
              id: record.recordId,
              fields: {
                voting: parseInt(record.voting) + 1,
              }
            }
          ]);

          if (updatedRecord) {
            res.json(getMinifiedRecords(updatedRecord));
          }
        } else {
          res.json({message: 'Coffee store id does not exist', id});
        }
      } else {
        res.status(400).json({message: 'Id is missing'});
      }
    } catch (err) {
      res.status(500).json({ message: 'Error upvoting coffee store', err });
    }
  }
}

export default favouriteCoffeeStoreById;