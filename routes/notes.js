const express = require('express');
const Router = express.Router();
var fetchUser = require('../middleware/fetchUser');
const { body, validationResult } = require('express-validator');
const { route } = require('./auth');
const Note = require('../models/Note');
const router = require('./auth');

//ROUTE::1 Get All Notes of a logged in user using GET Request ---> LOGIN REQUIRED
router.get('/allnotes', fetchUser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes)

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }

})

//ROUTE::2 Add a new Note using POST Request "/notes/addnote" ---> LOGIN REQUIRED
router.post('/addnote', fetchUser, [
    body('title', "Enter atleast 1 Character in Title to save the Note").isLength({ min: 1 }),
    body('description', "Enter atleast 1 Characters in Description to save the Note").isLength({ min: 1 })], async (req, res) => {
        try {


            const { title, description, tag } = req.body;
            //if there are errors give invalid Error
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const note = new Note({
                title, description, tag, user: req.user.id
            })
            const SavedNote = await note.save();

            res.json(SavedNote)
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error");
        }
    })

//ROUTE::3 Update an existing Note of a logged in user using PUT Request "/notes/updatenote/:id" ---> LOGIN REQUIRED
router.put('/updatenote/:id', fetchUser, async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        //CREATE A New Note Object
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        //Find the Note to be Updated and Update it..
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Banau Tej 🤬??? You're Not Allowed Sudhar Jaa meri jaan")
        }

        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

//ROUTE::4 Deleting Note of a logged in user using DELETE Request "/notes/deletenote/:id" ---> LOGIN REQUIRED
router.delete('/deletenote/:id', fetchUser, async (req, res) => {
    try {
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Banau Tej 🤬??? You're Not Allowed Sudhar Jaa meri jaan")
        }

        note = await Note.findByIdAndDelete(req.params.id, note)
        res.json({ "Success": "Note has been deleted.." });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})


module.exports = router;