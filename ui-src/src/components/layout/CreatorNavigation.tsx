import styled from 'styled-components';
import { PAGES, colors } from '../../config';
import { Link, useLocation } from 'react-router-dom';
import { ReactComponent as InheritanceIcon } from '../../assets/icons/dna-svgrepo-com.svg';
import { ReactComponent as FaceFeaturesIcon } from '../../assets/icons/face-recognition-1-svgrepo-com.svg';
import { ReactComponent as AppearanceIcon } from '../../assets/icons/brush-makeup-svgrepo-com.svg';
import { ReactComponent as BodyIcon } from '../../assets/icons/2c279b7a38bcd973731217da33faa0f2.svg';
import { ReactComponent as HairIcon } from '../../assets/icons/scissors-11-svgrepo-com.svg';
import { ReactComponent as TShirtIcon } from '../../assets/icons/t-shirt-6-svgrepo-com.svg';
import { ReactComponent as PantsIcon } from '../../assets/icons/pants-1-svgrepo-com.svg';
import { useConfig } from '../../store';
// import { ReactComponent as ShoesIcon } from '../../assets/icons/sports-shoes-2-svgrepo-com.svg';

const NavigationWrapper = styled.div`
  margin-left: 10px;
  height: 100%;
  width: 60px;

  a {
    margin-bottom: 10px;
    display: block;
    width: 40px;
    height: 40px;
    background-color: ${colors.secondary};
    display: flex;
    align-items: center;
    justify-content: center;
    color: #afafaf;
    svg {
      height: 20px;
      width: 20px;
      fill: currentColor;
      path {
        fill: currentColor;
      }
      polygon {
        fill: currentColor;
      }
    }

    &.active {
      color: ${colors.tertiary};
    }
  }
`;

const routes = [
  {
    path: PAGES.inheritance,
    icon: <InheritanceIcon />,
  },
  {
    path: PAGES.faceFeatures,
    icon: <FaceFeaturesIcon />,
  },
  {
    path: PAGES.appearance,
    icon: <AppearanceIcon />,
  },
  {
    path: PAGES.body,
    icon: <BodyIcon />,
  },
  {
    path: PAGES.hair,
    icon: <HairIcon />,
  },
  {
    type: 'clothes',
    path: PAGES.topClothers,
    icon: <TShirtIcon />,
  },
  {
    type: 'clothes',
    path: PAGES.bottomClothes,
    icon: <PantsIcon />,
  },
];

const lookup: Record<string, string> = {
  clothes: 'displayClothes',
};

export const CreatorNavigation = () => {
  const { pathname } = useLocation();
  const config = useConfig();

  return (
    <NavigationWrapper>
      {routes.map(({ path, icon, type }) => {
        if (type && lookup[type]) {
          if (!config[lookup[type] as never]) {
            return null;
          }
        }
        return (
          <Link className={pathname.includes(path) ? 'active' : undefined} key={path} to={path}>
            {icon}
          </Link>
        );
      })}
    </NavigationWrapper>
  );
};
