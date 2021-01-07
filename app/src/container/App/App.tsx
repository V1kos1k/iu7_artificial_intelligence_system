import React, { RefObject, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './App.scss';

import { referenceInput, searching } from '../../store/signIn/actions';
import { AppState } from '../../store/reducers';

import { RadioButtonGroup } from '../../components/RadioButtonGroup/RadioButtonGroup';
import { SelectSection } from '../../components/SelectSection/SelectSection';
import { SliderSection } from '../../components/SliderSection/SliderSection';
import { InputSection } from '../../components/InputSection/InputSection';
import { TextSection } from '../../components/TextSection/TextSection';
import { Button } from '../../components/Button/Button';

export const App: React.FC = () => {
  const dispatch = useDispatch();

  const isError = useSelector((state: AppState) => state.signIn.error);
  const search = useSelector((state: AppState) => state.signIn.searching);

  const [online, setOnline] = useState(false);
  const [age, setAge] = useState('');
  const [year, setYear] = useState([1980, 2021]);
  const [rating, setRating] = useState(50);
  const [publisher, setPublisher] = useState('');
  const [success, setSuccess] = useState(false);

  const onClickOnline = (name: string) => {
    if (name === 'wifi') setOnline(true);
    else setOnline(false);
  };

  const onChangeAge = (
    e: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ) => {
    setAge(String(e.target.value));
  };

  const onChangeYear = (
    e: React.ChangeEvent<{}>,
    newValue: number | number[]
  ) => {
    const value = String(newValue).split(',');
    setYear([Number(value[0]), Number(value[1])]);
  };

  const onChangeRating = (
    e: React.ChangeEvent<{}>,
    newValue: number | number[]
  ) => {
    setRating(Number(newValue));
  };

  const onChangePublisher = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPublisher(e.target.value);
  };

  const onClickButton = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    dispatch(referenceInput(online, age, year, rating, publisher));
    dispatch(searching());
    if (!isError) setSuccess(true);
  };

  const signIn = () => {
    return (
      <div className="registration-form">
        <header>
          <h1>Отправка данных</h1>
          <p>Введите необходимую информацию</p>
        </header>
        <form className="input-section">
          <RadioButtonGroup
            onClickWifiNo={() => onClickOnline('no')}
            onClickWifi={() => onClickOnline('wifi')}
          />

          <SelectSection
            value={age}
            placeholder="Введите возрастноое ограничение"
            onChange={(
              e: React.ChangeEvent<{
                name?: string | undefined;
                value: unknown;
              }>
            ) => onChangeAge(e)}
          />

          <SliderSection
            value={year}
            label="Год выпуска"
            min={1980}
            max={2021}
            marks={[
              { value: 1980, label: '80' },
              { value: 2021, label: '2021' },
            ]}
            ariaLabelledby="range-slider"
            onChange={(e, newValue) => onChangeYear(e, newValue)}
          />

          <SliderSection
            value={rating}
            label="Рейтинг"
            min={0}
            max={100}
            ariaLabelledby="slider"
            marks={[
              { value: 0, label: '0' },
              { value: 100, label: '100' },
            ]}
            onChange={(e, newValue) => onChangeRating(e, newValue)}
          />

          <TextSection
            value={publisher}
            label="Издатель"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onChangePublisher(e)
            }
          />

          <Button
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
              onClickButton(e)
            }
          />
        </form>
      </div>
    );
  };

  const result = () => {
    return (
      <div className="registration-form">
        <header>
          <h1>Результаты</h1>
          <p>Наиболее подходящие вам игры</p>
        </header>

        <div className="content">
          {search.map((item, index) => {
            return (
              <div className="part" key={index}>
                <h3>Игра: {item[0]}</h3>
                <p>Счет: {item[1]}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return <div className="back">{success ? result() : signIn()}</div>;
};
