import React from "react";
import styled from "styled-components";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
const NavbarContainer = styled.div`
  height: ${({ isFullScreen }) => (isFullScreen ? "0" : "4.5rem")};
  background: linear-gradient(180deg, #2d2d30, #1e1e1e);
  display: flex;
  align-items: center;
  justify-content: center;
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

const MainHeading = styled.h1`
  font-size: 2rem;
  font-weight: 400;
  color: #fff;

  span {
    font-weight: 700;
  }
`;

const Navbar = ({ isFullScreen }) => {
  const navigate = useNavigate();
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
    </NavbarContainer>
  );
};

export default Navbar;
