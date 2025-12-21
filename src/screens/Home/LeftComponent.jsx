import React, { useContext } from 'react'
import styled from 'styled-components'
import logo from '../../assets/logo.png'
import { ModalContext } from '../../context/ModalContext'

const StyledLeftComponent = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 40%;
  height: 100vh;
  background-color: #1e1e1e;

  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    position: relative;
    width: 100%;
  }
`

const ContentContainer = styled.div`
  text-align: center;
  color: #eaeaea;
  font-family: 'Inter', sans-serif;
`

const Logo = styled.img`
  width: 165px;
  margin-bottom: 1rem;
`

const MainHeading = styled.h1`
  font-size: 2.6rem;
  font-weight: 700;
  color: #eaeaea;
  margin-bottom: 0.75rem;

  span {
    color: #f59e0b; /* orange accent */
  }
`

const SubHeading = styled.div`
  font-size: 1.4rem;
  color: #b0b0b0;
  margin-bottom: 1.8rem;
`

const AddNewButton = styled.button`
  padding: 0.5rem 1.8rem;
  font-size: 1rem;
  border: 1px solid #f59e0b;
  border-radius: 30px;
  background: transparent;
  color: #f59e0b;

  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  transition: all 0.2s ease-in-out;
  font-family: 'Inter', sans-serif;

  span {
    font-size: 1.6rem;
    font-weight: 700;
  }

  &:hover {
    cursor: pointer;
    background: rgba(245, 158, 11, 0.1);
    transform: scale(1.05);
  }
`

const LeftComponent = () => {
  const { openModal } = useContext(ModalContext)

  return (
    <StyledLeftComponent>
      <ContentContainer>
        <Logo src={logo} alt="codebox.tech logo" />

        <MainHeading>
          codebox<span>.tech</span>
        </MainHeading>

        <SubHeading>Code. Run. Share.</SubHeading>

        <AddNewButton
          onClick={() =>
            openModal({
              show: true,
              modalType: 3,
              identifiers: {
                folderId: '',
                cardId: '',
              },
            })
          }
        >
          <span>+</span> Create New Playground
        </AddNewButton>
      </ContentContainer>
    </StyledLeftComponent>
  )
}

export default LeftComponent
