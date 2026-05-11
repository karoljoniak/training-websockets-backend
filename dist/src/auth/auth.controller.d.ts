import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private readonly auth;
    constructor(auth: AuthService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        user: import("./auth.service").AuthUser;
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        user: import("./auth.service").AuthUser;
    }>;
}
