import React, {FC} from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {theme} from '../../../../utils/theme';
import {Icon} from '../../../../model/category';
import {StyledShape} from '../../../package/shape';

const IconCard = ({library, name, type, isSelected}) => {
  let Icon;
  switch (library) {
    case 'MaterialIcons':
      Icon = MaterialIcons;
      break;
    case 'Ionicons':
      Icon = Ionicons;
      break;
    default:
      Icon = FontAwesome5;
  }

  return (
    <StyledShape
      square
      padding={8}
      borderRadius={8}
      width={48}
      height={48}
      backgroundColor={theme.colors.gray[100]}>
      <Icon
        name={name}
        size={24}
        color={isSelected ? theme.colors.gray[400] : theme.colors.gray[600]}
        solid={type === 'solid'}
      />
    </StyledShape>
  );
};

export {IconCard as Icon};
