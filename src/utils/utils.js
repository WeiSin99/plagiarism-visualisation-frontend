const plagiarisedPartBgColor = (plagReport, caseNum, sentence) => {
  if (!Object.keys(plagReport).length) return;

  if (sentence.case.includes(caseNum)) {
    if (sentence.case.length > 1) {
      return 'rgba(147, 51, 234, 0.35)';
    } else {
      return 'rgba(225, 29, 72, 0.35)';
    }
  } else if (sentence.case.length > 0) {
    if (sentence.case.length > 1) {
      return 'rgba(37, 99, 235, 0.35)';
    } else {
      return 'rgba(249, 115, 22, 0.35)';
    }
  } else {
    return '';
  }
};

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

export { plagiarisedColor, roundTwoDecimal, plagiarisedPartBgColor };
