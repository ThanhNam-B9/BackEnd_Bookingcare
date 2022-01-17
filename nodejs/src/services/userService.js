import db from "../models/index";
import bcryptjs from "bcryptjs";
var salt = bcryptjs.genSaltSync(10);
let handleUserLogin = (email, password) => {
  return new Promise(async (reslove, reject) => {
    try {
      let userData = {};
      let isExits = await checkUserEmail(email);
      if (isExits) {
        let user = await db.User.findOne({
          attributes: ["email", "password", "roleId", "firstName", "lastName"],
          where: { email: email },
          raw: true,
        });
        if (user) {
          let checkUserPassword = bcryptjs.compareSync(password, user.password);
          if (checkUserPassword) {
            (userData.errCode = 0),
              (userData.message = `Ok`),
              delete user.password,
              (userData.user = user);
          } else {
            (userData.errCode = 3),
              (userData.message = `
            Incorrect password!`);
          }
        } else {
          (userData.errCode = 2),
            (userData.message = `User is not exit in system`);
        }
        reslove(userData);
      } else {
        (userData.errCode = 1),
          (userData.message = `You's Email isn't exist in your system. Plz try other email !`);
        reslove(userData);
      }
    } catch (e) {
      reject(e);
    }
  });
};

let checkUserEmail = (userEmail) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { email: userEmail },
      });
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getAllUsers = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = "";
      if (userId === "All") {
        user = await db.User.findAll({ attributes: { exclude: ["password"] } });
      }
      if (userId && userId !== "All") {
        user = await db.User.findOne({
          attributes: { exclude: ["password"] },
          where: { id: userId },
        });
      }
      resolve(user);
    } catch (e) {
      reject(e);
    }
  });
};

let createNewUser = (data) => {
  return new Promise(async (reslove, reject) => {
    try {
      let checkNewEmail = await checkUserEmail(data.email);
      if (checkNewEmail === true) {
        reslove({
          errCode: 1,
          errMessage:
            "Your email is already in the system! Please use another email",
        });
      } else {
        let hashPasswordFromBcryptjs = await hashUserPassword(data.password);
        await db.User.create({
          email: data.email,
          password: hashPasswordFromBcryptjs,
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          phonenumber: data.phonenumber,
          // gender: data.gender === "1" ? true : false, cho 2 giới tính
          gender: data.gender, // cho hơn 2 giới tính
          roleId: data.roleId,
          positionId: data.positionId,
          image: data.image,
        });
        reslove({
          errCode: 0,
          errMessage: "Oke",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let hashUserPassword = (password) => {
  return new Promise(async (reslove, reject) => {
    try {
      let hashPassword = await bcryptjs.hashSync(password, salt);
      reslove(hashPassword);
    } catch (e) {
      reject(e);
    }
  });
};

let deleteUser = (userId) => {
  return new Promise(async (reslove, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: userId },
      });
      if (!user) {
        reslove({
          errCode: 2,
          message: `Your Email isn't exits in system.Plz use anthor email !`,
        });
      }
      if (user) {
        await db.User.destroy({
          where: { id: userId },
        });
        reslove({
          errCode: 0,
          message: "Oke",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
let editUser = (data) => {
  return new Promise(async (reslove, reject) => {
    if (!data.id || !data.gender || !data.positionId || !data.roleId) {
      reslove({
        errCode: 2,
        message: "Missing required parameters!",
      });
    }

    let user = await db.User.findOne({
      where: { id: data.id },
      raw: false,
    });
    if (!user) {
      reslove({
        errCode: 1,
        message: `User isn't exits in system!`,
      });
    }

    if (user) {
      // user = {

      // }
      user.firstName = data.firstName;
      user.lastName = data.lastName;
      user.address = data.address;
      user.phonenumber = data.phonenumber;
      user.gender = data.gender;
      user.positionId = data.positionId;
      user.roleId = data.roleId;
      if (data.image) {
        user.image = data.image;
      }
      await user.save();
      reslove({
        errCode: 0,
        message: "Oke",
      });
    }
  });
};
let getAllCode = (typeInput) => {
  return new Promise(async (reslove, reject) => {
    try {
      if (!typeInput) {
        reslove({
          errCode: 1,
          errMessage: "Missing required parameters !",
        });
      } else {
        let res = {};
        let allcode = await db.Allcode.findAll({
          where: { type: typeInput },
        });
        res.errCode = 0;
        res.data = allcode;
        reslove(res);
      }
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  handleUserLogin: handleUserLogin,
  getAllUsers: getAllUsers,
  createNewUser: createNewUser,
  deleteUser: deleteUser,
  editUser: editUser,
  getAllCode: getAllCode,
};
