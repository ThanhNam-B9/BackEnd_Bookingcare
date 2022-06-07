import patientService from "../services/patientService";

let handlePostPatientBookAppointment = async (req, res) => {
  try {
    let infoPatinet = await patientService.postPatientBookAppointent(req.body);
    return res.status(200).json(infoPatinet);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server !",
    });
  }
};
module.exports = {
  handlePostPatientBookAppointment,
};
