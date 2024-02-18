import { useQuery } from "react-query";

export function useLabelsData() {
  const labelsQuery = useQuery(
    ["labels"],
    () => fetch("/api/labels").then((res) => res.json()),
    {
      staleTime: 1000 * 60 * 60, //this is for make data be fresh until 60 minutes
    }
  );

  return labelsQuery;
}
