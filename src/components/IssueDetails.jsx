import { useParams } from "react-router-dom";
import { useInfiniteQuery, useQuery } from "react-query";
import { IssueHeader } from "./IssueHeader";
import { useUserData } from "../helpers/useUserData";
import { relativeDate } from "../helpers/relativeDate";
import IssueStatus from "./IssueStatus";
import IssueAssignment from "./IssueAssignment";
import IssueLabels from "./IssueLabels";
import Loader from "./Loader";
import useScrollToBottomAction from "../helpers/useScrollToBottomAction";

function useIssueData(issueNumber) {
  return useQuery(["issues", issueNumber], ({ signal }) => {
    return fetch(`/api/issues/${issueNumber}`, { signal }).then((res) =>
      res.json()
    );
  });
}

function useIssueComments(issueNumber) {
  return useInfiniteQuery(
    ["issues", issueNumber, "comments"],
    ({ signal, pageParam = 1 }) => {
      return fetch(`/api/issues/${issueNumber}/comments?page=${pageParam}`, {
        signal,
      }).then((res) => res.json());
    },
    {
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.lenght === 0) return;

        return pages.length + 1;
      },
    }
  );
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

  //this is for running next fetch (infiniteQuery)
  useScrollToBottomAction(document, commentsQuery.fetchNextPage, 100);

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
                commentsQuery.data?.pages.map((commentPage) =>
                  commentPage.map((comment) => (
                    <Comment key={comment.id} {...comment} />
                  ))
                )
              )}
              {commentsQuery.isFetchingNextPage && <Loader />}
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
              <IssueLabels
                labels={issueQuery.data.labels}
                issueNumber={issueQuery.data.number.toString()}
              />
            </aside>
          </main>
        </>
      )}
    </div>
  );
}
