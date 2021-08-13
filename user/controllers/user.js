const db = require("../../db.connection");

const getUser = async (userId) => {
  let result,
    err = null;
  try {
    const response = await db.query('SELECT * FROM public."Users"');
    result = response.rows;
  } catch (e) {
    err = {
      message: e.message,
      code: e.code ? e.code : 500,
    };
  }
  return { result, err };
};

const validateUserData = (userData) => {
  const date = Date.now();
  userData["createdAt"] = userData?.createdAt ? userData.createdAt : date;
  userData["updatedAt"] = date;
  return userData;
};

const addUser = async (userData) => {
  let result,
    err = null;
  const client = await db.getClient();
  try {
    console.log(userData);
    const {
      firstName,
      lastName,
      userName,
      bio,
      avatar,
      dob,
      website,
      location,
      email,
      phone,
      category,
      gender,
      verifiedUser,
      createdAt,
      updatedAt,
    } = validateUserData(userData);
    const response = await client.query(
      'INSERT INTO public."Users" (firstName,lastName,userName, bio,avatar, dob,website, location, email,phone, category,gender, verifiedUser,createdAt, updatedAt) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)',
      [
        firstName,
        lastName,
        userName,
        bio,
        avatar,
        dob,
        website,
        location,
        email,
        phone,
        category,
        gender,
        verifiedUser,
        createdAt,
        updatedAt,
      ]
    );
    if (response.rowCount === 1) {
      result = "success";
    } else {
      throw {
        message: "Internal server error",
        code: 500,
      };
    }
  } catch (e) {
    err = {
      message: e.message,
      code: e.code ? e.code : 500,
    };
  } finally {
    client.release();
  }
  return { result, err };
};

module.exports = {
  getUser,
  addUser,
};
