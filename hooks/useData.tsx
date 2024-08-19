import { useQuery } from "react-query";
import axiosInstance from "@/http/axiosInstance";
import { getSession } from "next-auth/react";

function useData(queryKey: string, url: string) {
  const { isLoading, isError, data, refetch, isSuccess, isFetching } = useQuery(
    queryKey,
    async () => {
      const session = await getSession();
      const response = await axiosInstance.get(url, {
        headers: {
          Authorization: `Bearer ${session ? session?.user?.token : ""}`,
        },
      });
      return response.data;
    }
  );
  return { isLoading, isError, data, refetch, isSuccess, isFetching };
}

export default useData;
