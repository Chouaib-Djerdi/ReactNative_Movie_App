import SavedCard from "@/components/SavedCard";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { useSession } from "@/context/SessionProvider";
import { fetchSavedMovies } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  View,
} from "react-native";

const Saved = () => {
  const { session, loading } = useSession();
  const {
    data: savedMovies,
    loading: savedMoviesLoading,
    error: savedMoviesError,
    refetch,
  } = useFetch(() => fetchSavedMovies(session?.userId));
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [session?.userId])
  );

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
      >
        <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />

        {savedMoviesLoading || loading ? (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            className="mt-10 self-center"
          />
        ) : savedMoviesError ? (
          <Text>
            Error: {savedMoviesError?.message || "Something went wrong"}
          </Text>
        ) : (
          <View className="flex-1 mt-5">
            <>
              <Text className="text-lg text-white font-bold mt-5 mb-3">
                Your Saved Movies
              </Text>
              {savedMovies?.length === 0 && !savedMoviesLoading && (
                <Text className="text-center text-gray-400 mt-10">
                  You haven’t saved any movies yet 🎬
                </Text>
              )}
              <FlatList
                data={savedMovies}
                renderItem={({ item }) => <SavedCard {...item} />}
                keyExtractor={(item) => item.$id}
                numColumns={3}
                columnWrapperStyle={{
                  justifyContent: "flex-start",
                  gap: 20,
                  paddingRight: 5,
                  marginBottom: 10,
                }}
                className="mt-2 pb-32"
                scrollEnabled={false}
              />
            </>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Saved;
