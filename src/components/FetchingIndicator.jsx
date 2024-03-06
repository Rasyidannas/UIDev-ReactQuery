import { useIsFetching } from "react-query";
import Loader from "./Loader";

export default function FetchingIndicator() {
  const isFetching = useIsFetching(); //this for check all fetching all queries (not specific)

  if (!isFetching) return null;

  return (
    <div className="fetching-indicator">
      <Loader />
    </div>
  );
}
