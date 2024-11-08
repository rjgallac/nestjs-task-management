import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt'; 
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './dto/jwt-payload.interface';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) 
        private userRepository: Repository<User>,
        private jwtService: JwtService
    ){}

    async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void>{
        const {username, password} = authCredentialsDto;

        const salt  = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = this.userRepository.create({
            username,
            password: hashedPassword
        })
        try{
            const savedUser = await this.userRepository.save(user);

        } catch(error){
            if(error.code === '23505') {
                throw new ConflictException('username already exists');
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async signin(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string} > {
        const {username, password} = authCredentialsDto;
        console.log(username)
        const user = await this.userRepository.findOneBy({username});

        if(user && (await bcrypt.compare(password, user.password))) {
            const payload: JwtPayload = { username };
            const accessToken: string = await this.jwtService.sign(payload);

            return { accessToken };

        } else {
            throw new UnauthorizedException('please check your auth')
        }
    }
}
