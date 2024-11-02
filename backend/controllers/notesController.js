const Note = require('../model/Note');
const Tag = require('../model/Tag');

const getAllNotes = async (req, res) => {
  const notes = await Note.find().sort({ createdAt: -1 }).populate({
    path: 'tags',
    select: 'label',
  });
  if (!notes) return res.status(204).json({ message: 'No Note found' });
  res.json(notes);
};

const createNewNote = async (req, res) => {
  const { body, title, important, tags } = req.body;

  const tagObjects = await Promise.all(
    tags?.map(async (tag) => {
      let tagObj = await Tag.findOne({ label: tag.label });
      if (!tagObj) {
        tagObj = new Tag(tag);
        await tagObj.save();
      }
      return tagObj;
    })
  );

  if (!title || !body) {
    return res.status(400).json({ message: 'Title and body are required.' });
  }
  try {
    const result = await Note.create({
      title: title,
      body: body,
      important: important ? true : false,
      tags: tagObjects.map((tag) => tag._id),
    });

    res.status(201).json(result);
    await Promise.all(
      tagObjects.map(async (tagObj) => {
        tagObj.notes.push(result._id);
        await tagObj.save();
      })
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateNote = async (req, res) => {
  const { id, title, body, important, tags } = req.body;
  if (!id) {
    return res.status(400).json({ message: `ID parameter is required` });
  }
  try {
    const existingNote = await Note.findById(req.body.id).populate('tags');
    if (!existingNote) {
      return res.status(404).json({ message: 'Note not found' });
    }
    const oldTagIds = existingNote.tags.map((tag) => tag._id.toString());
    let newTagIds = [];
    let tagObjects;
    if (tags && Array.isArray(tags)) {
      tagObjects = await Promise.all(
        tags?.map(async (tag) => {
          let tagObj = await Tag.findOne({ label: tag.label });
          if (!tagObj) {
            tagObj = new Tag(tag);
            await tagObj.save();
          }
          if (!tagObj.notes.includes(existingNote._id)) {
            tagObj.notes.push(existingNote._id);
            await tagObj.save();
          }
          newTagIds.push(tagObj._id.toString());
          return tagObj;
        })
      );
    }
    const tagsToRemove = oldTagIds.filter(
      (tagId) => !newTagIds.includes(tagId)
    );
    await Promise.all(
      tagsToRemove.map(async (tagId) => {
        const tag = await Tag.findById(tagId);
        tag.notes = tag.notes.filter(
          (noteId) => noteId.toString() !== existingNote._id.toString()
        );
        if (tag.notes.length === 0) {
          await Tag.findByIdAndDelete(tagId);
        } else {
          await tag.save();
        }
      })
    );
    const note = await Note.findByIdAndUpdate(
      id,
      {
        title,
        body,
        important,
        tags: tagObjects.map((tag) => tag._id),
      },
      { new: true }
    );

    res.status(201).json(note);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteNote = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ message: `ID parameter is required` });
  }
  try {
    const note = await Note.findByIdAndDelete(req.body.id);

    // Check each tag to see if it's associated with any other notes
    if (note) {
      for (const tagId of note.tags) {
        const notesWithTag = await Note.find({ tags: tagId });
        if (notesWithTag.length === 0) {
          await Tag.findByIdAndDelete(tagId);
        }
      }
      res.status(204).send();
    }
  } catch (error) {
    return res
      .status(400)
      .json({ message: `NO note matches ID ${req.body.id}.` });
  }
};

const getNote = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ message: `ID parameter is required` });
  }
  const note = await Note.findById(req.params.id).populate('tags');
  if (!note) {
    return res
      .status(400)
      .json({ message: `NO note matches ID ${req.params.id}.` });
  }
  res.json(note);
};

module.exports = {
  getAllNotes,
  createNewNote,
  updateNote,
  deleteNote,
  getNote,
};
