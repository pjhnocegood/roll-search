import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wiki } from './entities/wiki.entity';
import { Comment } from './entities/comment.entity';
import { Like } from './entities/like.entity';
import { Tag, TagType } from './entities/tag.entity';
import { UsersService } from '../users/users.service';
import { CreateWikiDto } from './dto/create-wiki.dto';
import { UpdateWikiDto } from './dto/update-wiki.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateLikeDto } from './dto/create-like.dto';
import { User } from '../users/entities/user.entity';
import { FindAllWikiDto } from './dto/find-all-wiki.dto';

@Injectable()
export class WikiService {
  constructor(
    @InjectRepository(Wiki)
    private wikiRepository: Repository<Wiki>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    private usersService: UsersService,
  ) {}

  private async getOrCreateTags(tagNames: TagType[]): Promise<Tag[]> {
    const tags = await Promise.all(
      tagNames.map(async (name) => {
        let tag = await this.tagRepository.findOne({ where: { name } });
        if (!tag) {
          tag = this.tagRepository.create({ name });
          tag = await this.tagRepository.save(tag);
        }
        return tag;
      })
    );
    return tags;
  }

  async create(createWikiDto: CreateWikiDto, user: User): Promise<Wiki> {
    // 사용자 존재 여부 확인
    const existingUser = await this.usersService.findOne(user.id);
    if (!existingUser) {
      throw new NotFoundException(`사용자 ID ${user.id}를 찾을 수 없습니다.`);
    }

    const tags = createWikiDto.tags ? await this.getOrCreateTags(createWikiDto.tags) : [];
    const wiki = this.wikiRepository.create({
      ...createWikiDto,
      author: existingUser,
      authorId: existingUser.id,
      tags,
    });
    return this.wikiRepository.save(wiki);
  }

  async findAll(findAllWikiDto: FindAllWikiDto): Promise<Wiki[]> {
    const queryBuilder = this.wikiRepository
      .createQueryBuilder('wiki')
      .leftJoinAndSelect('wiki.author', 'author')
      .leftJoinAndSelect('wiki.comments', 'comments')
      .leftJoinAndSelect('wiki.likes', 'likes')
      .leftJoinAndSelect('wiki.tags', 'tags');

    if (findAllWikiDto.category) {
      queryBuilder.andWhere('wiki.category = :category', { category: findAllWikiDto.category });
    }

    if (findAllWikiDto.tag) {
      queryBuilder.andWhere('tags.name = :tag', { tag: findAllWikiDto.tag });
    }

    return queryBuilder.getMany();
  }

  async findOne(id: number): Promise<Wiki> {
    const wiki = await this.wikiRepository.findOne({
      where: { id },
      relations: ['author', 'comments', 'likes', 'tags'],
    });
    if (!wiki) {
      throw new NotFoundException(`위키 ID ${id}를 찾을 수 없습니다.`);
    }
    return wiki;
  }

  async update(id: number, updateWikiDto: UpdateWikiDto, user: User): Promise<Wiki> {
    const wiki = await this.findOne(id);
    if (wiki.authorId !== user.id) {
      throw new ForbiddenException('자신이 작성한 글만 수정할 수 있습니다.');
    }

    if (updateWikiDto.tags) {
      wiki.tags = await this.getOrCreateTags(updateWikiDto.tags);
    }

    Object.assign(wiki, updateWikiDto);
    wiki.lastEditedBy = user.username;
    return this.wikiRepository.save(wiki);
  }

  async delete(id: number): Promise<void> {
    const result = await this.wikiRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`위키 ID ${id}를 찾을 수 없습니다.`);
    }
  }

  async findByTitle(title: string): Promise<Wiki> {
    const wiki = await this.wikiRepository.findOne({
      where: { title },
      relations: ['author', 'comments', 'likes'],
    });
    if (!wiki) {
      throw new NotFoundException(`제목 "${title}"의 위키를 찾을 수 없습니다.`);
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
    return this.commentRepository.save(comment);
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