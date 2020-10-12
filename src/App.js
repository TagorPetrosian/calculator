import React, { useState } from 'react';
import './App.css';
import styled from 'styled-components';

//todo: find divide sign char, add C for clear
const buttonsData = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '=', '+', '/', '*', '-', 'C'];
const Wrapper = styled.div`
  width: 20rem;
  height: 40rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
`;

//show clearer width calculation
const Screen = styled.div`
  display: flex;
  font-size: 0.8rem;
  align-items: center;
  border: 1px solid brown;
  border-radius: 3px;
  background-color: yellow;
  padding: 0.5rem 1rem;
  width: calc(128px - 4px - 2rem);
  height: 1.5rem;
`;

//reorganize keyboard properly with grid layout
const Keyboard = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
`;

const Button = styled.button`
  width: 2rem;
  height: 2rem;
`;

function App() {
  const [expression, setExpression] = useState('');

  //Todo: write evalute function since eval is dengerous
  // const evaluate = (expression) => {
  //   return expression.split('').reduce((acc, char) => {
  //     if(!isNaN(Number(char)))
  //   })
  // };

  //Todo: check zero prefix
  //6+0+6 - legal
  //6+06 - illegal
  //5076 +50 -legal
  //0+6 - legal
  //07+ 0 - illegal
  //700005 +40006 - legal
  const isLegalInput = (value) => {
    const chars = expression.split('');
    const lastChar = chars[chars.length - 1];
    if (chars.length === 0 && isOperator(value)) return false;
    if (isOperator(lastChar) && isOperator(value)) return false;

    // if(value === '0' && lastChar && !isOperator(lastChar)) return false//
    return true;
  };

  const isOperator = (value) => /[\+-\/X]/.test(value);

  //Todo: add clear evalutaion
  const onValueConcat = (value) => {
    if (isLegalInput(value)) {
      if (value === '=') setExpression(`${eval(expression)}`);
      else setExpression(`${expression}${value}`);
    } else {
      setExpression('Error');
    }
  };

  const renderButtons = buttonsData.map((value, index) => (
    <Button key={index} onClick={() => onValueConcat(value)}>
      {value}
    </Button>
  ));

  return (
    <Wrapper>
      <Screen>{expression}</Screen>
      <Keyboard>{renderButtons}</Keyboard>
    </Wrapper>
  );
}

export default App;
