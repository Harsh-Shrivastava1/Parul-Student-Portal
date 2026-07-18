const { aggregateEntity, aggregateSingleById } = require('./compatibility/aggregator');

function asString(value, fallback = '') {
  if (value === null || value === undefined) return fallback;
  return String(value).trim();
}

function matchesSearch(dto, q) {
  if (!q) return true;
  const term = q.toLowerCase();
  return [
    dto.internshipTitle,
    dto.companyDepartment,
    dto.mentorName,
    dto.description,
  ].some((value) => asString(value).toLowerCase().includes(term));
}

async function getAllInternships(q) {
  const internships = await aggregateEntity('internships');
  return internships.filter((item) => matchesSearch(item, q));
}

async function getInternshipById(id) {
  return aggregateSingleById('internships', id, ['internshipId', 'id', '_id']);
}

module.exports = {
  getAllInternships,
  getInternshipById,
};
