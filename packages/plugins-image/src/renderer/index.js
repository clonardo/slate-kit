import React from "react";
import Image from "../components/Image";

const createRenderNode = (pluginOptions, pluginsWrapper) => {
  return props => {
    const newProps = pluginsWrapper.getProps(props);
    switch (newProps.node.type) {
      case "image":
        return <Image {...newProps} options={pluginOptions} />;
    }
  };
};

export default createRenderNode;