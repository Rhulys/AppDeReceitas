import { gql } from "graphql-tag";
import mongoose from "mongoose";

const receitaSchema = new mongoose.Schema({
    title: String,
    descricao: String,
    ingredientes: [String],
    preparo: [String],
});

const Receita = mongoose.model("Receita", receitaSchema);

export const typeDefs = gql`
    type Receita {
        id: ID!
        title: String!
        descricao: String!
        ingredientes: [String!]!
        preparo: [String!]!
    }

    type Query {
        receitas(search: String): [Receita]
        receita(id: ID!): Receita
    }

    type Mutation {
        addReceita(
            title: String!
            descricao: String!
            ingredientes: [String!]!
            preparo: [String!]!
        ): Receita
        removeReceita(id: ID!): ID
        updateReceita(
            id: ID!
            title: String!
            descricao: String!
            ingredientes: [String!]!
            preparo: [String!]!
        ): Receita
    }
`;

export const resolvers = {
    Query: {
        receitas: async (_: any, { search }: { search?: string }) => {
            if (search) {
                const regex = new RegExp(search, "i");
                return await Receita.find({
                    $or: [{ title: regex }, { descricao: regex }],
                });
            }
            return await Receita.find();
        },
        receita: async (_: any, { id }: any) => await Receita.findById(id),
    },
    Mutation: {
        addReceita: async (
            _: any,
            { title, descricao, ingredientes, preparo }: any
        ) => {
            const receita = new Receita({
                title,
                descricao,
                ingredientes,
                preparo,
            });
            await receita.save();
            return receita;
        },
        removeReceita: async (_: any, { id }: { id: string }) => {
            const result = await Receita.findByIdAndDelete(id);
            return result ? id : null;
        },
        updateReceita: async (
            _: any,
            {
                id,
                title,
                descricao,
                ingredientes,
                preparo,
            }: {
                id: string;
                title: string;
                descricao: string;
                ingredientes: string[];
                preparo: string[];
            }
        ) => {
            try {
                const updateReceita = await Receita.findByIdAndUpdate(
                    id,
                    { title, descricao, ingredientes, preparo },
                    { new: true }
                );
                if (!updateReceita) {
                    throw new Error("Receita não encontrada!");
                }
                return updateReceita;
            } catch (error) {
                throw new Error("Falha ao atualizar a Receita");
            }
        },
    },
};
