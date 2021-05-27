const bodyValidation = (schema: any, body: any) => {
    const {value, error} = schema.validate(body);
    if(error === undefined){
      return true;
    }
    else{ 
      console.log('error');
      return false;
    }
};
  
export { bodyValidation };