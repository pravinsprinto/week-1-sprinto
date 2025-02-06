// Home page
"use client"
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import BookList from "../components/BookList";
export default function Home() {
    return (
        <Theme>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8 text-center">
                    Books Library
                </h1>
                <BookList />
            </div>
        </Theme>
    )
}