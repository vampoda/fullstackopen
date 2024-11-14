"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var bmiCalculator_1 = require("./bmiCalculator");
var exerciseCalculator_1 = require("./exerciseCalculator");
var app = (0, express_1.default)();
app.use(express_1.default.json());
var isNumber = function (value) { return !isNaN(Number(value)); };
var sendError = function (res, message, statusCode) {
    if (statusCode === void 0) { statusCode = 400; }
    return res.status(statusCode).send({ error: message });
};
app.get("/hello", function (_req, res) {
    res.send("hello fullstack!");
});
app.get("/bmi", function (req, res) {
    var height = Number(req.query.height);
    var weight = Number(req.query.weight);
    if (!isNumber(height) || !isNumber(weight)) {
        return sendError(res, "wrong parameters");
    }
    var bmi = (0, bmiCalculator_1.bmiCalculator)(height, weight);
    var bmiData = {
        weight: weight,
        height: height,
        bmi: bmi
    };
    res.status(200).send(bmiData);
});
app.post("/exercise", function (req, res) {
    var dailyExercises = req.body.dailyExercises;
    var number = req.body.target;
    if (!dailyExercises || !number) {
        return sendError(res, "parameters missing");
    }
    if (!isNumber(number) || !Array.isArray(dailyExercises) || dailyExercises.some(function (e) { return !isNumber(e); })) {
        return sendError(res, "malformatted parameters");
    }
    try {
        var result = (0, exerciseCalculator_1.calculateExercises)(number, dailyExercises);
        res.status(200).send({ result: result });
    }
    catch (error) {
        if (error instanceof Error) {
            return sendError(res, error.message);
        }
        return sendError(res, 'something went wrong');
    }
});
var PORT = 3000;
app.listen(PORT, function () {
    console.log("I am listening at port ".concat(PORT));
});
