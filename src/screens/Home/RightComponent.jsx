import React, { useContext } from 'react'
import styled from 'styled-components'
import { IoTrashOutline } from 'react-icons/io5'
import { BiEditAlt } from 'react-icons/bi'
import { FcOpenedFolder } from 'react-icons/fc'
import logo from '../../assets/logo-small.png'
import { ModalContext } from '../../context/ModalContext'
import { PlaygroundContext } from '../../context/PlaygroundContext'
import { useNavigate } from 'react-router-dom'

const StyledRightComponent = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 60%;
  padding: 2rem;
  background: #1e1e1e;
  color: #eaeaea;
  font-family: 'Open Sans', sans-serif;

  @media (max-width: 768px) {
    position: relative;
    width: 100%;
    padding: 1rem 0.5rem;
  }
`

const Header = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #333;
  margin-bottom: 1rem;
`

const Heading = styled.h3`
  font-size: ${(props) => (props.size === 'small' ? '1.25rem' : '1.75rem')};
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #eaeaea;

  span {
    font-weight: 700;
    color: #f59e0b;
  }
`

const AddButton = styled.div`
  font-size: 0.95rem;
  border-radius: 30px;
  color: #f59e0b;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  cursor: pointer;

  span {
    font-size: 1.4rem;
    font-weight: 700;
  }

  &:hover {
    opacity: 0.85;
  }
`

const FolderCard = styled.div`
  margin-bottom: 1.5rem;
`

const FolderIcons = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  cursor: pointer;

  svg {
    color: #b0b0b0;
  }

  svg:hover {
    color: #f59e0b;
  }
`

const PlayGroundCards = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 428px) {
    grid-template-columns: 1fr;
  }
`

const Card = styled.div`
  padding: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 10px;
  background: #252526;
  border: 1px solid #333;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: translateY(-2px);
    border-color: #f59e0b;
  }
`

const CardContainer = styled.div`
  display: flex;
  align-items: center;
`

const CardContent = styled.div`
  p {
    margin: 0.2rem 0;
    font-size: 0.95rem;
    color: #eaeaea;
  }

  p:last-child {
    color: #b0b0b0;
    font-size: 0.85rem;
  }
`

const Logo = styled.img`
  width: 60px;
  margin-right: 1rem;

  @media (max-width: 425px) {
    width: 45px;
    margin-right: 0.5rem;
  }
`

const RightComponent = () => {
  const navigate = useNavigate()
  const { openModal } = useContext(ModalContext)
  const { folders, deleteFolder, deleteCard } =
    useContext(PlaygroundContext)

  return (
    <StyledRightComponent>
      <Header>
        <Heading size="large">
          My <span>Playgrounds</span>
        </Heading>

        <AddButton
          onClick={() =>
            openModal({
              show: true,
              modalType: 1,
              identifiers: { folderId: '', cardId: '' },
            })
          }
        >
          <span>+</span> New Folder
        </AddButton>
      </Header>

      {Object.entries(folders).map(([folderId, folder]) => (
        <FolderCard key={folderId}>
          <Header>
            <Heading size="small">
              <FcOpenedFolder /> {folder.title}
            </Heading>

            <FolderIcons>
              <IoTrashOutline onClick={() => deleteFolder(folderId)} />
              <BiEditAlt
                onClick={() =>
                  openModal({
                    show: true,
                    modalType: 4,
                    identifiers: { folderId, cardId: '' },
                  })
                }
              />
              <AddButton
                onClick={() =>
                  openModal({
                    show: true,
                    modalType: 2,
                    identifiers: { folderId, cardId: '' },
                  })
                }
              >
                <span>+</span> New Playground
              </AddButton>
            </FolderIcons>
          </Header>

          <PlayGroundCards>
            {Object.entries(folder.playgrounds).map(
              ([playgroundId, playground]) => (
                <Card
                  key={playgroundId}
                  onClick={() =>
                    navigate(`/playground/${folderId}/${playgroundId}`)
                  }
                >
                  <CardContainer>
                    <Logo src={logo} />
                    <CardContent>
                      <p>{playground.title}</p>
                      <p>Language: {playground.language}</p>
                    </CardContent>
                  </CardContainer>

                  <FolderIcons
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                  >
                    <IoTrashOutline
                      onClick={() =>
                        deleteCard(folderId, playgroundId)
                      }
                    />
                    <BiEditAlt
                      onClick={() =>
                        openModal({
                          show: true,
                          modalType: 5,
                          identifiers: {
                            folderId,
                            cardId: playgroundId,
                          },
                        })
                      }
                    />
                  </FolderIcons>
                </Card>
              )
            )}
          </PlayGroundCards>
        </FolderCard>
      ))}
    </StyledRightComponent>
  )
}

export default RightComponent
