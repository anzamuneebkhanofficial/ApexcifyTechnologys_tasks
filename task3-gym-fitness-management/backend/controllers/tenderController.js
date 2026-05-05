import Tender from '../models/Tender.js';
export const getTenders = async (req, res) => {
  try {
    const tenders = await Tender.find().populate('createdBy', 'name role').sort({ createdAt: -1 });
    res.json(tenders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
export const createTender = async (req, res) => {
  try {
    const tender = await Tender.create({
      ...req.body,
      createdBy: req.user._id
    });
    res.status(201).json(tender);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
export const updateTender = async (req, res) => {
  try {
    const tender = await Tender.findById(req.params.id);
    if (!tender) return res.status(404).json({ message: 'Tender not found' });

    const updatedTender = await Tender.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTender);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
export const deleteTender = async (req, res) => {
  try {
    const tender = await Tender.findById(req.params.id);
    if (!tender) return res.status(404).json({ message: 'Tender not found' });

    await Tender.findByIdAndDelete(req.params.id);
    res.json({ message: 'Tender removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
