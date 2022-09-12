import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../utils/prisma";

export default NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
        }),
    ],
    jwt: {
        encryption: true,
    },
    secret: process.env.SECRET,
    callbacks: {
        async jwt(token, account) {
            if (account?.accessToken) {
                token.accessToken = account.accessToken;
            }
            return token;
        },
        redirect: async (url, baseUrl) => {
            if(url === '/task-list' || url === '/calendar' || url === '/text-editor') {
                return Promise.resolve('/');
            }
            return Promise.resolve('/');
        }
    },
    debug: true,
})