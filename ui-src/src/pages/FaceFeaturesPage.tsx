import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useAppDispatch, useFaceFeatures } from '../store';
import { InputRange } from '../components/input/InputRange';
import { setFaceFeature } from '../store/face-features.store';
import { gameEmitter } from '../hooks/game';

const Wrapper = styled.div``;

const config = [
  {
    section: 'nose',
    inputs: [
      {
        label: 'width',
        index: 0,
      },
      {
        label: 'peak',
        index: 1,
      },
      {
        label: 'length',
        index: 2,
      },
      {
        label: 'boneCurviness',
        index: 3,
      },
      {
        label: 'tip',
        index: 4,
      },
      {
        label: 'boneTwist',
        index: 5,
      },
    ],
  },
  {
    section: 'eyebrows',
    inputs: [
      {
        label: 'vertical',
        index: 6,
      },
      {
        label: 'horizontal',
        index: 7,
      },
    ],
  },
  {
    section: 'cheekBones',
    inputs: [
      {
        label: 'vertical',
        index: 8,
      },
      {
        label: 'horizontal',
        index: 9,
      },
      {
        label: 'width',
        index: 10,
      },
    ],
  },
  {
    section: 'eyes',
    inputs: [
      {
        label: 'shape',
        index: 11,
      },
    ],
  },
  {
    section: 'lips',
    inputs: [
      {
        label: 'thickness',
        index: 12,
      },
    ],
  },
  {
    section: 'jawBone',
    inputs: [
      {
        label: 'width',
        index: 13,
      },
      {
        label: 'shape',
        index: 14,
      },
    ],
  },
  {
    section: 'chinBone',
    inputs: [
      {
        label: 'vertical',
        index: 15,
      },
      {
        label: 'length',
        index: 16,
      },
      {
        label: 'shape',
        index: 17,
      },
    ],
  },
  {
    section: 'chinHole',
    inputs: [
      {
        label: 'bum',
        index: 18,
      },
    ],
  },
  {
    section: 'neck',
    inputs: [
      {
        label: 'thickness',
        index: 19,
      },
    ],
  },
];

//pages.faceFeatures.sections.

export const FaceFeaturesPage = () => {
  const { t } = useTranslation();
  const faceFeatures = useFaceFeatures();
  const dispatch = useAppDispatch();

  const changeFaceFeature = (index: number, value: number) => {
    gameEmitter.emitAsync('appearance:set-face-feature', { index, value }).then(() => {
      dispatch(setFaceFeature({ index, value }));
    });
  };

  return (
    <Wrapper className="page">
      <div className="page-title">{t('pages.faceFeatures.title')}</div>
      <div className="page-content">
        {config.map(({ section, inputs }) => {
          const inputsEls = inputs.map(({ label, index }) => {
            return (
              <InputRange
                key={`input:${index}`}
                label={t(`pages.faceFeatures.sections.${section}.${label}.label`)}
                secondaryLabel={t(`pages.faceFeatures.sections.${section}.${label}.secondaryLabel`)!}
                value={faceFeatures[index]}
                min={-100}
                max={100}
                onChange={function (v: number): void {
                  changeFaceFeature(index, v);
                }}
              />
            );
          });
          return (
            <div className="section" key={`section:${section}`}>
              <div className="section-title">{t(`pages.faceFeatures.sections.${section}.title`)}</div>
              {inputsEls}
            </div>
          );
        })}
      </div>
    </Wrapper>
  );
};
