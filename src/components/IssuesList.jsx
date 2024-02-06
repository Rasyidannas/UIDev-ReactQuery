import { useQuery } from "react-query";
import { IssueItem } from "./IssueItem";

export default function IssuesList({ labels }) {
  const issueQuery = useQuery(["issues", { labels }], () => {
    const labelString = labels.map((label) => `labels[]=${label}`).join("&");
    // console.log(labelString);
    return fetch(`/api/issues?${labelString}`).then((res) => res.json());
  });

  return (
    <div>
      <h2>Issues List</h2>
      {issueQuery.isLoading ? (
        <p>Loading...</p>
      ) : (
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
      )}
    </div>
  );
}
