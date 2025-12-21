import React, { useContext, useState } from 'react'
import { Header, CloseButton, Input } from '../Modal'
import { IoCloseSharp } from 'react-icons/io5'
import { ModalContext } from '../../context/ModalContext'
import { PlaygroundContext } from '../../context/PlaygroundContext'

const EditPlaygroundTitle = () => {
  const { isOpenModal, closeModal } = useContext(ModalContext)
  const { editPlaygroundTitle, folders } = useContext(PlaygroundContext)

  const { folderId, cardId } = isOpenModal.identifiers
  const [playgroundTitle, setPlaygroundTitle] = useState(
    folders[folderId].playgrounds[cardId].title
  )

  return (
    <>
      <Header>
        <h2
          style={{
            color: '#f59e0b',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          Edit Card Title
        </h2>

        <CloseButton onClick={closeModal}>
          <IoCloseSharp style={{ color: '#f59e0b' }} />
        </CloseButton>
      </Header>

      <Input>
        <input
          type="text"
          value={playgroundTitle}
          onChange={(e) => setPlaygroundTitle(e.target.value)}
          style={{
            background: '#1e1e1e',
            color: '#eaeaea',
            border: '1px solid #333',
            fontFamily: 'Inter, sans-serif',
          }}
        />

        <button
          onClick={() => {
            editPlaygroundTitle(folderId, cardId, playgroundTitle)
            closeModal()
          }}
          style={{
            background: 'none',
            color: '#f59e0b',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
          }}
        >
          Update Title
        </button>
      </Input>
    </>
  )
}

export default EditPlaygroundTitle
