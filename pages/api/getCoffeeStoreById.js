import { findRecordByFilter } from '../../lib/airtable';

const getCoffeeStoreById = async (req, res) => {
  const { id } = req.query;
  try {
    if (id) {
      const records = await findRecordByFilter(id);
      if (records.length > 0) {
        res.json(records);
      } else {
        res.json({message: 'Id not found'})
      }
    } else {
      res.status(400).json({ message: 'Id is missing' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong', err });
  }
}

export default getCoffeeStoreById;