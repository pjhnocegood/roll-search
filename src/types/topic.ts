export interface Tag {
  id: number;
  name: string;
}

export interface Author {
  id: number;
  githubId: string;
  username: string;
  email: string;
  password: string | null;
  walletAddress: string | null;
  avatarUrl: string;
  createdAt: string; // ISO 문자열. 필요 시 Date 타입으로 변환 가능.
  updatedAt: string;
}

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Like {
  id: number;
  createdAt: string;
  isLiked: boolean;
}

export interface ITopicProps {
  id: number;
  title: string;
  content: string;
  category: string;
  tags: Tag[];
  views: number;
  likesCount: number;
  author: Author;
  authorId: number;
  comments: Comment[];
  likes: Like[];
  createdAt: string;
  updatedAt: string;
  lastEditedBy: Author | null;
}

