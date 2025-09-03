"use client"

import { Provider } from "react-redux"
import { store } from "@/lib/redux/store"
import { DesignToolContainerV2 } from "./design-tool/design-tool-container-v2"

export function ProductDesignTool() {
  return (
    <Provider store={store}>
      <DesignToolContainerV2 />
    </Provider>
  )
}
