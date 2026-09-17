import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from '../auth/types/authenticated-request.type';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { UserResponseDto } from './dto/user-response.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

import type { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  // ROTAS GET

  // READ ALL
  @Get()
  async findAll() {
    const users = await this.userService.findAll();
    const response: UserResponseDto[] = [];

    users.forEach(user => {
      let userFounded = new UserResponseDto(user);
      response.push(userFounded);
    });

    return response;
  }

  // READ LOGGED IN USER
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async readLoggedInUser(@Req() req: AuthenticatedRequest) {
    const user = await this.userService.findOneByOrFail({ id: req.user.id });
    return new UserResponseDto(user);
  }

  // READ ONE BY ID
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    const user = await this.userService.findById(id);
    return new UserResponseDto(user);
  }


  // FIM GET

  // ROTAS POST

  @Post()
  async create(@Body() dto: CreateUserDto) {
    const user = await this.userService.create(dto);
    return new UserResponseDto(user);
  }

  // FIM POST

  // ROTAS PATCH

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async update(@Req() req: AuthenticatedRequest, @Body() dto: UpdateUserDto) {
    const user = await this.userService.update(req.user.id, dto);
    return new UserResponseDto(user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/password')
  async updatePassword(
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdatePasswordDto,
  ) {
    const user = await this.userService.updatePassword(req.user.id, dto);
    return new UserResponseDto(user);
  }

  // FIM PATCH

  // ROTAS DELETE

  @UseGuards(JwtAuthGuard)
  @Delete('me')
  async deleteMyAccount(@Req() req: AuthenticatedRequest) {
    const user = await this.userService.remove(req.user.id);
    return new UserResponseDto(user);
  }

  // FIM DELETE
}

