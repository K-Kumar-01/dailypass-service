const { dailyPassCrud, DailyPass } = require("../models/DailyPass");
const { NotFoundError } = require("prattask-cmmn");
const axios = require("axios").default;

exports.pushNewSeries = async (req, res, next) => {
  try {
    const seriesData = req.body.series;
    // console.log(seriesData);
    const data = await dailyPassCrud.getManyDocs({ findBy: {} });
    let promisesArray = [];
    for (const d of data) {
      d.series.push(...seriesData);
      promisesArray.push(d.save());
    }
    await Promise.all(promisesArray);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.pushNewUser = async (req, res, next) => {
  try {
    const userId = req.body.user_id;
    const seriesData = await axios.get(
      "http://localhost:3000/series/all?selectOpts=_id chapters.name"
    );
    const modifiedSeriesData = seriesData.data.data.map((series) => {
      return {
        series_id: series._id.toString(),
        lastChapter: Math.min(series.chapters.length, 4),
        totalChapters: series.chapters.length,
      };
    });
    const newUserData = { user_id: userId, series: modifiedSeriesData };
    const data = await dailyPassCrud.createOne({ body: newUserData });
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.unlockChapter = async (req, res, next) => {
  try {
    const userSeries = await dailyPassCrud.getOneDoc({
      findBy: {
        user_id: req.body.userId,
      },
    });
    if (!userSeries) {
      throw new NotFoundError("No such combination of user and series exist");
    }

    let requiredSeries = userSeries.series.find((series) => {
      return series.series_id === req.body.seriesId;
    });

    if (requiredSeries.lastChapter === requiredSeries.totalChapters) {
      return res
        .status(202)
        .json({ data: "All chapters are already unlocked." });
    }

    requiredSeries.lastChapter = requiredSeries.lastChapter + 1;

    await userSeries.save();
    // update USer details

    return res.status(200).json({ data: requiredSeries });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.getDetails = async (req, res, next) => {
  const userId = req.query.userId;
  const seriesId = req.query.seriesId;
  try {
    let userSeries = await dailyPassCrud.getOne({
      findBy: {
        user_id: userId,
      },
    });
    if (seriesId && userSeries) {
      userSeries.series = userSeries.series.filter(
        ({ series_id }) => series_id === seriesId
      );
    }
    return res.status(200).json({ data: userSeries });
  } catch (error) {
    next(error);
  }
};
