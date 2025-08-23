import SavedCard from "@/components/SavedCard";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { useSession } from "@/context/SessionProvider";
import { fetchSavedMovies } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import { Image, Text, View } from "react-native";

const Profile = () => {
  const { session, loading } = useSession();
  const {
    data: savedMovies,
    loading: savedMoviesLoading,
    error: savedMoviesError,
  } = useFetch(() => fetchSavedMovies(session?.userId));
  const numberOfSavedMovies = savedMovies?.length;
  return (
    <View className="flex-1 bg-primary ">
      <Image source={images.bg} className="absolute w-full z-0" />
      {/* User Info */}
      <View className="px-5">
        <View className="items-center mb-6 ">
          <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />

          <Text className="text-white text-xl font-bold">
            {session?.email ?? "Guest User"}
          </Text>
          <Text className="text-gray-400 text-sm mt-1">
            Movie lover since 2025 ✨
          </Text>
        </View>

        {/* Stats */}
        <View className="flex-row justify-around bg-gray-800 p-4   rounded-2xl mb-6">
          <View className="items-center">
            <Text className="text-white font-bold text-lg">
              {numberOfSavedMovies ?? 0}
            </Text>
            <Text className="text-gray-400 text-sm">Saved</Text>
          </View>
          <View className="items-center">
            <Text className="text-white font-bold text-lg">
              {numberOfSavedMovies}
            </Text>
            <Text className="text-gray-400 text-sm">Favorites</Text>
          </View>
          <View className="items-center">
            <Text className="text-white font-bold text-lg">34</Text>
            <Text className="text-gray-400 text-sm">Watched</Text>
          </View>
        </View>

        {/* Saved Movies Preview */}
        <View className="mb-6">
          <Text className="text-white font-bold text-lg mb-3">
            Recently Saved
          </Text>
          {savedMovies?.length ? (
            <View className="flex-row space-x-3">
              {savedMovies.slice(0, 3).map((movie) => (
                <SavedCard key={movie.$id} {...movie} />
              ))}
            </View>
          ) : (
            <Text className="text-gray-400">No saved movies yet.</Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default Profile;
