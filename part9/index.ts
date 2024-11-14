type operation="multiply"|"add"|"divide";
const calculator=(a:number,b:number,op:operation):number=>{
    if(op==="multiply"){
        return a*b;

    }else if (op==="add"){
        return a+b;

    }else if (op==="divide"){
        if(b===0){ 
            console.log( "this cannot be done")
    
        }
        
            return a/b;
        
        }

    }