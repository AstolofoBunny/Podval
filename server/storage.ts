import {
  users,
  categories,
  posts,
  comments,
  postFiles,
  postViews,
  postLikes,
  siteSettings,
  type User,
  type UpsertUser,
  type Category,
  type InsertCategory,
  type Post,
  type InsertPost,
  type PostWithDetails,
  type Comment,
  type InsertComment,
  type PostFile,
  type PostView,
  type PostLike,
  type SiteSetting,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql, count, or } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserAdminStatus(id: string, isAdmin: boolean): Promise<void>;
  getAllUsers(): Promise<User[]>;

  // Category operations
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category>;
  deleteCategory(id: string): Promise<void>;

  // Post operations
  getPosts(categoryId?: string, limit?: number, offset?: number): Promise<PostWithDetails[]>;
  getPost(id: string): Promise<PostWithDetails | undefined>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: string, post: Partial<InsertPost>): Promise<Post>;
  deletePost(id: string): Promise<void>;
  getUserPosts(userId: string): Promise<PostWithDetails[]>;

  // Post files
  addPostFile(postId: string, file: Omit<PostFile, 'id' | 'postId' | 'createdAt'>): Promise<PostFile>;
  getPostFiles(postId: string): Promise<PostFile[]>;
  deletePostFile(id: string): Promise<void>;

  // Comments
  getPostComments(postId: string): Promise<(Comment & { author: User })[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  deleteComment(id: string): Promise<void>;

  // Views and likes
  recordView(postId: string, userId: string | null, ipAddress: string, sessionId?: string): Promise<void>;
  toggleLike(postId: string, userId: string): Promise<{ liked: boolean; likeCount: number }>;
  getUserLikes(userId: string): Promise<string[]>;

  // Site settings
  getSetting(key: string): Promise<string | null>;
  setSetting(key: string, value: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    // Check if user should be admin based on email
    const adminEmails = ['petro228man@gmail.com']; // Add more admin emails as needed
    const isAdmin = userData.email ? adminEmails.includes(userData.email) : false;

    const [user] = await db
      .insert(users)
      .values({ ...userData, isAdmin })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          isAdmin, // Update admin status on each login
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserAdminStatus(id: string, isAdmin: boolean): Promise<void> {
    await db.update(users).set({ isAdmin, updatedAt: new Date() }).where(eq(users.id, id));
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(categories.name);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  async updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category> {
    const [updated] = await db.update(categories).set(category).where(eq(categories.id, id)).returning();
    return updated;
  }

  async deleteCategory(id: string): Promise<void> {
    await db.delete(categories).where(eq(categories.id, id));
  }

  // Post operations
  async getPosts(categoryId?: string, limit = 10, offset = 0): Promise<PostWithDetails[]> {
    const query = db
      .select({
        post: posts,
        author: users,
        category: categories,
      })
      .from(posts)
      .innerJoin(users, eq(posts.authorId, users.id))
      .innerJoin(categories, eq(posts.categoryId, categories.id))
      .where(
        and(
          eq(posts.published, true),
          categoryId ? eq(posts.categoryId, categoryId) : undefined
        )
      )
      .orderBy(desc(posts.createdAt))
      .limit(limit)
      .offset(offset);

    const results = await query;
    
    // Get comments and files for each post
    const postsWithDetails: PostWithDetails[] = [];
    for (const result of results) {
      const comments = await this.getPostComments(result.post.id);
      const files = await this.getPostFiles(result.post.id);
      
      postsWithDetails.push({
        ...result.post,
        author: result.author,
        category: result.category,
        comments,
        files,
      });
    }

    return postsWithDetails;
  }

  async getPost(id: string): Promise<PostWithDetails | undefined> {
    const [result] = await db
      .select({
        post: posts,
        author: users,
        category: categories,
      })
      .from(posts)
      .innerJoin(users, eq(posts.authorId, users.id))
      .innerJoin(categories, eq(posts.categoryId, categories.id))
      .where(eq(posts.id, id));

    if (!result) return undefined;

    const comments = await this.getPostComments(id);
    const files = await this.getPostFiles(id);

    return {
      ...result.post,
      author: result.author,
      category: result.category,
      comments,
      files,
    };
  }

  async createPost(post: InsertPost): Promise<Post> {
    const [newPost] = await db.insert(posts).values(post).returning();
    return newPost;
  }

  async updatePost(id: string, post: Partial<InsertPost>): Promise<Post> {
    const [updated] = await db
      .update(posts)
      .set({ ...post, updatedAt: new Date() })
      .where(eq(posts.id, id))
      .returning();
    return updated;
  }

  async deletePost(id: string): Promise<void> {
    await db.delete(posts).where(eq(posts.id, id));
  }

  async getUserPosts(userId: string): Promise<PostWithDetails[]> {
    const userPosts = await db
      .select({
        post: posts,
        author: users,
        category: categories,
      })
      .from(posts)
      .innerJoin(users, eq(posts.authorId, users.id))
      .innerJoin(categories, eq(posts.categoryId, categories.id))
      .where(eq(posts.authorId, userId))
      .orderBy(desc(posts.createdAt));

    const postsWithDetails: PostWithDetails[] = [];
    for (const result of userPosts) {
      const comments = await this.getPostComments(result.post.id);
      const files = await this.getPostFiles(result.post.id);
      
      postsWithDetails.push({
        ...result.post,
        author: result.author,
        category: result.category,
        comments,
        files,
      });
    }

    return postsWithDetails;
  }

  // Post files
  async addPostFile(postId: string, file: Omit<PostFile, 'id' | 'postId' | 'createdAt'>): Promise<PostFile> {
    const [newFile] = await db.insert(postFiles).values({ ...file, postId }).returning();
    return newFile;
  }

  async getPostFiles(postId: string): Promise<PostFile[]> {
    return await db.select().from(postFiles).where(eq(postFiles.postId, postId));
  }

  async deletePostFile(id: string): Promise<void> {
    await db.delete(postFiles).where(eq(postFiles.id, id));
  }

  // Comments
  async getPostComments(postId: string): Promise<(Comment & { author: User })[]> {
    const results = await db
      .select({
        comment: comments,
        author: users,
      })
      .from(comments)
      .innerJoin(users, eq(comments.authorId, users.id))
      .where(eq(comments.postId, postId))
      .orderBy(desc(comments.createdAt));

    return results.map(result => ({
      ...result.comment,
      author: result.author,
    }));
  }

  async createComment(comment: InsertComment): Promise<Comment> {
    const [newComment] = await db.insert(comments).values(comment).returning();
    return newComment;
  }

  async deleteComment(id: string): Promise<void> {
    await db.delete(comments).where(eq(comments.id, id));
  }

  // Views and likes
  async recordView(postId: string, userId: string | null, ipAddress: string, sessionId?: string): Promise<void> {
    // Check if view already exists for this session/user
    const existingView = await db
      .select()
      .from(postViews)
      .where(
        and(
          eq(postViews.postId, postId),
          or(
            userId ? eq(postViews.userId, userId) : undefined,
            and(eq(postViews.ipAddress, ipAddress), sessionId ? eq(postViews.sessionId, sessionId) : undefined)
          )
        )
      )
      .limit(1);

    if (existingView.length === 0) {
      // Record new view
      await db.insert(postViews).values({
        postId,
        userId,
        ipAddress,
        sessionId,
      });

      // Update post view count
      await db
        .update(posts)
        .set({ 
          viewCount: sql`${posts.viewCount} + 1`,
          updatedAt: new Date()
        })
        .where(eq(posts.id, postId));
    }
  }

  async toggleLike(postId: string, userId: string): Promise<{ liked: boolean; likeCount: number }> {
    // Check if like exists
    const [existingLike] = await db
      .select()
      .from(postLikes)
      .where(and(eq(postLikes.postId, postId), eq(postLikes.userId, userId)));

    let liked: boolean;
    
    if (existingLike) {
      // Remove like
      await db.delete(postLikes).where(eq(postLikes.id, existingLike.id));
      await db
        .update(posts)
        .set({ 
          likeCount: sql`${posts.likeCount} - 1`,
          updatedAt: new Date()
        })
        .where(eq(posts.id, postId));
      liked = false;
    } else {
      // Add like
      await db.insert(postLikes).values({ postId, userId });
      await db
        .update(posts)
        .set({ 
          likeCount: sql`${posts.likeCount} + 1`,
          updatedAt: new Date()
        })
        .where(eq(posts.id, postId));
      liked = true;
    }

    // Get updated like count
    const [post] = await db.select({ likeCount: posts.likeCount }).from(posts).where(eq(posts.id, postId));
    
    return { liked, likeCount: post?.likeCount || 0 };
  }

  async getUserLikes(userId: string): Promise<string[]> {
    const likes = await db.select({ postId: postLikes.postId }).from(postLikes).where(eq(postLikes.userId, userId));
    return likes.map(like => like.postId);
  }

  // Site settings
  async getSetting(key: string): Promise<string | null> {
    const [setting] = await db.select().from(siteSettings).where(eq(siteSettings.key, key));
    return setting?.value || null;
  }

  async setSetting(key: string, value: string): Promise<void> {
    await db
      .insert(siteSettings)
      .values({ key, value })
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: { value, updatedAt: new Date() },
      });
  }
}

export const storage = new DatabaseStorage();
