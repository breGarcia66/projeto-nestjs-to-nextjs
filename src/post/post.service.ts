import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from '../user/entities/user.entity';
import { createSlugFromText } from '../common/utils/create-slug-from-text';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);

  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>
  ) {}

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
}
