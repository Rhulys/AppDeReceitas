"use client";

import React, { useState } from "react";
import ListaReceitas from "./components/ListaReceitas";
import { motion } from "framer-motion";
import { gql, useQuery } from "@apollo/client";

const GET_RECEITAS = gql`
    query GetReceitas($search: String) {
        receitas(search: $search) {
            id
            title
            descricao
        }
    }
`;

export default function Home() {
    const [search, setSearch] = useState("")
    const {loading, error, data, refetch} = useQuery(GET_RECEITAS, {
        variables: {search: null}
    })

    const handleSearch = () => {
        refetch(search ? {search}: {search: null})
    }

    if (loading) return <p>Carregando...</p>;
    if (error) return <p>Erro ao carregar receitas: {error.message}</p>;

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-full px-5">
                <h1 className="absolute inset-0 text-center font-bold text-4xl text-lime-400 uppercase my-5">
                    Lista de Receitas
                </h1>
                <motion.a
                whileHover={{ scale: 1.1, rotate: -3 }}
                    whileTap={{ scale: 0.9, rotate: 3 }}
                    href="/addReceitas"
                    className="absolute right-10 top-5 text-black bg-lime-400 font-bold p-2 rounded-lg"
                >
                    Adicionar Receita
                </motion.a>
            </div>
            <div className="mt-20">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Procure uma receita..."
                    className="rounded-l-lg p-2 outline-none"
                />
                <motion.button
                    whileHover={{
                        backgroundColor: "#000",
                        color: "#84cc16",
                    }}
                    onClick={handleSearch}
                    className="bg-lime-500 rounded-r-lg p-2 font-bold"
                >
                    Buscar
                </motion.button>
            </div>
            <ListaReceitas receitas={data.receitas}/>
        </div>
    );
}
