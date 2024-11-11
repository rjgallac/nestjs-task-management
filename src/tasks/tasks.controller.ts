import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task-status.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { getUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    constructor(private taskService: TasksService){}




    @Get()
    getTasks(
        @Query() filterDto: GetTasksFilterDto,
        @getUser() user: User
    ): Promise<Task[]> {
        return this.taskService.getTasks(filterDto, user);
    }

    @Get('/:id')
    getTaskById(
        @Param('id') id: string,
        @getUser() user: User) : Promise<Task> {
        return this.taskService.getTaskById(id, user);
    }


    @Post()
    createTask(
        @Body() createTaskDto: CreateTaskDto,
        @getUser() user: User
    ): Promise<Task> {
        return this.taskService.createTask(createTaskDto, user);
    }

    @Delete('/:id')
    deleteTaskById(
        @Param('id') id: string,
        @getUser() user: User) :void {
        this.taskService.deleteTaskById(id, user);
    }

    @Patch('/:id/status')
    pathTaskStatus(
        @Param('id') id: string, 
        @Body() updateTaskStatusDto: UpdateTaskStatusDto,
        @getUser() user: User) : Promise<Task> {
        const { status } = updateTaskStatusDto;
        return this.taskService.updateTaskStatus(id, status, user);
    }


}
