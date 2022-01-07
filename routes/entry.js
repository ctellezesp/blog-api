
const express = require('express');
const router = express.Router();
const Entry = require('../models/entry.schema');
const getUnixTime = require('date-fns/getUnixTime')

/**
 * Get All Entries
 */

router.get('/', async (req, res) => {
  try {
    let params = {};
    if(req.query.s) {
      const regexFilter = new RegExp(`${req.query.s}`, 'i');
      params = {
        $or: [
          { title: regexFilter }, 
          { author: regexFilter }, 
          { tags: [`${req.query.s}`] },
          { body: regexFilter }
        ]
      }
    }
    const entries = await Entry.find(params);
    if(entries.length) {
      res.status(200).json({
        entries
      });
    } else {
      res.status(404).json({
        message: 'Data not found'
      });
    }
  } catch (err) {
    res.status(400).json({
      message: JSON.stringify(err)
    });
  }
});

/**
 * Create entry
 */

router.post('/', async (req, res) => {
  try {
    const body = {
      ...req.body,
      date: getUnixTime(new Date())
    };
    const result = await Entry.create(body);
    if(result) {
      res.status(201).json({
        entry: result
      });
    } else {
      res.status(400).json({
        message: 'Cannot create, try again'
      });
    }
  } catch(err) {
    res.status(400).json({
      message: JSON.stringify(err)
    });
  }
});

/**
 * Get Entry
 */

router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const entry = await Entry.findById(id);
    if(entry) {
      res.status(200).json({
        entry
      });
    } else {
      res.status(404).json({
        message: 'Entry not found'
      });
    }
  } catch(err) {
    res.status(400).json({
      message: JSON.stringify(err)
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const body = {
      ...req.body,
      date: getUnixTime(new Date())
    };
    const updateEntry = await Entry.findByIdAndUpdate(id, body, {new: true});
    if(updateEntry) {
      res.status(200).json({
        entry: updateEntry
      });
    } else {
      res.status(400).json({
        message: 'Cannot update'
      })
    }
  } catch (err) {
    res.status(400).json({
      message: JSON.stringify(err)
    })
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deletedEntry = await Entry.findByIdAndRemove(id);
    if(deletedEntry) {
      res.status(200).json({
        entry: deletedEntry
      });
    } else {
      res.status(404).json({
        message: 'Not found'
      });
    }
  } catch (err) {
    res.status(400).json({
      message: JSON.stringify(err)
    });
  }
});

module.exports = router;