"use client";

import { motion } from "framer-motion";

export default function ListaReceitas({ receitas }: { receitas: any[] }) {
    if (!receitas || receitas.length === 0) {
        return <p className="bg-red-500 p-4 rounded-lg mt-5 font-bold text-white">Nenhuma receita encontrada!</p>;
    }

    const staggerContainer = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 50 },
        show: { opacity: 1, y: 0 },
    };

    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={staggerContainer}
            className="flex flex-wrap gap-4 w-full  justify-center mt-5"
        >
            <motion.ul
                variants={staggerContainer}
                className="flex flex-wrap gap-4 w-full justify-center"
            >
                {receitas.map(
                    (receita: {
                        id: string;
                        title: string;
                        descricao: string;
                    }) => (
                        <motion.li
                            variants={itemVariants}
                            className="bg-white rounded-xl p-5 text-center flex flex-col gap-4 w-1/4"
                            key={receita.id}
                        >
                            <h3 className="font-bold text-2xl">
                                {receita.title}
                            </h3>
                            <p>{receita.descricao}</p>
                            <motion.a
                                whileHover={{ rotate: 2 }}
                                href={`/receita/${receita.id}`}
                                className="bg-lime-500 font-bold p-2 rounded-lg text-white"
                            >
                                Ver receita completa...
                            </motion.a>
                        </motion.li>
                    )
                )}
            </motion.ul>
        </motion.div>
    );
}
