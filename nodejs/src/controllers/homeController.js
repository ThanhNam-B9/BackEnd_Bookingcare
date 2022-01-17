import db from "../models/index";
import CRUDService from "../services/CRUDService";
let getHomepage = async (req, res) => {
  try {
    let data = await db.User.findAll();
    return res.render("homepage.ejs", {
      data: JSON.stringify(data),
    });
  } catch (e) {
    console.log(e);
  }
};

let getNampage = (req, res) => {
  return res.send("Hello !");
};

let getCRUD = (req, res) => {
  return res.render("crud.ejs");
};

let postCRUD = async (req, res) => {
  let messger = await CRUDService.creataNewUser(req.body);
  console.log(messger);
  return res.send("Nam post CURD");
};

let getDisplayCRUD = async (req, res) => {
  let data = await CRUDService.getAllUser();
  return res.render("displayCRUD.ejs", {
    dataTable: data,
  });
};

let getEditCRUD = async (req, res) => {
  let idEdit = req.query.id;
  if (idEdit) {
    let userData = await CRUDService.getUserInfoById(idEdit);
    return res.render("editCRUD.ejs", {
      dataEdit: userData,
    });
  } else {
    return res.send("User no found !");
  }
};

let putCRUD = async (req, res) => {
  let data = req.body;
  let newUser = await CRUDService.updateUserById(data);
  return res.render("displayCRUD.ejs", {
    dataTable: newUser,
  });
};

let getDeleteCRUD = async (req, res) => {
  let id = req.query.id;
  await CRUDService.deleteUserInfoById(id);
  if (id) {
    return res.send("Delete is succeed ");
  } else {
    return res.send("Delete is not succeed ");
  }
};
module.exports = {
  getHomepage: getHomepage,
  getNampage: getNampage,
  getCRUD: getCRUD,
  postCRUD: postCRUD,
  getDisplayCRUD: getDisplayCRUD,
  getEditCRUD: getEditCRUD,
  putCRUD: putCRUD,
  getDeleteCRUD,
  getDeleteCRUD,
};
