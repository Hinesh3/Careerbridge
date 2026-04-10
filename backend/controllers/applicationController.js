const Application = require('../models/Application');
const Job = require('../models/Job');

// @desc    Apply for a job
// @route   POST /api/applications/apply
const applyForJob = async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;

    if (!jobId) return res.status(400).json({ message: 'Job ID is required' });

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const existing = await Application.findOne({ userId: req.user._id, jobId });
    if (existing) return res.status(400).json({ message: 'You have already applied for this job' });

    const application = await Application.create({
      userId: req.user._id,
      jobId,
      coverLetter: coverLetter || '',
      status: 'Pending'
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user's applications
// @route   GET /api/applications/user
const getUserApplications = async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user._id })
      .populate('jobId', 'title companyName location type')
      .sort({ createdAt: -1 });

    // Filter out entries where the job no longer exists
    const valid = applications.filter(a => a.jobId !== null);
    res.json(valid);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all applications (admin)
// @route   GET /api/applications/all
const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('userId', 'name email role')
      .populate('jobId', 'title companyName location type')
      .sort({ createdAt: -1 });

    // Filter out entries where the job or user no longer exists
    const valid = applications.filter(a => a.jobId !== null && a.userId !== null);
    res.json(valid);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update application status (admin)
// @route   PUT /api/applications/status
const updateStatus = async (req, res) => {
  try {
    const { applicationId, status } = req.body;

    const validStatuses = ['Pending', 'Under Review', 'Hired', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const application = await Application.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true }
    ).populate('userId', 'name email').populate('jobId', 'title companyName');

    if (!application) return res.status(404).json({ message: 'Application not found' });

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { applyForJob, getUserApplications, getAllApplications, updateStatus };
