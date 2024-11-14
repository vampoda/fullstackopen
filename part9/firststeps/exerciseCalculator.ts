interface Result {
    periodLength:number;
    trainingDays:number;
    success:boolean;
   rating:number;
   ratingDescription:string;
   target:number;
   average:number;
    
}
export const calculateExercises=(exerciseHours:number[],target:number):Result=>{
 const periodLength=exerciseHours.length
 const trainingDays=exerciseHours.filter(day=>day>0).length
 const average=exerciseHours.reduce((sum,hours)=>sum+hours,0)/periodLength;
 const success=average >=target
 let rating:number
 let ratingDescription:string;
    
if(average>=target){
    rating=3;
    ratingDescription="Excellent job! you met your target.";

}else if(average>=target*0.75){
    rating=2

    ratingDescription="Not too bad could be better."
}
else{

    rating=1
ratingDescription="You need to work harder!";
}

return{
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average
}


}





// const Result=calculateExercises([3,0,2,4.5,0,3,1],2)
// console.log(Result)

const args=process.argv.slice(2)
const target=Number(args[0])
const exerciseHours=args.slice(1).map(arg=>Number(arg))
if(isNaN(target)|| exerciseHours.some(isNaN)){
    console.log("Please provide target and exercise hours.")

}else{
    const result=calculateExercises(exerciseHours,target)
    console.log(result)
}