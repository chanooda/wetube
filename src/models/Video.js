import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxLength: 100 },
  fileUrl: { type: String, required: true },
  description: {
    type: String,
    requiredPaths: true,
    trim: true,
    maxLength: 100,
  },
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
  },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
});

videoSchema.static("formatHashtags", function (hashtags) {
  const splitHash = hashtags.split(",");
  const mapHash = splitHash.map((word) => {
    const asd = word.replace(/ /g, "");
    if (asd.startsWith("#")) {
      return asd;
    } else {
      return "#" + asd;
    }
  });
  return mapHash;
});

const movieModel = mongoose.model("Video", videoSchema);
export default movieModel;
