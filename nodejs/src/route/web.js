import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import doctorController from "../controllers/doctorController";

let router = express.Router();

let initWebRoutes = (app) => {
  router.get(
    "/",
    homeController.getHomepage // (req, res) => {return res.send("Hello word with Nam");}
  );
  // crud với view ejs
  router.get("/nam", homeController.getNampage);
  router.get("/crud", homeController.getCRUD);
  router.post("/post-crud", homeController.postCRUD);
  router.get("/get-crud", homeController.getDisplayCRUD);
  router.get("/edit-crud", homeController.getEditCRUD);
  router.post("/put-crud", homeController.putCRUD);
  router.get("/delete-crud", homeController.getDeleteCRUD);
  // reactjs-crud
  router.post("/api/login", userController.handleLogin);
  router.get("/api/get-all-users", userController.handleGetAllUsers);
  router.post("/api/create-new-user", userController.handleCreateNewUser);
  router.put("/api/edit-user", userController.handleEditUser);
  router.delete("/api/delete-user", userController.handleDeleteUser);
  // reacjs-
  router.get("/api/allcodes", userController.handleGetAllCode);
  //doctor
  router.get("/api/top-doctor-home", doctorController.handleGetTopDoctorHome);

  return app.use("/", router);
};

module.exports = initWebRoutes;
