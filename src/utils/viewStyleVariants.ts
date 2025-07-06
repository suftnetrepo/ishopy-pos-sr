import { ViewStyle } from 'react-native';

export const viewStyleVariants = {

  width: (selected: string) => {
    const value = parseFloat(selected);
    if (isNaN(value) || value < 0) return {};
    return { width: value } as ViewStyle;
  },
  
  height: (selected: string) => {
    const value = parseFloat(selected);
    if (isNaN(value) || value < 0) return {};
    return { height: value } as ViewStyle;
  },
  
  minWidth: (selected: string) => {
    const value = parseFloat(selected);
    if (isNaN(value) || value < 0) return {};
    return { minWidth: value } as ViewStyle;
  },
  
  maxWidth: (selected: string) => {
    const value = parseFloat(selected);
    if (isNaN(value) || value < 0) return {};
    return { maxWidth: value } as ViewStyle;
  },
  
  minHeight: (selected: string) => {
    const value = parseFloat(selected);
    if (isNaN(value) || value < 0) return {};
    return { minHeight: value } as ViewStyle;
  },
  
  maxHeight: (selected: string) => {
    const value = parseFloat(selected);
    if (isNaN(value) || value < 0) return {};
    return { maxHeight: value } as ViewStyle;
  },

  // Position Properties
  top: (selected: string) => {
    const value = parseFloat(selected);
    if (isNaN(value)) return {};
    return { top: value } as ViewStyle;
  },
  
  bottom: (selected: string) => {
    const value = parseFloat(selected);
    if (isNaN(value)) return {};
    return { bottom: value } as ViewStyle;
  },
  
  left: (selected: string) => {
    const value = parseFloat(selected);
    if (isNaN(value)) return {};
    return { left: value } as ViewStyle;
  },
  
  right: (selected: string) => {
    const value = parseFloat(selected);
    if (isNaN(value)) return {};
    return { right: value } as ViewStyle;
  },

  // Margin Properties
  margin: (selected: string) => {
    const value = parseFloat(selected);
    if (isNaN(value)) return {};
    return { margin: value } as ViewStyle;
  },
  
  marginTop: (selected: string) => {
    const value = parseFloat(selected);
    if (isNaN(value)) return {};
    return { marginTop: value } as ViewStyle;
  },
  
  marginBottom: (selected: string) => {
    const value = parseFloat(selected);
    if (isNaN(value)) return {};
    return { marginBottom: value } as ViewStyle;
  },
  
  marginLeft: (selected: string) => {
    const value = parseFloat(selected);
    if (isNaN(value)) return {};
    return { marginLeft: value } as ViewStyle;
  },
  
  marginRight: (selected: string) => {
    const value = parseFloat(selected);
    if (isNaN(value)) return {};
    return { marginRight: value } as ViewStyle;
  },
  
  marginHorizontal: (selected: string) => {
    const value = parseFloat(selected);
    if (isNaN(value)) return {};
    return { marginHorizontal: value } as ViewStyle;
  },
  
  marginVertical: (selected: string) => {
    const value = parseFloat(selected);
    if (isNaN(value)) return {};
    return { marginVertical: value } as ViewStyle;
  },

  // Padding Properties
  padding: (selected: string) => {
    const value = parseFloat(selected);
    if (isNaN(value) || value < 0) return {};
    return { padding: value } as ViewStyle;
  },
  
  paddingTop: (selected: string) => {
    const value = parseFloat(selected);
    if (isNaN(value) || value < 0) return {};
    return { paddingTop: value } as ViewStyle;
  },
  
  paddingBottom: (selected: string) => {
    const value = parseFloat(selected);
    if (isNaN(value) || value < 0) return {};
    return { paddingBottom: value } as ViewStyle;
  },
  
  paddingLeft: (selected: string) => {
    const value = parseFloat(selected);
    if (isNaN(value) || value < 0) return {};
    return { paddingLeft: value } as ViewStyle;
  },
  
  paddingRight: (selected: string) => {
    const value = parseFloat(selected);
    if (isNaN(value) || value < 0) return {};
    return { paddingRight: value } as ViewStyle;
  },
  
  paddingHorizontal: (selected: string) => {
    const value = parseFloat(selected);
    if (isNaN(value) || value < 0) return {};
    return { paddingHorizontal: value } as ViewStyle;
  },
  
  paddingVertical: (selected: string) => {
    const value = parseFloat(selected);
    if (isNaN(value) || value < 0) return {};
    return { paddingVertical: value } as ViewStyle;
  },

  // Border Properties
  borderWidth: (selected: string) => {
    const value = parseFloat(selected);
    if (isNaN(value) || value < 0) return {};
    return { borderWidth: value } as ViewStyle;
  },
  
  borderTopWidth: (selected: string) => {
    const value = parseFloat(selected);
    if (isNaN(value) || value < 0) return {};
    return { borderTopWidth: value } as ViewStyle;
  },
  
  borderBottomWidth: (selected: string) => {
    const value = parseFloat(selected);
    if (isNaN(value) || value < 0) return {};
    return { borderBottomWidth: value } as ViewStyle;
  },
  
  borderLeftWidth: (selected: string) => {
    const value = parseFloat(selected);
    if (isNaN(value) || value < 0) return {};
    return { borderLeftWidth: value } as ViewStyle;
  },
  
  borderRightWidth: (selected: string) => {
    const value = parseFloat(selected);
    if (isNaN(value) || value < 0) return {};
    return { borderRightWidth: value } as ViewStyle;
  },

  // Border Radius Properties
  borderRadius: (selected: string) => {
    const value = parseFloat(selected);
    if (isNaN(value) || value < 0) return {};
    return { borderRadius: value } as ViewStyle;
  },
  
  borderTopLeftRadius: (selected: string) => {
    const value = parseFloat(selected);
    if (isNaN(value) || value < 0) return {};
    return { borderTopLeftRadius: value } as ViewStyle;
  },
  
  borderTopRightRadius: (selected: string) => {
    const value = parseFloat(selected);
    if (isNaN(value) || value < 0) return {};
    return { borderTopRightRadius: value } as ViewStyle;
  },
  
  borderBottomLeftRadius: (selected: string) => {
    const value = parseFloat(selected);
    if (isNaN(value) || value < 0) return {};
    return { borderBottomLeftRadius: value } as ViewStyle;
  },
  
  borderBottomRightRadius: (selected: string) => {
    const value = parseFloat(selected);
    if (isNaN(value) || value < 0) return {};
    return { borderBottomRightRadius: value } as ViewStyle;
  },

  // Border Color Properties (accept color strings)
  borderColor: (selected: string) => {
    if (!selected || selected.trim() === '') return {};
    return { borderColor: selected } as ViewStyle;
  },
  
  borderTopColor: (selected: string) => {
    if (!selected || selected.trim() === '') return {};
    return { borderTopColor: selected } as ViewStyle;
  },
  
  borderBottomColor: (selected: string) => {
    if (!selected || selected.trim() === '') return {};
    return { borderBottomColor: selected } as ViewStyle;
  },
  
  borderLeftColor: (selected: string) => {
    if (!selected || selected.trim() === '') return {};
    return { borderLeftColor: selected } as ViewStyle;
  },
  
  borderRightColor: (selected: string) => {
    if (!selected || selected.trim() === '') return {};
    return { borderRightColor: selected } as ViewStyle;
  },

  // Background Properties
  backgroundColor: (selected: string) => {
    if (!selected || selected.trim() === '') return {};
    return { backgroundColor: selected } as ViewStyle;
  },
  
  opacity: (selected: string) => {
    const value = parseFloat(selected);
    if (isNaN(value) || value < 0 || value > 1) return {};
    return { opacity: value } as ViewStyle;
  },

  // Flexbox Properties
  flex: (selected: string) => {
    const value = parseFloat(selected);
    if (isNaN(value) || value < 0) return {};
    return { flex: value } as ViewStyle;
  },
  
  flexBasis: (selected: string) => {
    const value = parseFloat(selected);
    if (isNaN(value)) return {};
    return { flexBasis: value } as ViewStyle;
  },
  
  flexGrow: (selected: string) => {
    const value = parseFloat(selected);
    if (isNaN(value) || value < 0) return {};
    return { flexGrow: value } as ViewStyle;
  },
  
  flexShrink: (selected: string) => {
    const value = parseFloat(selected);
    if (isNaN(value) || value < 0) return {};
    return { flexShrink: value } as ViewStyle;
  },

  // Gap Properties (for newer React Native versions)
  gap: (selected: string) => {
    const value = parseFloat(selected);
    if (isNaN(value) || value < 0) return {};
    return { gap: value } as ViewStyle;
  },
  
  columnGap: (selected: string) => {
    const value = parseFloat(selected);
    if (isNaN(value) || value < 0) return {};
    return { columnGap: value } as ViewStyle;
  },
  
  rowGap: (selected: string) => {
    const value = parseFloat(selected);
    if (isNaN(value) || value < 0) return {};
    return { rowGap: value } as ViewStyle;
  },

  // Transform Properties (simplified - only scale, rotate)
  rotation: (selected: string) => {
    const value = parseFloat(selected);
    if (isNaN(value)) return {};
    return { transform: [{ rotate: `${value}deg` }] } as ViewStyle;
  },
  
  scale: (selected: string) => {
    const value = parseFloat(selected);
    if (isNaN(value) || value < 0) return {};
    return { transform: [{ scale: value }] } as ViewStyle;
  },

  // Shadow Properties (iOS)
  shadowOpacity: (selected: string) => {
    const value = parseFloat(selected);
    if (isNaN(value) || value < 0 || value > 1) return {};
    return { shadowOpacity: value } as ViewStyle;
  },
  
  shadowRadius: (selected: string) => {
    const value = parseFloat(selected);
    if (isNaN(value) || value < 0) return {};
    return { shadowRadius: value } as ViewStyle;
  },
  
  shadowColor: (selected: string) => {
    if (!selected || selected.trim() === '') return {};
    return { shadowColor: selected } as ViewStyle;
  },

  // Elevation (Android)
  elevation: (selected: string) => {
    const value = parseFloat(selected);
    if (isNaN(value) || value < 0) return {};
    return { elevation: value } as ViewStyle;
  },

  // Z-Index
  zIndex: (selected: string) => {
    const value = parseInt(selected, 10);
    if (isNaN(value)) return {};
    return { zIndex: value } as ViewStyle;
  },
};

