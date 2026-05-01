import React  from 'react';
import MaterialIcons from 'react-native-vector-icons/FontAwesome5';
import {theme} from '../../../utils/theme';
import {StyledShape} from '../../package/shape';
import {useAppTheme} from '../../../theme';

const IconCard = ({name, size = 18, color = theme.colors.gray[400], isSelected = true}) => {
  const {t} = useAppTheme();
  return (
    <StyledShape
      square
      padding={8}
      borderRadius={8}
      width={42}
      height={42}
      borderWidth={isSelected ? 2 :0.5 }
      borderColor={isSelected ? theme.colors.blue[800] : t.textMuted}
      backgroundColor={t.bgCard}>
      <MaterialIcons
        name={name}
        size={size}
        color={color}
      />
    </StyledShape>
  );
};

export {IconCard as Icon};
