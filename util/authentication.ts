const bcrypt = require('bcrypt');

const encrypt = (frontendPassword: string) =>{
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(frontendPassword, salt);
    return hash;
}

const comparePassword = (frontendPassword: string, backendPassword: string)=>{
    const result = bcrypt.compareSync(frontendPassword, backendPassword);
    return result;
}

export { encrypt, comparePassword }