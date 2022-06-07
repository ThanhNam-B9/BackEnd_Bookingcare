import db from "../models/index";

let postPatientBookAppointent = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.email || !data.doctorId || !data.date || !data.timeType) {
        resolve({
          errCode: 1,
          errMessage: "Miss Parameter!",
        });
      } else {
        let patient = await db.User.findOrCreate({
          where: { email: data.email },
          defaults: {
            email: data.email,
            roleId: "R3",
          },
        });
        if (patient && patient[0]) {
          await db.Booking.findOrCreate({
            where: { patientId: patient[0].id },
            defaults: {
              statusId: "S1",
              doctorId: data.doctorId,
              patientId: patient[0].id,
              date: data.date,
              timeType: data.timeType,
            },
          });
        }
        resolve({
          errCode: 0,
          errMessage: "Oke!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  postPatientBookAppointent,
};
