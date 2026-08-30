import { BadRequestException, ParseIntPipe } from "@nestjs/common";

export class CustomParseIntPipe extends ParseIntPipe {
  constructor() {
    super({
      exceptionFactory: () => new BadRequestException('parâmetro da requisição precisar se número inteiro')
    });
  }
}