// ==================== AUTH ====================
export type UserRole = 'USER' | 'ADMIN' | 'MODERATOR';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'BANNED';

export interface User {
  id: string;
  email: string;
  username: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  avatar?: string;
  bio?: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success?: boolean;
  accessToken: string;
  refreshToken?: string;
  token?: string; // Legacy
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  username: string;
  password: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
}

// 2FA / OTP tipos
export type OTPType = 'EMAIL_VERIFICATION' | 'TWO_FACTOR' | 'PASSWORD_RESET';

export interface OTPVerifyPayload {
  email: string;
  otp: string;
  type: OTPType;
}

export interface ResendOTPPayload {
  email: string;
  type: OTPType;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
}

// Session
export interface Session {
  id: string;
  userId: string;
  token: string;
  userAgent?: string;
  ipAddress?: string;
  expiresAt: string;
  createdAt: string;
}

// ==================== POSTS ====================
export type PostStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'DELETED';
export type PostType = 'ARTICLE' | 'NEWS' | 'TUTORIAL' | 'GUIDE';
export type PostVisibility = 'PUBLIC' | 'PRIVATE' | 'RESTRICTED';

export interface PostMedia {
  mediaId: string;
  postId: string;
  order: number;
  media: {
    id: string;
    filename: string;
    originalName: string;
    url: string;
    thumbnailUrl: string;
    width: number;
    height: number;
  };
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt?: string;
  type: PostType;
  status: PostStatus;
  visibility: PostVisibility;
  author: User;
  authorId?: string;
  metaTitle?: string;
  metaDescription?: string;
  coverImage?: string;
  featuredImage?: string | null;
  tags?: string[];
  categories?: string[];
  media?: PostMedia[];
  viewCount: number;
  likeCount?: number;
  likesCount?: number;
  commentCount?: number;
  commentsCount?: number;
  sharesCount?: number;
  bookmarksCount?: number;
  isLiked?: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface CreatePostPayload {
  title: string;
  content: string;
  excerpt?: string;
  type?: PostType;
  status?: PostStatus;
  visibility?: PostVisibility;
  metaTitle?: string;
  metaDescription?: string;
  coverImage?: string;
  tags?: string[];
  categories?: string[];
}

export interface UpdatePostPayload {
  title?: string;
  content?: string;
  excerpt?: string;
  type?: PostType;
  status?: PostStatus;
  visibility?: PostVisibility;
  metaTitle?: string;
  metaDescription?: string;
  coverImage?: string;
  featuredImage?: string | null;
  tags?: string[];
  categories?: string[];
}

export interface PostAnalytics {
  postId: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  averageReadTime?: number;
}

// ==================== SOCIAL ====================
export interface UserProfile extends User {
  bio?: string;
  followerCount: number;
  followingCount: number;
  postCount: number;
  isFollowing?: boolean;
  followedAt?: string;
}

export interface FeedPost extends Post {
  isLiked?: boolean;
}

export interface FollowPayload {
  userId: string;
}

export interface LikePayload {
  postId: string;
  type: 'POST' | 'COMMENT';
}

// ==================== COMMENTS ====================
export interface Comment {
  id: string;
  content: string;
  author: User;
  authorId?: string;
  postId: string;
  parentId?: string | null;
  replies?: Comment[];
  likeCount: number;
  isLiked?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentPayload {
  content: string;
  parentId?: string | null;
}

export interface UpdateCommentPayload {
  content: string;
}

// ==================== MEDIA ====================
export type MediaType = 'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'AUDIO';

export interface Media {
  id: string;
  filename: string;
  originalName: string;
  type: MediaType;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  uploadedBy: User;
  createdAt: string;
  updatedAt: string;
}

export interface UploadMediaPayload {
  file: File;
  type?: MediaType;
}

// ==================== SEARCH ====================
export interface SearchPostsPayload {
  q: string;
  limit?: number;
  page?: number;
}

export interface SearchUsersPayload {
  q: string;
  limit?: number;
  page?: number;
}

export interface SearchResult<T> {
  results: T[];
  total: number;
  query: string;
}

// ==================== NOTIFICATIONS ====================
export type NotificationType = 'LIKE' | 'COMMENT' | 'FOLLOW' | 'MENTION' | 'SYSTEM';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  actor?: User;
  relatedId?: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

// ==================== ANALYTICS ====================
export interface UserAnalytics {
  userId: string;
  postCount: number;
  followerCount: number;
  followingCount: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
}

// ==================== API RESPONSES ====================
export interface ApiResponse<T = any> {
  success?: boolean;
  message?: string;
  data?: T;
  error?: string | Record<string, string[]>;
  errors?: Record<string, string[]>;
  status?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// ==================== REACTIONS ====================
export type ReactionType = 'LIKE' | 'LOVE' | 'CARE' | 'HAHA' | 'WOW' | 'SAD' | 'ANGRY';

export interface Reaction {
  id: string;
  userId: string;
  targetId: string;
  targetType: 'POST' | 'COMMENT';
  type: ReactionType;
  createdAt: string;
}

export interface ReactionStats {
  LIKE: number;
  LOVE: number;
  CARE: number;
  HAHA: number;
  WOW: number;
  SAD: number;
  ANGRY: number;
  total: number;
  userReaction?: ReactionType | null;
}

export interface CreateReactionPayload {
  targetId: string;
  targetType: 'POST' | 'COMMENT';
  type: ReactionType;
}

// ==================== HASHTAGS ====================
export interface Hashtag {
  id: string;
  name: string;
  description?: string;
  count: number;
  trendingScore?: number;
  createdAt: string;
  updatedAt: string;
}

export interface HashtagStats {
  hashtag: Hashtag;
  postsCount: number;
  trendingRank?: number;
}

// ==================== MENTIONS ====================
export type MentionType = 'POST_MENTION' | 'COMMENT_MENTION';

export interface Mention {
  id: string;
  type: MentionType;
  title: string;
  body: string;
  mentioningUser: User;
  postId?: string;
  commentId?: string;
  isRead: boolean;
  createdAt: string;
}

// ==================== BOOKMARKS ====================
export interface Bookmark {
  id: string;
  userId: string;
  postId: string;
  post: Post;
  createdAt: string;
}

export interface CreateBookmarkPayload {
  postId: string;
}

// ==================== SHARES ====================
export interface Share {
  id: string;
  userId: string;
  postId: string;
  message?: string;
  user: User;
  createdAt: string;
}

export interface CreateSharePayload {
  postId: string;
  message?: string;
}

// ==================== SOCIAL EXTENSIONS ====================
export interface UserSuggestion {
  id: string;
  user: User;
  mutualFollowers?: number;
  reason?: string;
}

export interface FollowerInfo {
  id: string;
  username: string;
  displayName?: string;
  avatarUrl?: string;
  bio?: string;
  isFollowing?: boolean;
}

export interface FollowResponse {
  isFollowing: boolean;
  followerCount: number;
}

// ==================== EXTENDED NOTIFICATIONS ====================
export type NotificationType = 
  | 'NEW_FOLLOWER' 
  | 'POST_LIKE' 
  | 'NEW_COMMENT' 
  | 'COMMENT_LIKE' 
  | 'POST_MENTION' 
  | 'COMMENT_MENTION' 
  | 'POST_SHARE' 
  | 'SYSTEM';

export interface ExtendedNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, any>;
  actor?: User;
  relatedId?: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

// ==================== WEBSOCKET EVENTS ====================
export interface SocketMessage<T = any> {
  event: string;
  data: T;
  timestamp: string;
}

export interface FollowerEvent {
  follower: User;
  followerCount: number;
  timestamp: string;
}

export interface ReactionEvent {
  userId: string;
  username: string;
  postId: string;
  type: ReactionType;
  timestamp: string;
}

export interface ReactionRemovedEvent {
  userId: string;
  postId: string;
  oldType: ReactionType;
  timestamp: string;
}

export interface PostCountersEvent {
  postId: string;
  reactionsCount: number;
  commentsCount: number;
  sharesCount: number;
  bookmarksCount: number;
  viewCount: number;
  timestamp: string;
}

export interface CommentEvent {
  userId: string;
  username: string;
  postId: string;
  commentId: string;
  timestamp: string;
}

export interface TypingEvent {
  userId: string;
  username: string;
  postId: string;
}

export interface UserPresenceEvent {
  userId: string;
  username: string;
  timestamp: string;
}

export interface MentionEvent {
  type: MentionType;
  title: string;
  body: string;
  mentioningUser: User;
  postId?: string;
  commentId?: string;
  timestamp: string;
}
