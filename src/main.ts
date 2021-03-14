import "./layouts/masonry";
import "./layouts/horizontal";
import "./layouts/vertical";
import "./layout-break";
import "./layouts/grid";
import "./layout-card";
import "./layout-card-editor";
import "./patches/hui-dialog-edit-view";
import "./patches/hui-card-element-editor";
import pjson from "../package.json";

console.info(
  `%cLAYOUT-CARD ${pjson.version} IS INSTALLED`,
  "color: green; font-weight: bold",
  ""
);
