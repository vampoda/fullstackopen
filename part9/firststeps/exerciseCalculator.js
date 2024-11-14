"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateExercises = void 0;
var calculateExercises = function (exerciseHours, target) {
    var periodLength = exerciseHours.length;
    var trainingDays = exerciseHours.filter(function (day) { return day > 0; }).length;
    var average = exerciseHours.reduce(function (sum, hours) { return sum + hours; }, 0) / periodLength;
    var success = average >= target;
    var rating;
    var ratingDescription;
    if (average >= target) {
        rating = 3;
        ratingDescription = "Excellent job! you met your target.";
    }
    else if (average >= target * 0.75) {
        rating = 2;
        ratingDescription = "Not too bad could be better.";
    }
    else {
        rating = 1;
        ratingDescription = "You need to work harder!";
    }
    return {
        periodLength: periodLength,
        trainingDays: trainingDays,
        success: success,
        rating: rating,
        ratingDescription: ratingDescription,
        target: target,
        average: average
    };
};
exports.calculateExercises = calculateExercises;
// const Result=calculateExercises([3,0,2,4.5,0,3,1],2)
// console.log(Result)
var args = process.argv.slice(2);
var target = Number(args[0]);
var exerciseHours = args.slice(1).map(function (arg) { return Number(arg); });
if (isNaN(target) || exerciseHours.some(isNaN)) {
    console.log("Please provide target and exercise hours.");
}
else {
    var result = (0, exports.calculateExercises)(exerciseHours, target);
    console.log(result);
}
