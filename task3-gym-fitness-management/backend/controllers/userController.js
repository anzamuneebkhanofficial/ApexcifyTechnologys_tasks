import User from '../models/User.js';
export const getMembers = async (req, res) => {
  try {
    const { all } = req.query;
    let query = { role: 'Member' };

    if (req.user.role === 'Trainer' && all !== 'true') {
      const assignedMembers = await User.find({ role: 'Member', assignedTrainer: req.user._id }).populate('assignedTrainer', 'name email');
      if (assignedMembers.length > 0) {
        return res.json(assignedMembers);
      }
    }

    const members = await User.find(query).populate('assignedTrainer', 'name email');
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
export const getTrainers = async (req, res) => {
  try {
    const trainers = await User.find({ role: 'Trainer' });
    res.json(trainers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.role = req.body.role || user.role;
      user.isActive = req.body.isActive !== undefined ? req.body.isActive : user.isActive;
      user.assignedTrainer = req.body.assignedTrainer || user.assignedTrainer;

      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
