const randomVerificationCode = ()=>{
    let result = "";
    for(let i=0; i<6; i++)
    {
        result += Math.floor((Math.random() * 9) + 1).toString();
    }
    return result;
}

const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}

export { randomVerificationCode, uuidv4 }