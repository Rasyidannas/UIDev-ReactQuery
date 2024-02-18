import { useQuery } from "react-query";
import { IssueItem } from "./IssueItem";
import { useState } from "react";

export default function IssuesList({ labels, status }) {
  const issueQuery = useQuery(["issues", { labels, status }], () => {
    const statusString = status ? `&status=${status}` : "";
    const labelString = labels.map((label) => `labels[]=${label}`).join("&");
    // console.log(labelString);
    return fetch(`/api/issues?${labelString}${statusString}`).then((res) =>
      res.json()
    );
  });

  const [searchValue, setSearchValue] = useState("");

  const searchQuery = useQuery(
    ["issues", "search", searchValue],
    () =>
      fetch(`/api/search/issues?q=${searchValue}`).then((res) => res.json()),
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

      <h2>Issues List</h2>
      {issueQuery.isLoading ? (
        <p>Loading...</p>
      ) : searchQuery.fetchStatus === "idle" &&
        searchQuery.isLoading === true ? (
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
