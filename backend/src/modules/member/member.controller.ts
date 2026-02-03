import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { MemberService } from './member.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateMemberDto } from './dto/update-member.dto';

@Controller('members')
@UseGuards(JwtAuthGuard)
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get('profile')
  async getProfile(@Request() req) {
    return this.memberService.findOne(req.user.id);
  }

  @Patch('profile')
  async updateProfile(@Request() req, @Body() updateMemberDto: UpdateMemberDto) {
    return this.memberService.update(req.user.id, updateMemberDto);
  }
}
