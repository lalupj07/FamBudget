import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Member, MemberRole } from '../../entities/member.entity';
import { Household } from '../../entities/household.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
    @InjectRepository(Household)
    private householdRepository: Repository<Household>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, name, householdName } = registerDto;

    // Check if user already exists
    const existingMember = await this.memberRepository.findOne({
      where: { email },
    });
    if (existingMember) {
      throw new UnauthorizedException('Email already registered');
    }

    // Create household
    const household = this.householdRepository.create({
      name: householdName,
      currency: 'USD',
      timezone: 'UTC',
    });
    await this.householdRepository.save(household);

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create primary member
    const member = this.memberRepository.create({
      email,
      name,
      passwordHash,
      role: MemberRole.PRIMARY,
      household,
      householdId: household.id,
      isActive: true,
    });
    await this.memberRepository.save(member);

    // Generate token
    const token = this.generateToken(member);

    return {
      token,
      member: this.sanitizeMember(member),
      household,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const member = await this.memberRepository.findOne({
      where: { email },
      select: ['id', 'email', 'name', 'role', 'passwordHash', 'householdId'],
      relations: ['household'],
    });

    if (!member) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, member.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(member);

    return {
      token,
      member: this.sanitizeMember(member),
      household: member.household,
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const member = await this.memberRepository.findOne({
      where: { email },
      select: ['id', 'email', 'name', 'role', 'passwordHash', 'householdId'],
    });

    if (member && (await bcrypt.compare(password, member.passwordHash))) {
      const { passwordHash, ...result } = member;
      return result;
    }
    return null;
  }

  private generateToken(member: Member): string {
    const payload = {
      sub: member.id,
      email: member.email,
      householdId: member.householdId,
      role: member.role,
    };
    return this.jwtService.sign(payload);
  }

  private sanitizeMember(member: Member) {
    const { passwordHash, ...sanitized } = member as any;
    return sanitized;
  }
}

