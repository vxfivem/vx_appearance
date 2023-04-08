import { useTranslation } from 'react-i18next';
import { gameEmitter } from '../hooks/game';
import { useAppDispatch, useAppearance, useConfig, useGender } from '../store';
import { setAppearanceColor, setAppearanceOpacity, setAppearanceValue } from '../store/appearance.store';
import React, { useEffect } from 'react';
import { InputRange } from '../components/input/InputRange';
import { ColorInput } from '../components/input/ColorInput';

const config = [
  {
    section: 'body',
    camera: 'body',
    inputs: [
      {
        label: 'chestHair',
        index: 10,
        max: 16,
        disabledGender: 'female',
        color: 1,
      },
      {
        label: 'bodyBlemishes',
        index: 11,
        max: 11,
      },
      {
        label: 'additionalBodyBlemishes',
        index: 12,
        max: 1,
      },
    ],
  },
];

export const BodyAppearancePage = () => {
  const { t } = useTranslation();
  const appearance = useAppearance();
  const dispatch = useAppDispatch();
  const sessionConfig = useConfig();
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

  useEffect(() => {
    gameEmitter.emitAsync('cam:point-at', 'body');
  }, []);

  return (
    <div className="page">
      <div className="page-title">{t('pages.appearance.title')}</div>
      <div className="page-content">
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
    </div>
  );
};
