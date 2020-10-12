import React, { useState, useEffect } from 'react';
import './App.css';
import styled from 'styled-components';
import { of, interval, concat, Subject } from 'rxjs';
import { takeWhile, takeUntil, scan, startWith, repeatWhen, share, filter } from 'rxjs/operators';

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
const countdown$ = interval(250)
  .pipe(
    startWith(5),
    scan((time) => time - 1),
    takeWhile((time) => time > 0)
  )
  .pipe(share());

const actions$ = new Subject();
const snooze$ = actions$.pipe(filter((action) => action === 'snooze'));
const dismiss$ = actions$.pipe(filter((action) => action === 'dismiss'));

const snoozeableAlarm$ = concat(countdown$, of('Wake up! 🎉')).pipe(repeatWhen(() => snooze$));
const observable$ = concat(snoozeableAlarm$.pipe(takeUntil(dismiss$)), of('Have a nice day! 🤗'));

function App() {
  const [expression, setExpression] = useState('');

  useEffect(() => {
    const sub = observable$.subscribe(setExpression);
    return () => sub.unsubscribe();
  }, []);

  const isLegalInput = (value) => {
    const chars = expression.split('');

    const lastChar = chars[chars.length - 1];

    if (chars.length === 0 && isOperator(value)) return false;

    if (isOperator(lastChar) && isOperator(value)) return false;

    return true;
  };

  const isOperator = (value) => /[\+-\/X]/.test(value);

  //Todo: add clear evaluation
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
      <Button key='somekey' onClick={() => actions$.next('snooze')}>
        snooze
      </Button>
    </Wrapper>
  );
}

export default App;
