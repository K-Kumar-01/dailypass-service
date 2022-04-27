const mongoose = require("mongoose");
const { crudControllers } = require("prattask-cmmn");

const dailyPassSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    series: [
      {
        series_id: {
          type: String,
          required: true,
          index: true,
        },
        lastChapter: {
          type: Number,
          required: true,
        },
        totalChapters: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    timeseries: true,
    toJSON: {
      versionKey: false,
    },
  }
);

dailyPassSchema.index({ user_id: 1, series_id: 1 }, { unique: true });

const DailyPass = mongoose.model("dailyPass", dailyPassSchema);

module.exports = {
  dailyPassCrud: crudControllers(DailyPass),
  DailyPass,
};
