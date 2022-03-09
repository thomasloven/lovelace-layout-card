import "./layouts/masonry";
import "./layouts/horizontal";
import "./layouts/vertical";
import "./layout-break";
import "./layouts/grid";
import "./layout-card";
import "./layout-card-editor";
import "./patches/hui-card-element-editor";
import "./patches/hui-view-editor";
import "./gap-card.ts";
import pjson from "../package.json";

console.groupCollapsed(
  `%cLAYOUT-CARD ${pjson.version} IS INSTALLED`,
  "color: green; font-weight: bold"
);
console.log("Readme:", "https://github.com/thomasloven/lovelace-layout-card");
console.groupEnd();
