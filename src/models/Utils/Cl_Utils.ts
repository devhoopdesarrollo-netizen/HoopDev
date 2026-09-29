import bcrypt from "bcryptjs";
import * as jose from "jose";
declare const process: {
    env: {
        JWT_SECRET?: string;
    };
};
const JWT_SECRET = "duval"

export default class Cl_UtilidadesLogin {


    static async cifrarPassword(password: string): Promise<string> {
        try {
            const saltRounds = 10;
            return await bcrypt.hash(password, saltRounds);
        } catch (error) {
            throw new Error("Error al cifrar la contraseña: " + error);
        }
    }

    static async compararPassword(passwordPlano: string, passwordHash: string): Promise<boolean> {
        try {
            return await bcrypt.compare(passwordPlano, passwordHash);
        } catch (error) {
            throw new Error("Error al comparar las contraseñas: " + error);
        }
    }
    static async generedToken(userID: string): Promise<string> {
        const jwtSecret = (typeof process !== 'undefined' && process.env?.JWT_SECRET) ? process.env.JWT_SECRET : "IBapH/Er9f4OZ92dslr1Jm8zGrL6q79hHpYKQeDHa21Cklu6N8quEsi3HGyOJR3qvdEDfJ8ukpN8FpCOhooSzg==";
        const secret = new TextEncoder().encode(jwtSecret);
        return await new jose.SignJWT({
            sub: userID,
            role: "authenticated",
            aud: "authenticated",
            status: true
        })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("2d")
            .sign(secret);
    }
    static async verificToken(token: string): Promise<any> {
        try {
            const jwtSecret = (typeof process !== 'undefined' && process.env?.JWT_SECRET) ? process.env.JWT_SECRET : "IBapH/Er9f4OZ92dslr1Jm8zGrL6q79hHpYKQeDHa21Cklu6N8quEsi3HGyOJR3qvdEDfJ8ukpN8FpCOhooSzg==";
            const secret = new TextEncoder().encode(jwtSecret);
            const { payload } = await jose.jwtVerify(token, secret);
            return payload;
        } catch (error) {
            throw new Error("Token Inválido o expirado");
        }
    }
}