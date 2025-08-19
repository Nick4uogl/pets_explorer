export type DogBreedDetail = {
  id: string;
  name: string;
  temperament?: string;
  life_span?: string;
  origin?: string;
  bred_for?: string;
  breed_group?: string;
  description?: string;
  weight?: { imperial: string; metric: string };
  height?: { imperial: string; metric: string };
  image?: { url: string };
};

export type DogImageApi = {
  id: string;
  url: string;
  breeds: { id: number; name: string }[];
};

export type CatBreedDetail = {
  id: string;
  name: string;
  temperament?: string;
  origin?: string;
  description?: string;
  life_span?: string;
  wikipedia_url?: string;
  weight?: { imperial: string; metric: string };
  height?: { imperial: string; metric: string };
  image?: { url: string };
};

export type GalleryImage = {
  id: string;
  url: string;
};

export type DogBreed = {
  id: string;
  breedId: number;
  name: string;
  imageUrl: string;
};

export type CatBreed = {
  id: string;
  name: string;
  image?: { url: string };
};
