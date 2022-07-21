import React from 'react';

const TableBody = ({ children, striped }) => {
  if (!striped) return <tbody className="bg-white divide-y">{children}</tbody>;

  return (
    <tbody className="bg-white">
      {React.Children.map(children, (row, i) => {
        let backgroundColor = i % 2 === 0 ? '' : 'bg-gray-50';

        return React.cloneElement(row, {
          className: `${backgroundColor} ${row.props.className ?? ''}`,
        });
      })}
    </tbody>
  );
};

export default TableBody;
