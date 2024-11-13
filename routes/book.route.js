import express from 'express';
import { getAllBooks, getBookById, createBook, deleteBookById } from '../controllers/book.controller.js';
import multer from 'multer';

const router = express.Router();

// Set up multer for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Ensure this path exists
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    }
});




// Route to fetch all books
router.get('/', getAllBooks);

// Route to fetch a book by ID
router.get('/:id', getBookById);

// Route to create a new book with image upload
router.post('/', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    res.status(200).json({ message: 'File uploaded successfully', file: req.file });
});


// Route to delete a book by ID
router.delete('/:id', deleteBookById);

export default router;