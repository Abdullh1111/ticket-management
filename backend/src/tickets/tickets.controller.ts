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
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateCommentDto, CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth-guard';
import { Roles } from 'src/auth/src/roles.decorator';
import { Role } from '@prisma/client';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createTicketDto: CreateTicketDto, @Req() req) {
    const ownerid = req.user.id;
    return this.ticketsService.create(createTicketDto, ownerid);
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
  ) {
    return this.ticketsService.CreateComments(id, commentDto);
  }
}
