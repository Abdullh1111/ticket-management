import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateCommentDto, CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth-guard';
import { Roles } from 'src/auth/src/roles.decorator';
import { Role } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('attachment'))
  create(@UploadedFile() attachment: Express.Multer.File, @Body() createTicketDto: any, @Req() req) {
    console.log(createTicketDto)
    const ownerid = req.user.id;
    return this.ticketsService.create(createTicketDto, ownerid, attachment);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  findAll() {
    return this.ticketsService.findAll();
  }

  @Get('userTickets')
  @UseGuards(JwtAuthGuard)
  findUserTickets(@Req() req) {
    const ownerid = req.user.id;
    return this.ticketsService.findUserTickets(ownerid);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketsService.update(id, updateTicketDto);
  }

  @Post('comments/:id')
  @UseGuards(JwtAuthGuard)
  CreateComments(
    @Param('id') id: string,
    @Body() commentDto: CreateCommentDto,
    @Req() req
  ) {
    const role = req.user.role;
    return this.ticketsService.CreateComments(id, commentDto,role);
  }
}
