import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { User } from '../auth/user.entity';


@Injectable()
export class TasksService {

    private logger = new Logger('Task Service', {timestamp: true});

    constructor(
        private taskEntityRepository: TaskRepository
    ){}

    async getTaskById(id: string, user: User): Promise<Task> {
        const found = await this.taskEntityRepository.getTaskById(id, user)
        if(!found) {
            throw new NotFoundException(`Task with id ${id} not found`);
        }
        return found;
    }

    async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
        return this.taskEntityRepository.findAll(filterDto, user);

    }

    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        return this.taskEntityRepository.createTask(createTaskDto, user);
    }



    async deleteTaskById(id: string, user: User): Promise<void> {
        return await this.taskEntityRepository.deleteTaskById(id, user);
    }

    async updateTaskStatus(id: string, status: TaskStatus, user: User): Promise<Task> {
        return this.taskEntityRepository.updateTaskStatus(id, status, user);
    }

}
