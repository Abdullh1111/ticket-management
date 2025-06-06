import { PartialType } from '@nestjs/mapped-types';
import { CreateTicketDto } from './create-ticket.dto';
import { IsEnum, IsString } from 'class-validator';
import { Status } from '@prisma/client';

export class UpdateTicketDto extends PartialType(CreateTicketDto) {
    @IsEnum(Status)
    status: Status
}
