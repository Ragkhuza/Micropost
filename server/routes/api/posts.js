const express = require('express');
const mongodb = require('mongodb');

const router = express.Router();

// Get Posts
router.get('/', async (req, res) => {
    const posts = await loadPostsCollection();
    res.send(await posts.find({}).toArray());
});

// Add Posts
router.post('/', async (req, res) => {
    const posts = await loadPostsCollection();
    await posts.insertOne({
        text: req.body.text,
        createdAt: new Date(),
    });

    res.status(201).send();
});

// Delete Posts
router.delete('/:id', async (req, res) => {
    const posts = await loadPostsCollection();
    await posts.deleteOne({_id: mongodb.ObjectID(req.params.id)});
    res.status(200).send();
});

async function loadPostsCollection() {
    let dburl = 'mongodb://127.0.0.1:27017';
    if (process.env.NODE_ENV === 'production') {
        console.log('[PRODUCTION] changing database! Line 33 in server/routes/api/posts.js');
        dburl = 'mongodb://testuser:test123@ds147044.mlab.com:47044/micropost';
    }
    const client = await mongodb.MongoClient.connect(dburl, {
        useNewUrlParser: true
    });

    return client.db('micropost').collection('posts');
}

module.exports = router;