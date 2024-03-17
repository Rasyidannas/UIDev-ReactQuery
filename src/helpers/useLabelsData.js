import { useQuery } from "react-query";
import { defaultLabels } from "./defaultData";

export function useLabelsData() {
  // this signal for aborted or cancel when don't do query
  const labelsQuery = useQuery(
    ["labels"],
    ({ signal }) => fetch("/api/labels", { signal }).then((res) => res.json()),
    {
      staleTime: 1000 * 60 * 60, //this is for make data be fresh until 60 minutes
      placeholderData: defaultLabels, //this for make placeholder date before query loaded
    }
  );

  return labelsQuery;
}
