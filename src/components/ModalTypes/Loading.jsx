import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  background: #1e1e1e;          /* dark background */
  color: #f59e0b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Inter', sans-serif;
  font-size: 1.2rem;
`

const Loading = () => {
  return <Wrapper>Loading...</Wrapper>
}

export default Loading
