import { User } from "src/auth/user.entity";
import { TaskRepository } from "./tasks.repository";
import { TasksService } from "./tasks.service"
import { Test } from '@nestjs/testing';
import { Logger } from "@nestjs/common";
import { TaskStatus } from "./task-status.model";

const mockTaskRepository = {
    findAll: jest.fn(),
    getTaskById: jest.fn()
};

const mockUser: User = {
    username: 'test',
    password: 'sdf',
    id: 'asd',
    tasks: []

}
describe('TaskService', () =>{

    let tasksService: TasksService;
    let tasksRepository;


    beforeEach(async () =>{
        const module = await Test.createTestingModule({
            providers: [ 
                TasksService,
                {
                    provide: TaskRepository, 
                    useValue: mockTaskRepository
                }
            ],
        }).compile();

        tasksService = await module.get(TasksService);
        tasksRepository = await module.get(TaskRepository);
    });

    describe('get tasks', () => {
        it('calls task repo and get tasks', async () =>{
            tasksRepository.findAll.mockResolvedValue('somevalue')

            const result = await tasksService.getTasks(null, mockUser)

            expect(tasksRepository.findAll).toHaveBeenCalled();
            expect(result).toBe('somevalue')
        })

    })

    describe('get by id', () =>{
        it('should get', async () =>{
            const mockTask = {
                title: 'test',
                description: 'desc',
                id: 'id',
                status: TaskStatus.DONE
            }
            tasksRepository.getTaskById.mockResolvedValue(mockTask);
            const result = await tasksService.getTaskById('id', mockUser);

            expect(result).toEqual(mockTask);

        })

        it('should get and handle error', async () =>{
            tasksRepository.getTaskById.mockResolvedValue(null);
            expect(tasksService.getTaskById('id', mockUser)).rejects.toThrow()
        });
    })
})