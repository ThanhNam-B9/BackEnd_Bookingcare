import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import doctorController from "../controllers/doctorController";
import patientController from "../controllers/patientController";

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
  // reactjs-crud\
  router.post("/api/login", userController.handleLogin);
  router.get("/api/get-all-users", userController.handleGetAllUsers);
  router.post("/api/create-new-user", userController.handleCreateNewUser);
  router.put("/api/edit-user", userController.handleEditUser);
  router.delete("/api/delete-user", userController.handleDeleteUser);
  // reacjs-
  router.get("/api/allcodes", userController.handleGetAllCode);
  //doctor
  router.get("/api/top-doctor-home", doctorController.handleGetTopDoctorHome);
  router.get("/api/get-all-doctors", doctorController.handleGetAllDoctor);
  router.post("/api/save-info-doctors", doctorController.handlePostInfoDoctor);
  router.get(
    "/api/get-detail-doctor-by-id",
    doctorController.handleGetDetailDoctorById
  );
  router.post(
    "/api/bulk-create-schedule",
    doctorController.handleBulkCreateSchedule
  );
  router.get(
    "/api/get-schedule-doctor-by-date",
    doctorController.handleGetScheduleDoctorByDate
  );
  router.get(
    "/api/get-extra-infor-doctor-by-id",
    doctorController.handleGetExtraInforDoctorById
  );
  router.get(
    "/api/get-extra-infor-doctor-by-id",
    doctorController.handleGetExtraInforDoctorById
  );
  router.get(
    "/api/get-profile-doctor-by-id",
    doctorController.handleGetProfileDoctorById
  );
  //patient
  router.post(
    "/api/patient-book-appointment",
    patientController.handlePostPatientBookAppointment
  );

  return app.use("/", router);
};

module.exports = initWebRoutes;
