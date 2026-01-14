import React, { useContext } from 'react'
import styled from 'styled-components'
import {
  NewFolder,
  NewPlayground,
  NewPlaygroundAndFolder,
  EditFolder,
  EditPlaygroundTitle,
  Loading,
  AIChat,
} from './ModalTypes'
import { ModalContext } from '../context/ModalContext'

/* =======================
   STYLED COMPONENTS
======================= */

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;

  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6); /* darker overlay */
  z-index: 999;

  display: flex;
  justify-content: center;
  align-items: center;
`

const ModalContent = styled.div`
  background-color: #1e1e1e; /* DARK MODAL */
  color: #eaeaea;
  padding: 1.5rem;
  width: 35%;
  min-width: 300px;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.7);
  font-family: 'Open Sans', sans-serif;
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 0.8rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid #333;
`

export const CloseButton = styled.button`
  background: transparent;
  border: none;
  outline: none;
  font-size: 2rem;
  cursor: pointer;
  color: #f59e0b;

  &:hover {
    opacity: 0.8;
  }
`

export const Input = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1.5rem;
  padding-top: 0.5rem;

  input {
    flex-grow: 1;
    height: 2.4rem;
    padding: 0 0.6rem;
    background: #252526;
    color: #eaeaea;
    border: 1px solid #333;
    border-radius: 6px;
    outline: none;
    font-family: 'Open Sans', sans-serif;

    &:focus {
      border-color: #f59e0b;
    }
  }

  button {
    height: 2.6rem;
    padding: 0 2rem;
    background: transparent;
    border: 1px solid #f59e0b;
    color: #f59e0b;
    border-radius: 32px;
    font-weight: 600;
    cursor: pointer;
    font-family: 'Open Sans', sans-serif;

    &:hover {
      background: rgba(245, 158, 11, 0.1);
    }
  }
`

/* =======================
   COMPONENT
======================= */

const Modal = () => {
  const { isOpenModal } = useContext(ModalContext)
  const { modalType } = isOpenModal

  return (
    <ModalContainer>
      <ModalContent>
        {modalType === 1 && <NewFolder />}
        {modalType === 2 && <NewPlayground />}
        {modalType === 3 && <NewPlaygroundAndFolder />}
        {modalType === 4 && <EditFolder />}
      {modalType === 5 && <EditPlaygroundTitle />}
      {modalType === 6 && <Loading />}
      {modalType === 7 && <AIChat />}
    </ModalContent>
  </ModalContainer>
  )
}

export default Modal
