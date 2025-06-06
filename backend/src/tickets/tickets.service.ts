import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCommentDto, CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { PrismaService } from 'src/libs/prisma/prisma.service';
import { CloudinaryService } from 'src/libs/cloudinary/src';

@Injectable()
export class TicketsService {
  constructor(private readonly prisma: PrismaService, private cloudinary: CloudinaryService) {}
  async create(createTicketDto: CreateTicketDto, userId: string, attachment?: Express.Multer.File) {
    try {
      if (attachment) {
        const result = await this.cloudinary.uploadFile(attachment);
        createTicketDto.attachmentUrl = result.secure_url;
      }
      const { comments, ...rest } = createTicketDto;

      return await this.prisma.ticket.create({
        data: {
          ...rest,
          owner: {
            connect: { id: userId }, // ✅ uses Prisma relation
          },
          ...(comments?.length && {
            comments: {
              create: comments.map((c) => ({
                author: c.author,
                content: c.content,
              })),
            },
          }),
        },
        include: {
          comments: true,
        },
      });
    } catch (error) {
      throw new BadRequestException(
        error?.meta?.cause || error?.message || 'Failed to create ticket',
      );
    }
  }

  async findAll() {
    try {
      return await this.prisma.ticket.findMany({
        include: {
          comments: true,
        },
      });
    } catch (error) {
      throw new BadRequestException(
        error?.meta?.cause || error?.message || 'Failed to fetch tickets',
      );
    }
  }

  async findUserTickets(ownerid: string) {
    try {
      return await this.prisma.ticket.findMany({
        where: {
          owner: {
            id: ownerid,
          },
        },
        include: {
          comments: true,
        },
      });
    } catch (error) {
      throw new BadRequestException(
        error?.meta?.cause || error?.message || 'Failed to fetch tickets',
      );
    }
  }

  async update(id: string, updateTicketDto: UpdateTicketDto) {
    try {
      return await this.prisma.ticket.update({
        where: { id },
        data: {
          status: updateTicketDto.status,
        },
        include: {
          comments: true,
        },
      });
    } catch (error) {
      throw new BadRequestException(
        error?.meta?.cause || error?.message || 'Failed to update ticket',
      );
    }
  }

  async CreateComments(id: string, commentDto: CreateCommentDto) {
    try {
      return await this.prisma.comment.create({
        data: {
          author: commentDto.author,
          content: commentDto.content,
          ticket: {
            connect: { id },
          },
        },
      });
    } catch (error) {
      throw new BadRequestException(
        error?.meta?.cause || error?.message || 'Failed to fetch comments',
      );
    }
  }
}
