const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc    Get all jobs
// @route   GET /api/jobs
const getJobs = async (req, res) => {
  try {
    const { location, type, search } = req.query;
    const filter = { isActive: true };

    if (location) filter.location = { $regex: location, $options: 'i' };
    if (type && type !== 'All') filter.type = type;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } }
      ];
    }

    const jobs = await Job.find(filter).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create job (admin only)
// @route   POST /api/jobs
const createJob = async (req, res) => {
  try {
    const { title, companyName, description, location, type, salary, requirements } = req.body;

    if (!title || !companyName || !description || !location || !type) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }

    const job = await Job.create({
      title,
      companyName,
      description,
      location,
      type,
      salary,
      requirements: requirements || [],
      postedBy: req.user._id
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update job (admin only)
// @route   PUT /api/jobs/:id
const updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete job (admin only)
// @route   DELETE /api/jobs/:id
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    // Cascade: remove all applications for this job
    await Application.deleteMany({ jobId: req.params.id });
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getJobs, getJobById, createJob, updateJob, deleteJob };
