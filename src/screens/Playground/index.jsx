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
import axios from 'axios'
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels'

/* ======================
   STYLES
====================== */

const MainContainer = styled.div`
  height: ${({ isFullScreen }) =>
    isFullScreen ? '100vh' : 'calc(100vh - 4.5rem)'};
  overflow: hidden;
  background: #1e1e1e;

  @media (max-width: 768px) {
    height: auto;
    overflow: auto;
  }
`

const StyledPanelGroup = styled(PanelGroup)`
  width: 100%;
  height: 100%;

  @media (max-width: 768px) {
    display: flex !important;
    flex-direction: column !important;
  }
`

const ResizeHandle = styled(PanelResizeHandle)`
  width: 4px;
  background: #1e1e1e;
  transition: background 0.2s ease;
  position: relative;
  cursor: col-resize;
  border-left: 1px solid #333;
  border-right: 1px solid #333;

  &:hover, &[data-resize-handle-active] {
    background: #007acc;
    border-color: #007acc;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: -4px;
    right: -4px;
    z-index: 10;
  }

  @media (max-width: 768px) {
    display: none;
  }
`

const ChatSidePanel = styled.div`
  background: #1e1e1e;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;

  @media (max-width: 768px) {
    height: 500px;
    border-top: 1px solid #333;
  }
`

const Consoles = styled.div`
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-rows: 1fr 1fr;
  background: #1e1e1e;
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
        <StyledPanelGroup direction="horizontal">
          <Panel minSize={30}>
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
              setIsFullScreen={setIsFullScreen}
              isFullScreen={isFullScreen}
            />
          </Panel>

          {!isFullScreen && (
            <>
              <ResizeHandle />
              <Panel minSize={20}>
                <Consoles className="consoles-column">
                  <InputConsole
                    currentInput={currentInput}
                    setCurrentInput={setCurrentInput}
                    getFile={getFile}
                  />
                  <OutputConsole currentOutput={currentOutput} />
                </Consoles>
              </Panel>
            </>
          )}

          {!isFullScreen && isAIChatOpen && (
            <>
              <ResizeHandle />
              <Panel minSize={20}>
                <ChatSidePanel>
                  <AIChat isSidePanel={true} />
                </ChatSidePanel>
              </Panel>
            </>
          )}
        </StyledPanelGroup>
      </MainContainer>
      {isOpenModal.show && <Modal />}
    </>
  )
}

export default Playground
