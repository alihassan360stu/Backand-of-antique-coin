const db = require("../mysql/index");
const validation = {
  isEmpty: (object = {}) => {
    return new Promise((done, reject) => {
      try {
        for (let key in object) {
          if (
            object[key] !== undefined &&
            typeof object[key] !== "object" &&
            !Array.isArray(object[key])
          ) {
            let updatedValue = object[key].toString();
            if (updatedValue.length > 0 && updatedValue.trim().length > 0) true;
            else done({ state: false, missing: key });
          } else done({ state: false, missing: key });
        }
        done({ state: true });
      } catch (e) {
        reject(false);
      }
      done({ state: true });
    });
  },
  isEqual: (operand1 = false, operand2 = true) => operand1 === operand2,
  isEmail: (email = false) => /^[A-Za-z0-9+_.-]+@(.+)$/.test(email),
  isExist: (value = {}) => {
    console.log('347398457290w5872035428q3952704395720u394wo5u20934otiu3p9re',value)
    return new Promise(async (done, reject) => {
      try {
        let result = await db?.User?.findAll({
          where: value
        });
        console.log('shdbjcaksldjfcnasd',result)
        if (Array.isArray(result) && result.length > 0) done(true);
        else done(false);
      } catch (e) {
        console.log(e);
        reject(false);
      }
    });
  },
};

module.exports = validation;
