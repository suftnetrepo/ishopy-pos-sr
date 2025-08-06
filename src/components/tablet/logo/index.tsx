import React from 'react';
import {StyledImage} from '../../../components/package/image';

const Logo = () => {
  return (
    <StyledImage
      source={require('./../../../../assets/img/logo.png')}
      height={50}
      width={160}
      resizeMode="contain"></StyledImage>
  );
};

export default Logo;
