import {Dimensions, PixelRatio, Platform} from 'react-native';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const scale = SCREEN_WIDTH / 320;
export const actOpacity = Platform.OS == 'ios' ? 0.2 : 0.4;
export function ft(size) {
  const newSize = size * scale;
  if (Platform.OS == 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}

export const wp = widthPercent => {
  const screenWidth = Dimensions.get('window').width;
  const elemWidth = parseFloat(widthPercent);
  return PixelRatio.roundToNearestPixel((screenWidth * elemWidth) / 100);
};

export const hp = heightPercent => {
  const screenHeight = Dimensions.get('window').height;
  const elemHeight = parseFloat(heightPercent);
  return PixelRatio.roundToNearestPixel((screenHeight * elemHeight) / 100);
};

export const FONTS = {
  brandFont: 'PressStart2P-Regular',
};

export const COLORS = {
  brand: '#F74C11',
  tabgrey: '#878787',
  white: '#ffffff',
  greyText: '#C2C2C2',
  purpleText: '#D5A2FF',
  background: '#000325',
  green: '#97D729',
  red: '#FB2B3A',
};

export const SIZES = {
  title: 18,
  header: 16,
  text: 12,
};

const appTheme = {COLORS, SIZES, FONTS};
export default appTheme;
