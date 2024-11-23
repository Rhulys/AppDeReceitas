"use client";

import { useMutation, useQuery, gql } from "@apollo/client";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const GET_RECEITA = gql`
    query GetReceita($id: ID!) {
        receita(id: $id) {
            id
            title
            descricao
            ingredientes
            preparo
        }
    }
`;

const UPDATE_RECEITA = gql`
    mutation UpdateReceita(
        $id: ID!
        $title: String!
        $descricao: String!
        $ingredientes: [String!]!
        $preparo: [String!]!
    ) {
        updateReceita(
            id: $id
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

export default function EditReceita() {
    const params = useParams();
    const id = params?.id;
    const router = useRouter();

    const { loading, error, data } = useQuery(GET_RECEITA, {
        variables: { id },
    });

    const [updateReceita] = useMutation(UPDATE_RECEITA);
    const [title, setTitle] = useState("");
    const [descricao, setDescricao] = useState("");
    const [ingredientes, setIngredientes] = useState("");
    const [preparo, setPreparo] = useState("");

    useEffect(() => {
        if (data?.receita) {
            setTitle(data.receita.title || "");
            setDescricao(data.receita.descricao || "");
            setIngredientes(data.receita.ingredientes.join(",") || "");
            setPreparo(data.receita.preparo.join(",") || "");
        }
    }, [data]);

    if (loading) return <p>Carregando...</p>;
    if (error) return <p>Erro ao carregar receita: {error.message}</p>;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const variables = {
            id,
            title,
            descricao,
            ingredientes: ingredientes.split(",").map((i) => i.trim()),
            preparo: preparo.split(",").map((p) => p.trim()),
        };

        try {
            const response = await updateReceita({ variables });
            alert("Receita atualizada com sucesso!");
            router.push("/");
        } catch (err) {
            console.error("Erro ao atualizar receita:", err);
        }
    };

    const handleCancel = async () => {
        router.push("/");
    };

    return (
        <div className="flex flex-col items-center">
            <div className="flex justify-between w-2/3 items-center">
                <h1 className="font-bold text-2xl text-lime-400 uppercase my-5">
                    Edite a Receita
                </h1>
                <button
                    onClick={handleCancel}
                    className="bg-blue-500 font-bold p-3 text-white rounded-xl"
                >
                    Cancelar
                </button>
            </div>
            <motion.form
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
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <p className="font-bold">Descrição:</p>
                    <textarea
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        className="rounded-lg p-2 h-20"
                    ></textarea>
                </div>
                <div className="flex flex-col gap-2">
                    <p className="font-bold">Ingredientes:</p>
                    <input
                        value={ingredientes}
                        onChange={(e) => setIngredientes(e.target.value)}
                        type="text"
                        className="rounded-lg p-2"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <p className="font-bold">Modo de Preparo:</p>
                    <textarea
                        value={preparo}
                        onChange={(e) => setPreparo(e.target.value)}
                        className="rounded-lg p-2 h-20"
                        placeholder="Digite o Modo de Preparo da Receita..."
                    ></textarea>
                </div>
                <motion.input
                    whileHover={{ scale: 0.9, rotate: 1 }}
                    type="submit"
                    value="Salvar alterações"
                    className="bg-gray-200 font-bold p-2 rounded-lg"
                />
            </motion.form>
        </div>
    );
}
