import React, { RefObject, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './App.scss';

import {
  nameInput,
  titleInput,
  collaborativeFiltering,
} from '../../store/signIn/actions';
import { AppState } from '../../store/reducers';
import { push } from 'connected-react-router';

import { ProfileType } from '../../types/types';

type InputSectionProps = {
  value: string;
  reff: RefObject<HTMLDivElement>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick: () => void;
  placeholder: string;
  class: string;
  icon: string;
};

const InputSection = (props: InputSectionProps) => {
  return (
    <div className={`input-section ${props.class}`} ref={props.reff}>
      <input
        type="name"
        placeholder={props.placeholder}
        autoComplete="off"
        value={props.value}
        onChange={props.onChange}
      />
      <div className="animated-button">
        {/* <span className={props.value ? 'icon-lock next' : 'icon-lock'}> */}
        <span className="icon-lock next">
          <i className="fa fa-lock" />
        </span>
        <span className="next-button">
          <i className={`fa ${props.icon}`} onClick={props.onClick} />
        </span>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  const dispatch = useDispatch();

  const profile: ProfileType = useSelector(
    (state: AppState) => state.signIn.profile
  );

  const isError = useSelector((state: AppState) => state.signIn.error);
  const collaborativeFilter = useSelector(
    (state: AppState) => state.signIn.collaborativeFiltering
  );

  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [success, setSuccess] = useState(false);
  const nameRef: RefObject<HTMLDivElement> = React.createRef();
  const titleRef: RefObject<HTMLDivElement> = React.createRef();

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target) setName(e.target.value);
    else console.log('e == null');
  };

  const onChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target) setTitle(e.target.value);
    else console.log('e == null');
  };

  const onClickNext = (nameStep: string) => {
    const refName = nameRef.current;
    const refTitle = titleRef.current;

    if (nameStep === 'name') {
      dispatch(nameInput(name));
    } else if (nameStep === 'title') {
      dispatch(titleInput(title));
      setSuccess(true);
      dispatch(collaborativeFiltering());
    }

    if (refName && refTitle) {
      refName.classList.toggle('fold-up');
      refTitle.classList.remove('folded');
    } else console.log(refName, refTitle);
  };

  const signIn = () => {
    return (
      <div className="registration-form">
        <header>
          <h1>Отправка данных</h1>
          <p>Введите необходимую информацию</p>
        </header>
        <form>
          {isError ? (
            <div className="finish failure done">
              <a href="/">
                Введенные данные некорректны! Повторить ввод?
                <span>ДА!!!</span>
              </a>
            </div>
          ) : (
            <>
              <InputSection
                value={name}
                placeholder="ВВЕДИТЕ СВОЕ ПОЛНОЕ ИМЯ"
                class=""
                icon="fa-arrow-up"
                reff={nameRef}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onChangeName(e)
                }
                onClick={() => onClickNext('name')}
              />
              <InputSection
                value={title}
                placeholder="ВВЕДИТЕ НАЗВАНИЕ ИГРЫ"
                class="folded"
                icon="fa-send"
                reff={titleRef}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onChangeTitle(e)
                }
                onClick={() => onClickNext('title')}
              />
              {/* <div className={`finish success ${success ? 'done' : ''}`}>
                <p>ПРИВЕТ {name}</p>
              </div> */}
            </>
          )}
        </form>
      </div>
    );
  };

  const result = () => {
    console.log(collaborativeFilter);
    return (
      <div className="registration-form">
        <header>
          <h1>Результаты</h1>
          <p>Наиболее подходящие вам игры</p>
        </header>

        <div className="content">
          {collaborativeFilter.map((item, index) => {
            return (
              <div className="part" key={index}>
                <h3>Игра: {item[1]}</h3>
                <p>Счет: {item[2]}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return <div className="back">{success ? result() : signIn()}</div>;
};
