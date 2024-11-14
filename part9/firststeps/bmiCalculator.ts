
export function bmiCalculator(height: number, weight: number): string  {
    const heightInMeters = height / 100; 
    const bmi = weight / (heightInMeters * heightInMeters);
  
    if (bmi < 18.5) {
      return "Underweight";
    } else if (bmi >= 18.5 && bmi < 24.9) {
      return "Normal range";
    } else if (bmi >= 25 && bmi < 29.9) {
      return "Overweight";
    } else {
      return "Obese";
    }
  };
  
  const args = process.argv.slice(2);
  if (args.length !== 2) {
    console.log("Please provide height (cm) and weight (kg).");
  } else {
    const height = Number(args[0]);
    const weight = Number(args[1]);
    if (isNaN(height) || isNaN(weight)) {
      console.log("Invalid input, please provide valid numbers for height and weight.");
    } else {
     // console.log(calculateBmi(height, weight));
    }
  }
  