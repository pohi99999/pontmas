// next/font outside a Next build: a font is just its class name and CSS variable.
const font = (o = {}) => ({ className: 'font', variable: o.variable ?? '--font', style: { fontFamily: 'font' } });
export const Inter = font;
export default font;
