"use client";

import { ApolloProvider } from "@apollo/client";
import client from "./ApolloClient";
import "./globals.css";

export default function RootLayout({ children }) {
    return (
        <html>
            <body className="bg-bg bg-cover">
                <div className="absolute inset-0 bg-black opacity-70 z-10 h-full"></div>
                <div className="relative z-20">
                    <ApolloProvider client={client}>{children}</ApolloProvider>
                </div>
            </body>
        </html>
    );
}
