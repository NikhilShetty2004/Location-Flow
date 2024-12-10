const Pin = require('../models/Pin')

exports.createPin = async (req, res) => {
    try {
        const newPin = new Pin(req.body)
        const savedPin = await newPin.save()
        res.status(200).json(savedPin)
    } catch (err) {
        res.status(500).json(err)
    }
}

exports.getAllPins = async (req, res) => {
    try {
        const pins = await Pin.find()
        res.status(200).json(pins)
    } catch (err) {
        res.status(500).json(err)
    }
}
