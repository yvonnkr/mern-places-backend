const getUsers = (req, res, next) => {
  res.status(200).json({ test: "users routes via controllers" });
};

module.exports = { getUsers };
