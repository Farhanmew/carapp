import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const dealerSchema = new mongoose.Schema({
  // Dealer full name.
  name: {
    type: String,
    required: true,
    trim: true,
  },

  // Email should stay unique for each dealer account.
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },

  // Password will be hashed before saving to the database.
  password: {
    type: String,
    required: true,
  },

  // Optional phone number for contact.
  phone: {
    type: String,
    trim: true,
  },

  // Reuse the same auth model for dealers and super admins.
  role: {
    type: String,
    enum: ["dealer", "admin"],
    default: "dealer",
  },

  // Save the date when the dealer account is created.
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

dealerSchema.pre("save", async function () {
  // Skip hashing if the password was not changed.
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

dealerSchema.methods.comparePassword = async function (plainPassword) {
  // Compare the entered password with the hashed password saved in MongoDB.
  return bcrypt.compare(plainPassword, this.password);
};

const Dealer = mongoose.models.Dealer || mongoose.model("Dealer", dealerSchema);

export default Dealer;
