import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { IssueHeader } from "./IssueHeader";
import { useUserData } from "../helpers/useUserData";
import { relativeDate } from "../helpers/relativeDate";
import IssueStatus from "./IssueStatus";
import IssueAssignment from "./IssueAssignment";

function useIssueData(issueNumber) {
  return useQuery(["issues", issueNumber], ({ signal }) => {
    return fetch(`/api/issues/${issueNumber}`, { signal }).then((res) =>
      res.json()
    );
  });
}

function useIssueComments(issueNumber) {
  return useQuery(["issues", issueNumber, "comments"], ({ signal }) => {
    return fetch(`/api/issues/${issueNumber}/comments`, { signal }).then(
      (res) => res.json()
    );
  });
}

function Comment({ comment, createdBy, createdDate }) {
  const useQuery = useUserData(createdBy);

  if (useQuery.isLoading) {
    return (
      <div className="comment">
        <div>
          <div className="comment-header">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="comment">
      <img src={useQuery.data.profilePictureUrl} alt="Comment Avatar" />
      <div>
        <div className="comment-header">
          <span>{useQuery.data.name}</span> commented{" "}
          <span>{relativeDate(createdDate)}</span>
        </div>
        <div className="comment-body">{comment}</div>
      </div>
    </div>
  );
}

export default function IssueDetails() {
  const { number } = useParams();
  const issueQuery = useIssueData(number);
  const commentsQuery = useIssueComments(number);

  return (
    <div className="issue-details">
      {issueQuery.isLoading ? (
        <p>Loading issue...</p>
      ) : (
        <>
          <IssueHeader {...issueQuery.data} />

          <main>
            <section>
              {commentsQuery.isLoading ? (
                <p>Loading...</p>
              ) : (
                commentsQuery.data?.map((comment) => (
                  <Comment key={comment.id} {...comment} />
                ))
              )}
            </section>
            <aside>
              <IssueStatus
                status={issueQuery.data.status}
                issueNumber={issueQuery.data.number.toString()}
              />
              <IssueAssignment
                assignee={issueQuery.data.assignee}
                issueNumber={issueQuery.data.number.toString()}
              />
            </aside>
          </main>
        </>
      )}
    </div>
  );
}
