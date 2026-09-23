import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from '../auth/types/authenticated-request.type';
import { CreatePostDto } from './dto/create-post.dto';
import { ResponsePostDto } from './dto/response-post.dto';
import { PostService } from './post.service';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // ROTAS POST

  @UseGuards(JwtAuthGuard)
  @Post('me')
  async create(@Req() req: AuthenticatedRequest, @Body() dto: CreatePostDto) {
    const post = await this.postService.create(dto, req.user);
    return new ResponsePostDto(post!);
  }

  // FIM POST

  // ROTAS GET

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async findAllOwned(@Req() req: AuthenticatedRequest) {
    const posts = await this.postService.findAllOwnedOrFail(req.user);
    const responsePosts: ResponsePostDto[] = [];

    posts.forEach(post => {
      responsePosts.push(new ResponsePostDto(post));
    });

    return responsePosts;
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/:id')
  async findOneOwned(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    const post = await this.postService.findOneOwnedOrFail({ id }, req.user);
    return new ResponsePostDto(post);
  }

  // FIM GET

  // ROTAS PATCH

  @UseGuards(JwtAuthGuard)
  @Patch('me/:id')
  async update(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePostDto,
  ) {
    const post = await this.postService.update({ id }, dto, req.user);
    return new ResponsePostDto(post);
  }

  // FIM PATCH
}
