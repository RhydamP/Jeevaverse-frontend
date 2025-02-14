"use client";
import { useEffect, useMemo, useState } from "react";
import { listProducts } from "@lib/data/products";
import { useParams } from "next/navigation";
import { HttpTypes } from "@medusajs/types";
import LocalizedClientLink from "@modules/common/components/localized-client-link";

export function SearchField() {
    const [search, setSearch] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [products, setProducts] = useState<HttpTypes.StoreProduct[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<HttpTypes.StoreProduct[]>([]);
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const countryCode = useParams().countryCode as string;
    const queryParams = 100;

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await listProducts({
                    countryCode: countryCode,
                    pageParam: 1,
                    queryParams: {
                        limit: queryParams,
                        fields: "id,title,handle,thumbnail",
                    },
                });
                setProducts(response.response?.products || []);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        if (search.trim() === "") {
            setFilteredProducts([]);
            setShowDropdown(false);
        } else {
            const results = products.filter((product) =>
                product.title.toLowerCase().includes(search.toLowerCase()) ||
                product.handle.toLowerCase().includes(search.toLowerCase())
            );
            setFilteredProducts(results);
            setShowDropdown(true);
        }
    }, [search, products]);

    return (
        <div className="relative w-[50%] mb-2 ">
            <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
                Search
            </label>
            <div className="relative ">
                <input
                    type="search"
                    id="default-search"
                    className="block w-full p-4 ps-10 text-sm text-gray-900 border border-lime-300 rounded-lg bg-lime-50 focus:ring-lime-500 focus:border-lime-500 dark:bg-lime-700 dark:border-lime-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-lime-500 dark:focus:border-lime-500 font-size search-bar"
                    placeholder="Search Tortoise, Iguana..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            {showDropdown && filteredProducts.length > 0 && (
                <ul className="fixed bg-white border border-gray-300 rounded-lg shadow-lg mt-1 dark:bg-gray-700 dark:border-gray-600">
                    {filteredProducts.map((product) => (
                        <LocalizedClientLink  key={product.id}  href={`/products/${product.handle}`}>
                        <li className="p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
                            {product.title}
                        </li>
                        </LocalizedClientLink>
                    ))}
                </ul>
            )}
        </div>
    );
}