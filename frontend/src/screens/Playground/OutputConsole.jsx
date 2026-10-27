import React from 'react'
import { Console, Header, TextArea } from './InputConsole'
import { BiExport } from 'react-icons/bi'
import styled from 'styled-components'

/* =======================
   FIX LINK STYLING
======================= */

const ExportLink = styled.a`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-weight: 400;
  color: #eaeaea;
  text-decoration: none;
  cursor: pointer;

  &:visited {
    color: #eaeaea;
  }

  &:hover {
    color: #f59e0b;
  }
`

/* =======================
   COMPONENT
======================= */

const OutputConsole = ({ currentOutput }) => {
  return (
    <Console>
      <Header>
        Output
        <ExportLink
          href={`data:text/plain;charset=utf-8,${encodeURIComponent(
            currentOutput
          )}`}
          download="output.txt"
        >
          <BiExport /> Export Output
        </ExportLink>
      </Header>

      <TextArea value={currentOutput} disabled />
    </Console>
  )
}

export default OutputConsole
