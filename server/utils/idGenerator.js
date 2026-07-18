/**
 * Generates a readable, sequential ID for a given prefix.
 * Examples: ST001, INT001, APP001, CELL001
 *
 * @param {mongoose.Model} Model - The Mongoose model to count documents in
 * @param {string} prefix - The prefix for the ID (e.g. 'ST', 'INT', 'APP', 'CELL')
 * @param {string} field - The field name to query for the latest ID (e.g. 'studentId')
 * @returns {Promise<string>} The next sequential ID
 */
const generateId = async (Model, prefix, field) => {
  const count = await Model.countDocuments();
  const next = count + 1;
  return `${prefix}${String(next).padStart(3, '0')}`;
};

module.exports = { generateId };
