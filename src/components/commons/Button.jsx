import React from 'react';

const Button =({
  text,
  title,
  color = 'default',
  size = 'medium',
  onClick,
  disabled = false,
  type = 'button',
  className = '',
  icon,
  width,
  height,
  style,
  ...rest
}) => {
  const buttonClasses = [
    'btn',
    `btn-${color}`,
    `btn-${size}`,
    className
  ].filter(Boolean).join(' ');

  const customStyle = {
    ...(width && { width }),
    ...(height && { height }),
    ...style
  };

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={customStyle}
      {...rest}
    >
      {icon && <span className="btn-icon">{icon}</span>}
      {text}
    </button>
  );
}

export default Button;
