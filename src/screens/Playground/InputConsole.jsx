import React from 'react'
import styled from 'styled-components'
import { BiImport } from 'react-icons/bi'

/* =======================
   STYLED COMPONENTS
======================= */

export const Console = styled.div`
  background: #1e1e1e;
  display: flex;
  flex-direction: column;
  height: 100%;
  color: #eaeaea;
`

export const Header = styled.div`
  background: #252526;
  height: 4rem;
  padding: 0 1rem;
  border-bottom: 1px solid #333;
  font-size: 1.2rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: space-between;

  input {
    display: none;
  }

  label {
    font-weight: 400;
    display: flex;
    align-items: center;
    gap: 0.6rem;
    color: #eaeaea;
    cursor: pointer;

    &:hover {
      color: #f59e0b;
    }
  }
`

export const TextArea = styled.textarea`
  flex-grow: 1;
  resize: none;
  border: none;
  outline: none;
  padding: 0.75rem;
  font-size: 1.1rem;
  overflow: auto;

  background: #1e1e1e;
  color: #eaeaea;

  font-family: 'JetBrains Mono', monospace;

  &::placeholder {
    color: #8e8e8e;
  }
`

/* =======================
   COMPONENT
======================= */

const InputConsole = ({ currentInput, setCurrentInput, getFile }) => {
  return (
    <Console>
      <Header>
        Input
        <label htmlFor="inputfile">
          <input
            type="file"
            accept="."
            id="inputfile"
            onChange={(e) => getFile(e, setCurrentInput)}
          />
          <BiImport /> Import Input
        </label>
      </Header>

      <TextArea
        placeholder="Enter input here..."
        onChange={(e) => setCurrentInput(e.target.value)}
        value={currentInput}
      />
    </Console>
  )
}

export default InputConsole
