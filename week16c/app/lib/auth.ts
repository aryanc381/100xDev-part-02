import CredentialProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import dotenv from 'dotenv';

dotenv.config();

export const NEXT_AUTH = {
    providers: [
        CredentialProvider({
            name: 'Email',
            credentials: {
                username: { label: 'email', type: 'text', placeholder: ''},
                password: { label: 'password', type: 'text', placeholder: ''}
            },
            async authorize(credentials: any) {
                return {
                 id: "user1",
                 name: "Aryan",
                 email: "aryan@gmail.com"
                };
            },
        }),
        GoogleProvider({
            clientId: process.env.CLIENT_ID!,
            clientSecret: process.env.CLIENT_SECRET!
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        //@ts-ignore
        jwt: ({token, user}) => {
            console.log(token);
            return token;
        },
        session: ({session, token, user}: any) => {
            console.log(session);
            if(session && session.user) {
                session.user.id = token.userId; 
            }
            return session;
        }
    }
}