import React from 'react';
const TableRow = ({ children, className }) => {
  const numOfElement = children.length;

  return (
    <tr className={`${className}`}>
      {React.Children.map(children, (cell, i) => {
        // set different padding for left and right most cell
        let padding = 'px-3';
        if (i === 0) padding = 'pl-4 pr-3 sm:pl-6';
        if (i === numOfElement - 1) padding = 'pl-3 pr-4 sm:pr-6';

        return React.cloneElement(cell, {
          className: `${padding} ${cell.props.className ?? ''}`,
        });
      })}
    </tr>
  );
};

export default TableRow;
