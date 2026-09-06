import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { HashingService } from '../common/hashing/hashing.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
  ) {}

  async findAll() {
    return await this.userRepository.find();
  }

  async findById(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    return user;
  }

  async create(dto: CreateUserDto) {
    const exists = await this.userRepository.exists({
      where: {
        email: dto.email,
      },
    });

    if (exists) {
      throw new ConflictException('Email já em uso');
    }

    const hashedPassword = await this.hashingService.hash(dto.password);
    const newUser: CreateUserDto = {
      name: dto.name,
      email: dto.email,
      password: hashedPassword
    }

    const created = this.userRepository.save(newUser);
    return created;
  }
}
