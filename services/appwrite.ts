import { Account, Client, Databases, ID, Query } from "react-native-appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const METRICS_COLLECTION_ID =
  process.env.EXPO_PUBLIC_APPWRITE_METRICS_COLLECTION_ID!;
const FAVORITES_COLLECTION_ID =
  process.env.EXPO_PUBLIC_APPWRITE_FAVORITES_COLLECTION_ID!;

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const database = new Databases(client);

const account = new Account(client);

// ✅ Anonymous session creation
export async function initSession() {
  try {
    // Attempt to retrieve the current session or create an anonymous session if none exists
    return await account.getSession("current");
  } catch {
    try {
      return await account.createAnonymousSession();
    } catch (error) {
      console.error("Failed to initialize session:", error);
      throw error;
    }
  }
}

export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    const result = await database.listDocuments(
      DATABASE_ID,
      METRICS_COLLECTION_ID,
      [Query.equal("searchTerm", query)]
    );

    if (result.documents.length > 0) {
      const existingMovie = result.documents[0];
      await database.updateDocument(
        DATABASE_ID,
        METRICS_COLLECTION_ID,
        existingMovie.$id,
        {
          count: existingMovie.count + 1,
        }
      );
    } else {
      await database.createDocument(
        DATABASE_ID,
        METRICS_COLLECTION_ID,
        ID.unique(),
        {
          searchTerm: query,
          movie_id: movie.id,
          title: movie.title,
          poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          count: 1,
        }
      );
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getTrendingMovies = async (): Promise<
  TrendingMovie[] | undefined
> => {
  try {
    const result = await database.listDocuments(
      DATABASE_ID,
      METRICS_COLLECTION_ID,
      [Query.limit(5), Query.orderDesc("count")]
    );
    return result.documents as unknown as TrendingMovie[];
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

export const addMovieToFavorites = async (
  movie: MovieDetails | null,
  userId: string
) => {
  try {
    await database.createDocument(
      DATABASE_ID,
      FAVORITES_COLLECTION_ID,
      ID.unique(),
      {
        userId,
        movie_id: movie?.id,
        movie_title: movie?.title,
        poster_url: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
      }
    );
  } catch (error) {
    console.error("Error adding movie to favorites:", error);
    throw error;
  }
};

export const fetchSavedMovies = async (userId: string | undefined) => {
  if (!userId) return [];
  try {
    const result = await database.listDocuments(
      DATABASE_ID,
      FAVORITES_COLLECTION_ID,
      [Query.equal("userId", userId), Query.orderDesc("$createdAt")]
    );
    return result.documents as unknown as SavedMovie[];
  } catch (error) {
    console.error("Error fetching saved movies:", error);
    return [];
  }
};
export const removeMovieFromFavorites = async (
  movie_id: number,
  userId: string
) => {
  try {
    // find the saved movie by movie_id + userId
    const result = await database.listDocuments(
      DATABASE_ID,
      FAVORITES_COLLECTION_ID,
      [Query.equal("movie_id", movie_id), Query.equal("userId", userId)]
    );

    if (result.documents.length > 0) {
      const docId = result.documents[0].$id;
      await database.deleteDocument(
        DATABASE_ID,
        FAVORITES_COLLECTION_ID,
        docId
      );
    }
  } catch (error) {
    console.error("Error removing movie from favorites:", error);
    throw error;
  }
};

export const isMovieFavorited = async (
  movieId: number,
  userId: string
): Promise<boolean> => {
  try {
    const result = await database.listDocuments(
      DATABASE_ID,
      FAVORITES_COLLECTION_ID,
      [Query.equal("movie_id", movieId), Query.equal("userId", userId)]
    );

    return result.documents.length > 0;
  } catch (error) {
    console.error("Error checking favorite:", error);
    return false;
  }
};
