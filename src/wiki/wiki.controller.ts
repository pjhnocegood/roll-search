import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, UseGuards, Request, ForbiddenException, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WikiService } from './wiki.service';
import { Wiki } from './entities/wiki.entity';
import { Comment } from './entities/comment.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateWikiDto } from './dto/create-wiki.dto';
import { UpdateWikiDto } from './dto/update-wiki.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateLikeDto } from './dto/create-like.dto';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { FindAllWikiDto } from './dto/find-all-wiki.dto';

@ApiTags('위키')
@Controller('wiki')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token')
export class WikiController {
  constructor(private readonly wikiService: WikiService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '위키 생성', description: '새로운 위키 페이지를 생성합니다.' })
  @ApiResponse({ status: 201, description: '위키가 성공적으로 생성되었습니다.' })
  create(@Body() createWikiDto: CreateWikiDto, @GetUser() user: User) {
    return this.wikiService.create(createWikiDto, user);
  }

  @Get()
  @ApiOperation({ summary: '위키 목록 조회', description: '모든 위키 페이지 목록을 조회합니다.' })
  @ApiResponse({ status: 200, description: '위키 목록을 성공적으로 조회했습니다.' })
  findAll(@Query() findAllWikiDto: FindAllWikiDto) {
    return this.wikiService.findAll(findAllWikiDto);
  }

  @Get(':id')
  @ApiOperation({ summary: '위키 상세 조회', description: '특정 위키 페이지의 상세 내용을 조회합니다.' })
  @ApiResponse({ status: 200, description: '위키를 성공적으로 조회했습니다.' })
  findOne(@Param('id') id: string) {
    return this.wikiService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '위키 수정', description: '위키 페이지를 수정합니다.' })
  @ApiResponse({ status: 200, description: '위키가 성공적으로 수정되었습니다.' })
  @ApiResponse({ status: 403, description: '수정 권한이 없습니다.' })
  @ApiResponse({ status: 404, description: '위키를 찾을 수 없습니다.' })
  async update(
    @Param('id') id: number,
    @Body() updateWikiDto: UpdateWikiDto,
    @GetUser() user: User,
  ): Promise<Wiki> {
    const wiki = await this.wikiService.findOne(id);
    if (wiki.author.id !== user.id) {
      throw new ForbiddenException('자신이 작성한 글만 수정할 수 있습니다.');
    }
    return this.wikiService.update(id, updateWikiDto, user);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '위키 삭제', description: '위키 페이지를 삭제합니다.' })
  @ApiResponse({ status: 204, description: '위키가 성공적으로 삭제되었습니다.' })
  @ApiResponse({ status: 403, description: '삭제 권한이 없습니다.' })
  @ApiResponse({ status: 404, description: '위키를 찾을 수 없습니다.' })
  async delete(@Param('id') id: number, @GetUser() user: User): Promise<void> {
    const wiki = await this.wikiService.findOne(id);
    if (wiki.author.id !== user.id) {
      throw new ForbiddenException('자신이 작성한 글만 삭제할 수 있습니다.');
    }
    return this.wikiService.delete(id);
  }

  @Get('title/:title')
  @ApiOperation({ summary: '제목으로 위키 검색', description: '제목으로 위키 페이지를 검색합니다.' })
  @ApiResponse({ status: 200, description: '위키를 성공적으로 찾았습니다.' })
  @ApiResponse({ status: 404, description: '위키를 찾을 수 없습니다.' })
  async findByTitle(@Param('title') title: string): Promise<Wiki> {
    return this.wikiService.findByTitle(title);
  }

  @Post(':id/comments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '댓글 작성', description: '위키 페이지에 댓글을 작성합니다.' })
  @ApiResponse({ status: 201, description: '댓글이 성공적으로 작성되었습니다.' })
  addComment(
    @Param('id') id: string,
    @Body() createCommentDto: CreateCommentDto,
    @GetUser() user: User,
  ) {
    return this.wikiService.addComment(+id, createCommentDto, user);
  }

  @Put('comments/:commentId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '댓글 수정', description: '댓글을 수정합니다.' })
  @ApiResponse({ status: 200, description: '댓글이 성공적으로 수정되었습니다.' })
  @ApiResponse({ status: 403, description: '수정 권한이 없습니다.' })
  @ApiResponse({ status: 404, description: '댓글을 찾을 수 없습니다.' })
  async updateComment(
    @Param('commentId') commentId: number,
    @Body('content') content: string,
    @GetUser() user: User,
  ): Promise<Comment> {
    return this.wikiService.updateComment(commentId, content, user.id);
  }

  @Delete('comments/:commentId')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '댓글 삭제', description: '댓글을 삭제합니다.' })
  @ApiResponse({ status: 204, description: '댓글이 성공적으로 삭제되었습니다.' })
  @ApiResponse({ status: 403, description: '삭제 권한이 없습니다.' })
  @ApiResponse({ status: 404, description: '댓글을 찾을 수 없습니다.' })
  async deleteComment(
    @Param('commentId') commentId: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.wikiService.deleteComment(commentId, user.id);
  }

  @Post(':id/likes')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '좋아요 토글', description: '위키 페이지에 좋아요를 토글합니다.' })
  @ApiResponse({ status: 201, description: '좋아요가 성공적으로 토글되었습니다.' })
  toggleLike(
    @Param('id') id: string,
    @Body() createLikeDto: CreateLikeDto,
    @GetUser() user: User,
  ) {
    return this.wikiService.toggleLike(+id, createLikeDto, user);
  }

  @Get(':id/liked')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '좋아요 여부 확인', description: '사용자의 좋아요 여부를 확인합니다.' })
  @ApiResponse({ status: 200, description: '좋아요 여부를 성공적으로 확인했습니다.' })
  async isLikedByUser(
    @Param('id') id: number,
    @GetUser() user: User,
  ): Promise<{ liked: boolean }> {
    const liked = await this.wikiService.isLikedByUser(id, user.id);
    return { liked };
  }
} 