import { AppDataSource } from "../config/database.js";
import { User } from "../entities/User.js";
import bcrypt from "bcrypt";

export class UserService {
    private userRepository = AppDataSource.getRepository(User);
    
    async createUser(name: string, email: string ,password: string, phone?: string){
        //Verificar si el mail ya existe
        const existingUser = await this.userRepository.findOne({where: { email }});
        if (existingUser) {
            throw new Error("El mail ya está en uso.");
        }

        //Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        //Crear el nuevo usuario
        const userData:{
            name: string;
            email: string;
            password: string;
            phone?: string;
        } = {
            name,
            email,
            password: hashedPassword,   
        };

        if (phone) {
            userData.phone = phone;
        }
        const user = this.userRepository.create(userData);
        await this.userRepository.save(user);

        //Retornar el usuario sin la contraseña
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async findUserByEmail(email: string) {
        return this.userRepository.findOneBy({ email });
    }

    async findUserById(id: string) {
        return this.userRepository.findOneBy({ id });   
    }

    async validatePassword(plainPassword: string, hashedPassword: string) {
        return bcrypt.compare(plainPassword, hashedPassword);
    }
}