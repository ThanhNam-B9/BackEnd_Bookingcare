import doctorService from "../services/doctorService";

let handleGetTopDoctorHome = async (req, res) => {
  let limit = req.query.limit;
  if (!limit) limit = 10;
  try {
    let response = await doctorService.getTopDoctorHome(+limit);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};
let handleGetAllDoctor = async (req, res) => {
  try {
    let doctors = await doctorService.getAllDoctors();
    return res.status(200).json(doctors);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server !",
    });
  }
};
let handlePostInfoDoctor = async (req, res) => {
  try {
    let response = await doctorService.postSaveDetailInfoDoctor(req.body);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server !",
    });
  }
};
let handleGetDetailDoctorById = async (req, res) => {
  try {
    let infor = await doctorService.getDetailDoctorById(req.query.id);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from the server!",
    });
  }
};
let handleBulkCreateSchedule = async (req, res) => {
  try {
    let scheduleData = await doctorService.bulkCreateSchedule(req.body);
    return res.status(200).json(scheduleData);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from the server!",
    });
  }
};
let handleGetScheduleDoctorByDate = async (req, res) => {
  try {
    let scheduleByDate = await doctorService.getScheduleDoctorByDate(
      req.query.doctorId,
      req.query.date
    );
    return res.status(200).json(scheduleByDate);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from the server!",
    });
  }
};
let handleGetExtraInforDoctorById = async (req, res) => {
  try {
    let doctorId = req.query.doctorId;
    let extraInforDoctor = await doctorService.getExtraInforDoctorById(
      doctorId
    );
    return res.status(200).json(extraInforDoctor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from the server!",
    });
  }
};
let handleGetProfileDoctorById = async (req, res) => {
  try {
    let doctorId = req.query.doctorId;
    let profileDoctor = await doctorService.getProfileDoctorById(doctorId);
    return res.status(200).json(profileDoctor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from the server!",
    });
  }
};
module.exports = {
  handleGetTopDoctorHome: handleGetTopDoctorHome,
  handleGetAllDoctor: handleGetAllDoctor,
  handlePostInfoDoctor: handlePostInfoDoctor,
  handleGetDetailDoctorById: handleGetDetailDoctorById,
  handleBulkCreateSchedule: handleBulkCreateSchedule,
  handleGetScheduleDoctorByDate: handleGetScheduleDoctorByDate,
  handleGetExtraInforDoctorById,
  handleGetProfileDoctorById,
};
