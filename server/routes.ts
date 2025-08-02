import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { upload, setupFileServing } from "./upload";
import { insertCategorySchema, insertPostSchema, insertCommentSchema } from "@shared/schema";
import { z } from "zod";
import nodemailer from 'nodemailer';

// Setup email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || process.env.EMAIL_USER,
    pass: process.env.SMTP_PASS || process.env.EMAIL_PASS,
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup file serving
  setupFileServing(app);

  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Profile update route
  app.post('/api/auth/update-profile', isAuthenticated, upload.single('profileImage'), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { firstName, lastName } = req.body;
      
      let profileImageUrl;
      if (req.file) {
        profileImageUrl = `/uploads/${req.file.filename}`;
      }

      const updateData: any = {
        firstName,
        lastName,
        updatedAt: new Date(),
      };

      if (profileImageUrl) {
        updateData.profileImageUrl = profileImageUrl;
      }

      const updatedUser = await storage.updateUser(userId, updateData);
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // My posts route
  app.get('/api/posts/my-posts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const userPosts = await storage.getUserPosts(userId);
      res.json(userPosts);
    } catch (error) {
      console.error("Error fetching user posts:", error);
      res.status(500).json({ message: "Failed to fetch user posts" });
    }
  });

  // Contact form route
  app.post('/api/contact', async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;

      // Email content
      const mailOptions = {
        from: email,
        to: process.env.CONTACT_EMAIL || 'support@contenthub.com',
        subject: `Contact Form: ${subject}`,
        html: `
          <h3>New Contact Form Submission</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `,
      };

      await transporter.sendMail(mailOptions);
      res.json({ message: "Message sent successfully" });
    } catch (error) {
      console.error("Error sending contact email:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // Category routes
  app.get('/api/categories', async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.post('/api/categories', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const data = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(data);
      res.json(category);
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  app.put('/api/categories/:id', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const data = insertCategorySchema.partial().parse(req.body);
      const category = await storage.updateCategory(req.params.id, data);
      res.json(category);
    } catch (error) {
      console.error("Error updating category:", error);
      res.status(500).json({ message: "Failed to update category" });
    }
  });

  app.delete('/api/categories/:id', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      await storage.deleteCategory(req.params.id);
      res.json({ message: "Category deleted successfully" });
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ message: "Failed to delete category" });
    }
  });

  // Post routes
  app.get('/api/posts', async (req, res) => {
    try {
      const categoryId = req.query.categoryId as string | undefined;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;
      
      const posts = await storage.getPosts(categoryId, limit, offset);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  app.get('/api/posts/:id', async (req: any, res) => {
    try {
      const post = await storage.getPost(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      // Record view
      const userId = req.user?.claims?.sub || null;
      const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';
      const sessionId = req.sessionID;
      
      await storage.recordView(req.params.id, userId, ipAddress, sessionId);

      // Check if user has liked this post
      if (userId) {
        const userLikes = await storage.getUserLikes(userId);
        post.isLiked = userLikes.includes(req.params.id);
      }

      res.json(post);
    } catch (error) {
      console.error("Error fetching post:", error);
      res.status(500).json({ message: "Failed to fetch post" });
    }
  });

  app.post('/api/posts', isAuthenticated, upload.single('coverImage'), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Handle category - create "Other" if not specified or doesn't exist
      let categoryId = req.body.categoryId;
      if (!categoryId || categoryId === '') {
        let otherCategory = await storage.getCategoryByName('Other');
        if (!otherCategory) {
          otherCategory = await storage.createCategory({
            name: 'Other',
            description: 'Разные темы и общие посты',
            color: 'gray',
            isDefault: true
          });
        }
        categoryId = otherCategory.id;
      }
      
      const data = insertPostSchema.parse({
        ...req.body,
        categoryId,
        authorId: userId,
        published: req.body.published === 'true' || req.body.published === true,
        coverImage: req.file ? `/uploads/${req.file.filename}` : null,
      });

      const post = await storage.createPost(data);
      res.json(post);
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ message: "Failed to create post" });
    }
  });

  app.post('/api/posts/:id/files', isAuthenticated, upload.array('files', 10), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const post = await storage.getPost(req.params.id);
      
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      const user = await storage.getUser(userId);
      if (post.authorId !== userId && !user?.isAdmin) {
        return res.status(403).json({ message: "Access denied" });
      }

      const files = req.files as Express.Multer.File[];
      const savedFiles = [];

      for (const file of files) {
        const savedFile = await storage.addPostFile(req.params.id, {
          filename: file.filename,
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
        });
        savedFiles.push(savedFile);
      }

      res.json(savedFiles);
    } catch (error) {
      console.error("Error uploading files:", error);
      res.status(500).json({ message: "Failed to upload files" });
    }
  });

  app.delete('/api/posts/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const post = await storage.getPost(req.params.id);
      
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      const user = await storage.getUser(userId);
      if (post.authorId !== userId && !user?.isAdmin) {
        return res.status(403).json({ message: "Access denied" });
      }

      await storage.deletePost(req.params.id);
      res.json({ message: "Post deleted successfully" });
    } catch (error) {
      console.error("Error deleting post:", error);
      res.status(500).json({ message: "Failed to delete post" });
    }
  });

  // Articles (similar to posts but with type 'article')
  app.post('/api/articles', isAuthenticated, upload.array('images', 10), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Handle category - create "Other" if not specified or doesn't exist
      let categoryId = req.body.categoryId;
      if (!categoryId || categoryId === '') {
        let otherCategory = await storage.getCategoryByName('Other');
        if (!otherCategory) {
          otherCategory = await storage.createCategory({
            name: 'Other',
            description: 'Разные темы и общие посты',
            color: 'gray',
            isDefault: true
          });
        }
        categoryId = otherCategory.id;
      }
      
      const data = insertPostSchema.parse({
        ...req.body,
        categoryId,
        authorId: userId,
        type: 'article',
        published: req.body.published === 'true' || req.body.published === true,
        coverImage: null, // Articles don't have cover images in this implementation
      });

      const article = await storage.createPost(data);
      
      // Handle uploaded images if any
      const files = req.files as Express.Multer.File[];
      if (files && files.length > 0) {
        for (const file of files) {
          await storage.addPostFile(article.id, {
            filename: file.filename,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
          });
        }
      }
      
      res.json(article);
    } catch (error) {
      console.error("Error creating article:", error);
      res.status(500).json({ message: "Failed to create article" });
    }
  });

  // Like/unlike post
  app.post('/api/posts/:id/like', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const result = await storage.toggleLike(req.params.id, userId);
      res.json(result);
    } catch (error) {
      console.error("Error toggling like:", error);
      res.status(500).json({ message: "Failed to toggle like" });
    }
  });

  // Comment routes
  app.get('/api/posts/:id/comments', async (req, res) => {
    try {
      const comments = await storage.getPostComments(req.params.id);
      res.json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.post('/api/posts/:id/comments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const data = insertCommentSchema.parse({
        ...req.body,
        postId: req.params.id,
        authorId: userId,
      });

      const comment = await storage.createComment(data);
      res.json(comment);
    } catch (error) {
      console.error("Error creating comment:", error);
      res.status(500).json({ message: "Failed to create comment" });
    }
  });

  app.delete('/api/comments/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      // Only allow comment author or admin to delete
      if (!user?.isAdmin) {
        // TODO: Check if user is comment author
        return res.status(403).json({ message: "Access denied" });
      }

      await storage.deleteComment(req.params.id);
      res.json({ message: "Comment deleted successfully" });
    } catch (error) {
      console.error("Error deleting comment:", error);
      res.status(500).json({ message: "Failed to delete comment" });
    }
  });

  // Account switching for testing
  app.post('/api/auth/switch-account', isAuthenticated, async (req: any, res) => {
    try {
      const { role } = req.body;
      const userId = req.user.claims.sub;
      
      if (role === 'admin') {
        await storage.updateUserAdminStatus(userId, true);
      } else {
        await storage.updateUserAdminStatus(userId, false);
      }
      
      res.json({ message: `Switched to ${role} account`, role });
    } catch (error) {
      console.error("Error switching account:", error);
      res.status(500).json({ message: "Failed to switch account" });
    }
  });

  // Admin routes
  app.get('/api/admin/users', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.put('/api/admin/users/:id/admin', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { isAdmin } = req.body;
      await storage.updateUserAdminStatus(req.params.id, isAdmin);
      res.json({ message: "User admin status updated" });
    } catch (error) {
      console.error("Error updating user admin status:", error);
      res.status(500).json({ message: "Failed to update user admin status" });
    }
  });

  // Site settings
  app.get('/api/settings/:key', async (req, res) => {
    try {
      const value = await storage.getSetting(req.params.key);
      res.json({ value });
    } catch (error) {
      console.error("Error fetching setting:", error);
      res.status(500).json({ message: "Failed to fetch setting" });
    }
  });

  app.put('/api/settings/:key', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { value } = req.body;
      await storage.setSetting(req.params.key, value);
      res.json({ message: "Setting updated" });
    } catch (error) {
      console.error("Error updating setting:", error);
      res.status(500).json({ message: "Failed to update setting" });
    }
  });

  // Contact form
  app.post('/api/contact', async (req, res) => {
    try {
      const { name, email, message } = req.body;
      
      const mailOptions = {
        from: process.env.SMTP_USER || process.env.EMAIL_USER,
        to: process.env.CONTACT_EMAIL || 'petro228man@gmail.com',
        subject: `Contact Form Message from ${name}`,
        html: `
          <h3>New Contact Form Message</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
      };

      await transporter.sendMail(mailOptions);
      res.json({ message: "Message sent successfully" });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
