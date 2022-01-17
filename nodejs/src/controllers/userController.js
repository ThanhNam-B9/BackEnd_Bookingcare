import userService from "../services/userService";

let handleLogin = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  if (!email || !password) {
    return res.status(500).json({
      errCode: 1,
      message: "Missing iuputs parameter!",
    });
  }
  let userData = await userService.handleUserLogin(email, password);
  return res.status(200).json({
    errCode: userData.errCode,
    message: userData.message,
    user: userData.user ? userData.user : {},
  });
};

let handleGetAllUsers = async (req, res) => {
  let id = req.query.id; // All , userId
  if (!id) {
    return res.status(200).json({
      errCode: 1,
      message: "Missing required parameters !",
      users: [],
    });
  }
  let users = await userService.getAllUsers(id);
  return res.status(200).json({
    errCode: 0,
    message: "Ok",
    users: users,
  });
};

let handleCreateNewUser = async (req, res) => {
  let message = await userService.createNewUser(req.body);
  return res.status(200).json(message);
};
let handleEditUser = async (req, res) => {
  let message = await userService.editUser(req.body);
  return res.status(200).json(message);
};
let handleDeleteUser = async (req, res) => {
  let id = req.body.id;
  if (!id) {
    return res.status(500).json({
      errCode: 1,
      message: "Missing required parameters!",
    });
  }
  let message = await userService.deleteUser(id);
  return res.status(200).json(message);
};
let handleGetAllCode = async (req, res) => {
  try {
    let data = await userService.getAllCode(req.query.type);

    return res.status(200).json(data);
  } catch (e) {
    console.log("Get all codes error", e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};
module.exports = {
  handleLogin: handleLogin,
  handleGetAllUsers: handleGetAllUsers,
  handleCreateNewUser: handleCreateNewUser,
  handleEditUser: handleEditUser,
  handleDeleteUser: handleDeleteUser,
  handleGetAllCode: handleGetAllCode,
};
