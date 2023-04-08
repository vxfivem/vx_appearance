import { FC } from 'react';
import styled from 'styled-components';

type TColorInputProps = {
  colors: [number, number, number][];
  selected: number;
  onSelect: (v: number) => unknown;
  label: string;
};

const Wrapper = styled.div`
  margin-top: 10px;
  margin-bottom: 15px;
  box-sizing: border-box;
  .label {
    margin-bottom: 10px;
  }
  .buttons {
    display: grid;
    --size: 22px;
    grid-template-columns: repeat(16, var(--size));
    grid-template-rows: var(--size);
    grid-gap: 2px;
    button {
      height: var(--size);
      width: var(--size);
      display: block;
      margin: 0;
      padding: 0;
      border: none;
      &:not(:disabled) {
        cursor: pointer;
      }

      &:disabled {
        box-shadow: inset 0 0 6px grey, 0 0 6px darkgray;
      }
    }
  }
`;

export const ColorInput: FC<TColorInputProps> = ({ colors, selected, onSelect, label }) => {
  return (
    <Wrapper>
      <div className="label">{label}</div>
      <div className="buttons">
        {colors.map((color, idx) => {
          const colorRgb = `rgb(${color.join(',')})`;
          return (
            <button
              key={colorRgb}
              onClick={() => onSelect(idx)}
              disabled={idx === selected}
              style={{ backgroundColor: colorRgb }}
            />
          );
        })}
      </div>
    </Wrapper>
  );
};
