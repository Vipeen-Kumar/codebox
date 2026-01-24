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
import AIChat from '../../components/ModalTypes/AIChat'
import { Buffer } from 'buffer'
import axios from 'axios'

/* ======================
   STYLES
====================== */

const MainContainer = styled.div`
  display: grid;
  grid-template-columns: ${({ isFullScreen, isAIChatOpen }) =>
    isFullScreen ? '1fr' : isAIChatOpen ? '1.5fr 0.7fr 1fr' : '2fr 1fr'};
  height: ${({ isFullScreen }) =>
    isFullScreen ? '100vh' : 'calc(100vh - 4.5rem)'};
  overflow: hidden;

  @media (max-width: 1200px) {
    grid-template-columns: ${({ isAIChatOpen }) => isAIChatOpen ? '1fr 1fr' : '2fr 1fr'};
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    height: auto;
    overflow: auto;
  }
`

const ChatSidePanel = styled.div`
  background: #1e1e1e;
  border-left: 1px solid #333;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 4.5rem);
  overflow: hidden;

  @media (max-width: 768px) {
    height: 500px;
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
  const { folders, savePlayground, isAIChatOpen } = useContext(PlaygroundContext)
  const { isOpenModal, openModal, closeModal } = useContext(ModalContext)

  const { title, language, code } =
    folders[folderId].playgrounds[playgroundId]

  const [currentLanguage, setCurrentLanguage] = useState(language)
  const [currentCode, setCurrentCode] = useState(code)
  const [currentInput, setCurrentInput] = useState('')

  // Sync with context updates (e.g. from AI changes)
  React.useEffect(() => {
    setCurrentCode(code);
    setCurrentLanguage(language);
  }, [code, language]);
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
    <>
      <Navbar
        isFullScreen={isFullScreen}
        currentCode={currentCode}
        currentLanguage={currentLanguage}
        playgroundId={playgroundId}
        folderId={folderId}
      />
      <MainContainer isFullScreen={isFullScreen} isAIChatOpen={isAIChatOpen}>
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
          setIsFullScreen={setIsFullScreen}
          isFullScreen={isFullScreen}
        />
        {!isFullScreen && (
          <Consoles>
            <InputConsole
              currentInput={currentInput}
              setCurrentInput={setCurrentInput}
            />
            <OutputConsole currentOutput={currentOutput} />
          </Consoles>
        )}
        {!isFullScreen && isAIChatOpen && (
          <ChatSidePanel>
            <AIChat isSidePanel={true} />
          </ChatSidePanel>
        )}
      </MainContainer>
      {isOpenModal.show && <Modal />}
    </>
  )
}

export default Playground
