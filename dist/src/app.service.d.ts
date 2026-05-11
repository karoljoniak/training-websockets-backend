import { PrismaService } from './prisma/prisma.service';
export declare class AppService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getHello(): string;
    findUsers(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        email: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
}
