const bodyValidation = (schema: any, body: any) => {
    const {value, error} = schema.validate(body);
    if(error === undefined){
      return true;
    }
    else{
      return false;
    }
};
  
export { bodyValidation };