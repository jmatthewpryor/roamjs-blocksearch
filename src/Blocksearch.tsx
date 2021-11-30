import Data from "./mock-data.json";
import { useState } from "react";
import { BlocksearchSettings } from ".";
import ReactDOM from "react-dom";

function wow() {
  alert("wow");
  return "wow";
}
const Blocksearch = ({
  settings,
  blockUid,
}: {
  settings: BlocksearchSettings;
  blockUid: string;
}): JSX.Element => {
  const [query, setQuery] = useState("Jesus");
  return (
    <div className="roamjs-blocksearch">
      <input className="roamjs-blocksearch-input"
        placeholder="Enter Post Title"
        onChange={(event) => setQuery(event.target.value)}
        value={query}
      />
        <div  className="roamjs-blocksearch-container roamjs-blocksearch-top">
      {Data.filter((post) => {
        if (query === "") {
          return null;
        } else if (post.title.toLowerCase().includes(query.toLowerCase())) {
          return post;
        }
      }).map((post, index) => (
            <div key={index} className="roamjs-blocksearch-row">
                <div className="itemText">
                  {post.title}
                </div>
                <div className="roamjs-blocksearch-container">
                  <div className="roamjs-blocksearch-item-button">
                    <button onClick={wow}>{post.author}</button>
                  </div>
                  <div className="roamjs-blocksearch-item-button">
                    <button onClick={wow}>{post.author}</button>
                  </div>
                </div>
            </div>
      ))}
        </div>
    </div>
  );
}

export const renderBlocksearch = (
  settings: BlocksearchSettings,
  blockUid: string,
  p: HTMLElement
): void => {
  ReactDOM.render(
    <Blocksearch
      settings={settings}
      blockUid={blockUid}
    />,
    p
  );
};

export default Blocksearch;