export const viewStyleStringVariants = {
  position: {
    absolute: { position: 'absolute' } as ViewStyle,
    relative: { position: 'relative' } as ViewStyle,
  },
  
  flexDirection: {
    row: { flexDirection: 'row' } as ViewStyle,
    column: { flexDirection: 'column' } as ViewStyle,
    'row-reverse': { flexDirection: 'row-reverse' } as ViewStyle,
    'column-reverse': { flexDirection: 'column-reverse' } as ViewStyle,
  },
  
  justifyContent: {
    'flex-start': { justifyContent: 'flex-start' } as ViewStyle,
    'flex-end': { justifyContent: 'flex-end' } as ViewStyle,
    center: { justifyContent: 'center' } as ViewStyle,
    'space-between': { justifyContent: 'space-between' } as ViewStyle,
    'space-around': { justifyContent: 'space-around' } as ViewStyle,
    'space-evenly': { justifyContent: 'space-evenly' } as ViewStyle,
  },
  
  alignItems: {
    'flex-start': { alignItems: 'flex-start' } as ViewStyle,
    'flex-end': { alignItems: 'flex-end' } as ViewStyle,
    center: { alignItems: 'center' } as ViewStyle,
    stretch: { alignItems: 'stretch' } as ViewStyle,
    baseline: { alignItems: 'baseline' } as ViewStyle,
  },
  
  alignSelf: {
    auto: { alignSelf: 'auto' } as ViewStyle,
    'flex-start': { alignSelf: 'flex-start' } as ViewStyle,
    'flex-end': { alignSelf: 'flex-end' } as ViewStyle,
    center: { alignSelf: 'center' } as ViewStyle,
    stretch: { alignSelf: 'stretch' } as ViewStyle,
    baseline: { alignSelf: 'baseline' } as ViewStyle,
  },
  
  alignContent: {
    'flex-start': { alignContent: 'flex-start' } as ViewStyle,
    'flex-end': { alignContent: 'flex-end' } as ViewStyle,
    center: { alignContent: 'center' } as ViewStyle,
    stretch: { alignContent: 'stretch' } as ViewStyle,
    'space-between': { alignContent: 'space-between' } as ViewStyle,
    'space-around': { alignContent: 'space-around' } as ViewStyle,
  },
  
  flexWrap: {
    wrap: { flexWrap: 'wrap' } as ViewStyle,
    nowrap: { flexWrap: 'nowrap' } as ViewStyle,
    'wrap-reverse': { flexWrap: 'wrap-reverse' } as ViewStyle,
  },
  
  overflow: {
    visible: { overflow: 'visible' } as ViewStyle,
    hidden: { overflow: 'hidden' } as ViewStyle,
    scroll: { overflow: 'scroll' } as ViewStyle,
  },
  
  display: {
    flex: { display: 'flex' } as ViewStyle,
    none: { display: 'none' } as ViewStyle,
  },
  
  borderStyle: {
    solid: { borderStyle: 'solid' } as ViewStyle,
    dotted: { borderStyle: 'dotted' } as ViewStyle,
    dashed: { borderStyle: 'dashed' } as ViewStyle,
  },
};