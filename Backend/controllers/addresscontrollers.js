const validateAddress = require("../utils/validateaddress")
const Address = require("../models/address")
const mongoose = require("mongoose")

exports.postMyAddress = async (req, res) => {
    try {
        const userid = req.user.id;

        // validate the user request
        const { error } = validateAddress(req.body);
        if (error)
            return res.status(400).json({ error: error.details[0].message });

        const { State, District, AddressLine, PinCode } = req.body;

        const address = new Address({
            userId: userid,
            State,
            District,
            AddressLine,
            PinCode,
        });

        await address.save();
        res.status(201).json({ message: "Address added successfully" });
    } catch (err) {
        res.status(500).json({ error: "Server error", details: err.message });
    }
};

// GET /address/me
exports.getMyAddress = async (req, res) => {
    try {
        const userid = req.user.id;
        const address = await Address.findOne({ userId: userid });

        if (!address)
            return res.status(404).json({ error: "No address found" });

        res.status(200).json(address);
    } catch (err) {
        res.status(500).json({ error: "Server error", details: err.message });
    }
};

// PUT /address/me
exports.updateMyAddress = async (req, res) => {
    try {
        const userid = req.user.id;

        const { error } = validateAddress(req.body);
        if (error)
            return res.status(400).json({ error: error.details[0].message });

        const updatedAddress = await Address.findOneAndUpdate(
            { userId: userid },
            { $set: req.body },
            { new: true }
        );

        if (!updatedAddress)
            return res.status(404).json({ error: "No address found" });

        res.status(200).json({ message: "Address updated", updatedAddress });
    } catch (err) {
        res.status(500).json({ error: "Server error", details: err.message });
    }
};

// DELETE /address/me
exports.deleteMyAddress = async (req, res) => {
    try {
        const userid = req.user.id;
        const deletedAddress = await Address.findOneAndDelete({ userId: userid });

        if (!deletedAddress)
            return res.status(404).json({ error: "No address found" });

        res.status(200).json({ message: "Address deleted" });
    } catch (err) {
        res.status(500).json({ error: "Server error", details: err.message });
    }
};