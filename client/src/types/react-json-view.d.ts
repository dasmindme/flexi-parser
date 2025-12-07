// src/types/react-json-view.d.ts
declare module 'react-json-view' {
  import { ComponentType } from 'react'

  export interface ReactJsonViewProps {
    src: any
    name?: string | false | null
    theme?: string | object
    collapsed?: boolean | number
    collapseStringsAfterLength?: number
    groupArraysAfterLength?: number
    enableClipboard?: boolean | ((copy: string) => void)
    displayObjectSize?: boolean
    displayDataTypes?: boolean
    indentWidth?: number
    quotesOnKeys?: boolean
    sortKeys?: boolean | ((a: string, b: string) => number)
    onEdit?: (edit: any) => boolean | void
    onAdd?: (add: any) => boolean | void
    onDelete?: (del: any) => boolean | void
    onSelect?: (select: any) => void
    validationMessage?: string
    style?: React.CSSProperties
    iconStyle?: 'circle' | 'square'
  }

  const ReactJson: ComponentType<ReactJsonViewProps>
  export default ReactJson
}
