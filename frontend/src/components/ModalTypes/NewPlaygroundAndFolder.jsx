import React, { useContext, useState } from 'react'
import { Header, CloseButton } from '../Modal'
import { IoCloseSharp } from 'react-icons/io5'
import { ModalContext } from '../../context/ModalContext'
import { PlaygroundContext } from '../../context/PlaygroundContext'
import Select from 'react-select'
import styled from 'styled-components'

/* =======================
   STYLED COMPONENTS
======================= */

const InputWithSelect = styled.div`
  display: grid;
  grid-template-columns: 1fr 0.5fr;
  gap: 1rem;
  margin-top: 1.2rem;
  align-items: center;
  color: #eaeaea;
  font-family: 'Open Sans', sans-serif;

  label {
    font-size: 1rem;
    color: #b0b0b0;
  }

  input {
    height: 2.4rem;
    padding: 0 0.6rem;
    background: #1e1e1e;
    border: 1px solid #333;
    color: #eaeaea;
    border-radius: 6px;
    outline: none;
    font-family: 'Open Sans', sans-serif;

    &:focus {
      border-color: #f59e0b;
    }
  }

  button {
    grid-column: span 2;
    height: 2.6rem;
    margin-top: 0.8rem;
    background: #f59e0b;
    color: #1e1e1e;
    border: none;
    border-radius: 32px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    font-family: 'Open Sans', sans-serif;

    &:hover {
      background: #e08c00;
      box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.35);
    }

    &:active {
      transform: scale(0.96);
    }
  }

  & > div {
    width: 100%;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    button {
      grid-column: span 1;
    }
  }
`

/* =======================
   COMPONENT
======================= */

const NewPlaygroundAndFolder = () => {
  const { closeModal } = useContext(ModalContext)
  const { addPlaygroundAndFolder } = useContext(PlaygroundContext)

  const languageOptions = [
    { value: 'cpp', label: 'cpp' },
    { value: 'java', label: 'java' },
    { value: 'javascript', label: 'javascript' },
    { value: 'python', label: 'python' },
  ]

  const [playgroundName, setPlaygroundName] = useState('')
  const [folderName, setFolderName] = useState('')
  const [language, setLanguage] = useState(languageOptions[0])

  return (
    <>
      <Header>
        <h2 style={{ color: '#eaeaea' }}>
          Create New Playground & Folder
        </h2>
        <CloseButton onClick={closeModal}>
          <IoCloseSharp />
        </CloseButton>
      </Header>

      <InputWithSelect>
        <label>Folder Name</label>
        <input
          type="text"
          placeholder="Enter folder name"
          onChange={(e) => setFolderName(e.target.value)}
        />

        <label>Playground Name</label>
        <input
          type="text"
          placeholder="Enter playground name"
          onChange={(e) => setPlaygroundName(e.target.value)}
        />

        <Select
          options={languageOptions}
          value={language}
          onChange={setLanguage}
          theme={(theme) => ({
            ...theme,
            colors: {
              ...theme.colors,
              neutral0: '#252526',
              neutral80: '#eaeaea',
              primary: '#f59e0b',
              primary25: '#333333',
            },
          })}
          styles={{
            control: (base) => ({
              ...base,
              backgroundColor: '#1e1e1e',
              borderColor: '#333',
              minHeight: '2.4rem',
            }),
            menu: (base) => ({
              ...base,
              backgroundColor: '#252526',
            }),
            singleValue: (base) => ({
              ...base,
              color: '#eaeaea',
            }),
          }}
        />

        <button
          onClick={() => {
            addPlaygroundAndFolder(
              folderName,
              playgroundName,
              language.label
            )
            closeModal()
          }}
        >
          Create Playground
        </button>
      </InputWithSelect>
    </>
  )
}

export default NewPlaygroundAndFolder
