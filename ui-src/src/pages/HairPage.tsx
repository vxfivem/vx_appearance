import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { gameEmitter } from '../hooks/game';
import { useEffect } from 'react';
import { useAppDispatch, useConfig, useHair } from '../store';
import { InputRange } from '../components/input/InputRange';
import { ColorInput } from '../components/input/ColorInput';
import { setHairVariation } from '../store/hair.store';
import { setHairPrimaryColor } from '../store/hair.store';
import { setHairSecondaryColor } from '../store/hair.store';

const Wrapper = styled.div``;

export const HairPage = () => {
  const { t } = useTranslation();
  const { variation, max, primaryColor, secondaryColor } = useHair();
  const { hairColors } = useConfig();
  const dispatch = useAppDispatch();

  const _setHairVariation = (v: number) => {
    gameEmitter.emitAsync('appearance:set-hair-style', v).then(() => {
      dispatch(setHairVariation(v));
    });
  };
  const _setHairPrimaryColor = (v: number) => {
    gameEmitter.emitAsync('appearance:set-hair-color', { primary: v, secondary: secondaryColor }).then(() => {
      dispatch(setHairPrimaryColor(v));
    });
  };
  const _setHairSescondaryColor = (v: number) => {
    gameEmitter.emitAsync('appearance:set-hair-color', { primary: primaryColor, secondary: v }).then(() => {
      dispatch(setHairSecondaryColor(v));
    });
  };

  useEffect(() => {
    gameEmitter.emitAsync('cam:point-at', 'head');
  }, []);

  return (
    <Wrapper className="page">
      <div className="page-title">{t('pages.hair.title')}</div>
      <div className="page-content">
        <InputRange
          label={t(`pages.hair.variation`)}
          secondaryLabel={`${variation + 1}/${max + 1}`}
          value={variation}
          min={0}
          max={max}
          onChange={_setHairVariation}
        />

        <ColorInput
          colors={hairColors}
          selected={primaryColor}
          onSelect={_setHairPrimaryColor}
          label={t(`pages.hair.primaryColor`)}
        />

        <ColorInput
          colors={hairColors}
          selected={secondaryColor}
          onSelect={_setHairSescondaryColor}
          label={t(`pages.hair.secondaryColor`)}
        />
      </div>
    </Wrapper>
  );
};
