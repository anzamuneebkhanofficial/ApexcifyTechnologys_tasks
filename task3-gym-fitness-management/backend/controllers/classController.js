import Class from '../models/Class.js';
export const getClasses = async (req, res) => {
  try {
    const classes = await Class.find().populate('trainer', 'name').sort({ scheduleTime: 1 });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
export const createClass = async (req, res) => {
  try {
    const newClass = await Class.create({
      title: req.body.title,
      description: req.body.description,
      trainer: req.body.trainer || req.user._id,
      scheduleTime: req.body.scheduleTime,
      durationMinutes: req.body.durationMinutes,
      capacity: req.body.capacity
    });
    res.status(201).json(newClass);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
export const enrollClass = async (req, res) => {
  try {
    const gymClass = await Class.findById(req.params.id);

    if (!gymClass) {
      return res.status(404).json({ message: 'Class not found' });
    }

    if (gymClass.enrolledMembers.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already enrolled' });
    }

    if (gymClass.enrolledMembers.length >= gymClass.capacity) {
      return res.status(400).json({ message: 'Class is full' });
    }

    gymClass.enrolledMembers.push(req.user._id);
    await gymClass.save();

    res.json({ message: 'Enrolled successfully', class: gymClass });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
export const updateClass = async (req, res) => {
  try {
    const gymClass = await Class.findById(req.params.id);
    if (!gymClass) return res.status(404).json({ message: 'Class not found' });
    if (req.user.role !== 'Admin' && gymClass.trainer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this class' });
    }

    const updatedClass = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedClass);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
export const deleteClass = async (req, res) => {
  try {
    const gymClass = await Class.findById(req.params.id);
    if (!gymClass) return res.status(404).json({ message: 'Class not found' });
    if (req.user.role !== 'Admin' && gymClass.trainer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this class' });
    }

    await Class.findByIdAndDelete(req.params.id);
    res.json({ message: 'Class removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
