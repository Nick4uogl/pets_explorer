"use client";
import Link from "next/link";
import { useState, useMemo } from "react";
import BreedCard from "./BreedCard";
import type { DogBreed, CatBreed } from "../types/breeds";

type HomeContentProps = {
  dogBreeds: DogBreed[];
  catBreeds: CatBreed[];
  error: string | null;
};

export default function HomeContent({
  dogBreeds,
  catBreeds,
  error,
}: HomeContentProps) {
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const allBreeds = useMemo(
    () => [
      ...dogBreeds.map((b) => ({ ...b, type: "dog" })),
      ...catBreeds.map((b) => ({ ...b, type: "cat" })),
    ],
    [dogBreeds, catBreeds]
  );
  const suggestions = useMemo(
    () =>
      search.length > 0
        ? allBreeds.filter((b) =>
            b.name.toLowerCase().includes(search.toLowerCase())
          )
        : [],
    [search, allBreeds]
  );
  const filteredDogBreeds = useMemo(
    () =>
      dogBreeds.filter((b) =>
        b.name.toLowerCase().includes(search.toLowerCase())
      ),
    [search, dogBreeds]
  );
  const filteredCatBreeds = useMemo(
    () =>
      catBreeds.filter((b) =>
        b.name.toLowerCase().includes(search.toLowerCase())
      ),
    [search, catBreeds]
  );

  return (
    <main className="min-h-screen bg-white py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Pets Explorer</h1>
      <div className="max-w-md mx-auto mb-8 relative">
        <input
          type="text"
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Search breeds..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
        />
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-md mt-1 max-h-48 overflow-y-auto shadow">
            {suggestions.slice(0, 8).map((b) => (
              <li
                key={b.type + "-" + b.id}
                className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                onMouseDown={() => {
                  setSearch(b.name);
                  setShowSuggestions(false);
                }}
              >
                {b.name}{" "}
                <span className="text-xs text-gray-400">({b.type})</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {error ? (
        <div className="text-red-600 text-center">{error}</div>
      ) : (
        <>
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-center">
              Dog Breeds
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2  auto-cols-auto md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredDogBreeds.length === 0 ? (
                <div className="col-span-full text-center text-gray-500">
                  No dog breeds found.
                </div>
              ) : (
                filteredDogBreeds.map((breed) => (
                  <Link
                    key={breed.id}
                    href={`/breed/dog/${breed.breedId}`}
                    className="block h-full"
                  >
                    <BreedCard name={breed.name} imageUrl={breed.imageUrl} />
                  </Link>
                ))
              )}
            </div>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-center">
              Cat Breeds
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredCatBreeds.length === 0 ? (
                <div className="col-span-full text-center text-gray-500">
                  No cat breeds found.
                </div>
              ) : (
                filteredCatBreeds.map((breed) => (
                  <Link
                    key={breed.id}
                    href={`/breed/cat/${breed.id}`}
                    className="block h-full"
                  >
                    <BreedCard name={breed.name} imageUrl={breed.image!.url} />
                  </Link>
                ))
              )}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
