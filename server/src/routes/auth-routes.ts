import { Router, Request, Response } from 'express';
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const login = async (req: Request, res: Response) => {
  
  // TODO: If the user exists and the password is correct, return a JWT token
  const { username, password } = req.body;  // Extract username and password from request body
  

  // Find the user in the database by username
  const user = await User.findOne({
    where: { username },
  });

  // If user is not found, send an authentication failed response
  if (!user) {
    console.log('❌ No user found');
    return res.status(401).json({ message: 'Authentication failed' });
  }

  // Compare the provided password with the stored hashed password
  const passwordIsValid = await bcrypt.compare(password, user.password);
  console.log('✅ Password match:', passwordIsValid);
  // If password is invalid, send an authentication failed response
  if (!passwordIsValid) {
    console.log('❌ Invalid password');
    return res.status(401).json({ message: 'Authentication failed' });
  }

  // Get the secret key from environment variables
  const secretKey = process.env.JWT_SECRET_KEY || '';

  // Generate a JWT token for the authenticated user
  const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
  return res.json({ token });  // Send the token as a JSON response
};

const router = Router();

// POST /login - Login a user
router.post('/login', login);

// POST /auth/dev-create-user - Temporarily create a test user
//TO DO: Delete or comment out this code once it's no longer needed
// router.post('/dev-create-user', async (_req, res) => {
  
//   try {
//     const user = await User.create({
//       username: 'testuser',
//       password: 'password123', // This will get hashed via the beforeCreate hook
//     });
//     res.status(201).json({ message: 'Test user created', user: { id: user.id, username: user.username } });
//   } catch (err) {
//     console.error('Error creating test user:', err);
//     res.status(500).json({ message: 'Failed to create test user' });
//   }
// });


export default router;
