import { useEffect, useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { colors } from '../config';
import { BsGenderMale, BsGenderFemale } from 'react-icons/bs';
import { gameEmitter } from '../hooks/game';
import { TGender, setGender } from '../store/common.store';
import { useAppDispatch, useGender } from '../store';
import { Headblend } from '../components';

const Wrapper = styled.div`
  .page-content {
    /* padding-top: 0 !important; */
  }
  .section {
    position: relative;
    box-sizing: border-box;
    padding-bottom: 6px;
    border-bottom: none !important;

    :after {
      position: absolute;
      height: 1px;
      width: 100%;
      content: '';
      left: 0;
      bottom: -5px;
      background-color: ${colors.text};
    }
  }

  .gender-section {
    label {
      display: block;
      width: 180px;
    }
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .genders {
    display: flex;
    align-items: center;
    margin-top: 10px;
    button {
      :hover:not(:disabled) {
        cursor: pointer;
      }
      display: flex;
      justify-content: center;
      align-items: center;
      svg {
        margin-left: 10px;
        fill: ${colors.tertiary};
      }
      margin: 0;
      padding: 0;
      border: none;
      width: 100px;
      height: 26px;
      overflow: hidden;
      &:last-of-type {
        margin-left: 10px;
      }
      background-color: ${colors.primary};
      color: inherit;

      &:disabled {
        opacity: 0.7;
      }
    }
  }
`;

export const InheritancePage = () => {
  const { t } = useTranslation();
  const genderId = useId();
  const [isSettingGender, setGenderState] = useState(false);
  const currentGender = useGender();
  const dispatch = useAppDispatch();
  const _setGender = (gender: TGender) => {
    setGenderState(true);
    gameEmitter.emitAsync('appearance:set-gender', gender).then(() => {
      dispatch(setGender(gender));
      setGenderState(false);
    });
  };

  useEffect(() => {
    gameEmitter.emitAsync('cam:point-at', 'head');
  }, []);

  return (
    <Wrapper className="page">
      <div className="page-title">{t('pages.inheritance.title')}</div>
      <div className="page-content">
        <div className="section gender-section">
          <label htmlFor={genderId}>{t('pages.inheritance.gender.title')}</label>
          <div className="genders">
            <button
              disabled={currentGender === 'male' || isSettingGender}
              onClick={() => {
                _setGender('male');
              }}
            >
              <div>{t('pages.inheritance.gender.male')}</div>
              <BsGenderMale />
            </button>
            <button
              disabled={currentGender === 'female' || isSettingGender}
              onClick={() => {
                _setGender('female');
              }}
            >
              <div>{t('pages.inheritance.gender.female')}</div>
              <BsGenderFemale />
            </button>
          </div>
        </div>
        <Headblend />
      </div>
    </Wrapper>
  );
};
