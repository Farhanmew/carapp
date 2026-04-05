import mongoose from "mongoose";

const carSchema = new mongoose.Schema({
  // Main car title shown on the listing.
  title: {
    type: String,
    required: true,
    trim: true,
  },

  // Brand name like Toyota, BMW, Honda, etc.
  brand: {
    type: String,
    required: true,
    trim: true,
  },

  // Store price as a number so it is easier to filter and sort later.
  price: {
    type: Number,
    required: true,
    min: 0,
  },

  // Fuel type such as Petrol, Diesel, Electric, or Hybrid.
  fuelType: {
    type: String,
    required: true,
    trim: true,
  },

  // Manufacturing year of the car.
  year: {
    type: Number,
    required: true,
  },

  // Total distance driven in kilometers.
  kilometersDriven: {
    type: Number,
    required: true,
    min: 0,
  },

  // Save multiple image URLs for the listing gallery.
  images: {
    type: [String],
    default: [],
  },

  // Link the car to the dealer who created the listing.
  dealerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Dealer",
    required: true,
  },

  // Save the listing creation date automatically.
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Car = mongoose.models.Car || mongoose.model("Car", carSchema);

export default Car;
