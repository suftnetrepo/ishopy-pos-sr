import React from 'react';
import {StyledImage} from '../../../components/package/image';

const Logo = () => {
  return (
    <StyledImage
      source={require('./../../../../assets/img/logo.png')}
      height={100}
      width={200}
      resizeMode="contain"></StyledImage>
  );
};

export default Logo;
