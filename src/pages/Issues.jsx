import { useState } from "react";
import IssuesList from "../components/IssuesList";
import LabelList from "../components/LabelList";
import { StatusSelect } from "../components/StatusSelect";
import { Link } from "react-router-dom";

export default function Issues() {
  const [labels, setLables] = useState([]);
  const [status, setStatus] = useState("");
  const [pageNum, setPageNum] = useState(1);

  return (
    <div>
      <main>
        <section>
          <h1>Issues</h1>
          <IssuesList
            labels={labels}
            status={status}
            pageNum={pageNum}
            setPageNum={setPageNum}
          />
        </section>
        <aside>
          <LabelList
            selected={labels}
            toggle={(label) => {
              setLables((currentLabels) =>
                currentLabels.includes(label)
                  ? currentLabels.filter(
                      (currentLabels) => currentLabels !== label
                    )
                  : currentLabels.concat(label)
              );
              setPageNum(1);
            }}
          />
          <h3>Status</h3>
          <StatusSelect
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPageNum(1);
            }}
          />
          <hr />
          <Link className="button" to="/add">
            Add Issue
          </Link>
        </aside>
      </main>
    </div>
  );
}
