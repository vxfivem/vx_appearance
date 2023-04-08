import { FC, useId, useMemo, useRef } from 'react';
import styled from 'styled-components';
import { colors } from '../../config';
import ReactDOM from 'react-dom';
import { BiCheck, BiExit } from 'react-icons/bi';
import { useTranslation } from 'react-i18next';
import { GiPerspectiveDiceSixFacesRandom } from 'react-icons/gi';
import { useGender } from '../../store';

const maleNames = [
  'Liam',
  'Noah',
  'Oliver',
  'Elijah',
  'William',
  'James',
  'Benjamin',
  'Lucas',
  'Henry',
  'Alexander',
  'Mason',
  'Michael',
  'Ethan',
  'Daniel',
  'Jacob',
  'Logan',
  'Jackson',
  'Levi',
  'Sebastian',
  'Mateo',
  'David',
  'Joseph',
  'Samuel',
  'Matthew',
  'Carter',
  'Owen',
  'Wyatt',
  'John',
  'Grayson',
  'Luke',
  'Isaac',
  'Jayden',
  'Lincoln',
  'Jack',
  'Gabriel',
  'Julian',
  'Christopher',
  'Joshua',
  'Andrew',
  'Theodore',
  'Ryan',
  'Nathan',
  'Adam',
  'Leo',
  'Nicholas',
  'Evan',
  'Aaron',
  'Tyler',
  'Hunter',
];

const femaleNames = [
  'Emma',
  'Olivia',
  'Ava',
  'Isabella',
  'Sophia',
  'Mia',
  'Charlotte',
  'Amelia',
  'Evelyn',
  'Abigail',
  'Harper',
  'Emily',
  'Elizabeth',
  'Avery',
  'Sofia',
  'Ella',
  'Madison',
  'Scarlett',
  'Victoria',
  'Aria',
  'Grace',
  'Chloe',
  'Camila',
  'Penelope',
  'Riley',
  'Layla',
  'Lillian',
  'Nora',
  'Zoey',
  'Mila',
  'Aubrey',
  'Hannah',
  'Lily',
  'Addison',
  'Eleanor',
  'Natalie',
  'Luna',
  'Savannah',
  'Brooklyn',
  'Leah',
  'Stella',
  'Aaliyah',
  'Ellie',
  'Kinsley',
  'Maya',
  'Makayla',
  'Hailey',
  'Arianna',
  'Allison',
];

const lastNames = [
  'Smith',
  'Johnson',
  'Brown',
  'Garcia',
  'Miller',
  'Davis',
  'Rodriguez',
  'Martinez',
  'Hernandez',
  'Lopez',
  'Gonzalez',
  'Perez',
  'Taylor',
  'Anderson',
  'Wilson',
  'Thomas',
  'Jackson',
  'White',
  'Harris',
  'Martin',
  'Thompson',
  'Moore',
  'Young',
  'Allen',
  'King',
  'Wright',
  'Scott',
  'Walker',
  'Hall',
  'Baker',
  'Nelson',
  'Carter',
  'Mitchell',
  'Parker',
  'Perez',
  'Roberts',
  'Turner',
  'Phillips',
  'Campbell',
  'Parker',
  'Evans',
  'Edwards',
  'Collins',
  'Stewart',
  'Sanchez',
  'Morris',
  'Murphy',
  'Rivera',
  'Cook',
  'Cooper',
  'Bailey',
  'Reed',
];

