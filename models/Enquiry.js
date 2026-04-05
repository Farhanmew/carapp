import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema({
  // Buyer name for the enquiry form.
  name: {
    type: String,
    required: true,
    trim: true,
  },

  // Buyer phone number for dealer follow-up.
  phone: {
    type: String,
    required: true,
    trim: true,
  },

  // Message sent by the buyer about the car.
  message: {
    type: String,
    required: true,
    trim: true,
  },

  // Save the related car id as a string so it works with both sample cars and MongoDB ids.
  carId: {
    type: String,
    required: true,
    trim: true,
  },

  // Save the date when the enquiry is created.
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Enquiry = mongoose.models.Enquiry || mongoose.model("Enquiry", enquirySchema);

export default Enquiry;
