import { useQuery } from "react-query";

export function useUserData(userId) {
  // this signal for aborted or cancel when don't do query
  const usersData = useQuery(
    ["users", userId],
    ({ signal }) =>
      fetch(`/api/users/${userId}`, { signal }).then((res) => res.json()),
    {
      staleTime: 1000 * 60 * 5, //this is for make data be fresh until 5 minutes
    }
  );

  return usersData;
}
