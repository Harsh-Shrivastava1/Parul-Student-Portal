const crypto = require('crypto');
const mongoose = require('mongoose');
const { ENTITY_CONFIG } = require('./entityConfig');

const ACTIVE_STATUSES = new Set(['published', 'open', 'active', 'ongoing', 'scheduled', 'pending', 'under review', 'shortlisted']);
const INACTIVE_STATUSES = new Set(['archived', 'deleted']);

function asString(value, fallback = '') {
  if (value === null || value === undefined) return fallback;
  return String(value).trim();
}

function normalizeDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date;
}

function normalizeEntity(entity, doc, sourceCollection) {
  const normalized = { ...doc, sourceCollection };

  if (entity === 'internships' || entity === 'advertisements') {
    normalized.internshipId = asString(doc.internshipId || doc.id || doc._id);
    normalized.id = normalized.internshipId;
    normalized.internshipTitle = asString(doc.internshipTitle || doc.title || doc.jobTitle);
    normalized.companyDepartment = asString(doc.companyDepartment || doc.department || doc.company || doc.organization || doc.companyName);
    normalized.duration = asString(doc.duration);
    normalized.mentorName = asString(doc.mentorName || doc.createdByName || doc.contactPerson);
    normalized.status = asString(doc.status || 'Published') || 'Published';
    normalized.description = asString(doc.description);
    normalized.requirements = Array.isArray(doc.requirements)
      ? doc.requirements
      : Array.isArray(doc.requiredSkills)
        ? doc.requiredSkills
        : asString(doc.requirements)
          ? [asString(doc.requirements)]
          : [];
    normalized.location = asString(doc.location || doc.venue);
    normalized.stipend = doc.stipend ?? null;
    normalized.deadline = doc.deadline || doc.applicationDeadline || null;
    normalized.vacancy = Number.isFinite(Number(doc.vacancy)) ? Number(doc.vacancy) : 0;
    normalized.interviewDate = doc.interviewDate || null;
    normalized.interviewTime = asString(doc.interviewTime);
    normalized.venue = asString(doc.venue || doc.location);
    normalized.createdAt = doc.createdAt || doc.created_on || doc.date || null;
    normalized.updatedAt = doc.updatedAt || doc.modifiedAt || null;
    normalized.isDeleted = doc.isDeleted === true;
    return normalized;
  }

  if (entity === 'notifications') {
    normalized.notificationId = asString(doc.notificationId || doc.id || doc._id);
    normalized.id = normalized.notificationId;
    normalized.title = asString(doc.title || doc.subject);
    normalized.message = asString(doc.message || doc.body || doc.text);
    normalized.date = doc.date || doc.createdAt || doc.created_on || null;
    normalized.read = Boolean(doc.read || doc.isRead);
    normalized.type = asString(doc.type || doc.level || 'info') || 'info';
    normalized.userId = asString(doc.userId || doc.studentId || doc.targetUserId);
    normalized.link = asString(doc.link || doc.url);
    normalized.status = asString(doc.status || 'active') || 'active';
    normalized.createdAt = doc.createdAt || doc.date || null;
    normalized.updatedAt = doc.updatedAt || null;
    normalized.isDeleted = doc.isDeleted === true;
    return normalized;
  }

  if (entity === 'applications') {
    normalized.applicationId = asString(doc.applicationId || doc.id || doc._id);
    normalized.id = normalized.applicationId;
    normalized.internshipId = asString(doc.internshipId || doc.postId);
    normalized.userId = asString(doc.userId || doc.studentId || doc.enrollmentNumber);
    normalized.studentId = asString(doc.studentId || doc.userId);
    normalized.assignedCellId = asString(doc.assignedCellId || doc.cellId);
    normalized.applicationStatus = asString(doc.applicationStatus || doc.status || 'Pending') || 'Pending';
    normalized.appliedDate = doc.appliedDate || doc.createdAt || doc.date || null;
    normalized.internshipSnapshot = doc.internshipSnapshot || {
      internshipTitle: asString(doc.internshipTitle || doc.title),
      companyDepartment: asString(doc.companyDepartment || doc.department),
    };
    normalized.timeline = Array.isArray(doc.timeline) ? doc.timeline : [];
    normalized.formData = doc.formData || {};
    normalized.status = normalized.applicationStatus;
    normalized.createdAt = doc.createdAt || doc.appliedDate || null;
    normalized.updatedAt = doc.updatedAt || null;
    normalized.isDeleted = doc.isDeleted === true;
    return normalized;
  }

  if (entity === 'trainings') {
    normalized.trainingId = asString(doc.trainingId || doc.id || doc._id);
    normalized.id = normalized.trainingId;
    normalized.applicationId = asString(doc.applicationId);
    normalized.studentId = asString(doc.studentId);
    normalized.internshipId = asString(doc.internshipId);
    normalized.assignedCellId = asString(doc.assignedCellId || doc.cellId);
    normalized.startDate = doc.startDate || null;
    normalized.endDate = doc.endDate || null;
    normalized.status = asString(doc.status || 'Scheduled') || 'Scheduled';
    normalized.createdAt = doc.createdAt || null;
    normalized.updatedAt = doc.updatedAt || null;
    normalized.isDeleted = doc.isDeleted === true;
    return normalized;
  }

  if (entity === 'attendance') {
    normalized.attendanceId = asString(doc.attendanceId || doc.id || doc._id);
    normalized.id = normalized.attendanceId;
    normalized.trainingId = asString(doc.trainingId);
    normalized.studentId = asString(doc.studentId);
    normalized.assignedCellId = asString(doc.assignedCellId || doc.cellId);
    normalized.date = doc.date || null;
    normalized.status = asString(doc.status || 'Present') || 'Present';
    normalized.remarks = asString(doc.remarks);
    normalized.createdAt = doc.createdAt || doc.date || null;
    normalized.updatedAt = doc.updatedAt || null;
    normalized.isDeleted = doc.isDeleted === true;
    return normalized;
  }

  if (entity === 'feedbacks') {
    normalized.feedbackId = asString(doc.feedbackId || doc.id || doc._id);
    normalized.id = normalized.feedbackId;
    normalized.applicationId = asString(doc.applicationId);
    normalized.studentId = asString(doc.studentId);
    normalized.internshipId = asString(doc.internshipId);
    normalized.assignedCellId = asString(doc.assignedCellId || doc.cellId);
    normalized.rating = doc.rating ?? null;
    normalized.comments = asString(doc.comments || doc.feedbackText);
    normalized.submittedAt = doc.submittedAt || doc.createdAt || null;
    normalized.status = asString(doc.status || 'active') || 'active';
    normalized.createdAt = doc.createdAt || doc.submittedAt || null;
    normalized.updatedAt = doc.updatedAt || null;
    normalized.isDeleted = doc.isDeleted === true;
    return normalized;
  }

  if (entity === 'students') {
    normalized.studentId = asString(doc.studentId || doc.id || doc._id);
    normalized.id = normalized.studentId;
    normalized.studentName = asString(doc.studentName || doc.name);
    normalized.enrollmentNumber = asString(doc.enrollmentNumber || doc.userId);
    normalized.email = asString(doc.email);
    normalized.department = asString(doc.department);
    normalized.semester = Number(doc.semester ?? 0) || 0;
    normalized.contactNumber = asString(doc.contactNumber || doc.contact || doc.phone);
    normalized.createdAt = doc.createdAt || null;
    normalized.updatedAt = doc.updatedAt || null;
    normalized.status = asString(doc.status || 'active') || 'active';
    normalized.isDeleted = doc.isDeleted === true;
    return normalized;
  }

  return normalized;
}

