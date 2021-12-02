import { useState } from "react";
import { BlocksearchSettings, openBlockInSidebar } from ".";
import ReactDOM from "react-dom";
import { Button, Icon } from "@blueprintjs/core";
import {RoamBlock, createBlock, getCurrentPageUid, getChildrenLengthByPageUid} from "roam-client";
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const Blocksearch = ({
  settings,
  blockUid,
}: {
  settings: BlocksearchSettings;
  blockUid: string;
}): JSX.Element => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<RoamBlock[][]>([]);
    return (
    <div className="roamjs-blocksearch">
      <input className="roamjs-blocksearch-input"
        placeholder="Enter Post Title"
        onChange={(event) => {
          setQuery(event.target.value);
          if (event.target.value.length > 3) {
            let searchResults: RoamBlock[][] = window.roamAlphaAPI.q(
              `[:find (pull ?e [:block/children, :block/string, :block/id, :block/uid]) :where [?e :block/string ?s] [(clojure.string/includes? ?s "${event.target.value}")]]`,
          ) as RoamBlock[][];
            setResults(searchResults.length > 10? searchResults.slice(0, 10) : searchResults);
            console.log("searchResults", searchResults);
          }
          else {
            setResults([]);
          }
        }}
        value={query}
      />
      <div  className="roamjs-blocksearch-top">
        {
          results.map((post, index) => (
            <div key={index} className="roamjs-blocksearch-row roam-block">
                <div className="roam-block roamjs-blocksearch-item-text">
                  <ReactMarkdown children={post[0].string} remarkPlugins={[remarkGfm]} />
                </div>
                <div className="roamjs-blocksearch-container">
                <Button icon={"document-open"} onClick={() => {openBlockInSidebar(post[0].uid)}} minimal title={"Open in Sidebar"} small />
                <Button icon={"backlink"} onClick={(e) => {navigator.clipboard.writeText(`((${post[0].uid}))`)}} minimal title={"Copy Block Ref"} small/>
                <Button icon={"diagram-tree"} onClick={() => {
                  let order = 0;
                  let currentPageUid = window.roamAlphaAPI.ui.getFocusedBlock()?window.roamAlphaAPI.ui.getFocusedBlock()["block-uid"]: null;
                  if (settings.debug) {
                    console.log("currentPageUid", currentPageUid);
                  }
                  if (!currentPageUid) {
                    currentPageUid = getCurrentPageUid();
                    order = getChildrenLengthByPageUid(currentPageUid);
                  }
                  createBlock({node: { text: `((${post[0].uid}))` }, parentUid: currentPageUid, order});
                  }} minimal title={"Copy Content"} small/>
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