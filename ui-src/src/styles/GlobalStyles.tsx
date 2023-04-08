import { createGlobalStyle } from 'styled-components';
import { colors } from '../config';

export const GlobalStyles = createGlobalStyle`
  body {
    width: 100vw;
    height: 100vh;
    margin: 0;
    padding: 0;
    font-family: "Exo 2", sans-serif;
  }
  * {
   user-select: none; 
   }


`;
