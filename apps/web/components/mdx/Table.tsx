import React from 'react'

export const Tr: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <tr>{children}</tr>
}

export const Th: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <th className="text-left px-6 py-2">{children}</th>
}

export const Td: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <td className="px-6 py-2">{children}</td>
}

const Table: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <>
      <style>{`
        table {
          border-collapse: collapse;
          width: 100%;
        }

        .mdx-table table td:first-child, .mdx-table table th:first-child {
          width: 200px;
          max-width: 200px;
        }

        .dark .mdx-table table thead tr {
          border-bottom: 1px solid;
          border-color: rgb(31, 41, 55)
        }

        .mdx-table table thead tr {
          border-bottom: 1px solid;
          border-color: rgb(229, 231, 235)
        }
    `}</style>
      <div className="mdx-table border border-border rounded-md">
        <table>{children}</table>
      </div>
    </>
  )
}

export default Object.assign(Table, { Tr, Th, Td })
