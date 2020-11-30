const express = require('express');

const Todo = require('../models/todos');
const { cloudinary } = require('../utils/cloudinary');

const router = express.Router();

//add new todo
router.post('/add', (req, res) => {
    const newTodo = new Todo({
        title: req.body.title,
        description: req.body.description,
        media: req.body.media ? req.body.media : '',
        target_date: req.body.target_date ? req.body.target_date : null,
        status: req.body.status ? req.body.status : '',
    });
    console.log(newTodo, "newTodo");
    newTodo.save().then(() => {
        return res.status(200).json({
            success: true
        })
    }).catch(err => {
        console.log(err);
        return res.status(400).json(err)
    })

});

// upload file or image
router.post('/api/upload', async (req, res) => {
    try {
        const fileStr = req.body.data;
        const uploadResponse = await cloudinary.uploader.upload_large(fileStr, {
            upload_preset: 'ml_default',
        });
        console.log(uploadResponse);
        return res.status(200).json({
            success: true,
            link: uploadResponse.secure_url,
        });
    } catch (err) {
        console.error(err, "here");
        return res.status(500).json({ err: 'File too large' });
    }
});

router.get('/get', (req, res) => {
    Todo.find({}).then(todos => {
        return res.status(200).json({
            todos
        })
    })
})

// update todos
router.post('/update', (req, res) => {
    Todo.findOneAndUpdate({ _id: req.body.id }, {
        title: req.body.title,
        description: req.body.description,
        media: req.body.media,
        target_date: req.body.target_date,
        status: req.body.status,

    }, { new: true }).then((todo) => {
        return res.status(200).json({
            success: true,
            todo
        })
    }).catch((err) => {
        console.log(err);
    })
})

// delete todo
router.post('/delete', async (req, res) => {
    const todoIds = req.body.todoList;
    let dbQueries = todoIds.map(todoId => {
        return new Promise((resolve, reject) => {
            Todo.findByIdAndDelete(todoId)
                .then((dbResponse) => {
                    if (dbResponse) {
                        // console.log(dbResponse)
                        return resolve({ [todoId]: true })
                    } else {
                        // console.log('in else')
                        return reject({ [todoId]: 'id not found' })
                    }
                })
                .catch((err) => {
                    // console.log(err)
                    return reject(err)
                })
        })
    });
    Promise.all(dbQueries)
        .then(() => {
            return res.status(200).json({
                success: true,
            })
        }).catch((err) => {
            // console.log('promise all err')
            console.log(err)
            return res.status(400).json({
                success: false,
                message: err
            })
        })
})

module.exports = router;
