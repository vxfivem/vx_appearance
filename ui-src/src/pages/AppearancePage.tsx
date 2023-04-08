import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { TGender, setEyeColor } from '../store/common.store';
import { InputRange } from '../components/input/InputRange';
import { useAppDispatch, useAppearance, useConfig, useEyeColor, useGender } from '../store';
import { gameEmitter } from '../hooks/game';
import { setAppearanceColor, setAppearanceOpacity, setAppearanceValue } from '../store/appearance.store';
import React, { useEffect } from 'react';
import { ColorInput } from '../components/input/ColorInput';

const Wrapper = styled.div``;

type TAppearanceConfig = {
  section: string;
  camera: string;
  inputs: {
    label: string;
    index: number;
    max: number;
    color?: 1 | 2;
    disabledGender?: TGender;
  }[];
};

const config: TAppearanceConfig[] = [
  {
    section: 'face',
    camera: 'head',
    inputs: [
      {
        label: 'blemishes',
        index: 0,
        max: 23,
      },
      {
        label: 'facialHair',
        index: 1,
        max: 28,
        color: 1,
        disabledGender: 'female',
      },
      {
        label: 'eyebrows',
        index: 2,
        max: 33,
        color: 1,
      },
      {
        label: 'ageing',
        index: 3,
        max: 14,
      },
      {
        label: 'makeup',
        index: 4,
        max: 74,
      },
      {
        label: 'blush',
        index: 5,
        max: 6,
        color: 2,
      },
      {
        label: 'lipstick',
        index: 8,
        max: 9,
        color: 2,
      },
      {
        label: 'complexion',
        index: 6,
        max: 11,
      },
      {
        label: 'sunDamage',
        index: 7,
        max: 10,
      },
      {
        label: 'freckles',
        index: 9,
        max: 17,
      },
    ],
  },
];

const MAX_EYE_COLORS = 31;

export const AppearancePage = () => {
  const { t } = useTranslation();
  const appearance = useAppearance();
  const dispatch = useAppDispatch();
  const sessionConfig = useConfig();
  const eyeColor = useEyeColor();
  const gender = useGender();

  const _setAppearanceValue = (index: number, value: number) => {
    gameEmitter.emitAsync('appearance:set-head-overlay-value', { index, value }).then(() => {
      dispatch(setAppearanceValue({ index, value }));
    });
  };

  const _setAppearanceColor = (index: number, value: number) => {
    gameEmitter.emitAsync('appearance:set-head-overlay-color', { index, value }).then(() => {
      dispatch(setAppearanceColor({ index, value }));
    });
  };

  const _setAppearanceOpacity = (index: number, value: number) => {
    gameEmitter.emitAsync('appearance:set-head-overlay-opacity', { index, value }).then(() => {
      dispatch(setAppearanceOpacity({ index, value }));
    });
  };

  const _setEyeColor = (value: number) => {
    gameEmitter.emitAsync('appearance:set-eye-color', value).then(() => {
      dispatch(setEyeColor(value));
    });
  };

  useEffect(() => {
    gameEmitter.emitAsync('cam:point-at', 'head');
  }, []);

  return (
    <Wrapper className="page">
      <div className="page-title">{t('pages.appearance.title')}</div>
      <div className="page-content">
        <InputRange
          label={t(`pages.appearance.sections.eyeColor`)}
          secondaryLabel={`${eyeColor + 1}/${MAX_EYE_COLORS + 1}`}
          value={eyeColor}
          min={0}
          max={MAX_EYE_COLORS}
          onChange={function (v: number): void {
            _setEyeColor(v);
          }}
        />
        <div className="section-divider" />
        {config.map(({ section, inputs }) => {
          const inputsEls = inputs.map(({ label, index, max, color, disabledGender }) => {
            if (disabledGender === gender) {
              return null;
            }
            const valueInput = (
              <InputRange
                label={t(`pages.appearance.sections.${section}.${label}`)}
                secondaryLabel={`${appearance[index].value + 2}/${max + 2}`}
                value={appearance[index].value}
                min={-1}
                max={max}
                onChange={function (v: number): void {
                  _setAppearanceValue(index, v);
                }}
              />
            );

            const opacityInput = (
              <InputRange
                label={
                  t(`pages.appearance.sections.${section}.${label}`) + ' - ' + t(`pages.appearance.common.opacity`)
                }
                secondaryLabel={`${appearance[index].opacity}%`}
                value={appearance[index].opacity}
                min={15}
                max={100}
                onChange={function (v: number): void {
                  _setAppearanceOpacity(index, v);
                }}
              />
            );

            const colorPalette = color ? (color === 1 ? sessionConfig.hairColors : sessionConfig.makeupColors) : null;
            const colorInput = colorPalette ? (
              <ColorInput
                label={t(`pages.appearance.sections.${section}.${label}`) + ' - ' + t(`pages.appearance.common.color`)}
                colors={colorPalette}
                selected={appearance[index].color}
                onSelect={function (v: number): void {
                  _setAppearanceColor(index, v);
                }}
              />
            ) : null;

            return (
              <React.Fragment key={`input:value:${index}`}>
                {valueInput} {opacityInput} {colorInput && colorInput}
                <div className="section-divider" />
              </React.Fragment>
            );
          });
          return (
            <div className="section" key={`section:${section}`}>
              <div className="section-title">
                <div>{t(`pages.appearance.sections.${section}.title`)}</div>
              </div>
              {inputsEls}
            </div>
          );
        })}
      </div>
    </Wrapper>
  );
};
