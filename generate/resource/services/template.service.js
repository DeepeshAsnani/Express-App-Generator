const logger = require("../config/logger");

const create = async (payload) => {
  const newRecord = new modelName(payload);
  return await newRecord.save();
};

const find = async (id) => {
  return await modeleName.findById(id);
};

const findAll = async (query) => {
  return await modelName.find();
};

const update = async (id, payload) => {
  return await modelName.findByIdAndUpdate(
    id,
    { $set: payload },
    { new: true }
  );
};

const remove = async (id) => {
  return await modelName.findByIdAndDelete(id);
};

module.exports = {
  create,
  find,
  findAll,
  update,
  remove,
};
