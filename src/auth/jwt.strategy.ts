import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserRepository } from "./users.repository";
import { JwtPayload } from "./dto/jwt-payload.interface";
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>
    ){
        super({ secretOrKey: 'topSecret51', jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()});
    }

    async validate(payload: JwtPayload): Promise<User> {
        const {username} = payload;
        const user: User = await this.usersRepository.findOneBy({username});

        if(!user) {
            throw new UnauthorizedException();
        }

        return user;

    }
}