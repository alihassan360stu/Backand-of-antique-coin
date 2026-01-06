const db = require("../mysql/index");
const resposeMessage = require("../constant/responseMessage");
const validation = require("../constant/inCommingRequestValidation");
const { HashPassword, comparePassword } = require("../security/hashPassword")
const { JSONWebToken } = require('../security/webToken')


const register = async (res, req, next) => {
  const { name, email, password, confirm } = res.body;
  try {
    let isValid = await validation.isEmpty({ name, email, password, confirm });
    if (isValid.state === true) {
      if (await validation.isExist({ email })) return req.send({ state: false, message: resposeMessage.ALREADY_EXIST })
      if (!validation.isEqual(password, confirm)) return req.send({ state: false, message: resposeMessage.PASSWORD_NOT_EQUAL })
    }
    else return req.send({ state: false, message: resposeMessage.MISSING_PARAMS(isValid.missing) })
  } catch (e) {
    return req.send({ state: false, message: resposeMessage.SOME_THING_WENT_WRONG })
  }

  let user = []
  try {
    let hash = await HashPassword(password)
    user = new db.User({ name, email, password: hash });
    await user.save();
  } catch (e) {
    console.log(e);
    return req.send({ state: false, message: resposeMessage.SOME_THING_WENT_WRONG })
  }
  req.send({ status: true, message: "user created successfully", data: user })
};


const sign_in = async (res, req, next) => {

  const { email, password } = res.body;
  try {
    let isValid = await validation.isEmpty({ email, password });
    if (!isValid.state)return req.send({ state: false, message: resposeMessage.MISSING_PARAMS(isValid.missing) })
    let user = await db.User.findAll({ where: { email } })
    if (!(Array.isArray(user) && user.length > 0)) return req.send({ state: false, message: resposeMessage.USER_NOT_FOUND })
    if (!await comparePassword(password, user[0].password)) return req.send({ state: false, message: resposeMessage.PASSWORD_NOT_EQUAL })
    let payload = {
      name: user[0].name,
      email,
      password
    }
    let token = await JSONWebToken(payload);
    return req.send({ status: true, message: "user login successfully",token,data:user[0]})
  } catch (e) {
    console.log(e)
    return req.send({ state: false, message: resposeMessage.SOME_THING_WENT_WRONG })
  }
}



const users = async (res, req, next) => {
  try {
    let user = await db.User.findAll()
    return req.send({ status: true, message: "user login successfully",user})
  } catch (e) {
    console.log(e)
    return req.send({ state: false, message: resposeMessage.SOME_THING_WENT_WRONG })
  }
}


const uploadProfile = async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File is required",
      });
    }

    const user = await db.User.findOne({ where: { id: user_id } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const filePath = `/${req.file.filename}`;
    console.log("filePathfilePathfilePath",filePath);

    await user.update({
      file_path: filePath,
    });

    return res.status(200).json({
      success: true,
      message: "Profile image updated successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: "Something went wrong",
    });
  }
};


const updateUser = async (req, res) => {
  try {
    const { user_id,name,contact,address } = req.body;

    const updates ={
      
    }

    const user = await db.User.findOne({ where: { id: user_id } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await user.update({
      file_path: filePath,
    });

    return res.status(200).json({
      success: true,
      message: "Profile image updated successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: "Something went wrong",
    });
  }
};



module.exports = { sign_up: register, sign_in ,users , uploadProfile};
