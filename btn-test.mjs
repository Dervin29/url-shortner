import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Button } from "@base-ui/react/button";

const plain = renderToStaticMarkup(
  React.createElement(Button, { type: "submit" }, "Create Link"),
);
console.log("plain:", plain);

const viaRender = renderToStaticMarkup(
  React.createElement(
    Button,
    { render: React.createElement("button", { type: "submit" }, "Create Link") },
  ),
);
console.log("render-prop:", viaRender);
