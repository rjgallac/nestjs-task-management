import { Injectable } from "@nestjs/common";
import {Repository } from "typeorm";
import { Task } from '../tasks/task.entity'
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";

@Injectable()
export class TaskRepository extends Repository<Task> {

    

}