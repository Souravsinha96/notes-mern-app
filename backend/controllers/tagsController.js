const Tag = require('../model/Tag');

const getAllTags = async (req, res) => {
  const tags = await Tag.find().populate({
    path: 'notes',
    select: 'title',
  });
  if (!tags) return res.status(204).json({ message: 'No Tag found' });
  res.json(tags);
};

const createNewTag = async (req, res) => {
  const { label } = req.body;
  if (!label) {
    return res.status(400).json({ message: 'label is required.' });
  }

  try {
    let tag = await Tag.findOne({ label });
    if (!tag) {
      tag = new Tag({ label });
      await tag.save();
      res.status(201).json(tag);
    } else {
      res.status(400).json({ message: 'Tag already exists' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTag = async (req, res) => {
  const { label, id } = req?.body;
  if (!req?.body?.id) {
    return res.status(400).json({ message: `ID parameter is required` });
  }
  const tag = await Tag.findByIdAndUpdate(id, { label }, { new: true });
  if (!tag) {
    return res.status(204).json({ message: `NO tag matches ID ${id}.` });
  }
  res.status(201).json(tag);
};

// const deleteTag = async (req, res) => {
//   if (!req?.body?.id) {
//     return res.status(400).json({ message: `ID parameter is required` });
//   }
//   try {
//     await Tag.findByIdAndDelete(req.body.id);
//     res.status(204).send();
//   } catch (error) {
//     res.status(400).json({ message: `NO tag matches ID ${req.body.id}.` });
//   }
// };
const deleteTags = async (req, res) => {
  if (!req?.body?.ids || !Array.isArray(req.body.ids)) {
    return res.status(400).json({ message: 'Array of tag IDs is required' });
  }

  try {
    await Tag.deleteMany({ _id: { $in: req.body.ids } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: `Failed to delete tags.`, error });
  }
};

module.exports = {
  getAllTags,
  createNewTag,
  updateTag,
  deleteTags,
};
