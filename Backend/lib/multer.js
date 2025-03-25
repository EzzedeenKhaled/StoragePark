import multer from 'multer';
import path from 'path';

// Set storage configuration for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify your upload folder here (make sure this folder exists)
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    cb(null, Date.now() + fileExtension); // Rename files with a unique timestamp
  },
});

// File filter for the file types you want to accept
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ['.pdf', '.jpg', '.jpeg', '.png', '.docx'];
  if (allowedFileTypes.includes(path.extname(file.originalname))) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Invalid file type. Only PDF, JPG, PNG, and DOCX are allowed.'), false);
  }
};

// Set up the multer upload instance
const upload = multer({ storage, fileFilter });

export default upload;
