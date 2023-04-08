import { FC } from 'react';
import styled from 'styled-components';
import { colors } from '../../config';

const Wrapper = styled.div`
  box-sizing: border-box;
  padding-top: 10px;
  .labels {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  input {
    margin-top: 10px;
    width: 100%;
    appearance: none;
    width: 100%;
    height: 6px;
    background-color: ${colors.primary};
    outline: none;
  }

  input::-webkit-slider-thumb {
    appearance: none;
    appearance: none;
    width: 8px;
    height: 12px;
    background-color: ${colors.text};
    cursor: pointer;
  }
`;

type InputRangeProps = {
  label: string;
  secondaryLabel?: string;
  value: number;
  onChange(v: number): unknown;
  min?: number;
  max?: number;
  step?: number;
};

export const InputRange: FC<InputRangeProps> = ({
  label,
  secondaryLabel,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
}) => {
  return (
    <Wrapper>
      <div className="labels">
        <div>{label}</div>
        {secondaryLabel && <div>{secondaryLabel}</div>}
      </div>
      <input
        min={min}
        max={max}
        step={step}
        type="range"
        value={value}
        onChange={(e) => onChange(e.target.valueAsNumber)}
      />
    </Wrapper>
  );
};
