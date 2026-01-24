import React, { useContext } from "react";
import styled from "styled-components";
import logo from "../../assets/logo.png";
import aiIcon from "../../assets/aiicon.png";
import { useNavigate } from "react-router-dom";
import { ModalContext } from "../../context/ModalContext";
import { PlaygroundContext } from "../../context/PlaygroundContext";

const NavbarContainer = styled.div`
  height: ${({ isFullScreen }) => (isFullScreen ? "0" : "4.5rem")};
  background: linear-gradient(180deg, #2d2d30, #1e1e1e);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  border-bottom: 1px solid #333;
  overflow: hidden;
  transition: height 0.3s ease;

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const NavbarContent = styled.button`
  background: transparent;
  border: 0;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  min-width: 0;
`;

const Logo = styled.img`
  width: 60px;
  flex-shrink: 0;
  @media (max-width: 768px) {
    width: 45px;
  }
`;

const AIIconContainer = styled.div`
  cursor: pointer;
  transition: transform 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;

  &:hover {
    transform: scale(1.1);
  }
  
  img {
    width: 32px;
    height: 32px;
    @media (max-width: 768px) {
      width: 28px;
      height: 28px;
    }
  }
`;

const LogoText = styled.div`
  font-size: 2rem;
  font-weight: 700;
  font-family: "Open Sans", sans-serif;
  text-shadow: 0 0 6px rgba(128, 128, 128, 0.4);
  color: white;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }

  @media (max-width: 480px) {
    display: none; /* Hide text on very small screens to keep AI icon visible */
  }
`;

const Navbar = ({ isFullScreen, currentCode, currentLanguage, playgroundId, folderId }) => {
  const navigate = useNavigate();
  const { isAIChatOpen, setIsAIChatOpen } = useContext(PlaygroundContext);

  return (
    <NavbarContainer isFullScreen={isFullScreen}>
      <NavbarContent
        onClick={() => {
          navigate("/");
        }}
      >
        <Logo src={logo} />
        <LogoText>
          codebox<span style={{ color: "#f59e0b" , textShadow: "0 0 6px rgba(245,158,11,0.4)"}}>.tech</span>
        </LogoText>
      </NavbarContent>
      
      <AIIconContainer onClick={() => setIsAIChatOpen(!isAIChatOpen)}>
        <img src={aiIcon} alt="AI Assistant" />
      </AIIconContainer>
    </NavbarContainer>
  );
};

export default Navbar;
