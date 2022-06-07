import db from "../models/index";
import _, { reject } from "lodash";
require("dotenv").config();
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;
let getTopDoctorHome = (limitInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await db.User.findAll({
        where: { roleId: "R2" },
        limit: limitInput,
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: db.Allcode,
            as: "positionData",
            attributes: ["valueEn", "valueVi"],
          },
          {
            model: db.Allcode,
            as: "genderData",
            attributes: ["valueEn", "valueVi"],
          },
        ],
        raw: true,
        nest: true,
      });
      resolve({
        errCode: 0,
        data: users,
      });
    } catch (e) {
      reject(e);
    }
  });
};
let getAllDoctors = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let doctors = await db.User.findAll({
        where: { roleId: "R2" },
        attributes: {
          exclude: ["password", "image"],
        },
      });

      resolve({
        errCode: 0,
        data: doctors,
      });
    } catch (e) {
      reject(e);
    }
  });
};
let postSaveDetailInfoDoctor = (doctorData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !doctorData.doctorId ||
        !doctorData.contentHTML ||
        !doctorData.contentMarkdown ||
        !doctorData.action ||
        !doctorData.selectPrice ||
        !doctorData.selectPayment ||
        !doctorData.selectProvince ||
        !doctorData.addressClinic ||
        !doctorData.nameClinic ||
        !doctorData.note
      ) {
        resolve({
          errCode: 1,
          message: "Miss Parameter !",
        });
      } else {
        // upsert to Markdown
        if (doctorData.action === "CREATE") {
          // insert
          await db.Markdown.create({
            contentHTML: doctorData.contentHTML,
            contentMarkdown: doctorData.contentMarkdown,
            description: doctorData.description,
            doctorId: doctorData.doctorId,
          });
        }
        if (doctorData.action === "EDIT") {
          //update
          let doctorMarkdown = await db.Markdown.findOne({
            where: { doctorId: doctorData.doctorId },
            raw: false,
          });
          if (doctorMarkdown) {
            doctorMarkdown.contentHTML = doctorData.contentHTML;
            doctorMarkdown.contentMarkdown = doctorData.contentMarkdown;
            doctorMarkdown.description = doctorData.description;
            doctorMarkdown.description = doctorData.description;

            await doctorMarkdown.save();
          }
        }
        //upsert to doctorInfor
        let doctorInfor = await db.Doctor_Infor.findOne({
          where: { doctorId: doctorData.doctorId },
          raw: false,
        });

        if (doctorInfor) {
          //update
          doctorInfor.doctorId = doctorData.doctorId;
          doctorInfor.priceId = doctorData.selectPrice;
          doctorInfor.provinceId = doctorData.selectProvince;
          doctorInfor.paymentId = doctorData.selectPayment;
          doctorInfor.addressClinic = doctorData.addressClinic;
          doctorInfor.nameClinic = doctorData.nameClinic;
          doctorInfor.note = doctorData.note;
          await doctorInfor.save();
        } else {
          // insert
          await db.Doctor_Infor.create({
            doctorId: doctorData.doctorId,
            priceId: doctorData.selectPrice,
            provinceId: doctorData.selectProvince,
            paymentId: doctorData.selectPayment,
            addressClinic: doctorData.addressClinic,
            nameClinic: doctorData.nameClinic,
            note: doctorData.note,
          });
        }
      }
      resolve({
        errCode: 0,
        message: "Save infor doctor succeed!",
      });
    } catch (e) {
      reject(e);
    }
  });
};
let getDetailDoctorById = (doctorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId) {
        resolve({
          errCode: 1,
          errMessage: "Miss Parameter!",
        });
      } else {
        let doctor = await db.User.findOne({
          where: { id: doctorId },
          attributes: {
            exclude: ["password"],
          },
          include: [
            {
              model: db.Markdown,

              attributes: ["contentHTML", "contentMarkdown", "description"],
            },
            {
              model: db.Allcode,
              as: "positionData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Doctor_Infor,
              attributes: {
                exclude: ["id", "doctorId"],
              },
              include: [
                {
                  model: db.Allcode,
                  as: "priceData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.Allcode,
                  as: "provinceData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.Allcode,
                  as: "paymentData",
                  attributes: ["valueEn", "valueVi"],
                },
              ],
            },
          ],

          raw: false,
          nest: true,
        });
        if (doctor && doctor.image) {
          doctor.image = new Buffer(doctor.image, "base64").toString("binary");
        }
        if (!doctor) {
          resolve({
            errCode: 2,
            errMessage: "Doctor not exiting in the system!",
            data: {},
          });
        }
        resolve({
          errCode: 0,
          data: doctor,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
let bulkCreateSchedule = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.arrSchedule && !data.formatCurrDate && !data.doctorId) {
        resolve({
          errCode: 1,
          errMessage: "Miss Parameter!",
        });
      } else {
        let schedule = data.arrSchedule;
        if (schedule && schedule.length > 0) {
          schedule = schedule.map((item) => {
            // let dataTime = new Date(minutes * 60 * 1000);
            item.maxNumber = MAX_NUMBER_SCHEDULE;
            return item;
          });
        }
        let existing = await db.Schedule.findAll({
          where: { doctorId: data.doctorId, date: data.formatCurrDate },
          attributes: ["doctorId", "date", "timeType"],
          raw: true,
        });
        //do date laf kiểu string nên phải đổi thành kiểu số để differenceWith
        // a= '5', b=+a => b = 5 với đk a phải là chuổi string số
        const toCreate = _.differenceWith(schedule, existing, (a, b) => {
          return +a.date === +b.date && a.timeType === b.timeType;
        });
        if (toCreate && toCreate.length > 0) {
          await db.Schedule.bulkCreate(toCreate);
        }
        resolve({
          errCode: 0,
          message: "Oke!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
let getScheduleDoctorByDate = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId && !date) {
        resolve({
          errCode: 1,
          message: "Missing required parameter!",
        });
      } else {
        let data = await db.Schedule.findAll({
          where: { doctorId: doctorId, date: date },
          include: [
            {
              model: db.Allcode,
              as: "timeTypeData",
              attributes: ["valueEn", "valueVi"],
            },
          ],
          raw: false,
          nest: true,
        });
        if (!data) {
          data = [];
        }
        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
let getExtraInforDoctorById = (doctorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId) {
        resolve({
          errCode: 1,
          message: "Missing required parameter!",
        });
      } else {
        let extraInforDoctor = await db.Doctor_Infor.findOne({
          where: { doctorId: doctorId },

          attributes: {
            exclude: ["id", "doctorId"],
          },
          include: [
            {
              model: db.Allcode,
              as: "priceData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Allcode,
              as: "provinceData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Allcode,
              as: "paymentData",
              attributes: ["valueEn", "valueVi"],
            },
          ],

          raw: false,
          nest: true,
        });
        if (!extraInforDoctor) {
          data = {};
        }
        resolve({
          errCode: 0,
          data: extraInforDoctor,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
let getProfileDoctorById = (doctorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId) {
        resolve({
          errCode: 1,
          message: "Missing required parameter!",
        });
      } else {
        let doctor = await db.User.findOne({
          where: { id: doctorId },
          attributes: {
            exclude: ["password"],
          },
          include: [
            {
              model: db.Markdown,

              attributes: ["contentHTML", "contentMarkdown", "description"],
            },
            {
              model: db.Allcode,
              as: "positionData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Doctor_Infor,
              attributes: {
                exclude: ["id", "doctorId"],
              },
              include: [
                {
                  model: db.Allcode,
                  as: "priceData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.Allcode,
                  as: "provinceData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.Allcode,
                  as: "paymentData",
                  attributes: ["valueEn", "valueVi"],
                },
              ],
            },
          ],
          raw: false,
          nest: true,
        });

        if (doctor && doctor.image) {
          doctor.image = new Buffer(doctor.image, "base64").toString("binary");
        }
        if (!doctor) {
          resolve({
            errCode: 2,
            errMessage: "Doctor not exiting in the system!",
            data: {},
          });
        }
        resolve({
          errCode: 0,
          data: doctor,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  getTopDoctorHome,
  getAllDoctors,
  postSaveDetailInfoDoctor,
  getDetailDoctorById,
  bulkCreateSchedule,
  getScheduleDoctorByDate,
  getExtraInforDoctorById,
  getProfileDoctorById,
};
