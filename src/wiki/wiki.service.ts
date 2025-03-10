import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wiki } from './entities/wiki.entity';
import { Comment } from './entities/comment.entity';
import { Like } from './entities/like.entity';
import { UsersService } from '../users/users.service';
import { CreateWikiDto } from './dto/create-wiki.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateLikeDto } from './dto/create-like.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class WikiService {
  constructor(
    @InjectRepository(Wiki)
    private wikiRepository: Repository<Wiki>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
    private usersService: UsersService,
  ) {}

  async create(createWikiDto: CreateWikiDto, user: User): Promise<Wiki> {
    const wiki = this.wikiRepository.create({
      ...createWikiDto,
      author: user,
    });
    return this.wikiRepository.save(wiki);
  }

  async findAll(): Promise<Wiki[]> {
    return this.wikiRepository.find({
      relations: ['author', 'comments', 'likes'],
    });
  }

  async findOne(id: number): Promise<Wiki> {
    const wiki = await this.wikiRepository.findOne({
      where: { id },
      relations: ['author', 'comments', 'likes'],
    });
    if (!wiki) {
      throw new NotFoundException(`위키 ID ${id}를 찾을 수 없습니다.`);
    }
    return wiki;
  }

  async update(id: number, updateWikiDto: Partial<Wiki>, userId: number): Promise<Wiki> {
    const author = await this.usersService.findOne(userId);
    await this.wikiRepository.update(id, {
      ...updateWikiDto,
      lastEditedBy: author.username,
    });
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    const result = await this.wikiRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Wiki with ID ${id} not found`);
    }
  }

  async findByTitle(title: string): Promise<Wiki> {
    const wiki = await this.wikiRepository.findOne({
      where: { title },
      relations: ['author', 'comments', 'comments.author', 'likes'],
    });
    if (!wiki) {
      throw new NotFoundException(`Wiki with title ${title} not found`);
    }
    return wiki;
  }

  async incrementViews(id: number): Promise<void> {
    await this.wikiRepository.increment({ id }, 'views', 1);
  }

  // 댓글 관련 메서드
  async addComment(id: number, createCommentDto: CreateCommentDto, user: User): Promise<Comment> {
    const wiki = await this.findOne(id);
    const comment = this.commentRepository.create({
      ...createCommentDto,
      wiki,
      author: user,
    });
    return this.commentRepository.save(comment);
  }

  async updateComment(commentId: number, content: string, userId: number): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['author'],
    });

    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }

    if (comment.author.id !== userId) {
      throw new ForbiddenException('자신의 댓글만 수정할 수 있습니다.');
    }

    comment.content = content;
    return await this.commentRepository.save(comment);
  }

  async deleteComment(commentId: number, userId: number): Promise<void> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['author'],
    });

    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }

    if (comment.author.id !== userId) {
      throw new ForbiddenException('자신의 댓글만 삭제할 수 있습니다.');
    }

    await this.commentRepository.remove(comment);
  }

  // 좋아요 관련 메서드
  async toggleLike(id: number, createLikeDto: CreateLikeDto, user: User): Promise<Like> {
    const wiki = await this.findOne(id);
    let like = await this.likeRepository.findOne({
      where: { wiki: { id }, user: { id: user.id } },
    });

    if (like) {
      like.isLiked = createLikeDto.isLiked;
    } else {
      like = this.likeRepository.create({
        isLiked: createLikeDto.isLiked,
        wiki,
        user,
      });
    }

    return this.likeRepository.save(like);
  }

  async isLikedByUser(wikiId: number, userId: number): Promise<boolean> {
    const like = await this.likeRepository.findOne({
      where: { wiki: { id: wikiId }, user: { id: userId } },
    });
    return !!like;
  }
} 