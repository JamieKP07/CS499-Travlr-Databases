const mongoose = require('mongoose');
const Trip = mongoose.model('trips');

// GET: /trips
// Returns all trips
const tripsList = async (req, res) => {
  const trips = await Trip.find({}).exec();

  if (!trips) {
    return res
      .status(404)
      .json({ message: 'Trips not found' });
  }

  return res
    .status(200)
    .json(trips);
};

// GET: /trips/:tripCode
// Returns one trip based on its code
const tripsFindByCode = async (req, res) => {
  const trip = await Trip
    .find({ code: req.params.tripCode })
    .exec();

  if (!trip || trip.length === 0) {
    return res
      .status(404)
      .json({ message: 'Trip not found' });
  }

  return res
    .status(200)
    .json(trip);
};

// POST: /trips
// Adds a new trip
const tripsAddTrip = async (req, res) => {
  try {
  const newTrip = new Trip({
    code: req.body.code,
    name: req.body.name,
    length: req.body.length,
    start: req.body.start,
    resort: req.body.resort,
    perPerson: req.body.perPerson,
    image: req.body.image,
    description: req.body.description
  });

  const savedTrip = await newTrip.save();

  return res
    .status(201)
    .json(savedTrip);

} catch (error) {
  console.error('Error adding trip:', error);

  if (error.code ===11000) {
    return res
    .status(409)
    .json({ message: 'A trip with this code already exists.' });
  }

  if (error.name === 'ValidationError') {
    return res
    .status(400)
    .json({ message: 'Trip data failed validation.' });
  }

  return res
  .status(500)
  .json({ message: 'Unable to add trip.' });
}
};

// PUT: /trips/:tripCode
// Updates an existing trip
const tripsUpdateTrip = async (req, res) => {
  try{
    console.log(req.params);
    console.log(req.body);

     const q = await Trip
     .findOneAndUpdate(
        { code: req.params.tripCode },
        {
          code: req.body.code,
          name: req.body.name,
          length: req.body.length,
          start: req.body.start,
          resort: req.body.resort,
          perPerson: req.body.perPerson,
          image: req.body.image,
          description: req.body.description
        },
        {
          runValidators: true,
          returnDocument: 'after'
        }
      )
      .exec();

    if (!q) {
      return res
        .status(400)
        .json({ message: 'Trip not found' });
    }

    return res
      .status(200)
      .json(q);

  } catch (error) {
    console.error('Error updating trip:', error);
 
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ message: 'A trip with this code already exists.' });
    }

    if (error.name === 'ValidationError') {
      return res
        .status(400)
        .json({ message: 'Trip data failed validation.' });
    }

    return res
      .status(500)
      .json({ message: 'Unable to update trip.' });
  }
};

// DELETE: /trips/:tripCode
// Deletes an existing trip based on its code
const tripsDeleteTrip = async (req, res) => {
  try {
    const deletedTrip = await Trip
      .findOneAndDelete({ code: req.params.tripCode })
      .exec();

    if (!deletedTrip) {
      return res
        .status(404)
        .json({ message: 'Trip not found' });
    }

    return res
      .status(200)
      .json({ message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Error deleting trip:', error);

    return res
      .status(500)
      .json({ message: 'Unable to delete trip' });
  }
};

module.exports = {
  tripsList,
  tripsFindByCode,
  tripsAddTrip,
  tripsUpdateTrip,
  tripsDeleteTrip
};