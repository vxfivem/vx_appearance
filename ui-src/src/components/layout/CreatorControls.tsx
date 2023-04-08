import styled from 'styled-components';
import { colors } from '../../config';
import { gameEmitter } from '../../hooks/game';
import { BiCheck, BiExit, BiReset } from 'react-icons/bi';
import { useState } from 'react';
import { useConfig } from '../../store';
import { CreatorSubmitPopup, TIdentity } from './CreatorSubmitPopup';
import { useTranslation } from 'react-i18next';

const ControlsWrapper = styled.div`
  margin-top: 10px;
  color: ${colors.text};
  width: 400px;

  .main-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    button {
      width: 49%;
    }
  }

  .optional-controls {
    width: 100%;
    button {
      width: 100%;
    }
  }

  button {
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    border: none;
    margin: 0;
    width: auto;
    overflow: visible;

    background: transparent;

    color: inherit;
    font: inherit;

    line-height: normal;

    -webkit-font-smoothing: inherit;
    -moz-osx-font-smoothing: inherit;

    margin-bottom: 10px;
    background-color: ${colors.secondary};
    box-sizing: border-box;
    padding: 5px;
    overflow: hidden;

    :hover {
      cursor: pointer;
      background-color: ${colors.primary};
    }

    svg {
      margin-left: 10px;
      color: ${colors.tertiary};
      height: 20px;
      width: 20px;
    }
  }
`;

export const CreatorControls = () => {
  const config = useConfig();
  const [showPopup, setPopup] = useState(false);
  const { t } = useTranslation();

  const done = (identity?: TIdentity) => {
    setPopup(false);
    if (identity) {
      gameEmitter.emit('creator:stop', { ...identity, dateOfBirth: identity?.dateOfBirth.toISOString().split('T')[0] });
    }
  };

  return (
    <>
      <ControlsWrapper>
        <div className="main-controls">
          <button onClick={() => setPopup(true)}>
            <div>{t('controls.done')}</div>
            <BiCheck />
          </button>
          <button
            onClick={() => {
              gameEmitter.emit('appearance:reset');
            }}
          >
            <div>{t('controls.reset')}</div>
            <BiReset />
          </button>
        </div>
        {config.allowExit && (
          <div className="optional-controls">
            <button
              onClick={() => {
                gameEmitter.emit('creator:stop');
              }}
            >
              <div>{t('controls.exit')}</div>
              <BiExit />
            </button>
          </div>
        )}
        {showPopup && <CreatorSubmitPopup cancel={() => done()} confirm={(identity) => done(identity)} />}
      </ControlsWrapper>
    </>
  );
};
