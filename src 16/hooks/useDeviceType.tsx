import {useWindowDimensions} from 'react-native';
import {useEffect, useState} from 'react';

const useDeviceType = () => {
  const {width, height} = useWindowDimensions();
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const aspectRatio = height / width;
    setIsTablet(width >= 600 || aspectRatio < 1.6);
  }, [width, height]);

  return {isTablet, isPhone: !isTablet};
};
export {useDeviceType};