const SubmitPopupWrapper = styled.form`
  z-index: 1000;
  position: absolute;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  .content {
    width: 400px;
    box-sizing: border-box;
    background-color: ${colors.secondary};
    padding: 10px;
    border-radius: 5px;
    color: ${colors.text};

    input {
      margin: 0;
      padding: 0;
      outline: none;
      border: none;
      background-color: ${colors.primary};
      box-sizing: border-box;
      padding: 5px 10px;
      color: ${colors.text};
      ::-webkit-calendar-picker-indicator {
        cursor: pointer;
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" viewBox="0 0 24 24"><path fill="%23F3A33D" d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z"/></svg>');
      }
    }

    .input-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      svg {
        height: 24px;
        width: 24px;
        :hover {
          cursor: pointer;
        }
        fill: ${colors.tertiary};
      }
    }

    label {
      margin-bottom: 5px;
      display: block;
    }

    .names {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .input {
        width: 49%;
      }
      input {
        width: 85%;
      }
    }
    .dob {
      margin-top: 15px;
      width: 100%;
      input {
        width: 100%;
      }
    }
  }

  .buttons {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-top: 20px;
    button {
      background-color: ${colors.secondary};
      color: ${colors.text};
      box-sizing: border-box;
      border: none;
      padding: 8px;
      width: 49%;
      display: flex;
      align-items: center;
      justify-content: center;
      svg {
        margin-left: 10px;
        fill: ${colors.tertiary};
      }
      &:hover {
        cursor: pointer;
        background-color: ${colors.primary};
      }
    }
  }
`;

export type TIdentity = {
  firstname: string;
  lastname: string;
  dateOfBirth: Date;
};

type TSubmitPopup = {
  cancel(): void;
  confirm(identity: TIdentity): void;
};

const [minDate, maxDate] = (() => {
  const today = new Date().toISOString().split('T')[0];
  const todayYear = today.split('-')[0];
  return [
    today.replace(todayYear, (Number(todayYear) - 100).toString()),
    today.replace(todayYear, (Number(todayYear) - 18).toString()),
  ];
})();

export const CreatorSubmitPopup: FC<TSubmitPopup> = ({ cancel, confirm }) => {
  const firstnameId = useId();
  const lastnameId = useId();
  const dateOfBirthId = useId();
  const ref = useRef<HTMLFormElement>(null);
  const { t } = useTranslation();
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const inputs = [...ref.current!.getElementsByTagName('INPUT')] as HTMLInputElement[];

    const firstname = inputs.find((x) => x.id === firstnameId)!.value;
    const lastname = inputs.find((x) => x.id === lastnameId)!.value;
    const dateOfBirth = inputs.find((x) => x.id === dateOfBirthId)!.valueAsDate!;

    confirm({
      firstname,
      lastname,
      dateOfBirth,
    });
  };

  const gender = useGender();

  const container = useMemo(() => document.getElementsByClassName('app')[0], []);

  const reset = (e: React.FormEvent) => {
    e.preventDefault();
    cancel();
  };

  return ReactDOM.createPortal(
    <SubmitPopupWrapper ref={ref} onSubmit={submit} onReset={reset}>
      <div className="content">
        <div className="names">
          <div className="input">
            <label htmlFor={firstnameId}>{t('submit.firstname')}</label>
            <div className="input-wrapper">
              <input required type="text" name="firstname" id={firstnameId} />
              <GiPerspectiveDiceSixFacesRandom
                onClick={() => {
                  const element = document.getElementById(firstnameId) as HTMLInputElement;
                  const lookup = gender === 'male' ? maleNames : femaleNames;
                  element.value = lookup[Math.floor(Math.random() * lookup.length)];
                }}
              />
            </div>
          </div>
          <div className="input">
            <label htmlFor={lastnameId}>{t('submit.lastname')}</label>
            <div className="input-wrapper">
              <input required type="text" name="lastname" id={lastnameId} />
              <GiPerspectiveDiceSixFacesRandom
                onClick={() => {
                  const element = document.getElementById(lastnameId) as HTMLInputElement;
                  const lookup = lastNames;
                  element.value = lookup[Math.floor(Math.random() * lookup.length)];
                }}
              />
            </div>
          </div>
        </div>
        <div className="dob">
          <div className="input">
            <label htmlFor={dateOfBirthId}>{t('submit.dateOfBirth')}</label>
            <input required type="date" name="date-of-birth" id={dateOfBirthId} min={minDate} max={maxDate} />
          </div>
        </div>
        <div className="buttons">
          <button type="submit">
            <div>{t('submit.confirm')}</div>
            <BiCheck />
          </button>
          <button type="reset">
            <div>{t('submit.abort')}</div>
            <BiExit />
          </button>
        </div>
      </div>
    </SubmitPopupWrapper>,
    container
  );
};
