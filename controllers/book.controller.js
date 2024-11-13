import { Book } from "../model/book.Schema.js";

// Fetch all books
export const getAllBooks = async (req, res) => {
    try {
        const books = await Book.find();

        if (books.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No books found',
                data: []
            });
        }

        res.json({
            success: true,
            message: 'Books fetched successfully',
            data: books
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error fetching books',
            error: err.message
        });
    }
};

// Fetch a book by ID
export const getBookById = async (req, res) => {
    const bookId = req.params.id;

    try {
        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid book ID'
            });
        }

        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: `Book with ID ${bookId} not found`
            });
        }

        res.json({
            success: true,
            message: `Book with ID ${bookId} fetched successfully`,
            data: book
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error fetching book details',
            error: err.message
        });
    }
};

// Create book route with image upload
export const createBook = async (req, res) => {
    const { title, author, price, description } = req.body;
    console.log(req.file);

    // Validation: Ensure all required fields are present
    if (!title || !author || !price || !description || !req.file) {
        // Construct an array of missing fields
        const missingFields = [];
        if (!title) missingFields.push('title');
        if (!author) missingFields.push('author');
        if (!price) missingFields.push('price');
        if (!description) missingFields.push('description');
        if (!req.file) missingFields.push('image');

        return res.status(400).json({
            success: false,
            message: `Missing required fields: ${missingFields.join(', ')}`
        });
    }

    // Validate price
    if (isNaN(price) || parseFloat(price) <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Price must be a positive number.'
        });
    }

    try {
        // Use the file information from multer (file saved by multer)
        const imagePath = `uploads/${req.file.filename}`;

        // Create a new book instance
        const newBook = new Book({
            title,
            author,
            price: parseFloat(price),
            description,
            image: imagePath
        });

        // Save the book to the database
        const savedBook = await newBook.save();

        // Respond with success and book details
        res.status(201).json({
            success: true,
            message: 'Book created successfully.',
            book: savedBook
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error creating book',
            error: err.message
        });
    }
};


export const deleteBookById = async (req, res) => {
    const { id } = req.params; // Get the book ID from the request parameters

    try {
        // Try to find and delete the book by ID
        const deletedBook = await Book.findByIdAndDelete(id);
        
        if (!deletedBook) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.status(200).json({ message: "Book deleted successfully", deletedBook });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while deleting the book", error });
    }
};