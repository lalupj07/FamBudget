import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from '../../entities/member.entity';
import { UpdateMemberDto } from './dto/update-member.dto';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
  ) {}

  async findOne(id: string): Promise<Member> {
    const member = await this.memberRepository.findOne({
      where: { id },
      relations: ['household'],
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    // Remove password hash from response
    const { passwordHash, ...memberWithoutPassword } = member;
    return memberWithoutPassword as Member;
  }

  async update(id: string, updateMemberDto: UpdateMemberDto): Promise<Member> {
    const member = await this.memberRepository.findOne({
      where: { id },
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    Object.assign(member, updateMemberDto);
    await this.memberRepository.save(member);

    return this.findOne(id);
  }
}
