var express = require('express');
var mongojs = require('mongojs');
var bodyParser = require('body-parser');
const axios = require('axios');

var PORT = process.env.PORT || 3001;
var app = express();
app.use(bodyParser());

// Database configuration
var databaseUrl = process.env.MONGODB_URI || 'googlebooks_db';
var collections = ['books'];
// // Hook mongojs config to db variable
var db = mongojs(databaseUrl, collections);
// // Log any mongojs errors to console
db.on('error', function (error) {
    console.log('Database Error:', error);
});

app.post('/api/books', function (req, res) {
    console.log(req.body)
    axios.get(`https://www.googleapis.com/books/v1/volumes?q=${req.body.book}`)
        .then(function (response) {
            // handle success

            // for (let i = 0; i < response.data.items.length; i++) {
            //     const book = {
            //         title: response.data.items[i].volumeInfo.title
            //     }
            //     db.books.insert(book, function (err, result) {
            //         // handle err

            //         if (i === response.data.items.length - 1) {
            //             res.json({
            //                 success: true,
            //                 data: response.data
            //             })
            //         }
            //     })
            // }

            response.data.items.map((item, index, array) => {
                const book = {
                    title: item.volumeInfo.title
                }
                db.books.insert(book, function (err, result) {
                    // handle err

                    if (index === array.length - 1) {
                        res.json({
                            success: true,
                            data: response.data
                        })
                    }
                })

            })

        })
        .catch(function (error) {
            // handle error
            console.log(error);
            res.json({ success: false })
        })
        .finally(function () {
            // always executed
        });

})

app.listen(PORT, function () {
    console.log(`Listening on port ${PORT}`)
})