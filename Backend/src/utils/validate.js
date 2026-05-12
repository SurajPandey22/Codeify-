
const validator=require('validator')
const validate=(data)=> {

    const mandt=['firstName','emailId','password']

    const isAllowed=mandt.every((k)=>Object.keys(data).includes(k));
    if(!isAllowed) {
        throw new Error("Some field missing");
    }
    if(!validator.isEmail(data.emailId)) {
        throw new Error("Invalid Email");
    }

}

module.exports=validate;