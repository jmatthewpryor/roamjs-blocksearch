import { addStyle, toConfig, runExtension, getUidsFromButton, getTreeByBlockUid } from "roam-client";
import { createConfigObserver,  } from "roamjs-components";
import {
  createButtonObserver,
  createHTMLObserver,
} from "roam-client";
import { renderBlocksearch } from "./Blocksearch";
import merge from "ts-deepmerge";

addStyle(`
.roamjs-blocksearch {
  font-family: monospace;
  box-sizing: border-box;
}
.roamjs-blocksearch-input {
  width: 500px;
  margin: 10px auto;
  display: block;
  padding: 10px;
  text-align: center;
}
.roamjs-blocksearch-top {
  width: 500px;
  margin: 0 auto;
  padding: 0;
}
.roamjs-blocksearch-container {
  display: flex;
  flex-direction: column;
}
.roamjs-blocksearch-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #f5f5f5;
  padding: 10px;
  margin-bottom: 5px;
  position: relative;
}
.roamjs-blocksearch-row:hover {
  background-color: #ededed;
}
.roamjs-blocksearch-item-text {
  flex-grow: 9;
}
.roamjs-blocksearch-item-button {
  color: #777;
  flex-basis: 0;
  flex-grow: 1;
  flex-shrink: 1;
  margin-left: 10px;
}
`);

export interface BlocksearchSettings {
  query?: {
    refs?: string[]
  };
  display?: {
    rectSize?: number;
    space?: number;
    legendCellSize?: number;
    prefixCls?: string;
    legend?: number[];
  };
  range?: {
    days?: number;
    startDate?: Date;
    endDate?: Date;
  }
  debug?: boolean;
}
const ID = "blocksearch";
const CONFIG = toConfig(ID);
runExtension(ID, () => {
  createConfigObserver({ title: CONFIG, config: { tabs: [] } });

  createButtonObserver({
    shortcut: ID,
    attribute: `${ID}-button`,
    render: (b: HTMLButtonElement) => {
      const { blockUid } = getUidsFromButton(b);
      const defaultSettings: BlocksearchSettings = {
        display: {
          rectSize: 11,
          space: 2,
          legendCellSize: 11,
          prefixCls: "roamjs-blocksearch",
          legend: [0, 4, 8, 12, 32],
        },
        range: {
          days: 365,
        },
        debug: false
      };

      let tree = getTreeByBlockUid(blockUid);
      let config: BlocksearchSettings = {};//parseConfig(tree) as BlocksearchSettings;
      config = merge.withOptions(
        { mergeArrays: false },
        defaultSettings, config);
      
      // make sure the query refs are an array, not just a single string
      if (typeof config.query?.refs === "string") {
        config.query.refs = [config.query.refs];
      }

      if (config.debug) {
        console.log("CONFIG:", config);
      }

      renderBlocksearch(
        config,
        blockUid,
        b.parentElement
      );
    },
  });
});
