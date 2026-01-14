import React, { useContext, useState } from 'react'
import EditorContainer from './EditorContainer'
import InputConsole from './InputConsole'
import OutputConsole from './OutputConsole'
import Navbar from './Navbar'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { languageMap, PlaygroundContext } from '../../context/PlaygroundContext'
import { ModalContext } from '../../context/ModalContext'
import Modal from '../../components/Modal'
import { Buffer } from 'buffer'
import axios from 'axios'

/* ======================
   STYLES
====================== */

const MainContainer = styled.div`
  display: grid;
  grid-template-columns: ${({ isFullScreen }) =>
    isFullScreen ? '1fr' : '2fr 1fr'};
  min-height: ${({ isFullScreen }) =>
    isFullScreen ? '100vh' : 'calc(100vh - 4.5rem)'};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const Consoles = styled.div`
  display: grid;
  width: 100%;
  grid-template-rows: 1fr 1fr;
`

/* ======================
   COMPONENT
====================== */

const Playground = () => {
  const { folderId, playgroundId } = useParams()
  const { folders, savePlayground } = useContext(PlaygroundContext)
  const { isOpenModal, openModal, closeModal } = useContext(ModalContext)

  const { title, language, code } =
    folders[folderId].playgrounds[playgroundId]

  const [currentLanguage, setCurrentLanguage] = useState(language)
  const [currentCode, setCurrentCode] = useState(code)
  const [currentInput, setCurrentInput] = useState('')
  const [currentOutput, setCurrentOutput] = useState('')
  const [isFullScreen, setIsFullScreen] = useState(false)

  /* ======================
     HELPERS
  ====================== */

  const saveCode = () => {
    savePlayground(folderId, playgroundId, currentCode, currentLanguage)
  }

  /* ======================
     RUN CODE (BACKEND CALL)
  ====================== */

  const runCode = async () => {
    try {
      openModal({ show: true, modalType: 6 })

      const res = await axios.post(
        'http://localhost:5000/api/piston/execute',
        {
          language: languageMap[currentLanguage].language,
          version: languageMap[currentLanguage].version,
          source_code: currentCode,
          stdin: currentInput,
        }
      )

      const result = res.data;
      const runStage = result.run;
      const compileStage = result.compile;

      let finalOutput = '';
      let status = 'Success';

      if (compileStage && compileStage.code !== 0) {
          status = 'Compilation Error';
          finalOutput = compileStage.output || compileStage.stderr;
      } else if (runStage && runStage.code !== 0) {
          status = 'Runtime Error';
          finalOutput = runStage.output || runStage.stderr;
      } else {
          finalOutput = runStage.output || runStage.stdout;
      }

      setCurrentOutput(`${status}\n\n${finalOutput}`)
    } catch (error) {
      setCurrentOutput('Error executing code')
      console.error(error)
    } finally {
      closeModal()
    }
  }

  /* ======================
     FILE IMPORT
  ====================== */

  const getFile = (e, setState) => {
    const input = e.target
    if (input.files && input.files.length > 0) {
      readFileContent(input.files[0]).then(setState)
    }
  }

  const readFileContent = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result)
      reader.onerror = reject
      reader.readAsText(file)
    })

  /* ======================
     RENDER
  ====================== */

  return (
    <div>
      <Navbar 
        isFullScreen={isFullScreen} 
        currentCode={currentCode} 
        currentLanguage={currentLanguage} 
      />

      <MainContainer isFullScreen={isFullScreen}>
        <EditorContainer
          title={title}
          currentLanguage={currentLanguage}
          setCurrentLanguage={setCurrentLanguage}
          currentCode={currentCode}
          setCurrentCode={setCurrentCode}
          folderId={folderId}
          playgroundId={playgroundId}
          saveCode={saveCode}
          runCode={runCode}
          getFile={getFile}
          isFullScreen={isFullScreen}
          setIsFullScreen={setIsFullScreen}
        />

        <Consoles>
          <InputConsole
            currentInput={currentInput}
            setCurrentInput={setCurrentInput}
            getFile={getFile}
          />
          <OutputConsole currentOutput={currentOutput} />
        </Consoles>
      </MainContainer>

      {isOpenModal.show && <Modal />}
    </div>
  )
}

export default Playground
