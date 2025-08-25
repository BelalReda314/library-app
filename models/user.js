const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
  
  books: {
		type: [
			{
				id: {
					type: String,
					required: true,
				},
				borrowed_from: {
					type: Date,
					required: true,
					default: new Date()
				},
				borrowed_to: {
					type: Date,
					required: true,
					default: () => new Date(Date.now() + 7*24*60*60*1000)
				}
			}
		],
		default: []
	}
});

const User = mongoose.model("User", userSchema);
module.exports = User;
