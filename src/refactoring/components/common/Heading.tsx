import React, { ReactNode } from 'react';

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

interface HeadingProps {
  children: ReactNode;
  as?: HeadingLevel;
  className?: string;
}

const Heading: React.FC<HeadingProps> = ({ children, as = 'h2', className = '' }) => {
  const Tag = as;

  const finalClassName = `${className}`;

  return <Tag className={finalClassName}>{children}</Tag>;
};

export default Heading;
