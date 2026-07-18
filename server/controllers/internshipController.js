const internshipService = require('../services/internshipService');

// GET /api/internships?q=searchTerm
const getAllInternships = async (req, res, next) => {
  try {
    const { q } = req.query;
    const internships = await internshipService.getAllInternships(q || '');
    res.json({ success: true, data: internships });
  } catch (err) {
    next(err);
  }
};

// GET /api/internships/:id
const getInternshipById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const internship = await internshipService.getInternshipById(id);
    if (!internship) {
      return res.status(404).json({ success: false, error: 'Internship not found' });
    }
    res.json({ success: true, data: internship });
  } catch (err) {
    next(err);
  }
};

const mongoose = require('mongoose');
const { ENTITY_CONFIG } = require('../services/compatibility/entityConfig');

const getDebugCounts = async (req, res, next) => {
  try {
    const db = mongoose.connection.db;
    const result = { collections: {} };
    for (const c of ENTITY_CONFIG.internships.collections) {
      const exists = await db.listCollections({ name: c }).hasNext();
      result.collections[c] = exists ? await db.collection(c).countDocuments() : 0;
      
      if (exists) {
        const docs = await db.collection(c).find({}).toArray();
        let excluded = 0;
        docs.forEach(doc => {
          const status = String(doc.status || doc.applicationStatus || '').toLowerCase();
          if (doc.isDeleted === true || status === 'archived' || status === 'deleted') excluded++;
        });
        result.collections[`${c}_excluded`] = excluded;
      }
    }
    const all = await internshipService.getAllInternships('');
    result.aggregatedTotal = all.length;
    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllInternships, getInternshipById, getDebugCounts };
