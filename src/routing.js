// Controllers
const categories = require("./routers/categories");
const statistics = require("./routers/statistics");
const cities = require("./routers/cities");
const configuration = require("./routers/configuration");

module.exports = app => {
    app.use("/api/categories", categories);
    app.use("/api/statistics", statistics);
    app.use("/api/cities", cities);
    app.use("/api/configuration", configuration);
};
