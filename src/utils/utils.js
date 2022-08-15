const plagiarisedColor = score => {
  if (score > 0.3) {
    return 'text-red-500';
  } else if (score > 0.2 && score <= 0.5) {
    return 'text-orange-500';
  } else if (score > 0.1 && score <= 0.2) {
    return 'text-yellow-500';
  } else {
    return 'text-green-500';
  }
};

const roundTwoDecimal = num => {
  return Math.round((Number.parseFloat(num) + Number.EPSILON) * 100) / 100;
};

export { plagiarisedColor, roundTwoDecimal };
