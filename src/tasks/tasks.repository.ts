import { Injectable } from "@nestjs/common";
import {Repository } from "typeorm";
import { Task } from '../tasks/task.entity'

@Injectable()
export class TaskRepository extends Repository<Task> {

    

}