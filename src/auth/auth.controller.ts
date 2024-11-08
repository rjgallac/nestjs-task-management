import { Body, Controller, Post } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService){}

    @Post('/signup')
    signup(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.authService.createUser(authCredentialsDto);
    }

    @Post('/signin')
    signin(@Body() authCredentialsDto: AuthCredentialsDto): Promise<string> {
        return this.authService.signin(authCredentialsDto);
    }
    

}
