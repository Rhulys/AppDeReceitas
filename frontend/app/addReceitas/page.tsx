"use client";

import React, { useState } from "react";
import { useMutation, gql, useQuery } from "@apollo/client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const GET_RECEITAS = gql`
    query GetReceitas {
        receitas {
            id
            title
            descricao
            ingredientes
            preparo
        }
    }
`;

const ADD_RECEITA = gql`
    mutation AddReceita(
        $title: String!
        $descricao: String!
        $ingredientes: [String!]!
        $preparo: [String!]!
    ) {
        addReceita(
            title: $title
            descricao: $descricao
            ingredientes: $ingredientes
            preparo: $preparo
        ) {
            id
            title
            descricao
            ingredientes
            preparo
        }
    }
`;


export default function Home() {
    const [title, setTitle] = useState("");
    const [descricao, setDescricao] = useState("");
    const [ingredientes, setIngredientes] = useState("");
    const [preparo, setPreparo] = useState("");
    const [addReceita] = useMutation(ADD_RECEITA);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !descricao || !ingredientes || !preparo) return;
    
        const variables = {
            title,
            descricao,
            ingredientes: ingredientes.split(",").map((i) => i.trim()), 
            preparo: preparo.split(",").map((p) => p.trim()),          
        };
    
        console.log("Enviando dados para a mutação:", variables);
    
        try {
            const response = await addReceita({ variables });
            setTitle("");
            setDescricao("");
            setIngredientes("");
            setPreparo("");
            router.push("/");
        } catch (error) {
            console.error("Erro ao adicionar receita:", error);
        }
    };
    

    return (
        <div className="flex flex-col items-center">
            <h1 className="font-bold text-2xl text-lime-400 uppercase my-5">
                Adicione uma nova Receita
            </h1>
            <motion.form
                initial={{ opacity: 0, x: 150 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                onSubmit={handleSubmit}
                className="p-10 bg-lime-500 rounded-xl flex flex-col gap-4 w-2/3"
            >
                <div className="flex flex-col gap-2">
                    <p className="font-bold">Título:</p>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        type="text"
                        className="rounded-lg p-2"
                        placeholder="Digite o Título da Receita..."
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <p className="font-bold">Descrição:</p>
                    <textarea
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        className="rounded-lg p-2 h-20"
                        placeholder="Digite a Descrição da Receita..."
                    ></textarea>
                </div>
                <div className="flex flex-col gap-2">
                    <p className="font-bold">Ingredientes:</p>
                    <input
                        value={ingredientes}
                        onChange={(e) => setIngredientes(e.target.value)}
                        type="text"
                        className="rounded-lg p-2"
                        placeholder="Digite os Ingredientes da Receita separado por vírgulas..."
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <p className="font-bold">Modo de Preparo:</p>
                    <textarea
                        value={preparo}
                        onChange={(e) => setPreparo(e.target.value)}
                        className="rounded-lg p-2 h-20"
                        placeholder="Digite o Modo de Preparo da Receita separado por vírgulas..."
                    ></textarea>
                </div>
                <motion.button
                    whileHover={{
                        scale: 1.05,
                        transition: { duration: 0.5 },
                    }}
                    type="submit"
                    className="bg-gray-200 font-bold p-2 rounded-lg"
                >
                    Adicionar
                </motion.button>
            </motion.form>
        </div>
    );
}
