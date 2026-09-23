import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from '../user/entities/user.entity';
import { createSlugFromText } from '../common/utils/create-slug-from-text';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);

  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>
  ) {}

  async findOnePostOrFail(postData: Partial<Post>) {
    const post = await this.postRepository.findOne({
      where: postData,
      relations: {
        author: true
      }
    });

    if (!post) {
      throw new NotFoundException('Post não encontrado');
    }

    return post;
  }

  async findOneOwnedOrFail(postData: Partial<Post>, author: User) {
    const post = await this.postRepository.findOne({
      where: {
        ...postData,
        author: { id: author.id }
      },
      relations: {
        author: true
      }
    });

    if (!post) {
      throw new NotFoundException('Post não encontrado');
    }

    return post;
  }

  async findAllOwnedOrFail(author: User) {
    const posts = await this.postRepository.find({
      where: {
        author: { id: author.id }
      },
      order: {
        createdAt: 'DESC'
      },
      relations: {
        author: true
      }
    })

    if(!posts) {
      throw new NotFoundException('Post não encontrado');
    }

    return posts;
  }

  async create(dto: CreatePostDto, author: User) {
    const post = this.postRepository.create({
      slug: createSlugFromText(dto.title),
      title: dto.title,
      excerpt: dto.excerpt,
      content: dto.content,
      coverImageUrl: dto.coverImageUrl,
      author,
    });

    const created = await this.postRepository.save(post).catch((err: unknown) => {
      if(err instanceof Error) {
        this.logger.error('Erro ao criar post', err.stack);
      }

      throw new BadRequestException('Erro ao criar post')
    });

    return created;
  }

  async update(postData: Partial<Post>, dto: UpdatePostDto, author: User) {
    if(Object.keys(dto).length === 0) {
      throw new BadRequestException('Dados não enviados');
    }

    const post = await this.findOneOwnedOrFail(postData, author);

    post.title = dto.title ?? post.title;
    post.content = dto.content ?? post.content;
    post.excerpt = dto.excerpt ?? post.excerpt;
    post.coverImageUrl = dto.coverImageUrl ?? post.coverImageUrl;
    post.published = dto.published ?? post.published;

    return this.postRepository.save(post);
  }
}
