import bcryptjs from "bcryptjs";
import db from "../models/index";
//const bcryptjs = require("bcryptjs");
var salt = bcryptjs.genSaltSync(10);

let creataNewUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPasswordFromBcryptjs = await hashUserPassword(data.password);
      await db.User.create({
        email: data.email,
        password: hashPasswordFromBcryptjs,
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        phonenumber: data.phonenumber,
        gender: data.gender === "1" ? true : false,
        roleId: data.roleId,
      });
      resolve("oke create successed !");
    } catch (e) {
      reject(e);
    }
  });
};
let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcryptjs.hashSync(password, salt);
      resolve(hashPassword);
    } catch (e) {
      reject(e);
    }
  });
};
let getAllUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await db.User.findAll({
        raw: true,
      });
      resolve(users);
    } catch (e) {
      reject(e);
    }
  });
};

let getUserInfoById = (idEdit) => {
  return new Promise(async (reslove, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: idEdit },
        raw: true,
      });
      if (user) {
        reslove(user);
      } else {
        reslove({});
      }
    } catch (e) {
      reject(e);
    }
  });
};

let updateUserById = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: data.id },
      });
      if (user) {
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.address = data.address;
        await user.save();
        let allUsers = db.User.findAll();
        resolve(allUsers);
      } else {
        resolve({});
      }
    } catch (e) {
      reject(e);
    }
  });
};

let deleteUserInfoById = (id) => {
  return new Promise(async (resolve, reject) => {
    let user = await db.User.findOne({
      where: { id: id },
    });
    if (user) {
      await user.destroy();
      resolve();
    } else {
      resolve();
    }
  });
};
module.exports = {
  creataNewUser: creataNewUser,
  getAllUser: getAllUser,
  getUserInfoById: getUserInfoById,
  updateUserById: updateUserById,
  deleteUserInfoById: deleteUserInfoById,
};
