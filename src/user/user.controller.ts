import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from '../auth/types/authenticated-request.type';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { UserResponseDto } from './dto/user-response.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  @Get()
  async findAll() {
    const users = await this.userService.findAll();
    const response: UserResponseDto[] = [];

    users.forEach(user => {
      let userFounded = new UserResponseDto(user);
      response.push(userFounded)
    })

    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    const user = await this.userService.findById(id);
    return new UserResponseDto(user);
  }

  @Get()
  async findByEmail(@Query('email') email: string) {
    const user = await this.userService.findByEmail(email);
    return new UserResponseDto(user);
  }

  @Post()
  async create(@Body() dto: CreateUserDto) {
    const user = await this.userService.create(dto);
    return new UserResponseDto(user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async update(@Req() req: AuthenticatedRequest, @Body() dto: UpdateUserDto) {
    const user = await this.userService.update(req.user.id, dto);
    return new UserResponseDto(user);
  }
}
