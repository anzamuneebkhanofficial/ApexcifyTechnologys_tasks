import Plan from '../models/Plan.js';
export const getMyPlans = async (req, res) => {
  try {
    const plans = await Plan.find({ assignedTo: req.user._id })
      .populate('assignedBy', 'name role')
      .sort({ createdAt: -1 });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
export const getAllPlans = async (req, res) => {
  try {
    const query = {};
    if (req.user.role === 'Trainer') {
      query.assignedBy = req.user._id;
    }
    const plans = await Plan.find(query)
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name role')
      .sort({ createdAt: -1 });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
export const createPlan = async (req, res) => {
  try {
    const { title, type, description, assignedTo } = req.body;

    if (!req.file && !description) {
      return res.status(400).json({ message: 'Please provide either a file or a description' });
    }

    const plan = await Plan.create({
      title,
      type,
      description,
      assignedTo,
      assignedBy: req.user._id,
      fileUrl: req.file ? `/uploads/${req.file.filename}` : ''
    });

    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
export const updatePlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    if (req.user.role !== 'Admin' && plan.assignedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this plan' });
    }

    const { title, type, description, assignedTo } = req.body;

    if (title) plan.title = title;
    if (type) plan.type = type;
    if (description) plan.description = description;
    if (assignedTo) plan.assignedTo = assignedTo;

    if (req.file) {
      plan.fileUrl = `/uploads/${req.file.filename}`;
    }

    const updatedPlan = await plan.save();
    res.json(updatedPlan);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
export const deletePlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    if (req.user.role !== 'Admin' && plan.assignedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this plan' });
    }

    await Plan.findByIdAndDelete(req.params.id);
    res.json({ message: 'Plan removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
