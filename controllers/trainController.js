const TrainModel = require('../models/trainModel');
class TrainController {
  static async addTrain(req, res) {
    try {
      const { name, source, destination, totalSeats } = req.body;
      
      const trainId = await TrainModel.create(
        name, 
        source, 
        destination, 
        totalSeats
      );
      
      res.status(201).json({ 
        message: 'Train added successfully', 
        trainId 
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to add train' });
    }
  }

  static async getTrainAvailability(req, res) {
    try {
      const { source, destination } = req.query;
      
      const trains = await TrainModel.findByRoute(source, destination);
      
      res.json(trains.map(train => ({
        id: train.id,
        name: train.name,
        availableSeats: train.available_seats
      })));
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch train availability' });
    }
  }
}

module.exports = TrainController;