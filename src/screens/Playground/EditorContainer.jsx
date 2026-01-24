import React, { useContext, useState } from "react";
import CodeEditor from "./CodeEditor";
import styled from "styled-components";
import { BiEditAlt, BiImport, BiExport, BiFullscreen } from "react-icons/bi";
import { ModalContext } from "../../context/ModalContext";
import Select from "react-select";
import { languageMap } from "../../context/PlaygroundContext";

/* =======================
   STYLED COMPONENTS
======================= */

const StyledEditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background: #1e1e1e;
  color: #eaeaea;
  height: ${({ isFullScreen }) =>
    isFullScreen ? "100vh" : "calc(100vh - 4.5rem)"};
  overflow: hidden;
`;

const UpperToolBar = styled.div`
  background: #2d2d30;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.4rem;
  padding: 0.8rem 0.6rem;
  border-bottom: 1px solid #333;

  @media (max-width: 540px) {
    height: 8rem;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 540px) {
    width: 100%;
  }
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.3rem;
  color: #eaeaea;

  svg {
    color: #b0b0b0;
    cursor: pointer;

    &:hover {
      color: #f59e0b;
    }
  }
`;

const SelectBars = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;

  & > div {
    width: 8rem;
  }

  & > div:last-child {
    width: 10rem;
  }
`;

const Button = styled.button`
  padding: 0.6rem 1rem;
  background: #f59e0b;
  color: #000000ff;
  border: none;
  border-radius: 32px;
  font-weight: 700;
  cursor: pointer;
  font-family: 'Open Sans', sans-serif;

  &:hover {
    background: #000000ff;
    border: 1px solid #f59e0b;
    color: #ffffffff;
  }
`;

const CodeEditorContainer = styled.div`
  flex: 1;
  background: #1e1e1e;
  overflow: hidden;

  & > div {
    height: 100%;
  }

  .cm-editor {
    height: 100%;
  }

  .cm-scroller {
    overflow: auto;
  }
`;

const LowerToolBar = styled.div`
  background: #252526;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.8rem;
  padding: 0.8rem 1rem;
  border-top: 1px solid #333;

  input {
    display: none;
  }

  label,
  button {
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    gap: 0.6rem;
    color: #eaeaea;
    background: none;
    border: none;
    cursor: pointer;

    &:hover {
      color: #f59e0b;
    }
  }

  /* FIX EXPORT OUTPUT LINK */
  a {
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    gap: 0.6rem;
    color: #eaeaea; /* REMOVE BLUE */
    text-decoration: none;
    cursor: pointer;

    &:visited {
      color: #eaeaea; /* PREVENT PURPLE */
    }

    &:hover {
      color: #f59e0b; /* MATCH IMPORT INPUT */
    }
  }
`;

const SaveAndRunButton = styled.button`
  padding: 0.65rem 1.4rem;
  background: #000000ff; /* primary orange */
  color: #ffffffff; /* dark text */
  border: none;
  border-radius: 32px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: #000000ff; /* darker on hover */
    box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.35);
  }

  &:active {
    transform: scale(0.96);
  }

  &:disabled {
    background: #555;
    color: #999;
    cursor: not-allowed;
    box-shadow: none;
  }
`;
const SaveToast = styled.div`
  position: fixed;
  top: 5rem;
  left: 37%;                 /* moved left from center */
  transform: translateX(-50%);
  background: #9bf50b7c;
  color: #000;
  padding: 0.6rem 0.6rem;
  border-radius: 12px;
  font-weight: 600;
  font-family: 'Open Sans', sans-serif;
  z-index: 9999;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
`;


/* =======================
   COMPONENT
======================= */

const EditorContainer = ({
  title,
  currentLanguage,
  setCurrentLanguage,
  currentCode,
  setCurrentCode,
  folderId,
  playgroundId,
  saveCode,
  runCode,
  getFile,
  isFullScreen,
  setIsFullScreen,
}) => {
  const { openModal } = useContext(ModalContext);

  const themeOptions = [
    { value: "githubDark", label: "githubDark" },
    { value: "dracula", label: "dracula" },
    { value: "vscodeDark", label: "vscodeDark" },
    { value: "okaidia", label: "okaidia" },
  ];

  const languageOptions = [
    { value: "cpp", label: "cpp" },
    { value: "javascript", label: "javascript" },
    { value: "java", label: "java" },
    { value: "python", label: "python" },
  ];

  const [currentTheme, setCurrentTheme] = useState(themeOptions[3]);
  const [language, setLanguage] = useState(
    languageOptions.find((l) => l.value === currentLanguage) ||
      languageOptions[0]
  );

  const handleThemeChange = (option) => setCurrentTheme(option);

  const handleLanguageChange = (option) => {
    setLanguage(option);
    setCurrentLanguage(option.value);
    setCurrentCode(languageMap[option.value].defaultCode);
  };

  const [showSavedToast, setShowSavedToast] = useState(false);

  return (
    <StyledEditorContainer isFullScreen={isFullScreen}>
      {showSavedToast && <SaveToast>✅Saved</SaveToast>}
      {!isFullScreen && (
        <UpperToolBar>
          <Header>
            <Title>
              <h3>{title}</h3>
              <BiEditAlt
                onClick={() =>
                  openModal({
                    show: true,
                    modalType: 5,
                    identifiers: { folderId, cardId: playgroundId },
                  })
                }
              />
            </Title>
            <Button
              onClick={() => {
                saveCode();
                setShowSavedToast(true);
                setTimeout(() => setShowSavedToast(false), 1000);
              }}
            >
              Save code
            </Button>
          </Header>

          <SelectBars>
            <Select
              options={languageOptions}
              value={language}
              onChange={handleLanguageChange}
              theme={(theme) => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  neutral0: "#252526",
                  neutral80: "#eaeaea",
                  primary: "#0097d7",
                },
              })}
            />
            <Select
              options={themeOptions}
              value={currentTheme}
              onChange={handleThemeChange}
              theme={(theme) => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  neutral0: "#252526",
                  neutral80: "#eaeaea",
                  primary: "#0097d7",
                },
              })}
            />
          </SelectBars>
        </UpperToolBar>
      )}

      <CodeEditorContainer>
        <CodeEditor
          currentLanguage={currentLanguage}
          currentTheme={currentTheme.value}
          currentCode={currentCode}
          setCurrentCode={setCurrentCode}
        />
      </CodeEditorContainer>

      <LowerToolBar>
        <button onClick={() => setIsFullScreen((v) => !v)}>
          <BiFullscreen />
          {isFullScreen ? "Minimize Screen" : "Full Screen"}
        </button>

        <label htmlFor="codefile">
          <input
            type="file"
            id="codefile"
            onChange={(e) => getFile(e, setCurrentCode)}
          />
          <BiImport /> Import Code
        </label>

        <a
          href={`data:text/plain;charset=utf-8,${encodeURIComponent(
            currentCode
          )}`}
          download="code.txt"
        >
          <BiExport /> Export Code
        </a>

        <SaveAndRunButton onClick={runCode}>Run Code</SaveAndRunButton>
      </LowerToolBar>
    </StyledEditorContainer>
  );
};

export default EditorContainer;
