import React from 'react';
import './cube-transition-loader.scss';

/* See https://github.danielcardoso.net/load-awesome/animations/cube-transition.html */

interface ICubeTransitionLoaderProps {
  customClassName?: string;
  customColor?: string,
  title?: string;
  customStyle?: React.CSSProperties;
}

function CubeTransitionLoader({ customClassName, customColor, title, customStyle = {} }: ICubeTransitionLoaderProps) {
  return (
    <div className="cube-transition-loader-component" style={customStyle}>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <h3>{title}</h3>
        <div className={`la-cube-transition ${customClassName}`} style={{ color: customColor }} >
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(CubeTransitionLoader);
