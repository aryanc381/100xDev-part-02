import { prisma } from "../lib/prisma";

export async function signup(name: string, email: string, password: string) {
    const existingUser = await prisma.user.findFirst({
        where: {
            email: email
        }
    });

    if(existingUser) {
        console.log(`Existing user found ${existingUser.name}`)
        return { status: 405, user: existingUser };
    }
    
    const newUser = await prisma.user.create({
        data: {
            name: name,
            email: email,
            password: password     
        }
    });

    return { status: 200, user: newUser }
}