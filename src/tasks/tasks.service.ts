import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/user.entity';


@Injectable()
export class TasksService {


    constructor(@InjectRepository(Task) private taskRepository: Repository<Task>){}

    async getTaskById(id: string): Promise<Task> {
        const found = await this.taskRepository.findOneBy({id});
        if(!found) {
            throw new NotFoundException(`Task with id ${id} not found`);
        }
        return found;
    }

    async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
        const {status, search} = filterDto;
        const query = this.taskRepository.createQueryBuilder('task');

        if(status) {
            query.andWhere(' LOWER(task.status) = LOWER(:status)', {status})
        }

        if(search) {
            query.andWhere(' LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)', {search: `%${search}%`})
        }
        const tasks = await query.getMany();
        return tasks;
    }

    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        const {title, description} = createTaskDto;
        const task: Task = this.taskRepository.create({
            title,
            description,
            status: TaskStatus.OPEN,
            user
        });

        await this.taskRepository.save(task);

        return task;
    }



    async deleteTaskById(id: string): Promise<void> {
        
        const result = await this.taskRepository.delete(id);
        if(result.affected  === 0) {
            throw new NotFoundException(`task with id ${id} not found`);
        }
    }

    async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
        const task = await  this.getTaskById(id);
        task.status = status;
        await this.taskRepository.save(task);
        return task;
    }

}
