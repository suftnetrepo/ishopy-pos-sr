import React  from 'react';
import MaterialIcons from 'react-native-vector-icons/FontAwesome5';
import {theme} from '../../../utils/theme';
import {StyledShape} from '../../package/shape';

const IconCard = ({ name, size = 18, color= theme.colors.gray[500], isSelected = true}) => {
  return (
    <StyledShape
      square
      padding={8}
      borderRadius={8}
      width={42}
      height={42}
      borderWidth={isSelected ? 2 :0.5 }
      borderColor={isSelected ? theme.colors.blue[800] : theme.colors.gray[300]}
      backgroundColor={theme.colors.gray[1]}>
      <MaterialIcons
        name={name}
        size={size}
        color={color}
      />
    </StyledShape>
  );
};

export {IconCard as Icon};
