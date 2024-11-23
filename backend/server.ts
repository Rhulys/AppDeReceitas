import express from "express";
import { ApolloServer } from "apollo-server-express";
import mongoose from "mongoose";
import { typeDefs, resolvers } from "./schema";
import "dotenv/config";

const MONGODB_URI =
    process.env.MONGODB_URI || "mongodb://localhost:27017/receitas";

mongoose
    .connect(MONGODB_URI)
    .then(() => console.log("Conectado ao MongoDB"))
    .catch((error) => console.error("Erro ao conectar ao MongoDB", error));

const startServer = async () => {
    const app = express();
    const server = new ApolloServer({
        typeDefs,
        resolvers,
    });

    await server.start();
    server.applyMiddleware({ app, path: "/graphql" });

    app.listen({ port: 4000 }, () => {
        console.log("Servidor rodando em http://localhost:4000/graphql");
    });
};

startServer()