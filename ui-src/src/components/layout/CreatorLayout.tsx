import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { PedRotator } from '../../utils';
import { colors } from '../../config';
import { CreatorControls } from './CreatorControls';
import { CreatorNavigation } from './CreatorNavigation';
import { ReactComponent as MouseIcon } from '../../assets/icons/rotation-icon.svg';
import { useTranslation } from 'react-i18next';

const Wrapper = styled.div`
  position: absolute;
  left: 2em;
  top: 10em;
  .content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    .page {
      background-color: ${colors.secondary};
      width: 400px;
      height: 600px;
      .page-content,
      .page-title {
        padding: 5px 10px 10px 10px;
        color: ${colors.text};
      }

      .page-title {
        font-size: 18px;
        height: 40px;

        box-sizing: border-box;
        position: relative;
        :after {
          position: absolute;
          height: 1px;
          width: calc(100% - 20px);
          content: '';
          left: 10px;
          bottom: 5px;
          background-color: ${colors.text};
        }
      }

      .page-content {
        overflow-y: auto;
        overflow-x: hidden;

        height: calc(100% - 55px);
        /* width */
        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-track {
          background-color: ${colors.primary};
        }

        /* Scrollbar Thumb */
        ::-webkit-scrollbar-thumb {
          background-color: ${colors.text};
        }

        /* Scrollbar Thumb on Hover */
        ::-webkit-scrollbar-thumb:hover {
          background-color: ${colors.tertiary};
        }

        .section {
          margin-top: 15px;
          border-bottom: 2px solid rgba(255, 255, 255, 0.5);
          box-sizing: border-box;
          padding-bottom: 15px;
          .section-title {
            font-size: 18px;
          }
          &:first-of-type {
            margin-top: 0;
          }
          &:last-of-type {
            border-bottom: none;
          }
        }
      }
    }
  }

  .section-divider {
    width: 100%;
    height: 1px;
    background-color: ${colors.text};
    opacity: 0.6;
    margin-top: 16px;
    &:last-of-type {
      display: none;
    }
  }
`;

const HelpersWrapper = styled.div`
  position: absolute;
  left: 2em;
  bottom: 2em;
  color: ${colors.text};
  background-color: ${colors.secondary};
  svg {
    height: 25px;
    width: 25px;
    fill: ${colors.tertiary};
  }

  .helper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 240px;
    height: 40px;
    box-sizing: border-box;
    padding: 5px;
  }
`;

const Helpers = () => {
  const { t } = useTranslation();
  return (
    <HelpersWrapper>
      <div className="helper">
        <div className="text">{t('helpers.rotate')}</div>
        <MouseIcon />
      </div>
    </HelpersWrapper>
  );
};

export const CreatorLayout = () => {
  return (
    <>
      <Wrapper>
        <div className="content">
          <Outlet />
          <CreatorNavigation />
        </div>
        <CreatorControls />
      </Wrapper>
      <Helpers />
      <PedRotator />
    </>
  );
};
