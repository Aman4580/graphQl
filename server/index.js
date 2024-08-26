import express from 'express';
import { ApolloServer } from '@apollo/server';
import cors from 'cors';
import bodyParser from 'body-parser';
import { expressMiddleware } from '@apollo/server/express4';
import axios from 'axios';

async function startServer() {
    // initialise express
    const app = express();

    const server = new ApolloServer({
        typeDefs: `
            type User {
                id: ID!,
                name: String!,
                username: String!,
                email: String!,
                phone: String!,
                website: String!,
            },
            type Todo {
                id: ID!,
                title: String!,
                completed: Boolean,
                user: User
            },
            type Query {
                getTodos: [Todo],
                getAllUsers: [User],
                getUser(id: ID!): User
            }
        `,
        resolvers: {
            Todo: {
                user: async (todo) => {
                    console.log('Fetching user for Todo ID:', todo.id);
                    try {
                        const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${todo.id}`);
                        return response.data;
                    } catch (error) {
                        console.error('Error fetching user:', error);
                        return null; // ya koi default user return karein
                    }
                }
            },
            Query: {
                getTodos: async () => {
                    try {
                        const response = await axios.get('https://jsonplaceholder.typicode.com/todos');
                        return response.data;
                    } catch (error) {
                        console.error('Error fetching todos:', error);
                        return []; // ya empty array return karein
                    }
                },
                getAllUsers: async () => {
                    try {
                        const response = await axios.get('https://jsonplaceholder.typicode.com/users');
                        return response.data;
                    } catch (error) {
                        console.error('Error fetching users:', error);
                        return [];
                    }
                },
                getUser: async (parent, { id }) => {
                    try {
                        const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`);
                        return response.data;
                    } catch (error) {
                        console.error('Error fetching user:', error);
                        return null;
                    }
                }
            }
        }
    });

    app.use(bodyParser.json());
    app.use(cors());
    await server.start();
    app.use('/graphql', expressMiddleware(server));
    app.listen(8000, () => {
        console.log(`Server is running on port 8000`);
    });
}

startServer();
