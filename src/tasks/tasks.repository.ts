import { Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import {Repository } from "typeorm";
import { Task } from '../tasks/task.entity'
import { InjectRepository } from "@nestjs/typeorm";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { User } from "../auth/user.entity";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskStatus } from "./task-status.model";

@Injectable()
export class TaskRepository {

    private logger = new Logger('Task Repo', {timestamp: true});

    constructor(
        @InjectRepository(Task) 
        private readonly taskEntityRepository: Repository<Task>
    ){}

    async findAll(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
        const {status, search} = filterDto;
        const query = this.taskEntityRepository.createQueryBuilder('task');


        query.where({user});

        if(status) {
            query.andWhere(' LOWER(task.status) = LOWER(:status)', {status})
        }

        if(search) {
            query.andWhere(' (LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))', {search: `%${search}%`})
        }
        try{
            const tasks = await query.getMany();
            return tasks;
        } catch(err) {
            this.logger.error(`Failed to get tasks for user ${user.username} and filter ${JSON.stringify(filterDto)}`, err.stack);
            throw new InternalServerErrorException();
        }

    }

    async getTaskById(id: string, user: User): Promise<Task> {
        return await this.taskEntityRepository.findOne({ where:{id, user}});
       
    }

    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        const {title, description} = createTaskDto;
        const task: Task = this.taskEntityRepository.create({
            title,
            description,
            status: TaskStatus.OPEN,
            user
        });

        await this.taskEntityRepository.save(task);

        return task;
    }

    async deleteTaskById(id: string, user: User): Promise<void> {
        
        const result = await this.taskEntityRepository.delete({id, user});
        if(result.affected  === 0) {
            throw new NotFoundException(`task with id ${id} not found`);
        }
    }

    async updateTaskStatus(id: string, status: TaskStatus, user: User): Promise<Task> {
        const task = await  this.getTaskById(id, user);
        task.status = status;
        await this.taskEntityRepository.save(task);
        return task;
    }



}