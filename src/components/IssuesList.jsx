import { useQuery, useQueryClient } from "react-query";
import { IssueItem } from "./IssueItem";
import { useState } from "react";
import fetchWithError from "../helpers/fetchWithError";
import Loader from "./Loader";

export default function IssuesList({ labels, status, pageNum, setPageNum }) {
  const queryCLient = useQueryClient();
  // this signal for aborted or cancel when don't do query
  const issueQuery = useQuery(
    ["issues", { labels, status, pageNum }],
    async ({ signal }) => {
      const statusString = status ? `&status=${status}` : "";
      const labelString = labels.map((label) => `labels[]=${label}`).join("&");
      const paginationString = pageNum ? `&page=${pageNum}` : "";

      // console.log(labelString);
      const result = await fetchWithError(
        `/api/issues?${labelString}${statusString}${paginationString}`,
        {
          signal,
        }
      );

      result.forEach((issue) => {
        //this set query for signle issue and connect with issueDetails.jsx you can check in reactQuery tool
        queryCLient.setQueryData(["issue", issue.number.toString()], issue);
      });

      return result;
    }
  );

  const [searchValue, setSearchValue] = useState("");

  const searchQuery = useQuery(
    ["issues", "search", searchValue],
    ({ signal }) =>
      fetch(`/api/search/issues?q=${searchValue}`, { signal }).then((res) =>
        res.json()
      ),
    {
      enabled: searchValue.length > 0, //this will be disable when searchValue is empty
    }
  );

  return (
    <div>
      <form
        onSubmit={(event) => {
          event.preventDefault();

          setSearchValue(event.target.elements.search.value);
        }}
      >
        <label htmlFor="search">Search Issues</label>
        <input
          type="search"
          placeholder="Search"
          name="search"
          id="search"
          onChange={(event) => {
            if (event.target.value.length === 0) {
              setSearchValue("");
            }
          }}
        />
      </form>

      <h2>
        Issues List {issueQuery.fetchStatus === "fetching" ? <Loader /> : null}
      </h2>
      {issueQuery.isLoading ? (
        <p>Loading...</p>
      ) : issueQuery.isError ? (
        <p>{issueQuery.error.message}</p>
      ) : searchQuery.fetchStatus === "idle" &&
        searchQuery.isLoading === true ? (
        <>
          <ul className="issues-list">
            {issueQuery.data.map((issue) => (
              <IssueItem
                key={issue.id}
                title={issue.title}
                number={issue.number}
                assignee={issue.assignee}
                commentCount={issue.comments.length}
                createdBy={issue.createdBy}
                createdDate={issue.createdDate}
                labels={issue.labels}
                status={issue.status}
              />
            ))}
          </ul>
          <div className="pagination">
            <button
              onClick={() => {
                if (pageNum - 1 > 0) setPageNum(pageNum - 1);
              }}
              disabled={pageNum === 1}
            >
              Previous
            </button>
            <p>
              Page {pageNum} {issueQuery.isFetching ? "..." : ""}
            </p>
            <button
              onClick={() => {
                if (issueQuery.data?.length !== 0) {
                  setPageNum(pageNum + 1);
                }
              }}
              disabled={issueQuery.data?.length === 0}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <>
          <h2>Search Results</h2>
          {searchQuery.isLoading ? (
            <p>Loading...</p>
          ) : (
            <>
              <p>{searchQuery.data.count} Results</p>
              <ul className="issues-list">
                {searchQuery.data.items.map((issue) => (
                  <IssueItem
                    key={issue.id}
                    title={issue.title}
                    number={issue.number}
                    assignee={issue.assignee}
                    commentCount={issue.comments.length}
                    createdBy={issue.createdBy}
                    createdDate={issue.createdDate}
                    labels={issue.labels}
                    status={issue.status}
                  />
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </div>
  );
}
