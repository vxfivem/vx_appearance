import styled from 'styled-components';
import { useAppDispatch, useHeadblend } from '../store';
import { useTranslation } from 'react-i18next';
import { InputRange } from './input/InputRange';
import { THeadblendStore, setHeadBlendValue } from '../store/headblend.store';
import { gameEmitter } from '../hooks/game';
import { gameConfig } from '../config';
import { useMemo } from 'react';

const Wrapper = styled.div`
  margin-top: 10px;
  .images {
    background-image: url('https://nui-img/pause_menu_pages_char_mom_dad/mumdadbg');
    position: relative;
    height: 196px;
    img {
      bottom: 0;
      position: absolute;
    }
    img:nth-child(1) {
      left: 0;
    }
    img:nth-child(2) {
      left: 50%;
      transform: translateX(-50%);
    }
    img:nth-child(3) {
      right: 0;
    }
  }
`;

const indexesLookup = {
  mother: 1,
  father: 2,
  ancestor: 3,
  resemblance: 7,
  skinMix: 8,
  ancestorInfluence: 9,
};

export const Headblend = () => {
  const { t } = useTranslation();
  const { mother, father, ancestor, ancestorInfluence, resemblance, skinMix } = useHeadblend();
  const dispatch = useAppDispatch();
  const setHb = (value: number, index: keyof THeadblendStore) => {
    const payload = { value, index: indexesLookup[index] };
    gameEmitter.emitAsync('appearance:set-head-blend', payload).then(() => {
      dispatch(setHeadBlendValue({ index, value }));
    });
  };

  const setParent = (value: number, index: keyof THeadblendStore) => {
    const payload = { value: value + 1, index: indexesLookup[index] };
    gameEmitter.emitAsync('appearance:set-parent', payload).then(() => {
      dispatch(setHeadBlendValue({ index, value }));
    });
  };

  const setAncestor = (value: number) => {
    gameEmitter.emitAsync('appearance:set-ancestor', value).then(() => {
      dispatch(setHeadBlendValue({ index: 'ancestor', value }));
    });
  };

  const allParents = useMemo(() => {
    return [...gameConfig.fathers, ...gameConfig.mothers].sort((a, b) => {
      return a.index - b.index;
    });
  }, []);

  return (
    <Wrapper>
      <div className="images">
        <img src={`${gameConfig.mothers[mother].portrait}`} alt="" width={140} />
        <img src={`${gameConfig.fathers[father].portrait}`} alt="" width={140} />
        <img src={`${allParents[ancestor].portrait}`} alt="" width={140} />
      </div>

      <InputRange
        label={t('pages.inheritance.headblend.titles.mother')}
        secondaryLabel={`${mother + 1}/${gameConfig.mothers.length}`}
        value={mother}
        min={0}
        max={gameConfig.mothers.length - 1}
        step={1}
        onChange={function (v: number): void {
          setParent(v, 'mother');
        }}
      />

      <InputRange
        label={t('pages.inheritance.headblend.titles.father')}
        secondaryLabel={`${father + 1}/${gameConfig.fathers.length}`}
        value={father}
        min={0}
        max={gameConfig.fathers.length - 1}
        step={1}
        onChange={function (v: number): void {
          setParent(v, 'father');
        }}
      />

      <InputRange
        label={t('pages.inheritance.headblend.titles.ancestor')}
        secondaryLabel={`${ancestor + 1}/${allParents.length}`}
        value={ancestor}
        min={0}
        max={allParents.length - 1}
        step={1}
        onChange={function (v: number): void {
          setAncestor(v);
        }}
      />

      <InputRange
        label={t('pages.inheritance.headblend.titles.resemblance')}
        secondaryLabel={`${resemblance}%`}
        value={resemblance}
        min={0}
        max={100}
        step={1}
        onChange={function (v: number): void {
          setHb(v, 'resemblance');
        }}
      />

      <InputRange
        label={t('pages.inheritance.headblend.titles.skinMix')}
        secondaryLabel={`${skinMix}%`}
        value={skinMix}
        min={0}
        max={100}
        step={1}
        onChange={function (v: number): void {
          setHb(v, 'skinMix');
        }}
      />

      <InputRange
        label={t('pages.inheritance.headblend.titles.ancestorInfluence')}
        secondaryLabel={`${ancestorInfluence}%`}
        value={ancestorInfluence}
        min={0}
        max={100}
        step={1}
        onChange={function (v: number): void {
          setHb(v, 'ancestorInfluence');
        }}
      />
    </Wrapper>
  );
};
