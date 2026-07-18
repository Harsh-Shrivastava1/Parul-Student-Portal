const { aggregateEntity } = require('../services/compatibility/aggregator');

const asString = (value) => (value === null || value === undefined ? '' : String(value).trim());

const getAdvertisements = async (req, res, next) => {
  try {
    const data = await aggregateEntity('advertisements');
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const getCertificates = async (req, res, next) => {
  try {
    const data = await aggregateEntity('certificates');
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const getReports = async (req, res, next) => {
  try {
    const data = await aggregateEntity('reports');
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const searchAll = async (req, res, next) => {
  try {
    const { q = '', entity = 'internships' } = req.query;
    const rows = await aggregateEntity(String(entity));
    const term = asString(q).toLowerCase();

    const data = term
      ? rows.filter((row) =>
          Object.values(row).some((value) =>
            asString(Array.isArray(value) ? value.join(' ') : value).toLowerCase().includes(term)
          )
        )
      : rows;

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const getRecentActivity = async (req, res, next) => {
  try {
    const limit = Math.max(1, Number(req.query.limit || 20));
    const [internships, applications, notifications] = await Promise.all([
      aggregateEntity('internships'),
      aggregateEntity('applications'),
      aggregateEntity('notifications'),
    ]);

    const activity = [
      ...internships.map((item) => ({
        entity: 'internship',
        id: item.id || item.internshipId,
        title: item.internshipTitle,
        createdAt: item.createdAt,
        sourceCollection: item.sourceCollection,
      })),
      ...applications.map((item) => ({
        entity: 'application',
        id: item.id || item.applicationId,
        title: `Application ${item.applicationId || item.id}`,
        createdAt: item.appliedDate || item.createdAt,
        sourceCollection: item.sourceCollection,
      })),
      ...notifications.map((item) => ({
        entity: 'notification',
        id: item.id || item.notificationId,
        title: item.title,
        createdAt: item.date || item.createdAt,
        sourceCollection: item.sourceCollection,
      })),
    ]
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, limit);

    res.json({ success: true, data: activity });
  } catch (err) {
    next(err);
  }
};

const getRecommendedOpportunities = async (req, res, next) => {
  try {
    const limit = Math.max(1, Number(req.query.limit || 10));
    const internships = await aggregateEntity('internships');
    const data = internships
      .filter((item) => !['closed', 'archived', 'deleted'].includes(asString(item.status).toLowerCase()))
      .slice(0, limit);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const getDashboardStats = async (req, res, next) => {
  try {
    const { userId } = req.query;
    const [internships, applications, notifications, trainings, attendance, feedbacks] = await Promise.all([
      aggregateEntity('internships'),
      aggregateEntity('applications'),
      aggregateEntity('notifications'),
      aggregateEntity('trainings'),
      aggregateEntity('attendance'),
      aggregateEntity('feedbacks'),
    ]);

    const availableInternships = internships.filter((item) => !['closed', 'archived', 'deleted'].includes(asString(item.status).toLowerCase()));
    const userApplications = userId ? applications.filter((item) => asString(item.userId) === asString(userId)) : applications;
    const userNotifications = userId ? notifications.filter((item) => asString(item.userId) === asString(userId)) : notifications;

    const data = {
      counts: {
        internships: internships.length,
        availableInternships: availableInternships.length,
        applications: applications.length,
        notifications: notifications.length,
        trainings: trainings.length,
        attendance: attendance.length,
        feedbacks: feedbacks.length,
      },
      user: {
        applications: userApplications.length,
        unreadNotifications: userNotifications.filter((n) => !n.read).length,
      },
      recentActivity: [
        ...internships.slice(0, 5).map((x) => ({ type: 'internship', id: x.id || x.internshipId, title: x.internshipTitle, at: x.createdAt })),
        ...applications.slice(0, 5).map((x) => ({ type: 'application', id: x.id || x.applicationId, title: x.applicationId || x.id, at: x.appliedDate || x.createdAt })),
        ...notifications.slice(0, 5).map((x) => ({ type: 'notification', id: x.id || x.notificationId, title: x.title, at: x.date || x.createdAt })),
      ]
        .sort((a, b) => new Date(b.at || 0).getTime() - new Date(a.at || 0).getTime())
        .slice(0, 10),
      recommendedOpportunities: availableInternships.slice(0, 5),
      latestInternships: internships.slice(0, 5),
    };

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAdvertisements,
  getCertificates,
  getReports,
  searchAll,
  getRecentActivity,
  getRecommendedOpportunities,
  getDashboardStats,
};
