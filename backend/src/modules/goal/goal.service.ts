import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Goal, GoalStatus } from '../../entities/goal.entity';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { ContributeToGoalDto } from './dto/contribute-to-goal.dto';

@Injectable()
export class GoalService {
  constructor(
    @InjectRepository(Goal)
    private goalRepository: Repository<Goal>,
  ) {}

  async findAll(householdId: string): Promise<Goal[]> {
    return this.goalRepository.find({
      where: { householdId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Goal> {
    const goal = await this.goalRepository.findOne({
      where: { id },
    });

    if (!goal) {
      throw new NotFoundException(`Goal with ID ${id} not found`);
    }

    return goal;
  }

  async create(householdId: string, createGoalDto: CreateGoalDto): Promise<Goal> {
    const goal = this.goalRepository.create({
      ...createGoalDto,
      householdId,
      currentAmount: createGoalDto.currentAmount || 0,
      status: GoalStatus.ACTIVE,
    });

    return this.goalRepository.save(goal);
  }

  async update(id: string, updateGoalDto: UpdateGoalDto): Promise<Goal> {
    const goal = await this.findOne(id);

    // Check if goal is completed and prevent updates
    if (goal.status === GoalStatus.COMPLETED) {
      throw new BadRequestException('Cannot update a completed goal');
    }

    // Auto-complete goal if current amount reaches target
    if (updateGoalDto.currentAmount && updateGoalDto.currentAmount >= goal.targetAmount) {
      updateGoalDto.status = GoalStatus.COMPLETED;
    }

    Object.assign(goal, updateGoalDto);
    return this.goalRepository.save(goal);
  }

  async delete(id: string): Promise<void> {
    const goal = await this.findOne(id);
    await this.goalRepository.remove(goal);
  }

  async contributeToGoal(id: string, contributeDto: ContributeToGoalDto): Promise<Goal> {
    const goal = await this.findOne(id);

    if (goal.status !== GoalStatus.ACTIVE) {
      throw new BadRequestException('Cannot contribute to inactive or completed goal');
    }

    const newAmount = goal.currentAmount + contributeDto.amount;
    
    // Auto-complete if target is reached
    const status = newAmount >= goal.targetAmount ? GoalStatus.COMPLETED : goal.status;

    await this.goalRepository.update(id, {
      currentAmount: newAmount,
      status,
    });

    return this.findOne(id);
  }

  async getGoalProgress(id: string): Promise<{
    goal: Goal;
    progressPercentage: number;
    remainingAmount: number;
    daysRemaining?: number;
    isOverdue: boolean;
  }> {
    const goal = await this.findOne(id);
    const progressPercentage = (goal.currentAmount / goal.targetAmount) * 100;
    const remainingAmount = Math.max(0, goal.targetAmount - goal.currentAmount);

    let daysRemaining: number | undefined;
    let isOverdue = false;

    if (goal.deadline) {
      const today = new Date();
      const deadline = new Date(goal.deadline);
      const diffTime = deadline.getTime() - today.getTime();
      daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      isOverdue = daysRemaining < 0;
    }

    return {
      goal,
      progressPercentage,
      remainingAmount,
      daysRemaining,
      isOverdue,
    };
  }

  async getHouseholdGoalStats(householdId: string): Promise<{
    totalGoals: number;
    activeGoals: number;
    completedGoals: number;
    totalTargetAmount: number;
    totalCurrentAmount: number;
    overallProgress: number;
  }> {
    const goals = await this.findAll(householdId);
    
    const totalGoals = goals.length;
    const activeGoals = goals.filter(g => g.status === GoalStatus.ACTIVE).length;
    const completedGoals = goals.filter(g => g.status === GoalStatus.COMPLETED).length;
    
    const totalTargetAmount = goals.reduce((sum, goal) => sum + Number(goal.targetAmount), 0);
    const totalCurrentAmount = goals.reduce((sum, goal) => sum + Number(goal.currentAmount), 0);
    const overallProgress = totalTargetAmount > 0 ? (totalCurrentAmount / totalTargetAmount) * 100 : 0;

    return {
      totalGoals,
      activeGoals,
      completedGoals,
      totalTargetAmount,
      totalCurrentAmount,
      overallProgress,
    };
  }
}
