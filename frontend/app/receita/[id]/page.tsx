"use client";

import { useQuery, gql, useMutation } from "@apollo/client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

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

const REMOVE_RECEITA = gql`
    mutation RemoveReceita($id: ID!) {
        removeReceita(id: $id)
    }
`;

export default function ReceitaDetails() {
    const { id } = useParams();
    const router = useRouter();

    const [removeReceita] = useMutation(REMOVE_RECEITA);

    if (!id) {
        return <p>ID invalido ou não encontrado na URL</p>;
    }

    const { loading, error, data } = useQuery(GET_RECEITA, {
        variables: { id },
        onError: (error) => {
            console.log("Erro no Apollo Client:", error);
        },
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await removeReceita({
                variables: { id },
            });
            alert("Receita removida com sucesso!");
            router.push("/");
        } catch (err) {
            console.log("Erro ao remover receita", err);
        }
    };

    if (loading) return <p>Carregando...</p>;
    if (error) {
        console.log("Erro na consulta GraphQL:", error);
        return <p>Erro ao Carregar a Receita: {error.message}</p>;
    }

    const receita = data?.receita;

    if (!receita) {
        return <p>Receita não encontrada</p>;
    }

    const handleCancel = async () => {
        router.push("/")
    }

    return (
        <motion.main
            initial={{ scale: 0.4 }}
            animate={{ scale: 1 }}
            transition={{ ease: "circInOut", duration: 1 }}
            className="flex h-screen justify-center items-center w-full"
        >
            <div className="bg-gray-200 rounded-xl p-5 flex flex-col gap-4 w-2/3 max-w-5xl">
                <div className="flex justify-between">
                    <h1 className="text-3xl font-bold uppercase">
                        {receita.title}
                    </h1>
                    <button onClick={handleCancel} className="bg-blue-500 font-bold p-3 text-white rounded-xl">Cancelar</button>
                </div>
                <p className="font-bold bg-gray-300 rounded-lg p-2">
                    {receita.descricao}
                </p>
                <p className="font-bold uppercase">Ingredientes:</p>
                <p className="font-bold bg-gray-300 rounded-lg p-2">
                    {receita.ingredientes.map(
                        (ingredientes: string, index: string) => (
                            <li key={index}>{ingredientes.trim()}</li>
                        )
                    )}
                </p>
                <p className="font-bold uppercase">Modo de Preparo</p>
                <p className="font-bold bg-gray-300 rounded-lg p-2">
                    {receita.preparo.map((passo: string, index: string) => (
                        <li key={index}>{passo.trim()}</li>
                    ))}
                </p>
                <div className="flex justify-between">
                    <Link href={`/receita/${id}/updateReceitas`}>
                        <button className="bg-orange-500 text-white p-2 rounded-lg font-bold mt-4">
                            Editar Receita
                        </button>
                    </Link>
                    <motion.button
                        onClick={handleSubmit}
                        className="bg-red-500 text-white p-2 rounded-lg font-bold mt-4"
                    >
                        Remover
                    </motion.button>
                </div>
            </div>
        </motion.main>
    );
}
