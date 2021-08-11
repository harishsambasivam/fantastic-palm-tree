const db = require("../../db.connection");

const getUser = async (userId) => {
  let result,
    err = null;
  try {
    const response = await db.query("SELECT * FROM users");
    result = response.rows;
  } catch (e) {
    err = {
      message: e.message,
      code: e.code ? e.code : 500,
    };
  }
  return { result, err };
};

const addUser = async (userData) => {
  let result,
    err = null;
  const client = await db.getClient();
  try {
    const { email, hasFarm, location, password, status, username } = userData;
    const response = await client.query(
      "INSERT INTO users (email, hasFarm, location,password, status,username ) VALUES ($1,$2,$3,$4,$5,$6)",
      [email, hasFarm, location, password, status, username]
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