function buildFallbackKey(doc, businessFields) {
  const raw = businessFields.map((field) => asString(doc[field]).toLowerCase()).join('|');
  return crypto.createHash('sha1').update(raw).digest('hex');
}

function scoreRecord(doc) {
  const status = asString(doc.status || doc.applicationStatus).toLowerCase();
  let score = 0;
  if (ACTIVE_STATUSES.has(status)) score += 200;
  if (INACTIVE_STATUSES.has(status)) score -= 200;
  if (doc.isDeleted === true) score -= 500;
  const completeness = Object.values(doc).reduce((acc, value) => {
    if (value === null || value === undefined) return acc;
    if (typeof value === 'string' && !value.trim()) return acc;
    if (Array.isArray(value) && value.length === 0) return acc;
    return acc + 1;
  }, 0);
  score += completeness;
  const updatedTs = normalizeDate(doc.updatedAt || doc.createdAt || doc.date || doc.appliedDate || doc.submittedAt)?.getTime() || 0;
  score += Math.floor(updatedTs / 1000);
  return score;
}

function shouldExclude(doc) {
  const status = asString(doc.status || doc.applicationStatus).toLowerCase();
  if (doc.isDeleted === true) return true;
  return INACTIVE_STATUSES.has(status);
}

async function fetchCollection(db, name) {
  const exists = await db.listCollections({ name }).hasNext();
  if (!exists) return null;
  const docs = await db.collection(name).find({}).toArray();
  return docs;
}

async function aggregateEntity(entity, options = {}) {
  const config = ENTITY_CONFIG[entity];
  if (!config) {
    throw new Error(`No compatibility config found for entity: ${entity}`);
  }

  const db = mongoose.connection.db;
  if (!db) {
    throw new Error('MongoDB connection is not initialized');
  }

  const candidateCollections = config.collections;
  const collectionsResult = await Promise.all(
    candidateCollections.map(async (name) => ({ name, docs: await fetchCollection(db, name) }))
  );

  const availableCollections = collectionsResult.filter((item) => Array.isArray(item.docs));
  if (availableCollections.length > 1) {
    console.warn(`[compat] Multiple collections detected for ${entity}: ${availableCollections.map((c) => c.name).join(', ')}`);
  }

  const normalized = [];
  for (const source of availableCollections) {
    const docs = source.docs || [];
    for (const doc of docs) {
      const mapped = normalizeEntity(entity, doc, source.name);
      if (options.filterFn && !options.filterFn(mapped)) continue;
      normalized.push(mapped);
    }
  }

  const deduped = new Map();
  for (const doc of normalized) {
    const idKey = config.idFields.map((field) => asString(doc[field])).find(Boolean);
    const key = idKey || buildFallbackKey(doc, config.businessFields);
    const existing = deduped.get(key);
    if (!existing) {
      deduped.set(key, doc);
      continue;
    }
    if (scoreRecord(doc) >= scoreRecord(existing)) {
      deduped.set(key, doc);
    }
  }

  const merged = [...deduped.values()]
    .filter((doc) => !shouldExclude(doc))
    .sort((a, b) => {
      const aTs = normalizeDate(a.updatedAt || a.createdAt || a.date || a.appliedDate || a.submittedAt)?.getTime() || 0;
      const bTs = normalizeDate(b.updatedAt || b.createdAt || b.date || b.appliedDate || b.submittedAt)?.getTime() || 0;
      return bTs - aTs;
    });

  return merged;
}

async function aggregateSingleById(entity, id, idFields = []) {
  const rows = await aggregateEntity(entity);
  const fields = idFields.length ? idFields : (ENTITY_CONFIG[entity]?.idFields || []);
  const match = rows.find((row) => fields.some((field) => asString(row[field]) === asString(id)));
  return match || null;
}

module.exports = {
  aggregateEntity,
  aggregateSingleById,
};
