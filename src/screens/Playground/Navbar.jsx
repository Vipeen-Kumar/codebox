import React, { useContext } from "react";
import styled from "styled-components";
import logo from "../../assets/logo.png";
import aiIcon from "../../assets/aiicon.png";
import { useNavigate } from "react-router-dom";
import { ModalContext } from "../../context/ModalContext";

const NavbarContainer = styled.div`
  height: ${({ isFullScreen }) => (isFullScreen ? "0" : "4.5rem")};
  background: linear-gradient(180deg, #2d2d30, #1e1e1e);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  border-bottom: 1px solid #333;
`;


const NavbarContent = styled.button`
  background: transparent;
  border: 0;

  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
`;

const Logo = styled.img`
  width: 60px;
`;

const AIIconContainer = styled.div`
  cursor: pointer;
  transition: transform 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: scale(1.1);
  }
  
  img {
    width: 32px;
    height: 32px;
  }
`;

const Navbar = ({ isFullScreen, currentCode, currentLanguage }) => {
  const navigate = useNavigate();
  const { openModal } = useContext(ModalContext);

  return (
    <NavbarContainer isFullScreen={isFullScreen}>
      <NavbarContent
        onClick={() => {
          navigate("/");
        }}
      >
        <Logo src={logo} />
        <div
          className="logo"
          style={{
            fontSize: "2rem", // increase size
            fontWeight: 700, // make it bold
            fontFamily: "Inter, sans-serif",
            textShadow: "0 0 6px rgba(128, 128, 128, 0.4)",
          }}
        >
          codebox<span style={{ color: "#f59e0b" , textShadow: "0 0 6px rgba(245,158,11,0.4)"}}>.tech</span>
        </div>
      </NavbarContent>
      
      <AIIconContainer onClick={() => openModal({ 
        show: true, 
        modalType: 7,
        identifiers: {
          code: currentCode,
          language: currentLanguage
        }
      })}>
        <img src={aiIcon} alt="AI Assistant" />
      </AIIconContainer>
    </NavbarContainer>
  );
};

export default Navbar;
